from database_api import get_user_by_email, get_all_jobs
from sentence_transformers import SentenceTransformer, util
import torch

# Modèle multilingue bien plus adapté au français
model = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

def build_job_text(job: dict) -> str:
    """Construit un texte représentatif de l'offre, en pondérant le titre et les compétences."""
    titre        = job.get("titre", "")
    entreprise   = job.get("entreprise_nom", "")
    competences  = job.get("competences", "") or ""
    description  = job.get("description", "") or ""

    # On répète le titre et les compétences pour leur donner plus de poids
    return f"{titre} {titre} {competences} {competences} {entreprise} {description[:300]}"

def build_user_text(user_data: dict) -> str:
    """Construit un texte représentatif du profil utilisateur."""
    competences = user_data.get("competences", "") or ""
    # On répète les compétences pour accentuer leur importance
    return f"{competences} {competences} {competences}"

def normalize_score(raw_score: float) -> float:
    """
    Transforme le score cosinus (souvent entre 0.2 et 0.8) en pourcentage lisible.
    On applique un min-max stretching entre 0.15 (= 0%) et 0.75 (= 100%).
    """
    MIN_SIM = 0.15
    MAX_SIM = 0.75
    clamped = max(MIN_SIM, min(MAX_SIM, raw_score))
    normalized = (clamped - MIN_SIM) / (MAX_SIM - MIN_SIM)
    return round(normalized * 100, 1)

def get_matching_jobs(user_email: str):
    user_data = get_user_by_email(user_email)
    if not user_data or not user_data.get("competences"):
        return {"error": "Compétences non renseignées ou utilisateur introuvable"}

    user_text = build_user_text(user_data)
    user_embedding = model.encode(user_text, convert_to_tensor=True)

    all_jobs = get_all_jobs()
    if not all_jobs:
        return {"error": "Aucune offre en base de données"}

    # Encode tous les jobs en batch pour la performance
    job_texts = [build_job_text(job) for job in all_jobs]
    job_embeddings = model.encode(job_texts, convert_to_tensor=True, batch_size=64, show_progress_bar=False)

    # Calcule toutes les similarités d'un coup
    similarities = util.cos_sim(user_embedding, job_embeddings)[0]

    results = []
    for i, job in enumerate(all_jobs):
        raw_score = float(similarities[i].item())
        job["matching_score"] = normalize_score(raw_score)
        job["raw_score"] = round(raw_score * 100, 2)  # utile pour debug
        results.append(job)

    return sorted(results, key=lambda x: x["matching_score"], reverse=True)
