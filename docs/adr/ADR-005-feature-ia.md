# ADR-005 — Feature IA : recommandation d'offres

**Date :** 11 mai 2026 (modèle multilingue adopté le 22 mai 2026)
**Statut :** Accepté
**Décideurs :** Marius Ceugniet

---

## Contexte

Une liste de plusieurs centaines d'offres ne dit pas à un étudiant lesquelles correspondent à son profil. Le sujet impose une feature IA **légère** :

- modèle de moins de 500 Mo ;
- résultat en moins de 5 secondes par offre ;
- aucun entraînement au démarrage du conteneur ;
- aucun appel à une API d'IA externe (OpenAI, Gemini…).

## Décision

**Feature :** score de compatibilité entre le profil d'un utilisateur et chaque offre, affiché en pourcentage, avec les offres triées de la plus à la moins pertinente.

**Modèle :** [`sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2), utilisé sans réentraînement, sur CPU.

## Pourquoi

- La similarité sémantique rapproche des formulations différentes (« développeur web » et « web developer », « React » et « front-end ») là où une recherche par mots-clés échoue.
- Le modèle est pré-entraîné : il fonctionne sans données annotées, que le projet n'avait pas.
- La première version utilisait `all-MiniLM-L6-v2`, entraîné surtout sur de l'anglais. Le passage au modèle multilingue s'explique par le fait que la majorité des offres et des profils sont rédigés en français.
- Le modèle respecte la limite de taille (moins de 500 Mo) et tourne sans GPU.

## Comment

```
Profil   : compétences ×3                                         ──► embedding
Offre    : titre ×2 + compétences ×2 + entreprise + 300 premiers
           caractères de la description                            ──► embedding (lots de 64)
Score    : similarité cosinus, puis mise à l'échelle 0,15 → 0 % et 0,75 → 100 %
Résultat : offres triées par score décroissant (GET /api/recommendations/{email})
```

- La répétition du titre et des compétences leur donne plus de poids que la description.
- La mise à l'échelle rend le score lisible : la similarité cosinus brute varie surtout entre 0,2 et 0,8.
- Le modèle est chargé une seule fois, au démarrage de l'API.

## Trade-offs

| Avantage | Inconvénient |
| :--- | :--- |
| Aucun entraînement ni donnée annotée | Le score n'a pas été évalué sur un jeu de données de référence |
| Fonctionne en français comme en anglais | Les vecteurs des offres sont recalculés à chaque demande |
| Résultat explicable : un pourcentage par offre | Le profil se limite aux compétences déclarées |

## Alternatives non retenues

| Alternative | Raison |
| :--- | :--- |
| Correspondance par mots-clés (TF-IDF) | Ne rapproche pas les synonymes ni les traductions |
| API de LLM externe | Interdite par le sujet, coût et dépendance à un tiers |
| Classifieur entraîné par domaine | Nécessite des offres étiquetées dont l'équipe ne disposait pas |

## Évolutions envisagées

- Calculer et stocker les vecteurs des offres une seule fois, après chaque collecte.
- Enrichir le profil avec l'expérience et le type de poste recherché.
- Construire un petit jeu de test (profils et offres jugées pertinentes) pour mesurer la qualité du classement.

## Liens

- [`backend/feature_ia.py`](../../backend/feature_ia.py)
- [Justification des features](../product/feature-justification.md)
