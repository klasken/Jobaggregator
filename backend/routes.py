from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from database_api import get_user_by_email, creer_utilisateur
from auth import verify_mdp, obtenir_mdp_hasher, cree_acces_pour_token

router = APIRouter()

class UserAuth(BaseModel):
    nom: str
    email: EmailStr
    password: str
    competences: str = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/api/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserAuth):
    if get_user_by_email(user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cet email est déjà utilisé"
        )
    hashed_pwd = obtenir_mdp_hasher(user.password)
    success = creer_utilisateur(user.nom, user.email, hashed_pwd, user.competences, role_id = 1)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erreur lors de la création du compte"
        )

    return {"message": "Utilisateur créé avec succès"}

@router.post("/api/login", response_model=Token)
async def login(user: UserLogin):
    """Route de connexion."""
    db_user = get_user_by_email(user.email)

    if not db_user or not verify_mdp(user.password, db_user['password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
        )

    access_token = cree_acces_pour_token(
        data={"sub": db_user['email'], "role_id": db_user['role_id']}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
