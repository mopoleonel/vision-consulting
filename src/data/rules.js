// ============================================================
//  BARÈMES OFFICIELS (IRCC) - vérifiés en octobre 2026 sur canada.ca
//  Si IRCC modifie une grille, il suffit de corriger ce fichier.
// ============================================================

// ---------- Conversion TCF Canada -> NCLC ----------
// [NCLC, min] du plus élevé au plus bas. Source : IRCC, équivalences des tests de langue.
export const tcfTable = {
  co: { label: 'Compréhension orale', max: 699, min: 0, steps: [[10, 549], [9, 523], [8, 503], [7, 458], [6, 398], [5, 369], [4, 331]] },
  ce: { label: 'Compréhension écrite', max: 699, min: 0, steps: [[10, 549], [9, 524], [8, 499], [7, 453], [6, 406], [5, 375], [4, 342]] },
  ee: { label: 'Expression écrite', max: 20, min: 0, steps: [[10, 16], [9, 14], [8, 12], [7, 10], [6, 7], [5, 6], [4, 4]] },
  eo: { label: 'Expression orale', max: 20, min: 0, steps: [[10, 16], [9, 14], [8, 12], [7, 10], [6, 7], [5, 6], [4, 4]] },
}
export function tcfToNclc(skill, score) {
  if (score === '' || score === null || Number.isNaN(Number(score))) return null
  const s = Number(score)
  for (const [n, min] of tcfTable[skill].steps) if (s >= min) return n
  return 3 // en dessous de NCLC 4
}

// ---------- Options communes ----------
export const educationLevels = [
  { v: 'none', label: 'Moins que le secondaire' },
  { v: 'secondary', label: 'Diplôme d’études secondaires (Bac)' },
  { v: 'one', label: 'Diplôme post-secondaire d’un an' },
  { v: 'two', label: 'Diplôme post-secondaire de deux ans (BTS, DUT)' },
  { v: 'bachelor', label: 'Licence ou programme de 3 ans ou plus' },
  { v: 'twoplus', label: 'Deux diplômes ou plus, dont un de 3 ans ou plus' },
  { v: 'master', label: 'Master ou diplôme professionnel (médecine, droit...)' },
  { v: 'phd', label: 'Doctorat (PhD)' },
]

// ---------- Programme des travailleurs qualifiés (fédéral) : grille sur 100, seuil 67 ----------
const fswEducation = { none: 0, secondary: 5, one: 15, two: 19, bachelor: 21, twoplus: 22, master: 23, phd: 25 }
const fswAge = (a) => (a < 18 ? 0 : a <= 35 ? 12 : a >= 47 ? 0 : 12 - (a - 35))
const fswExp = (y) => (y >= 6 ? 15 : y >= 4 ? 13 : y >= 2 ? 11 : y >= 1 ? 9 : 0)
const fswLangAbility = (n) => (n >= 9 ? 6 : n === 8 ? 5 : n === 7 ? 4 : 0)

export function computeFsw(p) {
  const first = [p.l1.co, p.l1.ce, p.l1.ee, p.l1.eo]
  const second = p.l2 ? [p.l2.co, p.l2.ce, p.l2.ee, p.l2.eo] : null
  const langOk = first.every((n) => n >= 7)
  const lang = first.reduce((t, n) => t + fswLangAbility(n), 0) + (second && second.every((n) => n >= 5) ? 4 : 0)
  const education = fswEducation[p.education] ?? 0
  const experience = fswExp(p.foreignExp + p.canadaExp)
  const age = fswAge(p.age)
  const arranged = p.jobOffer ? 10 : 0
  let adapt = 0
  if (p.spouse && p.spouseLang4) adapt += 5
  if (p.studyCanada) adapt += 5
  if (p.spouse && p.spouseStudyCanada) adapt += 5
  if (p.canadaExp >= 1) adapt += 10
  if (p.spouse && p.spouseWorkCanada) adapt += 5
  if (p.jobOffer) adapt += 5
  if (p.relative) adapt += 5
  adapt = Math.min(10, adapt)
  const total = lang + education + experience + age + arranged + adapt
  const minExp = p.foreignExp + p.canadaExp >= 1
  return {
    total,
    pass: total >= 67 && langOk && minExp,
    langOk,
    minExp,
    detail: [
      ['Langues', lang, 28],
      ['Études', education, 25],
      ['Expérience', experience, 15],
      ['Âge', age, 12],
      ['Emploi réservé', arranged, 10],
      ['Capacité d’adaptation', adapt, 10],
    ],
  }
}

