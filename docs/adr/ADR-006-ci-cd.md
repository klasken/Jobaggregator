# ADR-006 — Intégration continue

**Date :** 29 avril 2026
**Statut :** Accepté
**Décideurs :** Loïs Ekollo

---

## Contexte

Quatre personnes travaillent en parallèle sur le front, le back et l'infrastructure. Une erreur de syntaxe Python ou une erreur TypeScript poussée sur `main` casse le lancement de toute la stack. Le sujet impose GitHub Actions.

## Décision

Un workflow unique, [`.github/workflows/main.yml`](../../.github/workflows/main.yml), déclenché à chaque push sur `main` et `develop` et à chaque pull request vers `main`.

| Étape | Commande | Ce qui est vérifié |
| :--- | :--- | :--- |
| Lint backend | `flake8 ./backend --select=E9,F63,F7,F82` | Erreurs de syntaxe et noms non définis |
| Build backend | `docker build ./backend` | Installation des dépendances Python |
| Build frontend | `docker build ./front-end` | Compilation TypeScript (`tsc -b`) et build Vite |
| Compose | `docker compose config` | Validité de `docker-compose.yml` |

## Pourquoi

- Construire les images, c'est vérifier exactement ce qui sera lancé en production.
- La sélection flake8 ne bloque que les erreurs qui empêchent l'API de démarrer, sans imposer de règles de style au reste de l'équipe.
- `tsc -b` dans le build du front bloque les erreurs de typage avant la fusion.

## Trade-offs

| Avantage | Inconvénient |
| :--- | :--- |
| Workflow court et lisible | Pas encore de tests unitaires |
| Détecte les erreurs bloquantes avant la fusion | Le build du backend est long (installation de PyTorch) |
| Aucun secret nécessaire | Pas de déploiement automatique |

## Évolutions envisagées

- Ajouter `pytest` sur la normalisation des offres et le calcul des scores IA.
- Lancer `npm run lint` sur le front.
- Mettre en cache les couches Docker pour accélérer le build du backend.

## Liens

- [`.github/workflows/main.yml`](../../.github/workflows/main.yml)
- [ADR-001 — Architecture générale](ADR-001-architecture-generale.md)
