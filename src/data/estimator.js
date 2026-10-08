import { fees, localFees, honoraires, honoraireMembreSupp, CAD_TO_XAF, acquisDeductions } from '../config/tarifs.js'

// Questionnaire par procédure.
//  kind 'have'   : « Avez-vous déjà ... ? »  Oui = déjà acquis, donc exclu du devis.
//  kind 'choice' : option du projet (Oui = incluse).
//  La valeur stockée dans `options` vaut true quand la ligne doit être INCLUSE.
const HAVE = {
  tcf: 'Avez-vous déjà un résultat TCF Canada (ou TEF) valide ?',
  ede: 'Avez-vous déjà votre évaluation des diplômes (EDE / WES) ?',
  envoi: 'Vos documents ont-ils déjà été envoyés à l’organisme ?',
  medical: 'Avez-vous déjà passé la visite médicale IRCC ?',
  casier: 'Avez-vous déjà vos casiers judiciaires récents ?',
  traductions: 'Vos documents sont-ils déjà traduits et légalisés ?',
  admission: 'Avez-vous déjà une lettre d’admission ?',
  caqDone: 'Avez-vous déjà votre CAQ ?',
  biometrie: 'Avez-vous donné vos données biométriques il y a moins de 10 ans ?',
}
export const serviceQuestions = {
  'etudes-au-canada': [['quebec', 'choice', 'Vos études seront-elles au Québec ?', false], ['admission2', 'choice', 'Souhaitez-vous postuler dans deux établissements ?', true], ['admission', 'have'], ['caqDone', 'have'], ['tcf', 'choice', 'Devez-vous passer un test de français (TCF) ?', false], ['medical', 'have'], ['traductions', 'have'], ['biometrie', 'have']],
  'entree-express': [['tcf', 'have'], ['ede', 'have'], ['medical', 'have'], ['casier', 'have'], ['traductions', 'have'], ['biometrie', 'have']],
  'equivalence-de-diplomes': [['envoi', 'have'], ['traductions', 'choice', 'Avez-vous des documents à faire traduire ?', false]],
  'permis-de-travail': [['medical', 'have'], ['traductions', 'have'], ['biometrie', 'have']],
  'mobilite-francophone': [['tcf', 'have'], ['medical', 'have'], ['traductions', 'have'], ['biometrie', 'have']],
  'immigration-quebec': [['tcf', 'have'], ['ede', 'choice', 'Souhaitez-vous inclure une évaluation des diplômes ?', false], ['medical', 'have'], ['casier', 'have'], ['traductions', 'have'], ['biometrie', 'have']],
  'programmes-provinciaux': [['tcf', 'have'], ['ede', 'have'], ['medical', 'have'], ['casier', 'have'], ['traductions', 'have'], ['biometrie', 'have']],
  'visa-visiteur': [['traductions', 'choice', 'Avez-vous des documents à faire traduire ?', false], ['biometrie', 'have']],
  'regroupement-familial': [['medical', 'have'], ['casier', 'have'], ['traductions', 'have'], ['biometrie', 'have']],
}
export const questionsFor = (slug) => (serviceQuestions[slug] || []).map(([key, kind, text, def = true]) => ({ key, kind, text: text || HAVE[key], def }))
// Par défaut : rien n'est déjà acquis (tout est inclus), sauf indication contraire.
export const defaultOptions = (slug) => Object.fromEntries(questionsFor(slug).map((q) => [q.key, q.def]))
// Liste lisible de ce que le client possède déjà (pour le proforma)
export const acquisList = (slug, options) => questionsFor(slug).filter((q) => q.kind === 'have' && options[q.key] === false).map((q) => ACQUIS_LABEL[q.key])
const ACQUIS_LABEL = { tcf: 'TCF Canada valide', ede: 'Évaluation des diplômes (EDE)', envoi: 'Documents déjà envoyés à l’organisme', medical: 'Visite médicale', casier: 'Casiers judiciaires', traductions: 'Traductions et légalisations', admission: 'Lettre d’admission', caqDone: 'CAQ', biometrie: 'Données biométriques valides' }

const bio = (n) => (n >= 2 ? { label: `${fees.biometrie.label} - tarif famille (${n} pers.)`, cad: fees.biometrie.cadFamille, qty: 1 } : { label: fees.biometrie.label, cad: fees.biometrie.cad, qty: 1 })

