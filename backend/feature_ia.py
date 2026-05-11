from database_api import get_user_by_email, get_all_jobs
from sentence_transformers import SentenceTransformer
import torch

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def get_recommendations(user_email):
    user_data = get_user_by_email(user_email)
    if not user_data or not user_data.get("competences"):
        return {"error": "Compétences non renseignées ou utilisateur introuvable"}

    user_skills = user_data["competences"]

    user_embedding = model.encode(user_skills, convert_to_tensor=True)

    all_jobs = get_all_jobs()
    if not all_jobs:
        return {"error": "Aucune offre en base de données"}

    results = []
    for job in all_jobs:
        job_text = f"{job['titre']} {job['description']}"
        job_embedding = model.encode(job_text, convert_to_tensor=True)

        similarity = model.similarity(user_embedding, job_embedding)
        score = round(float(similarity.item()) * 100, 2)

        job["matching_score"] = score
        results.append(job)

    return sorted(results, key=lambda x: x["matching_score"], reverse=True)
