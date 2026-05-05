# ADR-005 — Feature IA

**Date :** _[à compléter]_
**Statut :** Proposé / Accepté / Obsolète _(choisir)_
**Décideurs :** _[noms des membres concernés]_

---

## Contexte

Le projet requiert une feature IA **légère** répondant à ces contraintes strictes :
- Modèle ≤ 500 MB sur disque
- Résultat produit en < 5 secondes par offre
- Pas de fine-tuning au démarrage du conteneur
- Pas d'appel à une API externe non contrôlée (ex: OpenAI, Gemini)

---

## Décision

**Feature IA choisie :** _[choisir parmi : classification, recommandation, extraction de mots-clés, détection de doublons, résumé, traduction]_

**Exemple développé dans ce document : Classification automatique des offres par domaine technique**

> Adapter cette section à la feature réellement choisie par l'équipe.

**Modèle retenu :** _[ex: `all-MiniLM-L6-v2` via sentence-transformers + classification SVM / TF-IDF + Naive Bayes / KeyBERT pour extraction]_

---

## Pourquoi (Why)

### Problème utilisateur

> Les utilisateurs arrivent sur une liste d'offres sans catégorisation claire. Ils ne savent pas rapidement si une offre correspond à leur domaine (frontend, backend, DevOps, data, etc.) sans lire la description complète.

### Hypothèse

> En classifiant automatiquement chaque offre dans un domaine technique, on permet un filtrage par catégorie et on améliore l'expérience de navigation sans effort supplémentaire pour l'utilisateur.

### Pourquoi cette approche est pertinente

> TF-IDF + Naive Bayes est un modèle classique de classification de texte, très léger (< 10 MB), rapide (< 100ms/offre), et sans dépendance lourde. Il est entraîné une fois en offline et chargé au démarrage du conteneur en quelques secondes.

### Mesure du succès

| Métrique | Cible |
|---|---|
| Précision de classification | ≥ 80% sur un jeu de test manuel |
| Temps de traitement | < 500ms par offre |
| Taille du modèle | < 50 MB |
| Couverture | ≥ 95% des offres classifiées (pas de "unknown") |

---

## Comment (How)

### Pipeline IA

```
Offre ingérée (title + description)
  → Prétraitement texte (lowercase, stop words, lemmatisation)
  → Vectorisation TF-IDF
  → Classification (modèle SVM ou Naive Bayes pré-entraîné)
  → Label prédit : ["backend", "frontend", "devops", "data", "mobile", "autre"]
  → Stockage dans offer_ai_scores (offer_id, labels, score de confiance)
```

### Entraînement (offline, hors conteneur)

```python
# Script d'entraînement (exécuté une fois, résultat commité)
# Voir scripts/train_classifier.py

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib

# Dataset d'entraînement : offres labellisées manuellement (~200 exemples)
# Voir data/training_set.csv

pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(max_features=5000, ngram_range=(1, 2))),
    ("clf", MultinomialNB()),
])
pipeline.fit(X_train, y_train)
joblib.dump(pipeline, "models/classifier.pkl")  # < 5 MB
```

### Utilisation à l'ingestion

```python
import joblib

model = joblib.load("models/classifier.pkl")  # Chargé une fois au démarrage

def classify_offer(offer: dict) -> dict:
    text = f"{offer['title']} {offer['description']}"
    label = model.predict([text])[0]
    confidence = model.predict_proba([text]).max()
    return {"category": label, "confidence": round(float(confidence), 3)}
```

---

## Contraintes respectées

| Contrainte | Valeur |
|---|---|
| Taille du modèle | ~5 MB (fichier `.pkl`) ✅ |
| Temps de traitement | ~50ms/offre ✅ |
| Fine-tuning au démarrage | Non (modèle pré-entraîné chargé) ✅ |
| API externe | Non (tout en local) ✅ |

---

## Limitations connues

- Le modèle est entraîné sur un petit dataset : les catégories rares (ex: "embedded", "blockchain") peuvent être mal classées
- Les offres rédigées en anglais peuvent être moins bien traitées si l'entraînement est majoritairement en français
- Pas de mise à jour automatique du modèle : si la distribution des offres change, un ré-entraînement est nécessaire

---

## Évaluation

_[À compléter après entraînement. Exemple :]_

Résultats sur le jeu de test (20% des données, ~40 exemples) :

| Catégorie | Précision | Rappel | F1 |
|---|---|---|---|
| backend | 0.87 | 0.91 | 0.89 |
| frontend | 0.83 | 0.79 | 0.81 |
| devops | 0.79 | 0.84 | 0.81 |
| data | 0.91 | 0.88 | 0.89 |
| _global_ | **0.85** | **0.85** | **0.85** |

---

## Trade-offs

| Avantage | Inconvénient |
|---|---|
| Très léger et rapide | Précision limitée par la taille du dataset |
| Pas de dépendance externe | Nécessite un ré-entraînement manuel si les données changent |
| Simple à comprendre et déboguer | Ne capture pas le contexte sémantique profond |

---

## Alternative rejetée

**Alternative :** Modèle de language pré-entraîné (ex: `distilbert-base-uncased`)

**Raison du rejet :** Taille du modèle ~250 MB, temps de traitement ~2-3s/offre sans GPU, et complexité de déploiement bien supérieure. La contrainte des 500 MB et 5s est respectée, mais la marge est trop faible pour un projet académique. TF-IDF + Naive Bayes offre des performances suffisantes avec 100x moins de ressources.

---

## Liens

- [`ai-service/models/classifier.pkl`](../../ai-service/models/classifier.pkl) — modèle entraîné
- [`ai-service/classify.py`](../../ai-service/classify.py) — service de classification
- [`ai-service/train.py`](../../ai-service/train.py) — script d'entraînement
- [`data/training_set.csv`](../../data/training_set.csv) — dataset d'entraînement
