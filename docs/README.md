# Documentation — JobyFind

Documentation technique et produit du projet. La présentation générale, l'installation et l'API sont dans le [README principal](../README.md).

## Décisions d'architecture (ADR)

| Document | Sujet |
| :--- | :--- |
| [ADR-001 — Architecture générale](adr/ADR-001-architecture-generale.md) | Stack, services Docker et réseaux |
| [ADR-002 — Base de données](adr/ADR-002-base-de-donnees.md) | MySQL 8, schéma et dédoublonnage |
| [ADR-003 — Authentification](adr/ADR-003-authentification.md) | bcrypt, JWT, rôles et fail2ban |
| [ADR-004 — Intégration WeLoveDevs](adr/ADR-004-integration-welovedevs.md) | Collecte, limite de débit et normalisation |
| [ADR-005 — Feature IA](adr/ADR-005-feature-ia.md) | Recommandation par similarité sémantique |
| [ADR-006 — CI/CD](adr/ADR-006-ci-cd.md) | Workflow GitHub Actions |

## Produit

| Document | Sujet |
| :--- | :--- |
| [Market scan](product/market-scan.md) | Plateformes existantes et positionnement |
| [Proposition de valeur](product/value-proposition.md) | Cible, problèmes adressés, différenciation |
| [Justification des features](product/feature-justification.md) | Pourquoi le tableau de bord et la recommandation IA |
| [Wireframes](product/wireframes.md) | Maquettes des écrans principaux |

## Sécurité

| Document | Sujet |
| :--- | :--- |
| [Choix de sécurité](security/security-choices.md) | Menaces, mesures en place et limites connues |

## Captures d'écran

Les captures de l'application se trouvent dans [`screenshots/`](screenshots/).
