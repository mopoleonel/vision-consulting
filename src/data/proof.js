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
//  MODE DÉMO (phase de développement)
//  true  = les données fictives ci-dessous s'affichent partout, avec la
//          mention discrète « Données de démonstration », et le site est
//          masqué des moteurs de recherche (noindex).
//  false = À FAIRE AVANT LE LANCEMENT : seules vos vraies données s'affichent.
// ------------------------------------------------------------
export const DEMO_MODE = true
export const SHOW_EXAMPLES = DEMO_MODE || import.meta.env.VITE_SHOW_EXAMPLES === 'true'

export const exampleStats = [
  { value: 250, suffix: '+', label: 'Dossiers accompagnés' },
  { value: 87, suffix: ' %', label: 'Taux de réussite moyen' },
  { value: 2, suffix: '', label: 'Bureaux au Cameroun' },
  { value: 3500, suffix: '+', label: 'Apprenants sur TCF Express', real: true },
]
export const exampleRates = [
  { service: 'etudes-au-canada', rate: 88, cases: 64, period: '2024-2026' },
  { service: 'entree-express', rate: 91, cases: 22, period: '2024-2026' },
  { service: 'equivalence-de-diplomes', rate: 98, cases: 81, period: '2024-2026' },
  { service: 'visa-visiteur', rate: 79, cases: 47, period: '2024-2026' },
  { service: 'mobilite-francophone', rate: 85, cases: 13, period: '2024-2026' },
  { service: 'regroupement-familial', rate: 92, cases: 12, period: '2024-2026' },
]
export const exampleTestimonials = [
  { name: 'Aïcha M.', city: 'Yaoundé', service: 'etudes-au-canada', year: 2026, rating: 5, quote: 'Mon conseiller m’a aidée à choisir un collège à ma portée et à préparer une lettre explicative solide. Permis d’études accepté du premier coup.' },
  { name: 'Brice T.', city: 'Bafoussam', service: 'entree-express', year: 2026, rating: 5, quote: 'Grâce à la préparation au TCF, j’ai gagné les points francophones. Invitation reçue au deuxième tirage, tout était prêt.' },
  { name: 'Carine N.', city: 'Douala', service: 'visa-visiteur', year: 2025, rating: 4, quote: 'Dossier vérifié pièce par pièce, réponses rapides sur WhatsApp. Visa obtenu pour assister à la remise de diplôme de mon fils.' },
  { name: 'Serge K.', city: 'Yaoundé', service: 'equivalence-de-diplomes', year: 2025, rating: 5, quote: 'Ils se sont occupés de l’authentification avec mon université. Rapport WES reçu sans aller-retour.' },
  { name: 'Mireille F.', city: 'Bafoussam', service: 'mobilite-francophone', year: 2026, rating: 5, quote: 'Je ne connaissais pas la Mobilité francophone. Avec un CV adapté, j’ai trouvé un employeur au Nouveau-Brunswick.' },
  { name: 'Patrick E.', city: 'Yaoundé', service: 'regroupement-familial', year: 2025, rating: 5, quote: 'Les preuves de relation bien organisées ont fait la différence. Ma femme m’a rejoint au Canada.' },
]

// Données réellement affichées
export const shownStats = stats.length ? stats : SHOW_EXAMPLES ? exampleStats : []
export const shownRates = successRates.length ? successRates : SHOW_EXAMPLES ? exampleRates : []
export const shownTestimonials = testimonials.length ? testimonials : SHOW_EXAMPLES ? exampleTestimonials : []
export const isExample = (arr, real) => SHOW_EXAMPLES && real.length === 0 && arr.length > 0
