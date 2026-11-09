# ADR-001 — Architecture générale

**Date :** 29 avril 2026
**Statut :** Accepté
**Décideurs :** Marius Ceugniet, Sacha Bouron, Loïs Ekollo, Gauthier Lebrun

---

## Contexte

La plateforme doit réunir un frontend, une API REST, une base de données, une collecte de données depuis l'API WeLoveDevs et une feature IA légère. Le sujet impose une conteneurisation complète avec Docker et une intégration continue sur GitHub Actions.

## Décision

| Couche | Technologie | Raison principale |
| :--- | :--- | :--- |
| Frontend | React 19 + TypeScript, Vite | Typage des données reçues de l'API, écosystème de composants (Recharts, Leaflet) |
| Serveur web | Nginx | Sert le build statique et relaie `/api/` vers le backend (une seule origine pour le navigateur) |
| Backend | FastAPI (Python 3.12) | Validation des entrées avec Pydantic, documentation OpenAPI générée automatiquement, même langage que la partie IA |
| Base de données | MySQL 8 | Données relationnelles (utilisateurs, rôles, offres, candidatures), image Docker officielle |
| IA | Sentence-Transformers, dans le backend | Modèle léger chargé une seule fois au démarrage de l'API |
| Administration BDD | phpMyAdmin | Consultation des données pendant le développement |
| Protection | fail2ban | Bannissement des IP qui enchaînent les échecs de connexion |
| Orchestration | Docker Compose | Lancement de toute la stack en une commande |

## Comment

Cinq services sont définis dans [`docker-compose.yml`](../../docker-compose.yml) :

| Service | Exposition | Réseaux |
| :--- | :--- | :--- |
| `frontend` (Nginx) | `8080` | `frontend_network` |
| `backend` (FastAPI) | `127.0.0.1:8000` | `frontend_network`, `backend_network` |
| `db` (MySQL) | aucune | `backend_network` |
| `phpmyadmin` | `127.0.0.1:8081` | `backend_network` |
| `fail2ban` | réseau de l'hôte (règles iptables) | — |

```
[Navigateur] → [Nginx :8080] → /api/ → [FastAPI :8000] → [MySQL :3306]
                                                       → [API WeLoveDevs]
```

La base n'est joignable que depuis le réseau interne `backend_network`. Les secrets (clé d'API, identifiants MySQL) sont fournis par variables d'environnement à partir d'un fichier `.env` non versionné.

## Trade-offs

| Avantage | Inconvénient |
| :--- | :--- |
| Un seul backend Python : pas de communication inter-services pour l'IA | L'image du backend est lourde (PyTorch) et son premier démarrage est long |
| Nginx comme point d'entrée unique, sans souci de CORS pour les appels `/api/` | Une partie des pages appelle encore l'API directement sur le port 8000 |
| Stack complète lancée en une commande | fail2ban dépend des règles iptables de l'hôte (pensé pour un serveur Linux) |

## Alternative non retenue

**Service IA séparé (`ai-worker`)** : il aurait isolé PyTorch du reste de l'API. Il a été écarté parce que l'IA ne sert qu'une route et qu'un service supplémentaire aurait ajouté un appel réseau et une configuration à maintenir.

## Liens

- [ADR-002 — Base de données](ADR-002-base-de-donnees.md)
- [ADR-003 — Authentification](ADR-003-authentification.md)
- [ADR-005 — Feature IA](ADR-005-feature-ia.md)
