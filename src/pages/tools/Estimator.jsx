import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { FilePdf, CheckCircle, SpinnerGap, ArrowLeft, ArrowRight, PencilSimple, WhatsappLogo } from '@phosphor-icons/react'
import { PageHeader } from '../../components/ui.jsx'
import { Field } from '../../components/form.jsx'
import { Disclaimer, OtherTools } from '../../components/ToolKit.jsx'
import { services, getService } from '../../data/services.js'
import { buildEstimate, defaultOptions, questionsFor, acquisList } from '../../data/estimator.js'
import { whatsappLink } from '../../config/site.js'

function Stepper({ label, value, onChange, min, max }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-300 px-5 py-4 dark:border-white/15">
      <span className="font-medium text-ink dark:text-slate-100">{label}</span>
      <div className="flex items-center gap-2">
        <button type="button" aria-label={`Moins : ${label}`} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="grid size-11 place-items-center rounded-full border border-slate-300 text-lg font-bold text-brand-700 transition hover:bg-brand-50 disabled:opacity-40 dark:border-white/15 dark:text-white">-</button>
        <span className="w-10 text-center font-display text-2xl font-bold text-brand-800 dark:text-white" aria-live="polite">{value}</span>
        <button type="button" aria-label={`Plus : ${label}`} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="grid size-11 place-items-center rounded-full border border-slate-300 text-lg font-bold text-brand-700 transition hover:bg-brand-50 disabled:opacity-40 dark:border-white/15 dark:text-white">+</button>
      </div>
    </div>
  )
}

