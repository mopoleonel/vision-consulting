// ============================================================
//  RÉSULTATS ET TÉMOIGNAGES
//  Ajoutez ici UNIQUEMENT de vrais chiffres et de vrais avis clients
//  (avec l'accord écrit de la personne). Ils s'affichent automatiquement
//  sur l'accueil, la page À propos et les fiches services.
// ============================================================

// Chiffres clés. Exemple : { value: 320, suffix: '+', label: 'Dossiers accompagnés' }
export const stats = []

// Taux de réussite par procédure, calculés sur vos dossiers réels.
// Exemple : { service: 'etudes-au-canada', rate: 87, cases: 64, period: '2024-2026' }
export const successRates = []

// Témoignages. Exemple :
// { name: 'Prénom N.', city: 'Yaoundé', service: 'etudes-au-canada', year: 2026, rating: 5,
//   quote: 'Texte exact du client.', photo: '' }
export const testimonials = []

// Lien vers vos avis Google (facultatif), pour permettre de vérifier les avis.
export const googleReviewsUrl = ''

// ------------------------------------------------------------
//  Exemples de mise en page : visibles UNIQUEMENT dans l'aperçu
//  (build avec VITE_SHOW_EXAMPLES=true), jamais sur le site public.
// ------------------------------------------------------------
export const SHOW_EXAMPLES = import.meta.env.VITE_SHOW_EXAMPLES === 'true'

export const exampleStats = [
  { value: 250, suffix: '+', label: 'Dossiers accompagnés' },
  { value: 85, suffix: ' %', label: 'Taux de réussite moyen' },
  { value: 2, suffix: '', label: 'Bureaux au Cameroun' },
  { value: 3500, suffix: '+', label: 'Apprenants sur TCF Express', real: true },
]
export const exampleRates = [
  { service: 'etudes-au-canada', rate: 88, cases: 60, period: '2024-2026' },
  { service: 'visa-visiteur', rate: 80, cases: 45, period: '2024-2026' },
  { service: 'entree-express', rate: 90, cases: 20, period: '2024-2026' },
  { service: 'equivalence-de-diplomes', rate: 98, cases: 75, period: '2024-2026' },
]
export const exampleTestimonials = [
  { name: 'Prénom N.', city: 'Yaoundé', service: 'etudes-au-canada', year: 2026, rating: 5, quote: 'Ici s’affichera le témoignage d’un client accompagné pour ses études, avec son accord.' },
  { name: 'Prénom N.', city: 'Bafoussam', service: 'entree-express', year: 2026, rating: 5, quote: 'Ici s’affichera le témoignage d’un client devenu résident permanent par Entrée express.' },
  { name: 'Prénom N.', city: 'Douala', service: 'visa-visiteur', year: 2025, rating: 4, quote: 'Ici s’affichera le témoignage d’un client ayant obtenu son visa visiteur.' },
]

// Données réellement affichées
export const shownStats = stats.length ? stats : SHOW_EXAMPLES ? exampleStats : []
export const shownRates = successRates.length ? successRates : SHOW_EXAMPLES ? exampleRates : []
export const shownTestimonials = testimonials.length ? testimonials : SHOW_EXAMPLES ? exampleTestimonials : []
export const isExample = (arr, real) => SHOW_EXAMPLES && real.length === 0 && arr.length > 0
