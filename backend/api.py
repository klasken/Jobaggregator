import os
import time
import requests
from datetime import datetime
import asyncio
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Form, File, UploadFile, Query
from typing import Optional
from database_api import (
    inserer_database, get_user_by_email, get_filtered_jobs, get_stats,
    update_user_profile, get_all_users, get_admin_jobs, delete_user, delete_job,
    add_application, get_applications, get_monthly_stats_from_db
)
from feature_ia import get_matching_jobs
from routes import router as auth_router
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

async def fetch_en_arriere_plan(interval_minutes: int):
    while True:
        await asyncio.sleep(interval_minutes * 60)
        print(f"Lancement de la collecte (toutes les {interval_minutes} min)...")
        offres = await asyncio.to_thread(collect_everything)
        if offres:
            await asyncio.to_thread(inserer_database, offres)
            print(f"{len(offres)} nouvelles offres ont été ajoutées.")
        else:
            print("Aucune nouvelle donnée trouvée.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Démarrage du serveur : Lancement de la collecte automatique...")
    offres = await asyncio.to_thread(collect_everything)
    if offres:
        await asyncio.to_thread(inserer_database, offres)
        print(f"{len(offres)} offres ont été collectées et insérées.")
    else:
        print("Aucune donnée récupérée au démarrage.")

    tache_fond = asyncio.create_task(fetch_en_arriere_plan(30))
    yield
    print("Arrêt du serveur.")
    tache_fond.cancel()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.get("/api/recommendations/{email}")
async def get_recommendations(email: str):
    scored_jobs = get_matching_jobs(email)
    return scored_jobs

@app.get("/")
def read_root():
    return {"status": "Job Aggregator API is running"}

@app.post("/api/fetch")
def trigger_fetch():
    offres = collect_everything()
    if offres:
        inserer_database(offres)
        return {"message": f"{len(offres)} offres collectées"}
    return {"message": "Aucune nouvelle offre trouvée."}

API_KEY  = os.getenv("WELOVEDEVS_API_KEY")
BASE_URL = "https://epi-api.welovedevs.com/v1"
HEADERS  = {"X-API-Key": API_KEY, "Content-Type": "application/json"}

