# ADR-002 — Base de Données

**Date :** _[à compléter]_
**Statut :** Proposé / Accepté / Obsolète _(choisir)_
**Décideurs :** _[noms des membres concernés]_

---

## Contexte

Le projet nécessite de stocker des utilisateurs, des offres d'emploi normalisées, et des rôles. La base doit survivre aux redémarrages de conteneurs (volume Docker persistant) et garantir l'intégrité des données.

---

## Décision

**SGBD choisi :** _[ex: PostgreSQL 15]_

---

## Pourquoi (Why)

_[Expliquer le choix ici. Exemple :]_
> PostgreSQL offre de solides contraintes d'intégrité (clés étrangères, unicité), une bonne gestion des types JSON pour les données flexibles des offres, et une large adoption dans l'industrie. Il est également bien supporté par Docker.

---

## Comment (How)

### Schéma de la base de données

```sql
-- Utilisateurs
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,          -- hashé (bcrypt)
    role        VARCHAR(50) NOT NULL DEFAULT 'user', -- 'user' | 'admin'
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- Offres d'emploi (normalisées)
CREATE TABLE offers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id     VARCHAR(255) UNIQUE,         -- ID WeLoveDevs ou autre source
    source          VARCHAR(100) NOT NULL,        -- 'welovedevs' | ...
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    company         VARCHAR(255),
    location        VARCHAR(255),
    contract_type   VARCHAR(100),                -- 'CDI' | 'CDD' | 'Stage' | ...
    salary_min      INTEGER,                     -- en euros/an, null si inconnu
    salary_max      INTEGER,
    published_at    TIMESTAMP,
    expires_at      TIMESTAMP,
    url             TEXT,
    is_moderated    BOOLEAN DEFAULT FALSE,       -- validé par un admin
    is_visible      BOOLEAN DEFAULT TRUE,
    raw_data        JSONB,                       -- données brutes de la source
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- Favoris utilisateur
CREATE TABLE user_favorites (
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    offer_id    UUID REFERENCES offers(id) ON DELETE CASCADE,
    created_at  TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, offer_id)
);

-- Scores IA (résultats du modèle, si stockés)
CREATE TABLE offer_ai_scores (
    offer_id        UUID PRIMARY KEY REFERENCES offers(id) ON DELETE CASCADE,
    score           FLOAT,                       -- ex: score de pertinence
    labels          JSONB,                       -- ex: {"category": "backend", "level": "junior"}
    computed_at     TIMESTAMP DEFAULT NOW()
);

-- Logs d'ingestion
CREATE TABLE ingestion_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source          VARCHAR(100) NOT NULL,
    started_at      TIMESTAMP NOT NULL,
    finished_at     TIMESTAMP,
    offers_fetched  INTEGER DEFAULT 0,
    offers_new      INTEGER DEFAULT 0,
    offers_updated  INTEGER DEFAULT 0,
    status          VARCHAR(50),                 -- 'success' | 'partial' | 'error'
    error_message   TEXT
);
```

### Diagramme entité-relation (simplifié)

```
users ──────────── user_favorites ──────────── offers
  │                                               │
  │                                       offer_ai_scores
  │
  └─── [role: user / admin]

ingestion_logs (indépendant, pour le monitoring)
```

---

## Contraintes d'intégrité

- `users.email` : UNIQUE + NOT NULL
- `offers.external_id` : UNIQUE (évite les doublons lors de l'ingestion)
- `user_favorites` : clé primaire composite (user_id, offer_id)
- Clés étrangères avec `ON DELETE CASCADE` pour éviter les orphelins
- Les mots de passe sont **toujours** hashés avant insertion (jamais en clair)

---

## Persistance

Le volume Docker est monté sur `/var/lib/postgresql/data` dans le service `database` du `docker-compose.yml` :

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data
```

---

## Trade-offs

| Avantage | Inconvénient |
|---|---|
| Contraintes d'intégrité fortes | Plus verbeux qu'une base document |
| Requêtes complexes (JOIN) performantes | Schéma moins flexible si les offres varient beaucoup |
| Très bien supporté en prod | _[à compléter]_ |

---

## Alternative rejetée

**Alternative :** _[ex: MongoDB]_

**Raison du rejet :** _[ex: Les données d'offres sont suffisamment structurées pour une base relationnelle. MongoDB aurait ajouté de la complexité sans apporter de bénéfice clair, et les contraintes d'intégrité auraient dû être gérées manuellement.]_

---

## Liens

- [`backend/models/`](../../backend/models/) — modèles ORM
- [`backend/migrations/`](../../backend/migrations/) — migrations
- [ADR-001 — Architecture générale](ADR-001-architecture-generale.md)
