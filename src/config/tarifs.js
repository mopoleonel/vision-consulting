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
    '50 % des honoraires à la signature du contrat d’accompagnement, 50 % avant le dépôt du dossier.',
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
// Montants proposés par défaut, à ajuster selon votre politique commerciale.
export const honoraires = {
  'etudes-au-canada': { label: 'Accompagnement études au Canada (admission + CAQ/APP + permis d’études)', xaf: 450000 },
  'entree-express': { label: 'Accompagnement résidence permanente Entrée express (profil + demande de RP)', xaf: 750000 },
  'equivalence-de-diplomes': { label: 'Accompagnement équivalence de diplômes (EDE)', xaf: 100000 },
  'permis-de-travail': { label: 'Accompagnement permis de travail', xaf: 500000 },
  'mobilite-francophone': { label: 'Accompagnement Mobilité francophone', xaf: 450000 },
  'immigration-quebec': { label: 'Accompagnement immigration au Québec (Arrima, CSQ, RP)', xaf: 650000 },
  'programmes-provinciaux': { label: 'Accompagnement programme provincial (PCP)', xaf: 650000 },
  'visa-visiteur': { label: 'Accompagnement visa visiteur', xaf: 200000 },
  'regroupement-familial': { label: 'Accompagnement parrainage familial', xaf: 500000 },
}
// Déduction sur vos honoraires quand le client a déjà fait une démarche (0 = pas de déduction)
export const acquisDeductions = { tcf: 0, ede: 0, admission: 0, caqDone: 0, traductions: 0 }

// Code d'accès à l'espace conseiller (simple verrou, pas une vraie sécurité)
export const STAFF_PIN = '2026'

export const honoraireMembreSupp = { label: 'Membre de famille supplémentaire (par personne)', xaf: 100000 }

export const xaf = (n) => `${Math.round(n).toLocaleString('fr-FR').replace(/ | /g, ' ')} FCFA`
export const cad = (n) => `${n.toLocaleString('fr-FR').replace(/ | /g, ' ')} $ CA`