// ---------- Système de classement global (SCG / CRS) ----------
// Index : [avec conjoint, sans conjoint]
const crsAgeTable = { 18: [90, 99], 19: [95, 105], 30: [95, 105], 31: [90, 99], 32: [85, 94], 33: [80, 88], 34: [75, 83], 35: [70, 77], 36: [65, 72], 37: [60, 66], 38: [55, 61], 39: [50, 55], 40: [45, 50], 41: [35, 39], 42: [25, 28], 43: [15, 17], 44: [5, 6] }
function crsAge(a, i) {
  if (a < 18 || a >= 45) return 0
  if (a >= 20 && a <= 29) return [100, 110][i]
  return crsAgeTable[a][i]
}
const crsEdu = { none: [0, 0], secondary: [28, 30], one: [84, 90], two: [91, 98], bachelor: [112, 120], twoplus: [119, 128], master: [126, 135], phd: [140, 150] }
function crsL1(n, i) {
  if (n >= 10) return [32, 34][i]
  return ({ 9: [29, 31], 8: [22, 23], 7: [16, 17], 6: [8, 9], 5: [6, 6], 4: [6, 6] }[n] || [0, 0])[i]
}
const crsL2 = (n) => (n >= 9 ? 6 : n >= 7 ? 3 : n >= 5 ? 1 : 0)
const crsCdnExp = (y, i) => (y >= 5 ? [70, 80] : y === 4 ? [63, 72] : y === 3 ? [56, 64] : y === 2 ? [46, 53] : y === 1 ? [35, 40] : [0, 0])[i]
const spouseEdu = { none: 0, secondary: 2, one: 6, two: 7, bachelor: 8, twoplus: 9, master: 10, phd: 10 }
const spouseLang = (n) => (n >= 9 ? 5 : n >= 7 ? 3 : n >= 5 ? 1 : 0)
const spouseExp = (y) => (y >= 5 ? 10 : [0, 5, 7, 8, 9][y] ?? 0)

export function computeCrs(p) {
  const i = p.spouse && p.spouseComes ? 0 : 1
  const l1 = [p.l1.co, p.l1.ce, p.l1.ee, p.l1.eo]
  const l2 = p.l2 ? [p.l2.co, p.l2.ce, p.l2.ee, p.l2.eo] : [0, 0, 0, 0]

  // A. Facteurs de base
  const age = crsAge(p.age, i)
  const edu = crsEdu[p.education][i]
  const lang1 = l1.reduce((t, n) => t + crsL1(n, i), 0)
  const lang2 = Math.min(i === 0 ? 22 : 24, l2.reduce((t, n) => t + crsL2(n), 0))
  const cdn = crsCdnExp(Math.min(p.canadaExp, 5), i)
  const A = age + edu + lang1 + lang2 + cdn

  // B. Conjoint
  let B = 0
  if (i === 0) {
    B += spouseEdu[p.spouseEducation] ?? 0
    B += Math.min(20, [p.spouseL.co, p.spouseL.ce, p.spouseL.ee, p.spouseL.eo].reduce((t, n) => t + spouseLang(n), 0))
    B += spouseExp(Math.min(p.spouseCanadaExp, 5))
  }

  // C. Transférabilité des compétences
  const minL1 = Math.min(...l1)
  const clb7 = minL1 >= 7, clb9 = minL1 >= 9
  const eduTier = ['one', 'two', 'bachelor'].includes(p.education) ? 1 : ['twoplus', 'master', 'phd'].includes(p.education) ? 2 : 0
  const cy = Math.min(p.canadaExp, 5)
  const fy = p.foreignExp
  const eduLang = eduTier === 0 || !clb7 ? 0 : clb9 ? [0, 25, 50][eduTier] : [0, 13, 25][eduTier]
  const eduCdn = eduTier === 0 || cy < 1 ? 0 : cy >= 2 ? [0, 25, 50][eduTier] : [0, 13, 25][eduTier]
  const fTier = fy >= 3 ? 2 : fy >= 1 ? 1 : 0
  const forLang = fTier === 0 || !clb7 ? 0 : clb9 ? [0, 25, 50][fTier] : [0, 13, 25][fTier]
  const forCdn = fTier === 0 || cy < 1 ? 0 : cy >= 2 ? [0, 25, 50][fTier] : [0, 13, 25][fTier]
  const cert = p.tradeCert ? (minL1 >= 7 ? 50 : minL1 >= 5 ? 25 : 0) : 0
  const C = Math.min(100, Math.min(50, eduLang + eduCdn) + Math.min(50, forLang + forCdn) + cert)

  // D. Points supplémentaires
  const frenchIsFirst = p.firstLang === 'fr'
  const fr = frenchIsFirst ? l1 : l2
  const en = frenchIsFirst ? l2 : l1
  let french = 0
  if (fr.every((n) => n >= 7)) french = en.every((n) => n >= 5) ? 50 : 25
  const study = p.canadaStudy === 'long' ? 30 : p.canadaStudy === 'short' ? 15 : 0
  const D = Math.min(600, (p.pnp ? 600 : 0) + (p.sibling ? 15 : 0) + french + study)

  return {
    total: A + B + C + D,
    sections: [
      { label: 'Capital humain', value: A, max: i === 0 ? 460 : 500, items: [['Âge', age], ['Études', edu], ['Première langue officielle', lang1], ['Seconde langue officielle', lang2], ['Expérience au Canada', cdn]] },
      { label: 'Conjoint', value: B, max: 40, items: i === 0 ? [] : [['Non applicable (célibataire ou conjoint qui ne vous accompagne pas)', 0]] },
      { label: 'Transférabilité des compétences', value: C, max: 100, items: [['Études et langue / expérience canadienne', Math.min(50, eduLang + eduCdn)], ['Expérience étrangère et langue / expérience canadienne', Math.min(50, forLang + forCdn)], ['Certificat de compétence', cert]] },
      { label: 'Points supplémentaires', value: D, max: 600, items: [['Nomination provinciale', p.pnp ? 600 : 0], ['Compétences en français', french], ['Études au Canada', study], ['Frère ou sœur au Canada', p.sibling ? 15 : 0]] },
    ],
  }
}
