// ============================================================
//  CONFIGURATION DU SITE - modifiez ici vos coordonnées
//  (tout le site se met à jour automatiquement)
// ============================================================

export const site = {
  name: 'Vision Consulting',
  tagline: 'Immigration Canada & préparation TCF',
  description:
    "Vision Consulting accompagne les étudiants, travailleurs et familles dans leur projet d'immigration au Canada, du choix du programme jusqu'à l'arrivée.",

  // --- Nos bureaux ---
  offices: [
    { city: 'Yaoundé', phone: '+237 687 01 66 45', tel: 'tel:+237687016645', whatsapp: '237687016645', mapQuery: 'Yaoundé, Cameroun' },
    { city: 'Bafoussam', phone: '+237 674 55 49 47', tel: 'tel:+237674554947', whatsapp: '237674554947', mapQuery: 'Bafoussam, Cameroun' },
  ],

  // Contact principal (bureau de Yaoundé)
  phone: '+237 687 01 66 45',
  phoneHref: 'tel:+237687016645',
  whatsapp: '237687016645', // numéro au format international, sans + ni espaces
  email: 'contact@vision-consulting.com', // À REMPLACER par votre vraie adresse e-mail
  address: 'Yaoundé et Bafoussam, Cameroun',
  hours: [
    { days: 'Lundi - Vendredi', time: '8h30 - 18h00' },
    { days: 'Samedi', time: '9h00 - 14h00' },
    { days: 'Dimanche', time: 'Fermé' },
  ],

  social: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    tiktok: 'https://tiktok.com/',
    linkedin: 'https://linkedin.com/',
    youtube: 'https://youtube.com/',
  },

  // Notre plateforme d'entraînement au TCF
  tcfExpressUrl: 'https://tcf-express.com/',

  foundedYear: 2020,
}

export const whatsappLink = (text = '', number = site.whatsapp) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`

// Liens officiels utiles (gouvernement du Canada / Québec)
export const officialLinks = [
  { label: 'IRCC - Immigration et citoyenneté', url: 'https://www.canada.ca/fr/services/immigration-citoyennete.html' },
  { label: 'Entrée express', url: 'https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/entree-express.html' },
  { label: 'Étudier au Canada', url: 'https://www.canada.ca/fr/immigration-refugies-citoyennete/services/etudier-canada.html' },
  { label: 'Immigrer au Québec', url: 'https://www.quebec.ca/immigration' },
  { label: 'Vérifier un consultant (CICC)', url: 'https://college-ic.ca/' },
]
