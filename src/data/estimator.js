import { fees, localFees, honoraires, honoraireMembreSupp, CAD_TO_XAF } from '../config/tarifs.js'

// Options proposées par procédure. key -> { label, default }
export const serviceOptions = {
  'etudes-au-canada': { quebec: ['Études au Québec (CAQ requis)', false], admission2: ['Deux demandes d’admission', true], tcf: ['Passer le TCF Canada', false], medical: ['Visite médicale', true], traductions: ['Traductions et légalisations', true] },
  'entree-express': { ede: ['Évaluation des diplômes (EDE)', true], tcf: ['Passer le TCF Canada', true], medical: ['Visites médicales', true], casier: ['Casiers judiciaires', true], traductions: ['Traductions et légalisations', true] },
  'equivalence-de-diplomes': { envoi: ['Envoi international des documents', true], traductions: ['Traductions et légalisations', false] },
  'permis-de-travail': { medical: ['Visite médicale', true], traductions: ['Traductions et légalisations', true] },
  'mobilite-francophone': { tcf: ['Passer le TCF Canada', true], medical: ['Visite médicale', true], traductions: ['Traductions et légalisations', true] },
  'immigration-quebec': { tcf: ['Passer le TCF Canada', true], ede: ['Évaluation des diplômes', false], medical: ['Visites médicales', true], casier: ['Casiers judiciaires', true], traductions: ['Traductions et légalisations', true] },
  'programmes-provinciaux': { ede: ['Évaluation des diplômes (EDE)', true], tcf: ['Passer le TCF Canada', true], medical: ['Visites médicales', true], casier: ['Casiers judiciaires', true], traductions: ['Traductions et légalisations', true] },
  'visa-visiteur': { traductions: ['Traductions et légalisations', false] },
  'regroupement-familial': { medical: ['Visites médicales', true], casier: ['Casiers judiciaires', true], traductions: ['Traductions et légalisations', true] },
}

export const defaultOptions = (slug) => Object.fromEntries(Object.entries(serviceOptions[slug] || {}).map(([k, [, d]]) => [k, d]))

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
      thirdCad(fees.admission, o.admission2 ? 2 : 1)
      if (o.quebec) off(fees.caq)
      off(fees.permisEtudes)
      if (adults > 1) off({ ...fees.permisTravail, label: 'Permis de travail ouvert du conjoint (traitement + privilège)', cad: fees.permisTravail.cad + fees.permisOuvert.cad })
      if (children) off({ ...fees.visiteur, label: 'Visa / permis des enfants (estimation)' }, children)
      O.push(bio(n))
      break
    case 'entree-express':
    case 'programmes-provinciaux':
    case 'immigration-quebec':
      if (o.ede) { thirdCad(fees.ede); thirdCad(fees.edeEnvoi) }
      rp()
      O.push(bio(n))
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
      O.push(bio(n))
      break
    case 'visa-visiteur':
      off(fees.visiteur, n)
      O.push(bio(n))
      break
    case 'regroupement-familial':
      off(fees.parrainage, adults)
      if (children) off(fees.rpEnfant, children)
      O.push(bio(n))
      break
  }
  if (o.tcf) loc(localFees.tcf)
  if (o.medical) loc(localFees.medical, n)
  if (o.casier) loc(localFees.casier, adults)
  if (o.traductions) loc(localFees.traductions)

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
