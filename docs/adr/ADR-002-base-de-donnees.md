# ADR-002 — Base de données

**Date :** 23 avril 2026
**Statut :** Accepté
**Décideurs :** Marius Ceugniet

---

## Contexte

L'application stocke des utilisateurs avec un rôle, des offres collectées et normalisées, et les candidatures des utilisateurs. Les données doivent survivre aux redémarrages des conteneurs, et une même offre collectée plusieurs fois ne doit apparaître qu'une fois.

## Décision

**SGBD :** MySQL 8.0, avec un volume Docker persistant (`db_data`) et un schéma créé au premier lancement par [`data.sql`](../../data.sql).

## Pourquoi

- Les données sont relationnelles et bien structurées : un modèle en tables avec clés étrangères convient.
- Les contraintes d'unicité de MySQL permettent de dédoublonner les offres directement à l'insertion.
- L'image officielle `mysql:8.0` exécute automatiquement les scripts de `/docker-entrypoint-initdb.d/` au premier démarrage.

## Comment

| Table | Rôle | Points clés |
| :--- | :--- | :--- |
| `roles` | Rôles applicatifs | `1 = utilisateur`, `2 = admin`, insérés par `data.sql` |
| `utilisateurs` | Comptes | Email unique, mot de passe haché (bcrypt), compétences, clé étrangère vers `roles` |
| `offres` | Offres normalisées | Clé unique sur `(titre, entreprise_nom)` |
| `candidatures` | Suivi des candidatures | Email de l'utilisateur, identifiant de l'offre, date et statut |

**Dédoublonnage** : l'insertion utilise `INSERT IGNORE` ; une offre dont le couple *(titre, entreprise)* existe déjà est ignorée. La collecte peut donc être relancée toutes les 30 minutes sans créer de doublons.

**Accès** : toutes les requêtes passent par `mysql-connector-python` avec des paramètres liés (`%s`), jamais par concaténation de chaînes. Elles sont regroupées dans [`backend/database_api.py`](../../backend/database_api.py).

## Trade-offs

| Avantage | Inconvénient |
| :--- | :--- |
| Dédoublonnage sans logique applicative | Deux offres différentes avec le même titre dans la même entreprise sont fusionnées |
| Schéma lisible, initialisé automatiquement | `data.sql` n'est exécuté qu'à la création du volume : une évolution du schéma demande de recréer le volume |
| Requêtes SQL explicites, faciles à relire | Pas d'ORM ni de migrations versionnées |

## Évolutions envisagées

- Ajouter des clés étrangères de `candidatures` vers `utilisateurs` et `offres`.
- Introduire un outil de migrations (Alembic) pour faire évoluer le schéma sans perte de données.
- Enregistrer les compétences extraites des offres dans la colonne `competences`, déjà prévue.

## Liens

- [`data.sql`](../../data.sql)
- [ADR-004 — Intégration WeLoveDevs](ADR-004-integration-welovedevs.md)
