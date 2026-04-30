# Job Aggregator — Epitech × WeLoveDevs

> Plateforme d'agrégation d'offres d'emploi et de stages pour développeurs.

---

## Table des matières

- [Présentation du projet](#présentation-du-projet)
- [Lancer le projet en local](#lancer-le-projet-en-local)
- [Architecture](#architecture)
- [Documentation](#documentation)
- [Équipe](#équipe)

---

## Présentation du projet

Ce projet est réalisé dans le cadre du programme **Build It For Real** d'Epitech, en partenariat avec **WeLoveDevs**.

La plateforme collecte des offres d'emploi et de stages depuis l'API WeLoveDevs, les normalise, et les présente aux utilisateurs avec des fonctionnalités de recherche, filtrage, et recommandation IA.

**Stack technique :**
- Frontend : _[Sacha ]_
- acces : _[Sacha ]_
- maquatage :_[Sacha ]_

- Backend : _[Maruis ]_
- Base de données : _[Maruis ]_
- IA : _[Maruis ]_

- Architectur et Conteurisation : _[Loîs ]_
- Automatisation de la data : _[Loîs ]_
- Securité opérationelle : _[Loîs ]_

- Documentation : _[Gauthier Lebrun]_
- README : _[Gauthier Lebrun]_

---

## Lancer le projet en local

> Prérequis : Docker et Docker Compose installés.

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd job-aggregator

# 2. Configurer les variables d'environnement
cp .env.example .env
# Remplir les valeurs dans .env (voir section Configuration)

# 3. Lancer tous les services
docker compose up --build
```

L'application sera disponible sur : `http://localhost:8080`
L'API sera disponible sur : `http://localhost:8000`

### Configuration

Copier `.env.example` en `.env` et renseigner :

| Variable | Description | Obligatoire |
|---|---|---|
| `WELOVEDEVS_API_KEY` | Clé API WeLoveDevs | ✅ |
| `DATABASE_URL` | URL de connexion à la base | ✅ |
| `JWT_SECRET` | Secret pour les tokens JWT | ✅ |
| `ADMIN_EMAIL` | Email du premier compte admin | ✅ |
| `ADMIN_PASSWORD` | Mot de passe du premier compte admin | ✅ |

> ⚠️ Ne jamais committer le fichier `.env`. Il est dans le `.gitignore`.

---

## Architecture

```
job-aggregator/
├── frontend/          # Interface utilisateur
├── backend/           # API REST
├── ai-service/        # Service IA (si séparé)
├── docs/              # Documentation du projet
│   ├── adr/           # Architecture Decision Records
│   ├── product/       # Documentation produit
│   ├── security/      # Documentation sécurité
│   ├── data-ai/       # Choix data & IA
│   └── ci/            # Pipeline CI/CD
├── .github/
│   └── workflows/     # GitHub Actions
├── docker-compose.yml
├── .env.example
└── README.md
```

Voir [`docs/adr/ADR-001-architecture-generale.md`](docs/adr/ADR-001-architecture-generale.md) pour les détails des choix techniques.

---

## Documentation

| Document | Description |
|---|---|
| [ADR-001 — Architecture générale](docs/adr/ADR-001-architecture-generale.md) | Choix du stack et des services |
| [ADR-002 — Base de données](docs/adr/ADR-002-base-de-donnees.md) | Modèle de données et choix du SGBD |
| [ADR-003 — Authentification](docs/adr/ADR-003-authentification.md) | Stratégie d'auth et gestion des rôles |
| [ADR-004 — Intégration WeLoveDevs](docs/adr/ADR-004-integration-welovedevs.md) | Stratégie d'ingestion et normalisation |
| [ADR-005 — Feature IA](docs/adr/ADR-005-feature-ia.md) | Choix du modèle et justification |
| [ADR-006 — CI/CD](docs/adr/ADR-006-ci-cd.md) | Pipeline GitHub Actions |
| [Produit — Market Scan](docs/product/market-scan.md) | Analyse du marché et concurrents |
| [Produit — Value Proposition](docs/product/value-proposition.md) | Proposition de valeur et personas |
| [Produit — Feature Justification](docs/product/feature-justification.md) | Justification des features data & IA |
| [Sécurité](docs/security/security-choices.md) | Menaces identifiées et contrôles implémentés |
| [Schéma BDD](docs/adr/ADR-002-base-de-donnees.md) | Modèle entité-relation |

---

## Équipe

| Nom | Rôle |
|---|---|
| _[Gauthier Lebrun]_ | Product / Documentation |
| _[Maruis ]_ | Backend |
| _[Sacha ]_ | Frontend |
| _[Loîs ]_ | DevOps / Sécurité |
| _[à compléter]_ | Data / IA |

---

## Accessibilité

L'interface respecte les critères **WCAG 2.1 Level AA** sur les flux suivants :
- Inscription / Connexion
- Recherche d'offres
- Détail d'une offre

Résultats de l'audit Lighthouse disponibles dans [`docs/product/accessibility-audit.md`](docs/product/accessibility-audit.md).
