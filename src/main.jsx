import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { DEMO_MODE } from './data/proof.js'

// Tant que le site contient des données de démonstration, on le cache des moteurs de recherche.
if (DEMO_MODE) {
  const m = document.createElement('meta')
  m.name = 'robots'; m.content = 'noindex, nofollow'
  document.head.appendChild(m)
}

// HashRouter : fonctionne sur tout hébergement statique (Netlify, Vercel, cPanel, GitHub Pages...)
// sans configuration de réécriture d'URL.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
