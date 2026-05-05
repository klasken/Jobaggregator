# Wireframes — Vues Principales

**Date :** _[à compléter]_
**Auteur :** _[nom]_
**Outil utilisé :** _[ex: Figma / draw.io / Balsamiq / maquettes papier scannées]_

> Les wireframes haute-fidélité sont disponibles dans : _[lien Figma ou dossier `/docs/product/mockups/`]_
>
> Ce document présente une version textuelle de référence pour les développeurs.

---

## Vue 1 — Page d'accueil (non connecté)

```
┌─────────────────────────────────────────────────────────────┐
│  LOGO JOB AGGREGATOR           [Connexion]  [S'inscrire]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         Trouvez votre prochain emploi tech                  │
│         en un seul endroit                                  │
│                                                             │
│   ┌──────────────────────────────┐  ┌──────────────┐        │
│   │  🔍 Rechercher une offre...  │  │  RECHERCHER  │        │
│   └──────────────────────────────┘  └──────────────┘        │
│                                                             │
│   [Stage ▾]  [Paris ▾]  [Backend ▾]  [Salaire min ▾]        │
│                                                             │
│   ──────────────────────────────────────────────────────    │
│   X XXX offres disponibles · Dernière mise à jour : hier    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Vue 2 — Page de recherche / liste des offres

```
┌─────────────────────────────────────────────────────────────┐
│  LOGO                      [Lucas ▾]  [Déconnexion]         │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  FILTRES     │  X offres trouvées    Trier par : [Récent ▾] │
│              │                                              │
│  Domaine     │  ┌──────────────────────────────────────┐   │
│  ○ Backend   │  │ [BACKEND] [STAGE]                    │   │
│  ○ Frontend  │  │ Développeur Backend Python            │   │
│  ○ DevOps    │  │ Entreprise XYZ · Paris · Stage 6 mois│   │
│  ○ Data      │  │ 1 200 – 1 500 €/mois                 │   │
│  ○ Mobile    │  │ Publié il y a 2 jours    [♡] [Voir →]│   │
│              │  └──────────────────────────────────────┘   │
│  Contrat     │                                              │
│  ○ Stage     │  ┌──────────────────────────────────────┐   │
│  ○ Alternance│  │ [FRONTEND] [CDI]                     │   │
│  ○ CDI       │  │ Développeur React Senior              │   │
│  ○ CDD       │  │ Startup ABC · Lyon · CDI              │   │
│              │  │ 42 000 – 50 000 €/an                 │   │
│  Localisation│  │ Publié il y a 5 jours    [♡] [Voir →]│   │
│  ____________│  └──────────────────────────────────────┘   │
│  |           │                                              │
│  Salaire min │  [Charger plus d'offres]                     │
│  ────────────│                                              │
└──────────────┴──────────────────────────────────────────────┘
```

---

## Vue 3 — Détail d'une offre

```
┌─────────────────────────────────────────────────────────────┐
│  LOGO                      [Lucas ▾]  [Déconnexion]         │
├─────────────────────────────────────────────────────────────┤
│  ← Retour aux offres                                        │
│                                                             │
│  [BACKEND]  [STAGE]                                         │
│  Développeur Backend Python                                 │
│  ★★★★☆  Entreprise XYZ                                      │
│                                                             │
│  📍 Paris (75)  ·  📅 Stage 6 mois  ·  💰 1 200–1 500 €/mois│
│  🗓️ Publié le 21 avril 2026  ·  Source : WeLoveDevs         │
│                                                             │
│  ┌────────────────────────────────────┐  ┌──────────────┐  │
│  │  Description du poste              │  │ [♡ Sauvegarder│  │
│  │                                    │  │ cette offre] │  │
│  │  [Texte de la description...]      │  │              │  │
│  │                                    │  │ [Postuler →] │  │
│  │                                    │  │              │  │
│  └────────────────────────────────────┘  └──────────────┘  │
│                                                             │
│  ── Offres similaires ──────────────────────────────────    │
│  [Offre 1]    [Offre 2]    [Offre 3]                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Vue 4 — Dashboard utilisateur

```
┌─────────────────────────────────────────────────────────────┐
│  LOGO                      [Lucas ▾]  [Déconnexion]         │
├──────────────┬──────────────────────────────────────────────┤
│  ● Dashboard │                                              │
│  ○ Mes offres│  Bonjour Lucas 👋                            │
│  ○ Favoris   │                                              │
│  ○ Paramètres│  ┌─────────────┐  ┌─────────────┐           │
│              │  │ 1 247       │  │ 38 k€       │           │
│              │  │ offres dispo│  │ salaire médian│          │
│              │  └─────────────┘  └─────────────┘           │
│              │                                              │
│              │  ┌─────────────────────────────────────┐    │
│              │  │  Salaires par domaine (boxplot)      │    │
│              │  │  [AI FEATURE] Domaine suggéré : Backend│   │
│              │  │  [graphique]                         │    │
│              │  └─────────────────────────────────────┘    │
│              │                                              │
│              │  ┌─────────────────────────────────────┐    │
│              │  │  Nouvelles offres cette semaine      │    │
│              │  │  [DATA FEATURE] [graphique barres]   │    │
│              │  └─────────────────────────────────────┘    │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

> ⚠️ Le dashboard doit afficher **au moins un résultat de la data feature et un résultat de l'AI feature** sans navigation supplémentaire.

---

## Vue 5 — Inscription

```
┌─────────────────────────────────────────────────────────────┐
│  LOGO                                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              Créer un compte                                │
│                                                             │
│         Email *                                             │
│         ┌──────────────────────────────────┐               │
│         │ votre@email.com                  │               │
│         └──────────────────────────────────┘               │
│                                                             │
│         Mot de passe *                                      │
│         ┌──────────────────────────────────┐               │
│         │ ••••••••                         │               │
│         └──────────────────────────────────┘               │
│         ℹ️ Min. 8 caractères, 1 majuscule, 1 chiffre        │
│                                                             │
│         Confirmer le mot de passe *                         │
│         ┌──────────────────────────────────┐               │
│         │ ••••••••                         │               │
│         └──────────────────────────────────┘               │
│                                                             │
│         [     Créer mon compte     ]                        │
│                                                             │
│         Déjà un compte ? Connexion                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Vue 6 — Interface Admin

```
┌─────────────────────────────────────────────────────────────┐
│  LOGO [ADMIN]                  [Admin ▾]  [Déconnexion]     │
├──────────────┬──────────────────────────────────────────────┤
│  ● Offres    │                                              │
│  ○ Utilisat. │  Gestion des offres                          │
│  ○ Ingestion │                                              │
│  ○ Logs      │  [🔄 Lancer l'ingestion WeLoveDevs]          │
│              │                                              │
│              │  Offres en attente de modération : 12        │
│              │                                              │
│              │  ┌──────────────────────────────────────┐   │
│              │  │ Titre              Source   Actions   │   │
│              │  │ ─────────────────────────────────── │   │
│              │  │ Dev Backend Py...  WLD    [✅][❌]   │   │
│              │  │ Stage React...     WLD    [✅][❌]   │   │
│              │  └──────────────────────────────────────┘   │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

---

## Notes sur l'accessibilité (WCAG 2.1 AA)

Les flux suivants sont soumis à l'audit d'accessibilité :
1. **Inscription** (Vue 5) — labels sur tous les champs, messages d'erreur associés
2. **Recherche d'offres** (Vue 2) — filtres accessibles au clavier, résultats annoncés aux lecteurs d'écran
3. **Détail d'une offre** (Vue 3) — structure de heading logique, contrastes respectés

Résultats de l'audit disponibles dans [`/docs/product/accessibility-audit.md`](accessibility-audit.md).
