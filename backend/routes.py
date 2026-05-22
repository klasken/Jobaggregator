import logging
import os
from fastapi import APIRouter, HTTPException, status, Request, Query
from pydantic import BaseModel, EmailStr
from typing import List, Dict
from database_api import get_user_by_email, creer_utilisateur, update_user_profile
from auth import verify_mdp, obtenir_mdp_hasher, cree_acces_pour_token

router = APIRouter()

# --- CONFIGURATION DU FICHIER DE LOG POUR FAIL2BAN ---
LOG_DIR = "/var/log/jobaggregator"
os.makedirs(LOG_DIR, exist_ok=True)

logger = logging.getLogger("auth_logger")
logger.setLevel(logging.ERROR)
file_handler = logging.FileHandler(f"{LOG_DIR}/app.log")
file_handler.setFormatter(logging.Formatter('%(message)s'))
logger.addHandler(file_handler)
# -----------------------------------------------------

class UserAuth(BaseModel):
    email: EmailStr
    password: str
    competences: str = None
    nom: str = None
    prenom: str = None

class Token(BaseModel):
    access_token: str
    token_type: str
    email: str
    nom: str
    prenom: str

class ProfileUpdate(BaseModel):
    nom: str
    competences: str
    experience: str = None


@router.post("/api/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserAuth):
    if get_user_by_email(user.email):
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")

    hashed_pwd = obtenir_mdp_hasher(user.password)

    if user.prenom and user.nom:
        nom_affichage = f"{user.prenom} {user.nom}"
    else:
        nom_affichage = user.prenom or user.nom or "Utilisateur"

    success = creer_utilisateur(
        user.email,
        hashed_pwd,
        user.competences,
        nom=nom_affichage,
        role_id=1
    )

    if not success:
        raise HTTPException(status_code=500, detail="Erreur lors de la création du compte")

    return {"message": "Utilisateur créé avec succès"}


@router.post("/api/login", response_model=Token)
async def login(request: Request, user: UserAuth):
    db_user = get_user_by_email(user.email)

    if not db_user or not verify_mdp(user.password, db_user['password']):
        client_ip = request.client.host
        logger.error(f'{client_ip} - "POST /api/login HTTP/1.1" 401')
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    access_token = cree_acces_pour_token(
        data={"sub": db_user['email'], "role_id": db_user['role_id']}
    )

    nom_complet = db_user['nom'] or "Utilisateur"
    parties = nom_complet.strip().split(' ', 1)
    prenom_affichage = parties[0] if parties else "Utilisateur"

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "email": db_user['email'],
        "nom": nom_complet,
        "prenom": prenom_affichage
    }


@router.get("/api/dashboard/stats/monthly")
def get_monthly_stats(email: str = Query(...)):
    stats_data = [
        {"mois": "Janv.", "envoyees": 5, "acceptees": 1, "refusees": 2},
        {"mois": "Févr.", "envoyees": 8, "acceptees": 2, "refusees": 1},
        {"mois": "Mars", "envoyees": 12, "acceptees": 3, "refusees": 4},
        {"mois": "Avril", "envoyees": 14, "acceptees": 5, "refusees": 3},
        {"mois": "Mai", "envoyees": 19, "acceptees": 6, "refusees": 5}
    ]
    return stats_data


@router.put("/api/dashboard/user/{email}")
def update_user_profile_route(email: str, profile: ProfileUpdate):
    success = update_user_profile(email, profile.nom, profile.competences)
    if not success:
        raise HTTPException(status_code=500, detail="Erreur lors de la mise à jour du profil")
    return {"message": "Profil mis à jour avec succès"}