export default function Estimator() {
  const [params] = useSearchParams()
  const preset = getService(params.get('service')) ? params.get('service') : null
  const reduce = useReducedMotion()

  const [slug, setSlug] = useState(preset)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [options, setOptions] = useState(() => (preset ? defaultOptions(preset) : {}))
  const [answered, setAnswered] = useState({}) // questions auxquelles le client a répondu
  const [step, setStep] = useState(preset ? 1 : 0)
  const [client, setClient] = useState({ name: '', phone: '' })
  const [state, setState] = useState('idle')
  const [number, setNumber] = useState('')

  const service = slug ? getService(slug) : null
  const single = slug === 'equivalence-de-diplomes'
  const questions = slug ? questionsFor(slug) : []

  // Étapes : procédure, (personnes), une question à la fois, puis le proforma
  const steps = useMemo(() => {
    const s = [{ id: 'service' }]
    if (slug && !single) s.push({ id: 'people' })
    questions.forEach((q) => s.push({ id: 'q', q }))
    s.push({ id: 'final' })
    return s
  }, [slug, single, questions])
  const current = steps[Math.min(step, steps.length - 1)]
  const next = () => setStep((n) => Math.min(n + 1, steps.length - 1))
  const back = () => setStep((n) => Math.max(0, n - 1))

  const chooseService = (s) => {
    if (s !== slug) { setSlug(s); setOptions(defaultOptions(s)); setAnswered({}); if (s === 'equivalence-de-diplomes') { setAdults(1); setChildren(0) } }
    setStep(1)
  }
  const answer = (q, yes) => {
    setOptions((o) => ({ ...o, [q.key]: q.kind === 'have' ? !yes : yes }))
    setAnswered((a) => ({ ...a, [q.key]: yes }))
    next()
  }

  const download = async () => {
    setState('busy')
    try {
      const est = buildEstimate(slug, { adults, children, options })
      const { generateProforma } = await import('../../lib/proforma.js')
      const n = await generateProforma({ estimate: est, serviceTitle: service.title, client, adults, children, acquis: acquisList(slug, options) })
      setNumber(n); setState('done')
    } catch (e) { console.error(e); setState('error') }
  }

  const progress = Math.round((step / (steps.length - 1)) * 100)
  const anim = reduce ? {} : { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 }, transition: { duration: 0.25 } }
  const recap = questions.filter((q) => q.key in answered)

  return (
    <>
      <PageHeader title="Estimateur de coût" text="Quelques questions sur votre situation, une à la fois. À la fin, vous recevez votre proforma personnalisé en PDF." />
      <section className="container-x mt-12 max-w-3xl">
        <div className="card overflow-hidden">
          <div className="h-1.5 bg-brand-50 dark:bg-white/10" aria-hidden>
            <div className="h-full bg-maple-500 transition-[width] duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="p-6 md:p-10">
            <div className="mb-6 flex items-center justify-between gap-3 text-sm">
              {step > 0 && current.id !== 'final' ? (
                <button type="button" onClick={back} className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-brand-600"><ArrowLeft /> Retour</button>
              ) : <span />}
              {service && <span className="truncate font-medium text-brand-700 dark:text-brand-200">{service.title}</span>}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={current.id === 'q' ? current.q.key : current.id} {...anim}>
                {current.id === 'service' && (
                  <>
                    <h2 className="text-2xl font-bold text-brand-800 md:text-3xl dark:text-white">Quelle procédure vous intéresse ?</h2>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {services.map((s) => (
                        <button key={s.slug} type="button" onClick={() => chooseService(s.slug)}
                          className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition hover:border-brand-500 ${slug === s.slug ? 'border-brand-600 bg-brand-50 dark:bg-white/5' : 'border-slate-300 dark:border-white/15'}`}>
                          <s.icon size={26} weight="duotone" className="shrink-0 text-brand-600 dark:text-brand-300" />
                          <span className="font-semibold text-ink dark:text-slate-100">{s.title}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {current.id === 'people' && (
                  <>
                    <h2 className="text-2xl font-bold text-brand-800 md:text-3xl dark:text-white">Combien de personnes sont concernées ?</h2>
                    <div className="mt-6 grid gap-3">
                      <Stepper label="Adultes (vous compris)" value={adults} onChange={setAdults} min={1} max={4} />
                      <Stepper label="Enfants à charge" value={children} onChange={setChildren} min={0} max={6} />
                    </div>
                    <button type="button" onClick={next} className="btn-dark mt-8">Continuer <ArrowRight weight="bold" /></button>
                  </>
                )}

                {current.id === 'q' && (
                  <>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Question {questions.indexOf(current.q) + 1} sur {questions.length}</p>
                    <h2 className="mt-2 text-2xl font-bold leading-snug text-brand-800 md:text-3xl dark:text-white">{current.q.text}</h2>
                    <div className="mt-8 grid grid-cols-2 gap-3">
                      {[[true, 'Oui'], [false, 'Non']].map(([v, l]) => (
                        <button key={l} type="button" onClick={() => answer(current.q, v)}
                          className={`rounded-2xl border-2 px-6 py-5 font-display text-xl font-bold transition hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-white/5 ${answered[current.q.key] === v ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-white' : 'border-slate-300 text-ink dark:border-white/15 dark:text-slate-100'}`}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {current.id === 'final' && (
                  <>
                    <CheckCircle size={48} weight="duotone" className="text-maple-500" />
                    <h2 className="mt-4 text-2xl font-bold text-brand-800 md:text-3xl dark:text-white">Votre proforma est prêt</h2>
                    <p className="muted mt-2">Il tient compte de votre procédure, de votre famille et de tout ce que vous avez déjà.</p>

                    {recap.length > 0 && (
                      <div className="mt-6 rounded-2xl bg-brand-50 p-4 dark:bg-white/5">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-brand-800 dark:text-white">Vos réponses</p>
                          <button type="button" onClick={() => setStep(steps.findIndex((s) => s.id === 'q'))} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-200"><PencilSimple /> Modifier</button>
                        </div>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {!single && <li className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 dark:bg-brand-900 dark:text-slate-200">{adults} adulte(s){children ? `, ${children} enfant(s)` : ''}</li>}
                          {acquisList(slug, options).map((a) => <li key={a} className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 dark:bg-brand-900 dark:text-slate-200">Déjà fait : {a}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <Field id="p-name" label="Nom (facultatif)"><input id="p-name" className="field" autoComplete="name" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} /></Field>
                      <Field id="p-phone" label="Téléphone (facultatif)"><input id="p-phone" type="tel" className="field" autoComplete="tel" value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} /></Field>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Ces informations apparaissent seulement sur votre document.</p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button type="button" onClick={download} disabled={state === 'busy'} className="btn-primary px-6 py-3.5 text-base disabled:opacity-70">
                        {state === 'busy' ? <SpinnerGap className="animate-spin" size={18} /> : <FilePdf size={18} weight="fill" />}
                        {state === 'busy' ? 'Création du PDF...' : 'Télécharger mon proforma'}
                      </button>
                      <a href={whatsappLink(`Bonjour, je viens de demander un proforma sur votre site pour : ${service?.title}${number ? ` (n° ${number})` : ''}. J'aimerais en discuter.`)} target="_blank" rel="noopener" className="btn bg-[#1fa855] text-white hover:bg-[#188a45]">
                        <WhatsappLogo size={18} weight="fill" /> Parler à un conseiller
                      </a>
                    </div>
                    {state === 'done' && <p className="mt-3 flex items-center gap-2 text-sm font-medium text-brand-700 dark:text-brand-200"><CheckCircle weight="fill" /> Proforma n° {number} téléchargé. Ouvrez-le pour voir le détail de votre budget.</p>}
                    {state === 'error' && <p className="mt-3 text-sm font-medium text-maple-600">Le PDF n’a pas pu être créé. Réessayez ou contactez-nous sur WhatsApp.</p>}
                    <button type="button" onClick={() => { setStep(0); setState('idle'); setNumber('') }} className="mt-6 text-sm font-semibold text-slate-500 underline underline-offset-2">Faire une autre estimation</button>
                    <Disclaimer>Estimation indicative. Frais officiels selon la grille IRCC et le MIFI, frais annexes estimés. Les montants définitifs sont confirmés par votre conseiller.</Disclaimer>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
      <OtherTools current="estimateur-cout" />
    </>
  )
}
