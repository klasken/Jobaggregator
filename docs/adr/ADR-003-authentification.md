# ADR-003 — Authentification

**Date :** 30 avril 2026
**Statut :** Accepté (renforcement côté serveur prévu)
**Décideurs :** Marius Ceugniet, Sacha Bouron, Loïs Ekollo

---

## Contexte

Les utilisateurs doivent créer un compte, se connecter et retrouver leur profil et leurs candidatures. Un rôle administrateur donne accès à la gestion des utilisateurs et des offres. Le formulaire de connexion est une cible classique d'attaque par force brute.

## Décision

- **Mots de passe** hachés avec **bcrypt** (bibliothèque `passlib`).
- **Session** sans état côté serveur, par **jeton JWT** signé en HS256 (`python-jose`), valable 30 minutes.
- **Rôles** stockés en base (`role_id`) et inclus dans le jeton.
- **Protection contre la force brute** : chaque échec de connexion est journalisé, et **fail2ban** bannit l'IP après 5 échecs en 10 minutes.

## Pourquoi

- bcrypt est lent par conception et salé : un vol de la base ne donne pas accès aux mots de passe.
- Un JWT évite de stocker des sessions côté serveur et transporte directement l'email et le rôle.
- fail2ban agit au niveau réseau, sans modifier la logique de l'API.

## Comment

```
Inscription  POST /api/register  → hachage bcrypt → INSERT utilisateurs (role_id = 1)
Connexion    POST /api/login     → vérification bcrypt
                                   ├─ succès : JWT { sub: email, role_id, exp: +30 min }
                                   └─ échec  : ligne « <IP> - "POST /api/login HTTP/1.1" 401 » dans app.log
Front        token dans localStorage → lecture de l'expiration et du rôle → menu Admin si role_id = 2
fail2ban     5 échecs en 10 min pour une même IP → bannissement 10 min (chaîne iptables DOCKER-USER)
```

Derrière Nginx, l'API lit l'IP du client dans l'en-tête `X-Real-IP` ajouté par le reverse proxy. L'API n'est exposée que sur `127.0.0.1`, ce qui empêche un client distant de falsifier cet en-tête en appelant le port 8000 directement.

## Limites connues

| Limite | Correction prévue |
| :--- | :--- |
| Les routes d'administration, de profil et de candidature ne vérifient pas encore le jeton côté serveur | Dépendance FastAPI qui décode le JWT et contrôle le rôle sur chaque route protégée |
| La clé de signature du JWT est définie dans le code | Lecture depuis une variable d'environnement (`JWT_SECRET`) |
| Le jeton est stocké dans `localStorage` | Cookie `HttpOnly` pour le protéger d'une éventuelle faille XSS |

## Alternative non retenue

**Sessions stockées côté serveur** : révocation plus simple, mais elles imposent un stockage partagé (table ou cache) et une gestion des cookies que le projet ne demandait pas.

## Liens

- [`backend/auth.py`](../../backend/auth.py), [`backend/routes.py`](../../backend/routes.py)
- [`jail.d/`](../../jail.d) — configuration fail2ban
- [Choix de sécurité](../security/security-choices.md)
