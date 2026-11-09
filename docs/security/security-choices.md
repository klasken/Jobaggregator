# Choix de sécurité

**Date :** 18 mai 2026
**Auteurs :** Loïs Ekollo, Marius Ceugniet, Gauthier Lebrun

---

> Ce document présente les menaces identifiées, les mesures en place et l'endroit où elles se trouvent dans le code, puis les limites connues. Format : **menace → mesure → preuve**.

---

## 1. Gestion des secrets

**Menace :** une clé d'API ou un mot de passe de base de données publié dans le dépôt peut être récupéré par n'importe qui.

**Mesure :**
- La clé WeLoveDevs et les identifiants MySQL sont lus depuis des variables d'environnement, fournies par un fichier `.env` exclu du dépôt.
- Le fichier `.env.example` documente les variables sans valeur réelle.
- Sans `.env`, Docker Compose utilise des valeurs de test, jamais des secrets réels.

**Preuve :** [`.gitignore`](../../.gitignore), [`.env.example`](../../.env.example), section `environment` de [`docker-compose.yml`](../../docker-compose.yml).

---

## 2. Stockage des mots de passe

**Menace :** en cas de fuite de la base, des mots de passe en clair seraient directement exploitables, y compris sur d'autres sites.

**Mesure :** hachage **bcrypt** avec sel aléatoire (`passlib`). Le mot de passe saisi est comparé au haché lors de la connexion ; il n'est jamais stocké ni journalisé.

**Preuve :** [`backend/auth.py`](../../backend/auth.py) (`obtenir_mdp_hasher`, `verify_mdp`).

---

## 3. Injections SQL

**Menace :** une valeur saisie par l'utilisateur (email, filtre de ville, type de contrat) modifie la requête SQL exécutée.

**Mesure :** toutes les requêtes utilisent des **paramètres liés** de `mysql-connector-python`. Les valeurs ne sont jamais concaténées dans le texte de la requête.

```python
# backend/database_api.py
query = "SELECT * FROM utilisateurs WHERE email = %s"
cursor.execute(query, (email,))
```

**Preuve :** [`backend/database_api.py`](../../backend/database_api.py), y compris pour les filtres dynamiques de `get_filtered_jobs`.

---

## 4. Validation des entrées

**Menace :** des données mal formées provoquent des erreurs ou des comportements inattendus.

**Mesure :** les corps de requête sont décrits par des modèles **Pydantic**. L'email est validé avec `EmailStr`, et une requête invalide est rejetée avec une erreur 422 avant d'atteindre la base.

**Preuve :** [`backend/routes.py`](../../backend/routes.py) (`UserAuth`, `ProfileUpdate`), [`backend/api.py`](../../backend/api.py).

---

## 5. Attaques par force brute sur la connexion

**Menace :** un attaquant essaie un grand nombre de mots de passe sur un même compte.

**Mesure :**
- Chaque échec de connexion est écrit dans `app.log` avec l'IP réelle du client (en-tête `X-Real-IP` ajouté par Nginx).
- **fail2ban** lit ce fichier : 5 échecs en 10 minutes pour une même IP entraînent un bannissement de 10 minutes.
- Le bannissement est appliqué dans la chaîne iptables `DOCKER-USER`, qui filtre le trafic à destination des conteneurs.

**Preuve :** [`backend/routes.py`](../../backend/routes.py), [`jail.d/jail.local`](../../jail.d/jail.local), [`jail.d/filter.d/jobaggregator.conf`](../../jail.d/filter.d/jobaggregator.conf), service `fail2ban` de [`docker-compose.yml`](../../docker-compose.yml).

---

## 6. Exposition des services

**Menace :** une base de données ou un outil d'administration accessible depuis Internet.

**Mesure :**
- MySQL n'a aucun port publié : il n'est joignable que depuis le réseau Docker interne `backend_network`.
- phpMyAdmin et l'API ne sont publiés que sur `127.0.0.1`. Depuis l'extérieur, seul Nginx (port 8080) est accessible.
- Nginx est le point d'entrée unique et relaie `/api/` vers le backend.

**Preuve :** [`docker-compose.yml`](../../docker-compose.yml), [`front-end/nginx.conf`](../../front-end/nginx.conf).

---

## 7. Limites connues et corrections prévues

| Limite | Risque | Correction prévue |
| :--- | :--- | :--- |
| Les routes d'administration, de profil et de candidature ne vérifient pas le JWT côté serveur | Un utilisateur qui connaît une route peut l'appeler sans être administrateur | Dépendance FastAPI qui valide le jeton et le rôle sur chaque route protégée |
| Clé de signature JWT définie dans le code | Fabrication de jetons par quiconque lit le code | Variable d'environnement `JWT_SECRET` |
| CORS ouvert à toutes les origines | Appels de l'API depuis n'importe quel site | Liste blanche limitée au domaine du front |
| Jeton stocké dans `localStorage` | Vol du jeton en cas de faille XSS | Cookie `HttpOnly` et `Secure` |
| Pas de HTTPS dans la configuration locale | Interception du trafic sur un réseau non sûr | Certificat TLS sur Nginx lors d'un déploiement |

---

## Liens

- [ADR-003 — Authentification](../adr/ADR-003-authentification.md)
- [ADR-001 — Architecture générale](../adr/ADR-001-architecture-generale.md)
