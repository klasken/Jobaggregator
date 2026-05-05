# Documentation Sécurité

**Date :** _[à compléter]_
**Auteur :** _[nom]_

---

> Ce document présente les menaces identifiées et les contrôles implémentés. Format : **Menace → Contrôle → Où dans le code**.

---

## 1. Gestion des secrets

### Menace

Les clés API (WeLoveDevs), les secrets JWT et les credentials de base de données, s'ils sont commités dans le dépôt, peuvent être récupérés par n'importe qui ayant accès au code.

### Contrôle implémenté

- Toutes les valeurs sensibles sont stockées dans un fichier `.env` (non commité, dans `.gitignore`)
- Un fichier `.env.example` documente les variables nécessaires sans révéler les valeurs
- En CI, les secrets sont injectés via **GitHub Actions Secrets** (Settings → Secrets and variables)
- Les variables d'environnement sont injectées dans les conteneurs Docker via `docker-compose.yml` (section `env_file` ou `environment`)

### Preuve

- [`.gitignore`](../../.gitignore) — `.env` listé
- [`.env.example`](../../.env.example) — template sans valeurs sensibles
- [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) — utilisation de `${{ secrets.JWT_SECRET }}`

---

## 2. Protection contre les injections

### Menace

Les injections SQL permettent à un attaquant d'exécuter des requêtes arbitraires en base de données via des inputs non validés (ex: champ de recherche, paramètres URL).

### Contrôle implémenté

- Utilisation d'un **ORM** (_[ex: SQLAlchemy / Prisma / Sequelize]_) avec des requêtes paramétrées (jamais de concaténation de chaîne dans les requêtes SQL)
- Validation et sanitisation des inputs via _[ex: Pydantic / Joi / Zod]_ sur toutes les routes
- Un middleware de validation centralisé rejette les requêtes malformées avant qu'elles atteignent la base

### Exemple concret

```python
# ❌ MAUVAIS - concaténation directe (vulnérable)
query = f"SELECT * FROM offers WHERE location = '{location}'"

# ✅ BON - requête paramétrée (sûr)
offers = db.query(Offer).filter(Offer.location == location).all()
```

### Preuve

- [`backend/middleware/validate.py`](../../backend/middleware/validate.py) — validation centralisée
- [`backend/models/offer.py`](../../backend/models/offer.py) — requêtes ORM

---

## 3. Mitigation du brute force

### Menace

Un attaquant peut essayer des milliers de combinaisons email/mot de passe sur la route `/auth/login` pour compromettre des comptes.

### Contrôle implémenté

- Rate limiting sur `POST /auth/login` : **5 tentatives maximum par IP sur 15 minutes**
- Après 5 échecs : réponse HTTP 429 `Too Many Requests` avec header `Retry-After`
- Bibliothèque utilisée : _[ex: `slowapi` (Python) / `express-rate-limit` (Node.js)]_
- Les messages d'erreur ne distinguent pas "email inexistant" et "mauvais mot de passe" (protection contre l'énumération d'emails)

### Preuve

- [`backend/middleware/rate_limit.py`](../../backend/middleware/rate_limit.py) — configuration du rate limiter
- [`backend/tests/test_auth.py`](../../backend/tests/test_auth.py) — test du comportement 429

---

## 4. Sécurité des routes, sessions et tokens

### Menace

Des routes sensibles (administration, ingestion) pourraient être accessibles sans authentification.

### Contrôle implémenté

- Toutes les routes sensibles utilisent le middleware `requireAuth` (vérification JWT)
- Les routes admin utilisent en plus le middleware `requireAdmin` (vérification du rôle)
- Le contrôle d'accès est **exclusivement côté serveur** (jamais uniquement côté client)
- Les tokens JWT ont une durée de vie courte (15 minutes pour l'access token)
- Le refresh token est stocké dans un **cookie HttpOnly + Secure + SameSite=Strict** (inaccessible au JavaScript)

### Preuve

- [`backend/middleware/auth.py`](../../backend/middleware/auth.py) — middleware JWT
- [ADR-003 — Authentification](../adr/ADR-003-authentification.md) — détails complets

---

## 5. Flux d'authentification sécurisé

### Menace

Un flux d'authentification mal conçu peut exposer les mots de passe (stockage en clair, transmission non chiffrée) ou permettre des attaques par replay.

### Contrôle implémenté

- Mots de passe hachés avec **bcrypt** (coût 12) avant stockage — jamais stockés en clair
- Transmission uniquement via HTTPS en production (TLS)
- Validation de la complexité du mot de passe à l'inscription (minimum 8 caractères, au moins une majuscule et un chiffre)
- Les tokens JWT sont signés avec `HS256` et un secret fort (`JWT_SECRET` de minimum 32 caractères aléatoires)

### Preuve

- [`backend/services/auth.py`](../../backend/services/auth.py) — hachage bcrypt
- [`backend/routes/auth.py`](../../backend/routes/auth.py) — validation des inputs à l'inscription

---

## 6. Protection des données en transit et au repos

### Menace

Les données sensibles (emails, mots de passe, tokens) peuvent être interceptées si transmises en clair, ou lues directement en base si non protégées.

### Contrôle implémenté

**En transit :**
- HTTPS obligatoire en production (TLS 1.2+)
- En développement local : HTTP acceptable sur `localhost` uniquement

**Au repos :**
- Mots de passe hashés en base (bcrypt)
- Les tokens JWT ne sont pas stockés en base
- Les données brutes des offres (`raw_data`) ne contiennent pas d'informations personnelles

### Preuve

- _[Lien vers la configuration HTTPS / certificat si déployé]_
- [`backend/models/user.py`](../../backend/models/user.py) — champ `password` jamais retourné dans les réponses API

---

## Récapitulatif des menaces et contrôles

| Menace | Criticité | Contrôle | Statut |
|---|---|---|---|
| Exposition des secrets | 🔴 Haute | `.env` + GitHub Secrets | ✅ Implémenté |
| Injection SQL | 🔴 Haute | ORM + validation centralisée | ✅ Implémenté |
| Brute force | 🟡 Moyenne | Rate limiting (5 req/15min) | ✅ Implémenté |
| Accès non autorisé | 🔴 Haute | JWT + middleware rôles | ✅ Implémenté |
| Vol de session | 🟡 Moyenne | Cookie HttpOnly + courte durée | ✅ Implémenté |
| Données en clair | 🔴 Haute | bcrypt + HTTPS | ✅ Implémenté |
| XSS | 🟡 Moyenne | _[ex: CSP headers, sanitisation]_ | _[statut]_ |
| CSRF | 🟡 Moyenne | _[ex: SameSite cookie]_ | _[statut]_ |

---

## Liens

- [ADR-003 — Authentification](../adr/ADR-003-authentification.md)
- [`backend/middleware/`](../../backend/middleware/) — tous les middlewares de sécurité
