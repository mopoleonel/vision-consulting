import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, XCircle, ArrowRight } from '@phosphor-icons/react'
import { PageHeader } from '../../components/ui.jsx'
import { Card, Field, Select, Num, YesNo, LangInput } from '../../components/form.jsx'
import { ResultCta, Disclaimer, ScoreBar, OtherTools } from '../../components/ToolKit.jsx'
import { computeFsw, educationLevels } from '../../data/rules.js'

const zero = { co: 0, ce: 0, ee: 0, eo: 0 }

export default function Eligibility() {
  const [p, setP] = useState({
    age: 28, education: 'bachelor', foreignExp: 2, canadaExp: 0, l1: { co: 7, ce: 7, ee: 7, eo: 7 }, hasL2: false, l2: zero,
    jobOffer: false, spouse: false, spouseLang4: false, spouseStudyCanada: false, spouseWorkCanada: false, studyCanada: false, relative: false,
  })
  const set = (k) => (v) => setP((o) => ({ ...o, [k]: v }))
  const r = computeFsw({ ...p, age: Number(p.age) || 0, foreignExp: Number(p.foreignExp) || 0, canadaExp: Number(p.canadaExp) || 0, l2: p.hasL2 ? p.l2 : null })

  const reasons = []
  if (!r.langOk) reasons.push('Il faut au moins NCLC 7 dans les 4 compétences de votre première langue officielle.')
  if (!r.minExp) reasons.push('Il faut au moins 1 an d’expérience de travail qualifiée continue (10 dernières années).')
  if (r.total < 67) reasons.push(`Il vous manque ${67 - r.total} point(s) pour atteindre 67.`)

  const summary = `Bonjour, j'ai fait le test d'admissibilité (travailleurs qualifiés) sur votre site : ${r.total}/100 points, ${r.pass ? 'admissible' : 'pas encore admissible'}. Âge ${p.age}, ${educationLevels.find((e) => e.v === p.education).label}, ${p.foreignExp} an(s) d'expérience. J'aimerais être conseillé(e).`

  return (
    <>
      <PageHeader title="Test d’admissibilité" text="Vérifiez si vous atteignez les 67 points du Programme des travailleurs qualifiés (fédéral), première étape pour entrer dans Entrée express." />
      <div className="container-x mt-12 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="grid gap-6">
          <Card title="Votre profil">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="e-age" label="Âge"><Num id="e-age" value={p.age} onChange={set('age')} max={70} /></Field>
              <Field id="e-edu" label="Plus haut diplôme"><Select id="e-edu" value={p.education} onChange={set('education')} options={educationLevels} /></Field>
              <Field id="e-fx" label="Années d’expérience qualifiée hors Canada" hint="Emploi qualifié (FEER 0 à 3), à temps plein."><Num id="e-fx" value={p.foreignExp} onChange={set('foreignExp')} max={30} /></Field>
              <Field id="e-cx" label="Années d’expérience qualifiée au Canada"><Num id="e-cx" value={p.canadaExp} onChange={set('canadaExp')} max={30} /></Field>
            </div>
          </Card>
          <Card title="Première langue officielle">
            <LangInput idPrefix="e-l1" value={p.l1} onChange={set('l1')} />
            <YesNo label="Avez-vous un test dans la seconde langue officielle ?" value={p.hasL2} onChange={set('hasL2')} />
            {p.hasL2 && <LangInput idPrefix="e-l2" value={p.l2} onChange={set('l2')} allowTcf={false} />}
          </Card>
          <Card title="Emploi et capacité d’adaptation">
            <div className="grid gap-5 sm:grid-cols-2">
              <YesNo label="Offre d’emploi valide d’un employeur canadien ?" value={p.jobOffer} onChange={set('jobOffer')} hint="Au moins 1 an, emploi FEER 0, 1, 2 ou 3." />
              <YesNo label="Études à temps plein au Canada (2 ans ou plus) ?" value={p.studyCanada} onChange={set('studyCanada')} />
              <YesNo label="Un parent proche citoyen ou résident permanent au Canada ?" value={p.relative} onChange={set('relative')} hint="Parent, grand-parent, enfant, frère, sœur, oncle, tante, neveu, nièce (18 ans ou plus)." />
              <YesNo label="Avez-vous un conjoint qui vous accompagne ?" value={p.spouse} onChange={set('spouse')} />
              {p.spouse && <>
                <YesNo label="Votre conjoint a-t-il NCLC 4 ou plus dans les 4 compétences ?" value={p.spouseLang4} onChange={set('spouseLang4')} />
                <YesNo label="Votre conjoint a-t-il étudié 2 ans ou plus au Canada ?" value={p.spouseStudyCanada} onChange={set('spouseStudyCanada')} />
                <YesNo label="Votre conjoint a-t-il travaillé 1 an ou plus au Canada ?" value={p.spouseWorkCanada} onChange={set('spouseWorkCanada')} />
              </>}
            </div>
          </Card>
        </div>

        <aside className="card p-6 lg:sticky lg:top-28" aria-live="polite">
          <h2 className="font-display text-lg font-bold text-brand-800 dark:text-white">Votre résultat</h2>
          <div className="mt-4 flex items-end gap-2">
            <span className="font-display text-6xl font-bold leading-none text-brand-700 dark:text-white">{r.total}</span>
            <span className="muted pb-1">/ 100 points</span>
          </div>
          <div className="mt-4"><ScoreBar value={r.total} max={100} accent={!r.pass} /></div>
          <div className={`mt-5 flex gap-3 rounded-2xl p-4 ${r.pass ? 'bg-brand-50 text-brand-800 dark:bg-white/5 dark:text-white' : 'bg-maple-500/10 text-maple-600 dark:text-maple-400'}`}>
            {r.pass ? <CheckCircle size={24} weight="fill" className="shrink-0" /> : <XCircle size={24} weight="fill" className="shrink-0" />}
            <div className="text-sm">
              <p className="font-bold">{r.pass ? 'Vous semblez admissible' : 'Pas encore admissible'}</p>
              {r.pass ? <p className="mt-1">Vous pouvez créer un profil Entrée express. Calculez maintenant votre score SCG.</p>
                : <ul className="mt-1 list-disc space-y-1 pl-4">{reasons.map((x) => <li key={x}>{x}</li>)}</ul>}
            </div>
          </div>
          <ul className="mt-6 space-y-3">
            {r.detail.map(([l, v, m]) => (
              <li key={l}>
                <div className="mb-1 flex justify-between text-sm"><span className="text-slate-700 dark:text-slate-200">{l}</span><span className="font-semibold text-brand-800 dark:text-white">{v} / {m}</span></div>
                <ScoreBar value={v} max={m} />
              </li>
            ))}
          </ul>
          <Link to="/outils/calculateur-scg" className="btn-dark mt-6 w-full">Calculer mon score SCG <ArrowRight weight="bold" /></Link>
          <ResultCta summary={summary} />
          <Disclaimer>Grille officielle des 6 facteurs de sélection (IRCC). Il faut aussi prouver des fonds suffisants et faire évaluer vos diplômes (EDE).</Disclaimer>
        </aside>
      </div>
      <OtherTools current="test-admissibilite" />
    </>
  )
}
