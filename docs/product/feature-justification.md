# Justification des Features — Data & IA

**Date :** _[à compléter]_
**Auteur :** _[nom]_

---

> Ce document répond à l'exigence d'**Innovation Justification** du projet. Chaque feature majeure du dashboard et de la partie IA est justifiée selon la structure : **Problème → Hypothèse → Pertinence → Mesure du succès**.

---

## Feature Data — _[ex: Dashboard de distribution des salaires]_

### Problème utilisateur adressé

> Les utilisateurs (étudiants, juniors) n'ont aucun repère sur les salaires du marché tech en France. Ils acceptent ou refusent des offres sans savoir si la rémunération est dans la norme de leur profil et de leur région.

### Hypothèse

> En affichant une distribution des salaires par type de contrat, ville, et domaine technique (backend, frontend, data...), les utilisateurs peuvent valider ou invalider leurs attentes salariales **sans quitter la plateforme**, ce qui augmente le temps passé sur le dashboard et la pertinence perçue de la plateforme.

### Pourquoi cette approche est pertinente

> Les données de salaire sont déjà collectées lors de l'ingestion WeLoveDevs (champs `salary_min` / `salary_max`). Leur agrégation et visualisation ne nécessite pas de traitement supplémentaire lourd. Un histogramme ou box-plot par catégorie est une visualisation reconnue pour ce type d'analyse.

### Widgets du dashboard et leur utilité

| Widget | Décision utilisateur supportée |
|---|---|
| Histogramme des salaires par domaine | "Est-ce que mon attente salariale est réaliste pour un poste backend ?" |
| Salaire médian par ville | "Vaut-il mieux chercher à Paris ou en remote ?" |
| Évolution du nombre d'offres par semaine | "Le marché recrute-t-il en ce moment ?" |
| Répartition stage / alternance / CDI | "Quels types de contrats sont disponibles ?" |

### Mesure du succès

| Métrique | Cible | Comment mesurer |
|---|---|---|
| Utilisateurs visitant le dashboard | ≥ 50% des utilisateurs actifs | Analytics (logs frontend) |
| Temps moyen passé sur le dashboard | > 30 secondes | Analytics |
| Satisfaction utilisateur (si testable) | Score > 3.5/5 | Questionnaire ou test utilisateur |

---

## Feature IA — _[ex: Classification automatique des offres par domaine]_

### Problème utilisateur adressé

> Les offres d'emploi n'ont pas de catégorie technique standardisée dans les sources externes. Un utilisateur cherchant un poste "backend Python" doit lire chaque offre une par une pour savoir si elle lui correspond.

### Hypothèse

> En classifiant automatiquement chaque offre dans un domaine technique (backend, frontend, DevOps, data, mobile...) dès l'ingestion, on permet un **filtrage instantané par catégorie** et une meilleure orientation dans la liste des offres, réduisant le temps de recherche.

### Pourquoi cette approche est pertinente

> La classification de texte par TF-IDF + Naive Bayes est une approche éprouvée pour ce type de tâche (catégorisation de courtes descriptions textuelles). Elle est très légère (< 10 MB), rapide (< 100ms/offre), et ne nécessite pas de GPU. Les labels de catégories correspondent directement aux termes de recherche les plus utilisés par les développeurs.

### Comment le résultat est visible pour l'utilisateur

- Filtre "Domaine" dans la barre de recherche (ex: "Backend", "Frontend", "DevOps")
- Badge coloré sur chaque carte d'offre indiquant la catégorie
- Widget dashboard : "Répartition des offres par domaine"

### Mesure du succès

| Métrique | Cible | Comment mesurer |
|---|---|---|
| Précision du modèle (jeu de test) | ≥ 80% | Évaluation sklearn sur test set |
| Temps de traitement par offre | < 500ms | Benchmark lors de l'ingestion |
| Taux de couverture | ≥ 95% des offres classifiées | Comptage des offres avec label "autre" |
| Utilisation du filtre domaine | ≥ 30% des recherches | Logs de filtrage |

---

## Justification des autres widgets du dashboard

_[Compléter avec les autres éléments de votre dashboard. Structure identique :]_

### Widget : _[nom du widget]_

**Problème :** _[Quel problème utilisateur ce widget adresse-t-il ?]_

**Hypothèse :** _[Qu'est-ce que ce widget va améliorer ?]_

**Pertinence :** _[Pourquoi cette représentation/cette donnée est-elle adaptée ?]_

**Mesure :** _[Comment saurez-vous si ce widget est utile ?]_

---

## Liens

- [ADR-005 — Feature IA](../adr/ADR-005-feature-ia.md)
- [Market Scan](market-scan.md)