export function buildEstimate(slug, { adults = 1, children = 0, options = {} }) {
  const n = adults + children
  const H = [], O = [], T = []
  const h = honoraires[slug]
  H.push({ label: h.label, qty: 1, xaf: h.xaf })
  if (slug !== 'equivalence-de-diplomes' && n > 1) H.push({ label: honoraireMembreSupp.label, qty: n - 1, xaf: honoraireMembreSupp.xaf })

  const off = (f, qty = 1, note) => O.push({ label: f.label + (note ? ` - ${note}` : ''), qty, cad: f.cad })
  const loc = (f, qty = 1) => T.push({ label: f.label, qty, xaf: f.xaf })
  const thirdCad = (f, qty = 1) => T.push({ label: f.label, qty, cad: f.cad })
  const o = options
  const rp = () => { off(fees.rpAdulte, adults); if (children) off(fees.rpEnfant, children) }

  switch (slug) {
    case 'etudes-au-canada':
      if (o.admission !== false) thirdCad(fees.admission, o.admission2 ? 2 : 1)
      if (o.quebec && o.caqDone !== false) off(fees.caq)
      off(fees.permisEtudes)
      if (adults > 1) off({ ...fees.permisTravail, label: 'Permis de travail ouvert du conjoint (traitement + privilège)', cad: fees.permisTravail.cad + fees.permisOuvert.cad })
      if (children) off({ ...fees.visiteur, label: 'Visa / permis des enfants (estimation)' }, children)
      if (o.biometrie !== false) O.push(bio(n))
      break
    case 'entree-express':
    case 'programmes-provinciaux':
    case 'immigration-quebec':
      if (o.ede) { thirdCad(fees.ede); thirdCad(fees.edeEnvoi) }
      rp()
      if (o.biometrie !== false) O.push(bio(n))
      break
    case 'equivalence-de-diplomes':
      thirdCad(fees.ede)
      if (o.envoi) thirdCad(fees.edeEnvoi)
      break
    case 'permis-de-travail':
    case 'mobilite-francophone':
      off(fees.permisTravail)
      if (adults > 1) off({ ...fees.permisTravail, label: 'Permis de travail ouvert du conjoint (traitement + privilège)', cad: fees.permisTravail.cad + fees.permisOuvert.cad })
      if (children) off({ ...fees.visiteur, label: 'Visa / permis des enfants (estimation)' }, children)
      if (o.biometrie !== false) O.push(bio(n))
      break
    case 'visa-visiteur':
      off(fees.visiteur, n)
      if (o.biometrie !== false) O.push(bio(n))
      break
    case 'regroupement-familial':
      off(fees.parrainage, adults)
      if (children) off(fees.rpEnfant, children)
      if (o.biometrie !== false) O.push(bio(n))
      break
  }
  if (o.tcf) loc(localFees.tcf)
  if (o.medical) loc(localFees.medical, n)
  if (o.casier) loc(localFees.casier, adults)
  if (o.traductions) loc(localFees.traductions)

  // Réduction d'honoraires quand le client a déjà fait une partie du travail (montants dans tarifs.js)
  Object.entries(acquisDeductions).forEach(([k, amount]) => {
    if (amount > 0 && o[k] === false && questionsFor(slug).some((q) => q.key === k && q.kind === 'have')) {
      H.push({ label: `Déduction : ${ACQUIS_LABEL[k]} déjà obtenu(e)`, qty: 1, xaf: -amount })
    }
  })

  const toXaf = (l) => (l.cad != null ? l.cad * l.qty * CAD_TO_XAF : l.xaf * l.qty)
  const sum = (arr) => arr.reduce((t, l) => t + toXaf(l), 0)
  const notes = []
  if (slug === 'immigration-quebec') notes.push('Les frais du MIFI (déclaration Arrima et demande de CSQ) s’ajoutent et vous seront précisés par votre conseiller.')
  if (slug === 'programmes-provinciaux') notes.push('Certaines provinces facturent des frais de candidature (variables selon la province), précisés par votre conseiller.')
  if (slug === 'etudes-au-canada') notes.push('Les frais de scolarité et la preuve de fonds exigée par IRCC ne sont pas inclus.')
  if (['entree-express', 'programmes-provinciaux', 'immigration-quebec'].includes(slug)) notes.push('La preuve de fonds exigée par IRCC (selon la taille de la famille) n’est pas une dépense mais doit être disponible.')

  return {
    groups: [
      { key: 'h', title: 'Honoraires Vision Consulting', lines: H, total: sum(H) },
      { key: 'o', title: 'Frais officiels (gouvernement)', lines: O, total: sum(O) },
      { key: 't', title: 'Frais de tiers estimés', lines: T, total: sum(T) },
    ].filter((g) => g.lines.length),
    total: sum(H) + sum(O) + sum(T),
    toXaf,
    notes,
  }
}
