# Vision Consulting - Site web (React)

Site vitrine pour un cabinet d'accompagnement en immigration au Canada, avec redirection vers la plateforme de formation **TCF Express** (https://tcf-express.com/).

## Technologies
React 19, Vite, React Router, Tailwind CSS v4, Motion (animations), Phosphor Icons. Mode clair et sombre, 100 % responsive.

## Démarrer
```bash
npm install
npm run dev        # serveur local : http://localhost:5173
npm run build      # version de production dans dist/
```
Déployez le contenu de `dist/` sur n'importe quel hébergeur (Netlify, Vercel, cPanel, Hostinger, GitHub Pages...). Aucune configuration de serveur n'est nécessaire (routage par `#`).

`npm run build:single` génère un unique fichier HTML autonome dans `dist-single/`.

## À personnaliser en priorité
Tout est centralisé dans **`src/config/site.js`** :
- téléphone, numéro WhatsApp, e-mail, adresse, horaires
- liens des réseaux sociaux
- lien TCF Express

Contenus :
- `src/data/services.js` : les 8 services (textes, conditions, étapes, documents)
- `src/data/content.js` : étapes, valeurs, FAQ
- `src/pages/Legal.jsx` : compléter forme juridique / immatriculation
- Logo : `src/assets/logo.webp` ; favicon : `public/favicon.png`

## Pages
Accueil, Services, 8 fiches service, Formation TCF, Évaluation gratuite (questionnaire en 4 étapes avec orientation automatique), FAQ, Contact, À propos, Mentions légales, page 404.

Les formulaires envoient la demande par **WhatsApp** ou **e-mail** (aucun serveur requis). Pour recevoir les demandes directement, branchez un service comme Formspree ou EmailJS.

## Photos
Le site n'utilise pas de photos de stock. Pour en ajouter, placez vos images dans `src/assets/` et importez-les dans les pages.

## ✅ Avant le lancement officiel (checklist)
1. `src/data/proof.js` : remplir `stats`, `successRates`, `testimonials` avec de **vraies** données, puis mettre `DEMO_MODE = false` (retire les données fictives et autorise Google à indexer le site).
2. `src/config/tarifs.js` : vos honoraires réels (grille tarifaire), RCCM, NIU.
3. `src/config/site.js` : vrai e-mail et liens des réseaux sociaux.
4. `src/pages/Legal.jsx` : forme juridique et responsable de publication.
