import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, WhatsappLogo, CheckCircle, ArrowUpRight } from '@phosphor-icons/react'
import { PageHeader } from '../components/ui.jsx'
import { services, getService } from '../data/services.js'
import { site, whatsappLink } from '../config/site.js'

const goals = [
  ['etudes-au-canada', 'Étudier'],
  ['permis-de-travail', 'Travailler'],
  ['entree-express', 'M’installer (résidence permanente)'],
  ['visa-visiteur', 'Visiter'],
  ['regroupement-familial', 'Rejoindre ma famille'],
  ['equivalence-de-diplomes', 'Faire évaluer mes diplômes'],
  ['inconnu', 'Je ne sais pas encore'],
]
const ages = ['Moins de 18 ans', '18 - 24 ans', '25 - 29 ans', '30 - 35 ans', '36 - 44 ans', '45 ans et plus']
const educations = ['Baccalauréat / secondaire', 'BTS / DUT / Bac+2', 'Licence / Bac+3', 'Master / Bac+5', 'Doctorat']
const experiences = ['Aucune', 'Moins d’un an', '1 à 2 ans', '3 à 5 ans', 'Plus de 5 ans']
const frLevels = ['Débutant', 'Intermédiaire', 'Avancé', 'Langue maternelle / courant']
const enLevels = ['Aucun', 'Débutant', 'Intermédiaire', 'Avancé']

const empty = { goal: '', age: '', education: '', experience: '', marital: '', french: '', tcf: '', english: '', }

