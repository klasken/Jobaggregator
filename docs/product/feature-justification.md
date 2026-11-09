# Justification des features — Data et IA

**Date :** 11 mai 2026
**Auteurs :** Gauthier Lebrun, Marius Ceugniet

---

> Chaque feature est justifiée selon la même structure : **problème → hypothèse → pertinence → mesure du succès**. Les indicateurs proposés n'ont pas encore été mesurés auprès d'utilisateurs réels.

---

## Feature Data — Tableau de bord des candidatures

### Problème utilisateur adressé

> Un étudiant qui postule à de nombreuses offres perd le fil : il ne sait plus où il a postulé, quand, ni quelles candidatures attendent encore une réponse.

### Hypothèse

> En regroupant toutes les candidatures envoyées depuis la plateforme dans un tableau de bord, avec des compteurs par statut et un graphique, l'utilisateur sait immédiatement où il en est et quelles candidatures relancer.

### Pourquoi cette approche est pertinente

> Les candidatures sont déjà enregistrées en base au moment où l'utilisateur postule : le tableau de bord ne demande aucune saisie supplémentaire. Des compteurs et un histogramme sont des visualisations lisibles en quelques secondes.

### Widgets et décisions supportées

| Widget | Question à laquelle il répond |
| :--- | :--- |
| Compteurs Envoyées / En attente / Acceptées / Refusées | « Où en sont mes candidatures ? » |
| Histogramme des candidatures et des réponses positives | « Mon taux de réponse s'améliore-t-il ? » |
| Tableau des candidatures (entreprise, poste, date, statut) | « Qui dois-je relancer ? » |
| Offres favorites | « Quelles offres ai-je mises de côté ? » |

### Mesure du succès proposée

| Métrique | Cible | Comment mesurer |
| :--- | :--- | :--- |
| Utilisateurs consultant le tableau de bord | ≥ 50 % des utilisateurs actifs | Journalisation des pages visitées |
| Candidatures envoyées depuis la plateforme | ≥ 2 par utilisateur actif et par mois | Table `candidatures` |

---

## Feature IA — Recommandation d'offres par compatibilité

### Problème utilisateur adressé

> Les offres n'indiquent pas si elles correspondent au profil d'un junior. Un utilisateur qui cherche un poste « React / TypeScript » doit lire chaque annonce pour le savoir.

### Hypothèse

> En calculant un score de compatibilité entre les compétences de l'utilisateur et chaque offre, et en triant les offres selon ce score, l'utilisateur trouve plus vite les offres pertinentes et postule davantage.

### Pourquoi cette approche est pertinente

> Un modèle d'embeddings pré-entraîné compare le sens des textes et pas seulement les mots exacts. Il ne nécessite aucune donnée annotée, tourne sur CPU et respecte les contraintes du projet (moins de 500 Mo, aucune API externe). Le choix du modèle est détaillé dans l'[ADR-005](../adr/ADR-005-feature-ia.md).

### Comment le résultat est visible

- Badge « XX % de compatibilité » sur chaque carte d'offre
- Liste triée de l'offre la plus compatible à la moins compatible
- Bloc « Recommandation IA » avec une barre de correspondance dans le détail de l'offre

### Mesure du succès proposée

| Métrique | Cible | Comment mesurer |
| :--- | :--- | :--- |
| Part des candidatures envoyées sur les 10 premières offres recommandées | ≥ 50 % | Rang de l'offre au moment de la candidature |
| Temps de calcul des recommandations | < 5 s pour l'ensemble des offres | Mesure côté API |
| Pertinence jugée par des testeurs | ≥ 4 offres pertinentes sur les 5 premières | Test utilisateur sur quelques profils types |

---

## Autres éléments de l'interface

### Carte interactive des offres

**Problème :** une liste ne montre pas où se situent les offres.
**Hypothèse :** une carte aide l'utilisateur à repérer les bassins d'emploi proches de chez lui.
**Pertinence :** les lieux sont déjà normalisés à la collecte, puis géocodés avec l'API Adresse du gouvernement.
**Mesure :** clics sur « Voir l'offre » depuis la carte.

### Filtres par type de contrat

**Problème :** stage, alternance et CDI sont mélangés.
**Hypothèse :** un filtre en un clic réduit la liste aux offres compatibles avec la situation de l'utilisateur.
**Pertinence :** le type de contrat est normalisé à la collecte.
**Mesure :** part des recherches utilisant un filtre.

---

## Liens

- [ADR-005 — Feature IA](../adr/ADR-005-feature-ia.md)
- [Market scan](market-scan.md)
- [Proposition de valeur](value-proposition.md)
