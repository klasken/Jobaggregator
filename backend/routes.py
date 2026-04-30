from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional

app = FastAPI()

class UserAuth(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str


@app.post("/api/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserAuth):
    """
    Route d'inscription pour le frontend.
    Ton pote doit envoyer un JSON avec 'email' et 'password'.
    """
    # TODO
    # TODO

    return {"message": "Utilisateur créé avec succès"}

@app.post("/api/login", response_model=Token)
async def login(user: UserAuth):
    """
    Route de connexion.
    Retourne un token JWT si les identifiants sont bons.
    """
    # TODO
    # TODO

    return {
        "access_token": "fake-jwt-token-pour-le-front",
        "token_type": "bearer"
    }
