# Market Scan — Analyse du Marché

**Date :** _[à compléter]_
**Auteur :** _[nom]_

---

## 1. Contexte du marché

Le marché des plateformes d'emploi tech est dominé par des acteurs généralistes et quelques spécialistes. Les développeurs juniors et les étudiants en informatique font face à plusieurs problèmes :
- Dispersion des offres sur de nombreuses plateformes
- Manque de lisibilité sur les salaires et les technos réellement attendues
- Difficulté à comparer des offres de sources différentes

---

## 2. Acteurs existants

| Plateforme | Type | Forces | Limites |
|---|---|---|---|
| LinkedIn | Généraliste | Volume énorme, réseau | Offres peu filtrées pour les devs |
| Indeed | Généraliste | Volume, simplicité | Qualité variable, doublons fréquents |
| WeLoveDevs | Spécialiste tech | Offres qualifiées, culture d'entreprise | Offres principalement françaises |
| Welcome to the Jungle | Spécialiste | Contenu riche sur les entreprises | Pas d'API publique |
| Jobteaser | Étudiants / juniors | Ciblé étudiants grandes écoles | Interface datée |
| Talent.io | Développeurs seniors | Matching actif | Pas adapté aux juniors / stages |

### Analyse de la concurrence

_[Compléter avec vos propres observations après exploration des plateformes]_

**Ce que font bien les concurrents :**
- _[ex: LinkedIn — recommandations personnalisées basées sur le profil]_
- _[ex: Welcome to the Jungle — fiches entreprises très riches]_

**Ce qu'ils font mal ou ignorent :**
- _[ex: Peu de plateformes permettent de comparer les salaires facilement]_
- _[ex: Les agrégateurs généralistes n'offrent pas de classification par stack technique]_
- _[ex: Pas de vue consolidée stage/alternance/CDI sur une seule interface]_

---

## 3. Utilisateurs cibles (Personnes)

### Personne 1 — Étudiant en fin d'études (Principal)

| Attribut | Valeur |
|---|---|
| **Prénom** | _[ex: Lucas, 21 ans]_ |
| **Contexte** | Étudiant Epitech en 3e année, cherche un stage de 6 mois |
| **Objectif** | Trouver rapidement des offres de stage en développement backend |
| **Frustrations** | Jongle entre 5 plateformes, voit les mêmes offres partout, ne sait pas si le salaire est correct |
| **Besoins** | Filtrage par type de contrat (stage), par stack (Python, Node), par ville, et visibilité du salaire |

### Personne 2 — Développeur junior (Secondaire)

| Attribut | Valeur |
|---|---|
| **Prénom** | _[ex: Amina, 24 ans]_ |
| **Contexte** | Diplômée depuis 6 mois, cherche son premier CDI en frontend |
| **Objectif** | Comparer les offres React/Vue, filtrer par salaire minimum |
| **Frustrations** | Impossible de comparer facilement les rémunérations, descriptions trop longues |
| **Besoins** | Résumés clairs, classification par technologie, comparaison de salaires |

---

## 4. Proposition de valeur

> **Pour les étudiants et développeurs juniors** qui cherchent un emploi ou un stage dans la tech, **notre plateforme** est un agrégateur centralisé qui collecte, normalise et classe les offres de plusieurs sources, afin de permettre une recherche rapide, une comparaison de salaires, et une meilleure décision d'orientation professionnelle. Contrairement à WeLoveDevs ou LinkedIn pris séparément, **notre solution** offre une vue unifiée enrichie par une classification IA et des analytics de marché.

---

## 5. Problèmes prioritaires adressés

| # | Problème | Priorité | Feature associée |
|---|---|---|---|
| 1 | Offres dispersées sur plusieurs sites | 🔴 Haute | Agrégation WeLoveDevs + source secondaire |
| 2 | Manque de visibilité sur les salaires | 🔴 Haute | Dashboard salaires (data feature) |
| 3 | Offres difficiles à catégoriser | 🟡 Moyenne | Classification IA (AI feature) |
| 4 | Pas de vue rapide sans lire toute la description | 🟡 Moyenne | Résumé automatique (bonus) |
| 5 | Interface peu accessible sur mobile | 🟢 Basse | Design responsive WCAG 2.1 |

---

## 6. Sources de cette analyse

- Exploration directe des plateformes citées (captures d'écran disponibles dans `/docs/product/screenshots/`)
- _[Ajouter toute autre source : articles, feedbacks utilisateurs, etc.]_

---

## Liens

- [Value Proposition](value-proposition.md)
- [Feature Justification](feature-justification.md)
- [Wireframes](wireframes.md)
