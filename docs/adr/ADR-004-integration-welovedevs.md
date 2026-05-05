# ADR-004 — Intégration WeLoveDevs et Ingestion de Données

**Date :** _[à compléter]_
**Statut :** Proposé / Accepté / Obsolète _(choisir)_
**Décideurs :** _[noms des membres concernés]_

---

## Contexte

Le projet **requiert** l'intégration de l'API WeLoveDevs comme source de données principale. L'API impose une limite de **1 requête/seconde/étudiant**. L'ingestion doit pouvoir être déclenchée manuellement par un admin, et les données doivent être normalisées avant stockage.

---

## Décision

**Stratégie d'ingestion :** Pull manuel déclenché par un admin via l'interface, avec un worker qui respecte le rate limit via une queue avec délai.

---

## Pourquoi (Why)

> Une ingestion à la demande (manuelle) évite les problèmes de rate limit en production et donne le contrôle à l'équipe. Une approche de queue avec délai garantit le respect des 1 req/s sans complexifier l'architecture avec un scheduler.

---

## Comment (How)

### Flux d'ingestion

```
Admin clique "Lancer l'ingestion"
  → POST /admin/ingest (protégé, role admin)
  → Le backend lance le worker d'ingestion
  → Le worker appelle l'API WeLoveDevs page par page
  → Pour chaque page : attendre 1 seconde avant la suivante
  → Normaliser chaque offre
  → Upsert en base (insert si nouveau, update si existant via external_id)
  → Logger le résultat dans ingestion_logs
  → Retourner un résumé à l'admin
```

### Gestion du rate limit (1 req/s)

```python
import time

def fetch_all_offers(api_key):
    page = 1
    all_offers = []
    while True:
        response = requests.get(
            f"https://epi-api.welovedevs.com/jobs?page={page}",
            headers={"Authorization": f"Bearer {api_key}"}
        )
        data = response.json()
        if not data["offers"]:
            break
        all_offers.extend(data["offers"])
        page += 1
        time.sleep(1)  # Respect du rate limit
    return all_offers
```

### Normalisation des données

Chaque offre brute est transformée vers le format interne avant stockage :

| Champ WeLoveDevs (brut) | Champ interne | Transformation |
|---|---|---|
| `job.title` | `title` | Strip whitespace, truncate 500 chars |
| `job.description` | `description` | Nettoyage HTML → texte brut |
| `job.company.name` | `company` | Strip whitespace |
| `job.location.city` | `location` | Normalisation ville + pays |
| `job.contractType` | `contract_type` | Mapping vers valeurs internes |
| `job.salary.min` | `salary_min` | Conversion en entier (€/an) |
| `job.salary.max` | `salary_max` | Conversion en entier (€/an) |
| `job.publishedAt` | `published_at` | Parsing ISO 8601 → timestamp |
| `job.id` | `external_id` | Préfixé `wld_` pour identifier la source |

### Fonction de normalisation (exemple)

```python
# Cette fonction est couverte par les tests automatiques (CI)
def normalize_offer(raw: dict) -> dict:
    return {
        "external_id": f"wld_{raw['id']}",
        "source": "welovedevs",
        "title": raw.get("title", "").strip()[:500],
        "description": strip_html(raw.get("description", "")),
        "company": raw.get("company", {}).get("name", "").strip(),
        "location": normalize_location(raw.get("location", {})),
        "contract_type": map_contract_type(raw.get("contractType")),
        "salary_min": parse_salary(raw.get("salary", {}).get("min")),
        "salary_max": parse_salary(raw.get("salary", {}).get("max")),
        "published_at": parse_datetime(raw.get("publishedAt")),
        "url": raw.get("applyUrl") or raw.get("url"),
        "raw_data": raw,  # Données brutes conservées pour audit
    }
```

> ℹ️ La fonction `normalize_offer` est couverte par des tests unitaires automatisés dans la CI (voir ADR-006).

---

## Gestion des erreurs

| Scénario | Comportement |
|---|---|
| Rate limit dépassé (429) | Attente exponentielle + retry (max 3 fois) |
| Offre déjà en base (duplicate) | Upsert via `external_id` (mise à jour) |
| Champ manquant dans l'API | Valeur `null`, jamais d'erreur bloquante |
| Erreur réseau | Log dans `ingestion_logs`, ingestion partielle conservée |

---

## Source secondaire (optionnelle)

_[Si vous ajoutez une deuxième source, documenter ici :]_

**Source ajoutée :** _[ex: LinkedIn Jobs RSS / Indeed API / autre]_

**Valeur ajoutée :** _[Pourquoi cette source complète WeLoveDevs ? Ex: offres non-tech, régions différentes, types de contrats différents]_

**Normalisation spécifique :** _[Différences dans le mapping des champs]_

---

## Trade-offs

| Avantage | Inconvénient |
|---|---|
| Simple à implémenter | L'ingestion manuelle nécessite une action admin |
| Respecte le rate limit sans complexité | Pas de mise à jour automatique des offres |
| Données brutes conservées pour audit | Volume de données potentiellement important |

---

## Alternative rejetée

**Alternative :** Scheduler automatique (cron job toutes les heures)

**Raison du rejet :** Complexifie l'infrastructure (ajout d'un cron service), et le rate limit de 1 req/s rend difficile une ingestion fréquente sur un grand volume d'offres. Le déclenchement manuel est suffisant pour le contexte du projet.

---

## Liens

- [`backend/services/ingestion.py`](../../backend/services/ingestion.py) — service d'ingestion
- [`backend/services/normalize.py`](../../backend/services/normalize.py) — normalisation
- [`backend/tests/test_normalize.py`](../../backend/tests/test_normalize.py) — tests unitaires
- [API WeLoveDevs](https://epi-api.welovedevs.com/)
