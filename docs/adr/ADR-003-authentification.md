# ADR-003 — Authentification et Gestion des Rôles

**Date :** _[à compléter]_
**Statut :** Proposé / Accepté / Obsolète _(choisir)_
**Décideurs :** _[noms des membres concernés]_

---

## Contexte

Le projet requiert une authentification sécurisée et un système de rôles (`user` / `admin`) avec un contrôle d'accès appliqué côté serveur. Les routes sensibles (administration, modération) doivent être protégées.

---

## Décision

**Stratégie retenue :** JWT (JSON Web Tokens) avec refresh token stocké en cookie HttpOnly.

| Élément | Choix |
|---|---|
| Mécanisme d'auth | JWT (access token + refresh token) |
| Hachage des mots de passe | bcrypt (coût minimum : 12) |
| Stockage du refresh token | Cookie HttpOnly + Secure |
| Durée de l'access token | 15 minutes |
| Durée du refresh token | 7 jours |
| Contrôle d'accès | Middleware serveur vérifiant le rôle |

---

## Pourquoi (Why)

> JWT permet une authentification stateless adaptée à une API REST. Le refresh token en cookie HttpOnly protège contre les attaques XSS (le JavaScript côté client ne peut pas y accéder). bcrypt avec un coût élevé ralentit les attaques par force brute sur les mots de passe.

---

## Comment (How)

### Flux d'authentification

```
1. POST /auth/register
   → Validation email + mot de passe
   → Hash bcrypt du mot de passe
   → Insertion en base
   → Retourne access token (JSON) + set refresh token (cookie HttpOnly)

2. POST /auth/login
   → Vérification credentials
   → Génération JWT access token (15min) + refresh token (7j)
   → Set cookie HttpOnly pour le refresh token

3. GET /api/protected
   → Middleware vérifie Authorization: Bearer <access_token>
   → Décode le JWT, vérifie signature et expiration
   → Vérifie le rôle si route admin

4. POST /auth/refresh
   → Lit le refresh token depuis le cookie
   → Génère un nouvel access token
   → Retourne le nouvel access token

5. POST /auth/logout
   → Supprime le cookie refresh token (Set-Cookie avec Max-Age=0)
```

### Rôles et permissions

| Route | user | admin |
|---|---|---|
| GET /offers | ✅ | ✅ |
| GET /offers/:id | ✅ | ✅ |
| POST /favorites | ✅ | ✅ |
| POST /admin/offers/moderate | ❌ | ✅ |
| GET /admin/users | ❌ | ✅ |
| POST /admin/ingest | ❌ | ✅ |
| DELETE /admin/offers/:id | ❌ | ✅ |

### Middleware de protection (pseudocode)

```javascript
// Vérifie le token JWT
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Non authentifié" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }
}

// Vérifie le rôle admin
function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Accès interdit" });
  }
  next();
}
```

---

## Protection anti-brute force

- Rate limiting sur `POST /auth/login` : max 5 tentatives / 15 min / IP
- Bibliothèque utilisée : _[ex: express-rate-limit]_
- Après 5 échecs : réponse 429 Too Many Requests avec `Retry-After`

---

## Trade-offs

| Avantage | Inconvénient |
|---|---|
| Stateless, scalable | Access token non révocable avant expiration |
| Refresh token sécurisé (HttpOnly) | Complexité légèrement supérieure à une session classique |
| Pas de session server-side à gérer | Nécessite HTTPS en production |

---

## Alternative rejetée

**Alternative :** Sessions serveur (express-session + store Redis)

**Raison du rejet :** Nécessite un service supplémentaire (Redis) et une gestion d'état serveur. JWT est plus adapté à une architecture conteneurisée stateless.

---

## Liens

- [`backend/middleware/auth.js`](../../backend/middleware/auth.js) — middleware d'authentification
- [`backend/routes/auth.js`](../../backend/routes/auth.js) — routes d'auth
- [Sécurité](../security/security-choices.md)