def fetch_offers(page=2, limit=50):
    try:
        r = requests.get(BASE_URL, headers=HEADERS, params={"page": page, "limit": limit}, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        print(f"Erreur HTTP : {e}")
        return None
    finally:
        time.sleep(1)


def extract_location(raw_places) -> str:
    if not raw_places:
        return "Lieu non renseigné"

    if isinstance(raw_places, list):
        if len(raw_places) == 0:
            return "Lieu non renseigné"
        first = raw_places[0]
        if isinstance(first, dict):
            city = first.get("name") or first.get("label") or first.get("city") or ""
            return city.strip() or "Lieu non renseigné"
        return str(first).strip()

    if isinstance(raw_places, str):
        return raw_places.split(',')[0].strip()

    return "Lieu non renseigné"


def normalize(raw):
    timesamp = raw.get("publishDate")
    if timesamp:
        date_objet = datetime.fromtimestamp(timesamp / 1000000)
        date_finale = date_objet.strftime("%Y-%m-%d")
    else:
        date_finale = None

    salary_dossier = raw.get("Salary") or raw.get("salary") or {}
    salary_min = salary_dossier.get("min")
    salary_max = salary_dossier.get("max")
    salary_per_year_var = raw.get("Salary") or raw.get("salary") or {}
    contract_type_var = raw.get("Job") or raw.get("job") or {}
    titre = raw.get("title")

    entreprise_nom = (raw.get("smallCompany") or {}).get("companyName") or "Entreprise non renseignée"
    description = raw.get("descriptionPreview")

    if titre is None or date_finale is None or entreprise_nom is None or description is None:
        return None

    raw_contract = contract_type_var.get("contractTypes")
    contract_final = ", ".join(raw_contract) if isinstance(raw_contract, list) else (raw_contract or "Non communiqué")

    raw_skills = raw.get("skillsList")
    if isinstance(raw_skills, list):
        skills_as_strings = [s.get("name") if isinstance(s, dict) else str(s) for s in raw_skills]
        skills_final = ", ".join(skills_as_strings)
    else:
        skills_final = str(raw_skills) if raw_skills else ""

    raw_places = raw.get("formattedPlaces")
    location_finale = extract_location(raw_places)

    return {
        "titre"          : titre,
        "entreprise_nom" : entreprise_nom,
        "salaire_min"    : salary_min if salary_min else 0,
        "salaire_max"    : salary_max if salary_max else 0,
        "description"    : description,
        "location"       : location_finale,
        "date"           : date_finale,
        "contract_type"  : contract_final,
        "salary_per_year": salary_per_year_var.get("maxPerYear") or "Salaire non renseigné",
        "competences"    : skills_final,
        "source"         : "WeLoveDevs"
    }

def process_page(data_brute):
    liste_offres = data_brute.get("values", [])
    offres_nettoyees = []
    for offre in liste_offres:
        propre = normalize(offre)
        if propre:
            offres_nettoyees.append(propre)
    return offres_nettoyees

def collect_everything(max_pages=20):
    toutes_les_offres = []
    for num_page in range(1, max_pages + 1):
        paquet_brut = fetch_offers(page=num_page, limit=50)
        if not paquet_brut:
            break
        nouveau_paquet = process_page(paquet_brut)
        toutes_les_offres.extend(nouveau_paquet)
    return toutes_les_offres


@app.get("/api/dashboard/stats")
async def dashboard_stats():
    return get_stats()

@app.get("/api/dashboard/jobs")
async def dashboard_list(location: str = None, contract: str = None):
    return get_filtered_jobs(location, contract)

@app.get("/api/dashboard/user/{email}")
async def dashboard_user_info(email: str):
    user = get_user_by_email(email)
    if user:
        return {
            "email"      : user["email"],
            "nom"        : user["nom"],
            "prenom"     : user["nom"],
            "competences": user["competences"],
            "role_id"    : user["role_id"]
        }
    return {"error": "Utilisateur non trouvé"}

# Nouveau modèle pour inclure 'experience' envoyé depuis le frontend (ProfilePage)
class UserProfileUpdate(BaseModel):
    nom: str = None
    competences: str = None
    experience: str = None

@app.put("/api/dashboard/user/{email}")
async def dashboard_user_update(email: str, profile_data: UserProfileUpdate):
    success = update_user_profile(email, profile_data.nom, profile_data.competences)
    if success:
        return {"message": "Profil mis à jour avec succès"}
    else:
        raise HTTPException(
            status_code=500,
            detail="Erreur lors de la mise à jour en base de données"
        )

# Route pour alimenter le graphique avec les vraies statistiques de DB
@app.get("/api/dashboard/stats/monthly")
async def dashboard_monthly_stats(email: str = Query(...)):
    stats = get_monthly_stats_from_db(email)
    return stats


# =====================================================================
#                      ROUTES API POUR L'ADMINISTRATION
# =====================================================================

@app.get("/api/admin/users")
async def admin_get_users():
    return get_all_users()

@app.delete("/api/admin/users/{user_id}")
async def admin_delete_user(user_id: int):
    if delete_user(user_id):
        return {"message": "Utilisateur supprimé avec succès"}
    raise HTTPException(status_code=500, detail="Échec de la suppression de l'utilisateur")

@app.get("/api/admin/jobs")
async def admin_get_jobs():
    return get_admin_jobs()

@app.delete("/api/admin/jobs/{job_id}")
async def admin_delete_job(job_id: int):
    if delete_job(job_id):
        return {"message": "Offre supprimée avec succès"}
    raise HTTPException(status_code=500, detail="Échec de la suppression de l'offre")

class ApplicationCreate(BaseModel):
    user_email: str
    job_id: int
    company: str
    position: str

@app.post("/api/applications")
async def create_application(
    user_email: str = Form(...),
    job_id: int = Form(...),
    company: str = Form(...),
    position: str = Form(...),
    message: Optional[str] = Form(None),
    cv: UploadFile = File(...),
    motivation_letter: Optional[UploadFile] = File(None)
):
    success = add_application(user_email, job_id, company, position)
    if success:
        print(f"[TEST] Fichier CV reçu : {cv.filename}")
        if motivation_letter:
            print(f"[TEST] Lettre de motivation reçue : {motivation_letter.filename}")
        return {"message": "Candidature enregistrée avec succès"}
    raise HTTPException(status_code=500, detail="Erreur lors de l'envoi de la candidature")

@app.get("/api/applications/{email}")
async def read_applications(email: str):
    return get_applications(email)
