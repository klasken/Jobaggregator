import os
import time
import requests
from datetime import datetime
import asyncio
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from database_api import inserer_database
from fastapi import APIRouter, Depends
from feature_ia import get_matching_jobs
from database_api import get_user_by_email
from routes import router as auth_router
from database_api import get_filtered_jobs, get_stats

load_dotenv()

router = APIRouter()

@router.get("/recommendations/{email}")
async def get_recommendations(email: str):
    scored_jobs = get_matching_jobs(email)
    return scored_jobs

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

app.include_router(auth_router)

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
    entreprise_id = raw.get("companyId")
    description = raw.get("descriptionPreview")

    if titre is None or date_finale is None or entreprise_id is None or description is None:
        return None

    raw_contract = contract_type_var.get("contractTypes")
    contract_final = ", ".join(raw_contract) if isinstance(raw_contract, list) else (raw_contract or "Non communiqué")

    raw_skills = raw.get("skillsList")
    if isinstance(raw_skills, list):
        skills_as_strings = [s.get("name") if isinstance(s, dict) else str(s) for s in raw_skills]
        skills_final = ", ".join(skills_as_strings)
    else:
        skills_final = str(raw_skills) if raw_skills else ""

    return {
        "titre" : titre,
        "entreprise_id" : entreprise_id,
        "salaire_min" : salary_min if salary_min else 0,
        "salaire_max" : salary_max if salary_max else 0,
        "description" : description,
        "location" : raw.get("formattedPlaces") or "Lieu non renseigné",
        "date" : date_finale,
        "contract_type" : contract_final,
        "salary_per_year" : salary_per_year_var.get("maxPerYear") or "Salaire non renseigné",
        "competences" : skills_final,
        "source" : "WeLoveDevs"
    }

def process_page(data_brute):
    liste_offres = data_brute.get("values", [])
    offres_nettoyees = []
    for offre in liste_offres:
        propre = normalize(offre)
        if propre:
            offres_nettoyees.append(propre)
    return offres_nettoyees

def collect_everything(max_pages=5):
    toutes_les_offres = []
    for num_page in range(1, max_pages + 1):
        paquet_brut = fetch_offers(page=num_page, limit=10)
        if not paquet_brut:
            break
        nouveau_paquet = process_page(paquet_brut)
        toutes_les_offres.extend(nouveau_paquet)
    return toutes_les_offres



@app.get("/api/dashboard/stats")
async def dashboard_stats():
    """Route pour afficher les compteurs en haut du dashboard"""
    return get_stats()

@app.get("/api/dashboard/jobs")
async def dashboard_list(location: str = None, contract: str = None):
    """Route pour la liste des jobs avec filtres optionnels"""
    return get_filtered_jobs(location, contract)

@app.get("/api/dashboard/user/{email}")
async def dashboard_user_info(email: str):
    """Récupère les infos de l'utilisateur pour la sidebar"""
    user = get_user_by_email(email)
    if user:
        return {
            "email": user["email"],
            "competences": user["competences"]
        }
    return {"error": "Utilisateur non trouvé"}
