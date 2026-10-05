import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from '@phosphor-icons/react'
import { PageHeader } from '../../components/ui.jsx'
import { Card, Field, Select, Num, YesNo, LangInput } from '../../components/form.jsx'
import { ResultCta, Disclaimer, ScoreBar, OtherTools } from '../../components/ToolKit.jsx'
import { computeCrs, educationLevels } from '../../data/rules.js'
import { site } from '../../config/site.js'

const zero = { co: 0, ce: 0, ee: 0, eo: 0 }
const expOpts = [0, 1, 2, 3, 4, 5].map((v) => ({ v, label: v === 0 ? 'Aucune ou moins d’un an' : v === 5 ? '5 ans ou plus' : `${v} an${v > 1 ? 's' : ''}` }))
const foreignOpts = [0, 1, 2, 3].map((v) => ({ v, label: v === 0 ? 'Aucune ou moins d’un an' : v === 3 ? '3 ans ou plus' : `${v} an${v > 1 ? 's' : ''}` }))

export default function Crs() {
  const [p, setP] = useState({
    spouse: false, spouseComes: true, age: 28, education: 'bachelor', firstLang: 'fr', l1: { co: 7, ce: 7, ee: 7, eo: 7 }, hasL2: false, l2: zero,
    canadaExp: 0, foreignExp: 2, tradeCert: false, canadaStudy: 'none', pnp: false, sibling: false,
    spouseEducation: 'bachelor', spouseL: zero, spouseCanadaExp: 0,
  })
  const set = (k) => (v) => setP((o) => ({ ...o, [k]: v }))
  const withSpouse = p.spouse && p.spouseComes
  const r = computeCrs({ ...p, age: Number(p.age) || 0, canadaExp: Number(p.canadaExp), foreignExp: Number(p.foreignExp), l2: p.hasL2 ? p.l2 : null })

  const summary = `Bonjour, mon score SCG estimé sur votre site est de ${r.total} points (${r.sections.map((s) => `${s.label} ${s.value}`).join(', ')}). J'aimerais savoir comment l'améliorer.`

  return (
    <>
      <PageHeader title="Calculateur de score SCG" text="Estimez votre score au Système de classement global d’Entrée express. Le résultat se met à jour à chaque réponse." />
      <div className="container-x mt-12 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="grid gap-6">
          <Card title="Situation familiale">
            <div className="grid gap-5 sm:grid-cols-2">
              <YesNo label="Êtes-vous marié(e) ou en union de fait ?" value={p.spouse} onChange={set('spouse')} />
              {p.spouse && <YesNo label="Votre conjoint vous accompagnera-t-il au Canada ?" value={p.spouseComes} onChange={set('spouseComes')} hint="S’il est citoyen ou résident permanent canadien, répondez Non." />}
            </div>
          </Card>
          <Card title="Capital humain">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="c-age" label="Âge"><Num id="c-age" value={p.age} onChange={set('age')} max={70} /></Field>
              <Field id="c-edu" label="Plus haut diplôme" hint="Diplôme étranger évalué par une EDE."><Select id="c-edu" value={p.education} onChange={set('education')} options={educationLevels} /></Field>
              <Field id="c-cx" label="Expérience qualifiée au Canada"><Select id="c-cx" value={p.canadaExp} onChange={(v) => set('canadaExp')(Number(v))} options={expOpts} /></Field>
              <Field id="c-fx" label="Expérience qualifiée hors Canada" hint="Au cours des 10 dernières années."><Select id="c-fx" value={p.foreignExp} onChange={(v) => set('foreignExp')(Number(v))} options={foreignOpts} /></Field>
            </div>
          </Card>
          <Card title="Langues officielles">
            <Field id="c-fl" label="Votre première langue officielle (celle de votre meilleur test)">
              <Select id="c-fl" value={p.firstLang} onChange={set('firstLang')} options={[{ v: 'fr', label: 'Français (TCF / TEF Canada)' }, { v: 'en', label: 'Anglais (IELTS / CELPIP / PTE)' }]} />
            </Field>
            <LangInput idPrefix="c-l1" value={p.l1} onChange={set('l1')} allowTcf={p.firstLang === 'fr'} />
            <YesNo label={`Avez-vous aussi un test en ${p.firstLang === 'fr' ? 'anglais' : 'français'} ?`} value={p.hasL2} onChange={set('hasL2')} />
            {p.hasL2 && <LangInput idPrefix="c-l2" value={p.l2} onChange={set('l2')} allowTcf={p.firstLang === 'en'} />}
          </Card>
          {withSpouse && (
            <Card title="Votre conjoint">
              <Field id="c-sedu" label="Plus haut diplôme du conjoint"><Select id="c-sedu" value={p.spouseEducation} onChange={set('spouseEducation')} options={educationLevels} /></Field>
              <Field id="c-sx" label="Expérience qualifiée du conjoint au Canada"><Select id="c-sx" value={p.spouseCanadaExp} onChange={(v) => set('spouseCanadaExp')(Number(v))} options={expOpts} /></Field>
              <span className="field-label">Résultats de test de langue du conjoint (facultatif)</span>
              <LangInput idPrefix="c-sl" value={p.spouseL} onChange={set('spouseL')} />
            </Card>
          )}
          <Card title="Points supplémentaires">
            <div className="grid gap-5 sm:grid-cols-2">
              <YesNo label="Nomination provinciale (PCP) ?" value={p.pnp} onChange={set('pnp')} hint="Rapporte 600 points." />
              <YesNo label="Frère ou sœur citoyen / résident permanent au Canada ?" value={p.sibling} onChange={set('sibling')} />
              <YesNo label="Certificat de compétence d’une province (métier) ?" value={p.tradeCert} onChange={set('tradeCert')} />
              <Field id="c-st" label="Études post-secondaires au Canada">
                <Select id="c-st" value={p.canadaStudy} onChange={set('canadaStudy')} options={[{ v: 'none', label: 'Aucune' }, { v: 'short', label: 'Diplôme de 1 ou 2 ans' }, { v: 'long', label: 'Diplôme de 3 ans ou plus, master ou doctorat' }]} />
              </Field>
            </div>
          </Card>
        </div>

        <aside className="card p-6 lg:sticky lg:top-28" aria-live="polite">
          <h2 className="font-display text-lg font-bold text-brand-800 dark:text-white">Votre score SCG estimé</h2>
          <div className="mt-4 flex items-end gap-2">
            <span className="font-display text-6xl font-bold leading-none text-brand-700 dark:text-white">{r.total}</span>
            <span className="muted pb-1">/ 1 200</span>
          </div>
          <ul className="mt-6 space-y-4">
            {r.sections.map((s) => (
              <li key={s.label}>
                <div className="mb-1 flex justify-between text-sm"><span className="font-medium text-slate-700 dark:text-slate-200">{s.label}</span><span className="font-semibold text-brand-800 dark:text-white">{s.value} / {s.max}</span></div>
                <ScoreBar value={s.value} max={s.max} accent={s.label === 'Points supplémentaires'} />
                <ul className="mt-2 space-y-0.5">
                  {s.items.filter(([, v]) => v > 0).map(([l, v]) => (
                    <li key={l} className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span>{l}</span><span>{v}</span></li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-2xl bg-brand-50 p-4 text-sm text-brand-800 dark:bg-white/5 dark:text-slate-200">
            Comparez votre score aux derniers tirages publiés par IRCC. Les tirages réservés aux francophones ont souvent un seuil plus bas.{' '}
            <a href="https://www.canada.ca/fr/immigration-refugies-citoyennete/services/immigrer-canada/entree-express/soumettre-profil/rondes-invitations.html" target="_blank" rel="noopener" className="font-semibold underline underline-offset-2">Voir les tirages</a>
          </p>
          {p.firstLang === 'fr' && Math.min(...Object.values(p.l1)) < 10 && (
            <a href={site.tcfExpressUrl} target="_blank" rel="noopener" className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-maple-500 p-4 text-sm font-semibold text-white">
              Gagner des points en améliorant votre TCF <ArrowUpRight className="shrink-0" />
            </a>
          )}
          <ResultCta summary={summary} />
          <Disclaimer>Grille officielle du SCG (IRCC). Depuis le 25 mars 2025, une offre d’emploi ne donne plus de points. Vous devez aussi être admissible à un programme : <Link to="/outils/test-admissibilite" className="underline">faites le test</Link>.</Disclaimer>
        </aside>
      </div>
      <OtherTools current="calculateur-scg" />
    </>
  )
}
