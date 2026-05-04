from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta


pwd_contenue = CryptContext(schemes=["bcrypt"], deprecated="auto", truncate_error=False)

SECRET_KEY = "cle_complique_impossible_find_biensur"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_mdp(plain_password, hashed_password):
    """Vérifie si le mot de passe tapé correspond au haché en BDD"""
    return pwd_contenue.verify(plain_password, hashed_password)

def obtenir_mdp_hasher(password):
    """Hache un mot de passe (pour l'inscription)"""
    return pwd_contenue.hash(password)

def cree_acces_pour_token(data: dict):
    """Génère un vrai token JWT"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
