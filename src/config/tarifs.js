// ============================================================
//  TARIFS ET INFORMATIONS DU PROFORMA
//  Tous les montants se modifient ici. Le site et le PDF se mettent à jour seuls.
// ============================================================

// Taux indicatif utilisé pour convertir les frais officiels (CAD) en FCFA.
// Taux du marché début octobre 2026 : environ 411 FCFA. On ajoute une marge de change bancaire.
export const CAD_TO_XAF = 420
export const RATE_DATE = 'octobre 2026'

// --- Informations imprimées sur le proforma ---
// Laissez une valeur vide ('') pour qu'elle n'apparaisse pas sur le document.
export const proformaInfo = {
  raisonSociale: 'Vision Consulting',
  slogan: 'Cabinet d’accompagnement en immigration Canada et préparation TCF',
  rccm: '', // ex. : RC/YAO/2024/B/1234  (À COMPLÉTER)
  niu: '', // ex. : M0123456789012A      (À COMPLÉTER)
  validiteJours: 30,
  conditions: [
    'Les frais d’assistance (honoraires Vision Consulting) sont non remboursables, quelle que soit l’issue de la procédure.',
    'Les frais officiels (gouvernement, organismes, tests) sont payés directement aux organismes concernés, au nom du client.',
    'Les montants en FCFA des frais officiels sont calculés au taux indicatif indiqué et peuvent varier selon le taux du jour.',
    'Paiement accepté : espèces au bureau, Mobile Money (Orange Money / MTN MoMo) ou virement bancaire. Références communiquées par votre conseiller.',
  ],
  mentions:
    'Document estimatif sans valeur contractuelle. Vision Consulting est un cabinet privé, non affilié au gouvernement du Canada. Aucun cabinet ne peut garantir la décision des autorités.',
}

// --- Frais officiels et frais de tiers (en CAD sauf indication) ---
// Sources : grille des frais IRCC (canada.ca), MIFI pour le CAQ. Vérifiés en octobre 2026.
export const fees = {
  biometrie: { label: 'Données biométriques', cad: 85, cadFamille: 170, source: 'IRCC' },
  permisEtudes: { label: 'Permis d’études (IRCC)', cad: 150, source: 'IRCC' },
  caq: { label: 'Certificat d’acceptation du Québec (CAQ)', cad: 135, source: 'MIFI' },
  permisTravail: { label: 'Permis de travail (IRCC)', cad: 155, source: 'IRCC' },
  permisOuvert: { label: 'Permis de travail ouvert (privilège)', cad: 100, source: 'IRCC' },
  visiteur: { label: 'Visa de résident temporaire (par personne)', cad: 100, source: 'IRCC' },
  rpAdulte: { label: 'Résidence permanente : traitement + droit de RP (par adulte)', cad: 1590, source: 'IRCC' },
  rpEnfant: { label: 'Résidence permanente : enfant à charge', cad: 270, source: 'IRCC' },
  parrainage: { label: 'Parrainage familial (parrainage + traitement + droit de RP)', cad: 1260, source: 'IRCC' },
  ede: { label: 'Évaluation des diplômes (EDE, WES, estimation)', cad: 330, source: 'Organisme EDE' },
  edeEnvoi: { label: 'Envoi international des documents (estimation)', cad: 60, source: 'Transporteur' },
  admission: { label: 'Frais de demande d’admission (estimation, par établissement)', cad: 120, source: 'Établissement' },
}

// Frais locaux estimés (en FCFA)
export const localFees = {
  tcf: { label: 'Inscription au TCF Canada (estimation, selon le centre)', xaf: 150000 },
  medical: { label: 'Visite médicale chez un médecin agréé (estimation)', xaf: 90000 },
  traductions: { label: 'Traductions et légalisations (estimation)', xaf: 50000 },
  casier: { label: 'Casier judiciaire et documents d’état civil (estimation)', xaf: 15000 },
}

// --- Honoraires Vision Consulting (FCFA) ---
// Montants et tranches définis dans src/config/contrats.json (même source que les contrats PDF).
// Règle : 500 000 FCFA maximum par procédure, en 3 tranches (150 000 / 150 000 / 200 000).
import contratsData from './contrats.json'
export const contrats = contratsData
const sum = (a) => a.reduce((t, n) => t + n, 0)
const honorLabels = {
  'etudes-au-canada': 'Accompagnement études au Canada (admission + CAQ/APP + permis d’études)',
  'entree-express': 'Accompagnement résidence permanente Entrée express (profil + demande de RP)',
  'equivalence-de-diplomes': 'Accompagnement équivalence de diplômes (EDE)',
  'permis-de-travail': 'Accompagnement permis de travail',
  'mobilite-francophone': 'Accompagnement Mobilité francophone',
  'immigration-quebec': 'Accompagnement immigration au Québec (Arrima, CSQ, RP)',
  'programmes-provinciaux': 'Accompagnement programme provincial (PCP)',
  'visa-visiteur': 'Accompagnement visa visiteur',
  'regroupement-familial': 'Accompagnement parrainage familial',
}
export const honoraires = Object.fromEntries(Object.entries(honorLabels).map(([slug, label]) => [slug, { label: `${label} - forfait dossier complet`, xaf: sum(contratsData.procedures[slug].tranches) }]))

// Échéancier des honoraires d'une procédure : [[quand, montant], ...]
export function tranchesFor(slug) {
  const p = contratsData.procedures[slug]
  if (!p) return []
  return p.etapes || [['À l’ouverture du dossier', p.tranches[0]], [p.selection, p.tranches[1]], [p.visa, p.tranches[2]]]
}
// Lien du contrat PDF à lire / télécharger (fichiers dans public/contrats/)
export const contratUrl = (slug) => `${import.meta.env.BASE_URL}contrats/Contrat-${slug}-Vision-Consulting.pdf`
export const contratQmaUrl = `${import.meta.env.BASE_URL}contrats/Contrat-Bourse-QMA-Vision-Consulting.pdf`

// Déduction sur vos honoraires quand le client a déjà fait une démarche (0 = pas de déduction)
export const acquisDeductions = { tcf: 0, ede: 0, admission: 0, caqDone: 0, traductions: 0 }

// Code d'accès à l'espace conseiller (simple verrou, pas une vraie sécurité)
export const STAFF_PIN = '2026'

// Honoraires forfaitaires : pas de supplément par membre de la famille (0 = ligne non affichée)
export const honoraireMembreSupp = { label: 'Membre de famille supplémentaire (par personne)', xaf: 0 }

export const xaf = (n) => `${Math.round(n).toLocaleString('fr-FR').replace(/ | /g, ' ')} FCFA`
export const cad = (n) => `${n.toLocaleString('fr-FR').replace(/ | /g, ' ')} $ CA`
