# Front-end JobyFind

Application React 19 + TypeScript, construite avec Vite et servie par Nginx en production.

## Lancer en développement

```bash
npm install
npm run dev        # http://localhost:5173
```

En développement, Vite redirige les appels `/api/...` vers le backend FastAPI sur `http://127.0.0.1:8000` (voir `vite.config.ts`). Lancez d'abord le backend et la base avec `docker compose up` à la racine du dépôt.

## Scripts

| Commande | Rôle |
| :--- | :--- |
| `npm run dev` | Serveur de développement avec rechargement à chaud |
| `npm run build` | Vérification TypeScript puis build de production dans `dist/` |
| `npm run lint` | Analyse ESLint |
| `npm run preview` | Prévisualisation du build |

## Organisation

| Dossier / fichier | Contenu |
| :--- | :--- |
| `src/App.tsx` | Navigation entre les pages, session utilisateur, thème et langue |
| `src/pages/` | Accueil (carte Leaflet), offres, tableau de bord (Recharts), profil, notifications, paramètres, administration |
| `src/Trad.ts` | Traductions (fr, en, es, de, ar, zh) |
| `nginx.conf` | Service du build et reverse proxy de `/api/` vers le backend |
| `Dockerfile` | Build en deux étapes : Node pour compiler, Nginx pour servir |
