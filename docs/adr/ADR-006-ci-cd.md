# ADR-006 — CI/CD avec GitHub Actions

**Date :** _[à compléter]_
**Statut :** Proposé / Accepté / Obsolète _(choisir)_
**Décideurs :** _[noms des membres concernés]_

---

## Contexte

Le projet requiert une pipeline CI via **GitHub Actions**, déclenchée automatiquement sur chaque pull request et push sur `main`. La pipeline doit inclure : build checks, lint/quality, et tests automatisés couvrant au minimum 2 routes API et 1 fonction de normalisation.

---

## Décision

**Outil CI :** GitHub Actions (`.github/workflows/`)

**Déclencheurs :** `push` sur `main` + `pull_request` sur `main`

---

## Pourquoi (Why)

> GitHub Actions est directement intégré au dépôt, sans infrastructure supplémentaire. Il est gratuit pour les projets publics et bien documenté. Le choix est aussi imposé par le projet.

---

## Comment (How)

### Structure des workflows

```
.github/
└── workflows/
    ├── ci.yml          # Pipeline principale (build + lint + tests)
    └── deploy.yml      # (Bonus) Déploiement sur push main
```

### Workflow principal (`ci.yml`)

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # ─── 1. Vérification du build ───────────────────────────────────────────
  build:
    name: Build Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker images
        run: docker compose build

  # ─── 2. Lint et qualité du code ─────────────────────────────────────────
  lint:
    name: Lint & Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js (frontend)
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install frontend dependencies
        run: cd frontend && npm ci

      - name: Lint frontend
        run: cd frontend && npm run lint

      - name: Setup Python (backend)
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install backend dependencies
        run: cd backend && pip install -r requirements.txt

      - name: Lint backend (flake8 / ruff)
        run: cd backend && ruff check .

  # ─── 3. Tests automatisés ───────────────────────────────────────────────
  test:
    name: Automated Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: cd backend && pip install -r requirements.txt -r requirements-test.txt

      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:testpassword@localhost/testdb
          JWT_SECRET: test-secret-key
        run: cd backend && pytest tests/ -v --tb=short

      # Les tests couvrent au minimum :
      # - tests/test_auth.py      → POST /auth/login (route 1)
      # - tests/test_offers.py    → GET /offers (route 2)
      # - tests/test_normalize.py → normalize_offer() (fonction de normalisation)
```

### Tests minimum requis

| Fichier de test | Ce qui est testé | Route / Fonction |
|---|---|---|
| `tests/test_auth.py` | Login avec credentials valides | `POST /auth/login` |
| `tests/test_auth.py` | Login avec mauvais mot de passe → 401 | `POST /auth/login` |
| `tests/test_offers.py` | Récupération de la liste des offres | `GET /offers` |
| `tests/test_offers.py` | Filtrage par localisation | `GET /offers?location=Paris` |
| `tests/test_normalize.py` | Normalisation d'une offre WeLoveDevs complète | `normalize_offer()` |
| `tests/test_normalize.py` | Gestion des champs manquants (null-safety) | `normalize_offer()` |

---

## Pourquoi ces checks ?

| Check | Raison |
|---|---|
| Build Docker | Garantit que l'image se construit avant tout merge |
| Lint | Maintient la cohérence du code et détecte les erreurs triviales |
| Tests routes API | Valide le comportement observable de l'API |
| Tests normalisation | La normalisation est critique : un bug ici corrompt toute la base |

---

## Trade-offs

| Avantage | Inconvénient |
|---|---|
| Intégré à GitHub, pas de service externe | Temps de build peut être long (~3-5 min) |
| Visible de toute l'équipe sur les PRs | Les secrets doivent être configurés dans GitHub Settings |
| Gratuit pour repos publics | _[à compléter]_ |

---

## Liens

- [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) — workflow CI
- [`backend/tests/`](../../backend/tests/) — suite de tests
- [ADR-001 — Architecture générale](ADR-001-architecture-generale.md)
