# ADR-004 — Intégration WeLoveDevs et collecte des offres

**Date :** 30 avril 2026
**Statut :** Accepté
**Décideurs :** Marius Ceugniet, Loïs Ekollo

---

## Contexte

L'API WeLoveDevs est la source de données imposée par le projet. Elle est limitée à **une requête par seconde** par étudiant et renvoie des offres dans un format propre à WeLoveDevs (dates en microsecondes, lieux sous forme de liste, compétences en objets…). Les offres doivent être stockées dans un format interne homogène.

## Décision

- **Collecte automatique** au démarrage de l'API, puis **toutes les 30 minutes** dans une tâche asynchrone.
- **Collecte manuelle** possible à tout moment via `POST /api/fetch`.
- Jusqu'à **20 pages de 50 offres** par collecte, avec **1 seconde de pause** après chaque requête.
- **Normalisation** de chaque offre, puis insertion avec dédoublonnage (voir [ADR-002](ADR-002-base-de-donnees.md)).

## Pourquoi

- Une collecte périodique garde les offres à jour sans action d'un administrateur.
- La pause d'une seconde garantit le respect de la limite de débit, quelle que soit la vitesse de réponse de l'API.
- La tâche asynchrone (`asyncio.to_thread`) n'empêche pas l'API de répondre aux utilisateurs pendant la collecte.

## Comment

### Flux

```
Démarrage de l'API ──► collecte ──► normalisation ──► INSERT IGNORE en base
        │
        └─► toutes les 30 min : même chaîne (tâche de fond asyncio)

Pour chaque page (1 à 20) : GET https://epi-api.welovedevs.com/v1?page=N&limit=50
                            en-tête X-API-Key, timeout 10 s, puis pause de 1 s
                            arrêt à la première page en erreur
```

### Normalisation

| Champ WeLoveDevs | Champ interne | Transformation |
| :--- | :--- | :--- |
| `title` | `titre` | Repris tel quel |
| `smallCompany.companyName` | `entreprise_nom` | « Entreprise non renseignée » si absent |
| `descriptionPreview` | `description` | Repris tel quel |
| `salary.min`, `salary.max` | `salaire_min`, `salaire_max` | `0` si non communiqué |
| `formattedPlaces` | `location` | Première ville de la liste, « Lieu non renseigné » si vide |
| `publishDate` (µs) | `date` | Conversion en `AAAA-MM-JJ` |
| `job.contractTypes` | `contract_type` | Liste jointe par des virgules, « Non communiqué » si vide |
| `skillsList` | `competences` | Noms des compétences joints par des virgules |
| — | `source` | `WeLoveDevs` |

Une offre sans titre, sans date, sans entreprise ou sans description est écartée.

### Gestion des erreurs

| Situation | Comportement |
| :--- | :--- |
| Erreur HTTP ou délai dépassé | Erreur journalisée, la collecte s'arrête à cette page |
| Offre déjà en base | Ignorée (`INSERT IGNORE` sur *(titre, entreprise)*) |
| Erreur sur une offre à l'insertion | Offre ignorée, les suivantes sont insérées |
| Clé d'API absente | L'application démarre normalement, sans nouvelles offres |

## Trade-offs

| Avantage | Inconvénient |
| :--- | :--- |
| Offres à jour sans intervention | Une collecte de 20 pages dure au moins 20 secondes |
| Respect garanti de la limite de débit | Les offres supprimées chez WeLoveDevs restent en base |
| Format interne unique pour le front et l'IA | Seul un aperçu de la description est récupéré |

## Évolutions envisagées

- Enregistrer en base les compétences normalisées : elles sont calculées mais pas encore insérées.
- Réessayer automatiquement une page en erreur (backoff) au lieu d'arrêter la collecte.
- Ajouter une seconde source d'offres en réutilisant le même format interne.

## Liens

- [`backend/api.py`](../../backend/api.py) — collecte et normalisation
- [`backend/database_api.py`](../../backend/database_api.py) — insertion
