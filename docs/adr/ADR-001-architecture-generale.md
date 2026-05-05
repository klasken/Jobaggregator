# ADR-001 — Architecture Générale

**Date :** _[à compléter]_
**Statut :** Proposé / Accepté / Obsolète _(choisir)_
**Décideurs :** _[noms des membres concernés]_

---

## Contexte

Nous devons choisir un stack technique pour construire une plateforme fullstack comprenant : un frontend responsive, une API REST, une base de données, un service de collecte de données, et une feature IA légère. Le tout doit être conteneurisé avec Docker.

---

## Décision

**Stack retenu :**

| Couche | Technologie choisie | Raison principale |
|---|---|---|
| Frontend | _[ex: React / Next.js / Vue]_ | _[à compléter]_ |
| Backend | _[ex: Node.js/Express / FastAPI / NestJS]_ | _[à compléter]_ |
| Base de données | _[ex: PostgreSQL / MongoDB]_ | _[à compléter]_ |
| Service IA | _[ex: Python/scikit-learn / transformers]_ | _[à compléter]_ |
| Conteneurisation | Docker + Docker Compose | Requis par le projet |
| CI | GitHub Actions | Requis par le projet |

**Services Docker Compose :**
1. `frontend` — interface utilisateur
2. `backend` — API REST
3. `database` — base de données persistante
4. `ai-worker` _(optionnel)_ — service IA si séparé du backend

---

## Pourquoi (Why)

_[Expliquer ici les raisons de ces choix : compétences de l'équipe, rapidité de développement, compatibilité avec les contraintes du projet (IA < 500 MB, < 5s/offre), etc.]_

Exemple :
> On a choisi FastAPI pour le backend car il offre une génération automatique de documentation OpenAPI, une validation des données native avec Pydantic, et une bonne compatibilité avec les bibliothèques Python pour la feature IA.

---

## Comment (How)

La communication entre services se fait via le réseau interne Docker Compose. Chaque service expose uniquement les ports nécessaires. Les secrets sont injectés via des variables d'environnement (fichier `.env`, non commité).

```
[Navigateur] → [Frontend :3000] → [Backend API :8000] → [Database :5432]
                                                      → [AI Worker :8001]
                                                      → [WeLoveDevs API]
```

---

## Trade-offs

| Avantage | Inconvénient |
|---|---|
| _[ex: Développement rapide avec X]_ | _[ex: Moins de contrôle sur Y]_ |
| _[ex: Bonne documentation de Z]_ | _[ex: Courbe d'apprentissage de W]_ |

---

## Alternative rejetée

**Alternative :** _[ex: Monorepo avec un seul service fullstack type Next.js]_

**Raison du rejet :** _[ex: Moins de séparation des responsabilités, plus difficile à scaler, et ne correspond pas à l'architecture microservices attendue par le jury]_

---

## Liens

- [`docker-compose.yml`](../../docker-compose.yml)
- [ADR-002 — Base de données](ADR-002-base-de-donnees.md)
- [ADR-003 — Authentification](ADR-003-authentification.md)
