## 🚀 Job Aggregator - Architecture Microservices
Bienvenue dans le projet Job Aggregator. Cette application permet de collecter et visualiser des offres d'emploi provenant de l'API WeLoveDevs.


## 🏗️ Architecture Technique
L'infrastructure est entièrement conteneurisée et repose sur une architecture robuste :

Frontend : Application Node.js servie par Nginx (utilisé comme Reverse Proxy).

Backend : API Python (FastAPI/Flask) avec traitement de données via Pandas.

Base de Données : MySQL 8.0 pour le stockage persistant.

Administration : Interface PhpMyAdmin (isolée en local).


## 🛡️ Sécurité & Optimisation (Points Clés)
Multi-stage Builds : Image Frontend optimisée (poids réduit de 90%).

Utilisateur Non-Root : Le backend tourne avec un utilisateur restreint pour prévenir toute élévation de privilèges.

Isolation Réseau : La base de données est isolée sur un réseau privé, accessible uniquement par le backend.

Reverse Proxy : Nginx masque l'API backend et gère les redirections /api pour éviter les erreurs CORS.


## 🛠️ Installation et Lancement
1. Pré-requis
Docker et Docker Compose installés.

Un fichier .env à la racine (voir .env.example).

2. Démarrage rapide
Bash
Construire et lancer tous les services
docker-compose up --build -d

L'application sera disponible sur :

Frontend : http://localhost:8080

API Backend : http://localhost:8080/api

PhpMyAdmin : http://127.0.0.1:8081


## 🔄 Flux de Données 
Collecte : Déclenchement via l'API (Endpoint /api/fetch).

Traitement : Le backend utilise Pandas pour nettoyer les données brutes (parsing des salaires, nettoyage HTML).

Stockage : Insertion des données propres dans la base MySQL.


## 🤖 CI/CD
Ce dépôt intègre un workflow GitHub Actions qui valide automatiquement :

Le build des images Docker à chaque push.

La validité de la configuration docker-compose.