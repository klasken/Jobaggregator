# Wireframes — Vues Principales

**Date :** 5 mai 2026
**Auteur :** Gauthier Lebrun
**Format :** maquettes en texte, utilisées comme référence par l'équipe front

> Ces maquettes ont servi de base au développement. L'interface finale est visible dans les [captures d'écran](../screenshots/) : elle ajoute notamment une barre latérale de navigation, la carte des offres et le score de compatibilité IA.

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

## Notes sur l'accessibilité

Points d'attention retenus pour les flux principaux :
1. **Inscription** (Vue 5) — un libellé pour chaque champ, des messages d'erreur explicites
2. **Recherche d'offres** (Vue 2) — filtres utilisables au clavier
3. **Détail d'une offre** (Vue 3) — hiérarchie de titres logique et contrastes suffisants

L'application finale propose en plus un mode sombre, un mode daltonien, un texte agrandi, un lecteur vocal et 6 langues (page Paramètres).