function Choice({ options, value, onChange, name }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={name}>
      {options.map((o) => {
        const [val, label] = Array.isArray(o) ? o : [o, o]
        const active = value === val
        return (
          <button
            type="button" key={val} role="radio" aria-checked={active} onClick={() => onChange(val)}
            className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white text-ink hover:border-brand-400 dark:border-white/15 dark:bg-brand-950 dark:text-slate-100'}`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

function Field({ label, error, children, id }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="field-label">{label}</label>
      {children}
      {error && <p className="text-sm font-medium text-maple-600 dark:text-maple-400">{error}</p>}
    </div>
  )
}

function recommend(d) {
  const recs = new Set()
  if (d.goal && d.goal !== 'inconnu') recs.add(d.goal)
  const skilled = ['Licence / Bac+3', 'Master / Bac+5', 'Doctorat', 'BTS / DUT / Bac+2'].includes(d.education) && !['Aucune', 'Moins d’un an', ''].includes(d.experience)
  const goodFr = ['Avancé', 'Langue maternelle / courant', 'Intermédiaire'].includes(d.french)
  if (skilled && d.age !== '45 ans et plus') { recs.add('entree-express'); recs.add('equivalence-de-diplomes') }
  if (goodFr && skilled) { recs.add('mobilite-francophone'); recs.add('immigration-quebec') }
  if (['18 - 24 ans', '25 - 29 ans', 'Moins de 18 ans'].includes(d.age) || d.experience === 'Aucune') recs.add('etudes-au-canada')
  if (skilled) recs.add('programmes-provinciaux')
  return [...recs].slice(0, 4).map(getService).filter(Boolean)
}

export default function Evaluation() {
  const [params] = useSearchParams()
  const pre = params.get('service')
  const [d, setD] = useState(() => ({ ...empty, goal: goals.some(([g]) => g === pre) ? pre : '' }))
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)
  const set = (k) => (v) => setD((p) => ({ ...p, [k]: v?.target ? (v.target.type === 'checkbox' ? v.target.checked : v.target.value) : v }))

  const titles = ['Votre projet', 'Votre profil', 'Vos langues']
  const validate = () => {
    const e = {}
    if (step === 0 && !d.goal) e.goal = 'Choisissez votre objectif principal.'
    if (step === 1) {
      if (!d.age) e.age = 'Indiquez votre tranche d’âge.'
      if (!d.education) e.education = 'Indiquez votre niveau d’études.'
      if (!d.experience) e.experience = 'Indiquez votre expérience.'
    }
    if (step === 2 && !d.french) e.french = 'Indiquez votre niveau de français.'
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const next = () => { if (validate()) { if (step < 2) setStep(step + 1); else setDone(true) } }

  const recs = useMemo(() => recommend(d), [d])
  const summary = useMemo(() => {
    const goal = goals.find(([g]) => g === d.goal)?.[1]
    return [
      'Bonjour Vision Consulting, voici mon profil (orientation rapide sur votre site) :',
      `Objectif : ${goal}`, `Âge : ${d.age}`, `Études : ${d.education}`, `Expérience : ${d.experience}`, d.marital && `Situation familiale : ${d.marital}`,
      `Français : ${d.french}`, d.tcf && `Test de français passé : ${d.tcf}`, d.english && `Anglais : ${d.english}`,
      recs.length && `Parcours suggérés : ${recs.map((r) => r.title).join(', ')}`,
    ].filter(Boolean).join('\n')
  }, [d, recs])

  return (
    <>
      <PageHeader title="Évaluation gratuite" text="Trois questions, une minute. Vous voyez immédiatement les parcours adaptés à votre profil, sans inscription." />
      <section className="container-x mt-12 max-w-3xl">
        <div className="card p-6 md:p-10">
          {!done ? (
            <>
              <div className="flex gap-2" aria-hidden>
                {titles.map((t, i) => <span key={t} className={`h-1.5 flex-1 rounded-full transition ${i <= step ? 'bg-maple-500' : 'bg-brand-100 dark:bg-white/10'}`} />)}
              </div>
              <p className="mt-6 text-sm font-medium text-slate-500 dark:text-slate-400">Étape {step + 1} sur 3</p>
              <h2 className="mt-1 text-2xl font-bold text-brand-800 dark:text-white">{titles[step]}</h2>

              <AnimatePresence mode="wait">
                <motion.form
                  key={step}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="mt-8 grid gap-7"
                  onSubmit={(e) => { e.preventDefault(); next() }}
                  noValidate
                >
                  {step === 0 && (
                    <Field label="Quel est votre objectif principal ?" error={errors.goal}>
                      <Choice name="Objectif" options={goals} value={d.goal} onChange={set('goal')} />
                    </Field>
                  )}
                  {step === 1 && (
                    <>
                      <Field label="Âge" error={errors.age}><Choice name="Âge" options={ages} value={d.age} onChange={set('age')} /></Field>
                      <Field label="Niveau d’études le plus élevé" error={errors.education}><Choice name="Études" options={educations} value={d.education} onChange={set('education')} /></Field>
                      <Field label="Expérience professionnelle qualifiée" error={errors.experience}><Choice name="Expérience" options={experiences} value={d.experience} onChange={set('experience')} /></Field>
                      <Field label="Situation familiale (facultatif)" id="marital">
                        <select id="marital" className="field" value={d.marital} onChange={set('marital')}>
                          <option value="">Choisir</option>
                          <option>Célibataire</option><option>Marié(e) / conjoint(e) de fait</option><option>Avec enfant(s)</option>
                        </select>
                      </Field>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <Field label="Niveau de français estimé" error={errors.french}><Choice name="Français" options={frLevels} value={d.french} onChange={set('french')} /></Field>
                      <Field label="Avez-vous déjà passé un test de français ? (facultatif)" id="tcf">
                        <select id="tcf" className="field" value={d.tcf} onChange={set('tcf')}>
                          <option value="">Non / pas encore</option><option>TCF Canada</option><option>TEF Canada</option><option>TCF Québec / TEFAQ</option><option>DELF / DALF</option>
                        </select>
                      </Field>
                      <Field label="Niveau d’anglais (facultatif)"><Choice name="Anglais" options={enLevels} value={d.english} onChange={set('english')} /></Field>
                      {d.french !== 'Langue maternelle / courant' && d.french && (
                        <a href={site.tcfExpressUrl} target="_blank" rel="noopener" className="flex items-center justify-between gap-3 rounded-2xl bg-brand-50 p-4 text-sm text-brand-800 dark:bg-white/5 dark:text-slate-200">
                          Améliorez votre niveau avec TCF Express <ArrowUpRight className="shrink-0 text-maple-500" />
                        </a>
                      )}
                    </>
                  )}

                  <div className="flex items-center justify-between gap-3 border-t border-brand-900/8 pt-6 dark:border-white/10">
                    <button type="button" onClick={() => setStep(step - 1)} disabled={step === 0} className="btn-ghost disabled:invisible"><ArrowLeft /> Retour</button>
                    <button type="submit" className={step === 2 ? 'btn-primary' : 'btn-dark'}>{step === 2 ? 'Voir mon résultat' : 'Continuer'} <ArrowRight weight="bold" /></button>
                  </div>
                </motion.form>
              </AnimatePresence>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <CheckCircle size={48} weight="duotone" className="text-maple-500" />
              <h2 className="mt-4 text-2xl font-bold text-brand-800 dark:text-white">Voici les parcours adaptés à votre profil</h2>
              <p className="muted mt-2">D’après vos réponses, ces options méritent d’être étudiées :</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {(recs.length ? recs : services.slice(0, 2)).map((s) => (
                  <Link key={s.slug} to={`/services/${s.slug}`} className="flex items-center gap-3 rounded-2xl border border-brand-900/10 p-4 transition hover:border-brand-500/40 dark:border-white/10">
                    <s.icon size={26} weight="duotone" className="shrink-0 text-brand-600 dark:text-brand-300" />
                    <span className="font-semibold text-brand-800 dark:text-white">{s.title}</span>
                  </Link>
                ))}
              </div>
              <h3 className="mt-10 font-semibold text-brand-800 dark:text-white">Allez plus loin avec nos outils</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {[
                  ['/outils/test-admissibilite', 'Test des 67 points'],
                  ['/outils/calculateur-scg', 'Mon score SCG'],
                  [`/outils/estimateur-cout${d.goal && d.goal !== 'inconnu' ? `?service=${d.goal}` : ''}`, 'Estimer mon budget'],
                ].map(([to, l]) => (
                  <Link key={to} to={to} className="flex items-center justify-between gap-2 rounded-2xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800 transition hover:bg-brand-100 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">{l} <ArrowRight className="shrink-0 text-maple-500" /></Link>
                ))}
              </div>
              <div className="mt-8 rounded-2xl border border-brand-900/10 p-5 dark:border-white/10">
                <p className="font-semibold text-brand-800 dark:text-white">Envie d’un avis personnalisé ?</p>
                <p className="muted mt-1 text-sm">Facultatif : envoyez ce résumé à un conseiller en un clic. Aucune inscription demandée.</p>
                <a href={whatsappLink(summary)} target="_blank" rel="noopener" className="btn mt-4 bg-[#1fa855] text-white hover:bg-[#188a45]"><WhatsappLogo size={18} weight="fill" /> Parler à un conseiller</a>
              </div>
              <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">Orientation automatique et indicative, qui ne remplace pas une étude personnalisée de votre dossier.</p>
              <button onClick={() => { setDone(false); setStep(0); setD(empty) }} className="mt-6 text-sm font-semibold text-slate-500 underline underline-offset-2">Recommencer</button>
            </motion.div>
          )}
        </div>
      </section>
    </>
  )
}
