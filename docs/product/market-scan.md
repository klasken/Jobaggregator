# Market Scan — Analyse du Marché

**Date :** 5 mai 2026
**Auteur :** Gauthier Lebrun

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

**Ce que font bien les concurrents :**
- LinkedIn propose des recommandations personnalisées à partir du profil.
- Welcome to the Jungle présente des fiches entreprises très riches (équipe, culture, locaux).
- WeLoveDevs qualifie ses offres pour les profils tech et affiche souvent la stack et le salaire.

**Ce qu'ils font mal ou ignorent :**
- Les généralistes noient les offres tech dans un grand volume d'annonces peu filtrées.
- Peu de plateformes indiquent clairement à un junior si une offre correspond à ses compétences.
- Stage, alternance et CDI sont rarement présentés côte à côte avec les mêmes filtres.
- Le suivi des candidatures est laissé à l'utilisateur (tableur, notes).

---

## 3. Utilisateurs cibles (Personnes)

### Personne 1 — Étudiant en fin d'études (Principal)

| Attribut | Valeur |
|---|---|
| **Prénom** | Lucas, 21 ans |
| **Contexte** | Étudiant Epitech en 3e année, cherche un stage de 6 mois |
| **Objectif** | Trouver rapidement des offres de stage en développement backend |
| **Frustrations** | Jongle entre 5 plateformes, voit les mêmes offres partout, ne sait pas si le salaire est correct |
| **Besoins** | Filtrage par type de contrat (stage), par stack (Python, Node), par ville, et visibilité du salaire |

### Personne 2 — Développeur junior (Secondaire)

| Attribut | Valeur |
|---|---|
| **Prénom** | Amina, 24 ans |
| **Contexte** | Diplômée depuis 6 mois, cherche son premier CDI en frontend |
| **Objectif** | Comparer les offres React/Vue, filtrer par salaire minimum |
| **Frustrations** | Impossible de comparer facilement les rémunérations, descriptions trop longues |
| **Besoins** | Résumés clairs, classification par technologie, comparaison de salaires |

---

## 4. Proposition de valeur

> **Pour les étudiants et développeurs juniors** qui cherchent un stage, une alternance ou un emploi dans la tech, **JobyFind** centralise les offres, les normalise et les classe selon leur compatibilité avec les compétences de chaque utilisateur. Contrairement à une recherche sur plusieurs sites, l'utilisateur voit d'abord les offres qui lui correspondent et suit toutes ses candidatures au même endroit.

Le détail est dans la [proposition de valeur](value-proposition.md).

---

## 5. Problèmes prioritaires adressés

| # | Problème | Priorité | Réponse dans JobyFind | État |
|---|---|---|---|---|
| 1 | Offres dispersées sur plusieurs sites | 🔴 Haute | Collecte automatique des offres WeLoveDevs, format unique | ✅ Réalisé |
| 2 | Difficile de savoir si une offre correspond à son profil | 🔴 Haute | Score de compatibilité IA et tri des offres | ✅ Réalisé |
| 3 | Candidatures suivies à la main | 🟡 Moyenne | Tableau de bord des candidatures | ✅ Réalisé |
| 4 | Recherche géographique peu visuelle | 🟡 Moyenne | Carte interactive des offres | ✅ Réalisé |
| 5 | Interfaces peu accessibles | 🟡 Moyenne | Mode sombre, mode daltonien, texte agrandi, lecteur vocal, 6 langues | ✅ Réalisé |
| 6 | Manque de visibilité sur les salaires | 🟢 Basse | Tableau de bord des salaires par ville et par contrat | 🔜 Piste d'amélioration |
| 7 | Une seule source d'offres | 🟢 Basse | Seconde source d'offres | 🔜 Piste d'amélioration |

---

## 6. Sources de cette analyse

- Exploration directe des plateformes citées
- Documentation de l'API WeLoveDevs fournie dans le cadre du projet

---

## Liens

- [Value Proposition](value-proposition.md)
- [Feature Justification](feature-justification.md)
- [Wireframes](wireframes.md)
