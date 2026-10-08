import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FilePdf, CheckCircle, SpinnerGap } from '@phosphor-icons/react'
import { PageHeader } from '../../components/ui.jsx'
import { Card, Field, Select } from '../../components/form.jsx'
import { ResultCta, Disclaimer, OtherTools } from '../../components/ToolKit.jsx'
import { services, getService } from '../../data/services.js'
import { buildEstimate, defaultOptions, questionsFor, acquisList } from '../../data/estimator.js'
import Questionnaire from '../../components/Questionnaire.jsx'
import { xaf, cad, CAD_TO_XAF, RATE_DATE } from '../../config/tarifs.js'

function Stepper({ label, value, onChange, min, max }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="field-label">{label}</span>
      <div className="flex items-center gap-2">
        <button type="button" aria-label={`Moins : ${label}`} onClick={() => onChange(Math.max(min, value - 1))} className="grid size-11 place-items-center rounded-full border border-slate-300 text-lg font-bold text-brand-700 transition hover:bg-brand-50 disabled:opacity-40 dark:border-white/15 dark:text-white" disabled={value <= min}>-</button>
        <span className="w-10 text-center font-display text-2xl font-bold text-brand-800 dark:text-white" aria-live="polite">{value}</span>
        <button type="button" aria-label={`Plus : ${label}`} onClick={() => onChange(Math.min(max, value + 1))} className="grid size-11 place-items-center rounded-full border border-slate-300 text-lg font-bold text-brand-700 transition hover:bg-brand-50 disabled:opacity-40 dark:border-white/15 dark:text-white" disabled={value >= max}>+</button>
      </div>
    </div>
  )
}

export default function Estimator() {
  const [params] = useSearchParams()
  const initial = getService(params.get('service')) ? params.get('service') : 'etudes-au-canada'
  const [slug, setSlug] = useState(initial)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [options, setOptions] = useState(() => defaultOptions(initial))
  const [client, setClient] = useState({ name: '', phone: '', email: '' })
  const [state, setState] = useState('idle') // idle | busy | done | error
  const [number, setNumber] = useState('')

  const changeService = (s) => { setSlug(s); setOptions(defaultOptions(s)); if (s === 'equivalence-de-diplomes') { setAdults(1); setChildren(0) } }
  const est = useMemo(() => buildEstimate(slug, { adults, children, options }), [slug, adults, children, options])
  const service = getService(slug)
  const single = slug === 'equivalence-de-diplomes'

  const download = async () => {
    setState('busy')
    try {
      const { generateProforma } = await import('../../lib/proforma.js')
      const n = await generateProforma({ estimate: est, serviceTitle: service.title, client, adults, children, acquis: acquisList(slug, options) })
      setNumber(n); setState('done')
    } catch (e) {
      console.error(e); setState('error')
    }
  }

  const summary = `Bonjour, j'ai estimé le coût de ma procédure "${service.title}" sur votre site (${adults} adulte(s), ${children} enfant(s)) : environ ${xaf(est.total)}.${number ? ` Proforma n° ${number}.` : ''} J'aimerais en discuter.`

  return (
    <>
      <PageHeader title="Estimateur de coût" text="Choisissez votre procédure : nous calculons nos honoraires, les frais officiels et les frais annexes, puis vous téléchargez votre proforma." />
      <div className="container-x mt-12 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
        <div className="grid gap-6">
          <Card title="Votre procédure">
            <Field id="s-svc" label="Procédure">
              <Select id="s-svc" value={slug} onChange={changeService} options={services.map((s) => ({ v: s.slug, label: s.title }))} />
            </Field>
            {!single && (
              <div className="grid gap-5 sm:grid-cols-2">
                <Stepper label="Adultes (vous compris)" value={adults} onChange={setAdults} min={1} max={4} />
                <Stepper label="Enfants à charge" value={children} onChange={setChildren} min={0} max={6} />
              </div>
            )}
          </Card>

          {questionsFor(slug).length > 0 && (
            <Card title="Où en êtes-vous ?">
              <p className="muted -mt-3 text-sm">Répondez à ces questions : ce que vous avez déjà est retiré automatiquement de votre devis.</p>
              <Questionnaire slug={slug} options={options} onChange={setOptions} />
            </Card>
          )}

          <Card title="Détail de l’estimation">
            {est.groups.map((g) => (
              <div key={g.key}>
                <h3 className="mb-2 text-sm font-bold text-brand-700 dark:text-brand-200">{g.title}</h3>
                <ul className="divide-y divide-brand-900/8 dark:divide-white/8">
                  {g.lines.map((l) => (
                    <li key={l.label} className="flex items-start justify-between gap-4 py-2.5 text-sm">
                      <span className="text-slate-700 dark:text-slate-200">{l.label}{l.qty > 1 && <span className="text-slate-500"> × {l.qty}</span>}{l.cad != null && <span className="block text-xs text-slate-500">{cad(l.cad)}{l.qty > 1 ? ' chacun' : ''}</span>}</span>
                      <span className={`shrink-0 font-semibold ${est.toXaf(l) < 0 ? 'text-brand-600 dark:text-brand-200' : 'text-brand-800 dark:text-white'}`}>{xaf(est.toXaf(l))}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-1 flex justify-between border-t border-brand-900/15 pt-2 text-sm font-bold text-brand-800 dark:border-white/20 dark:text-white"><span>Sous-total</span><span>{xaf(g.total)}</span></p>
              </div>
            ))}
            {est.notes.length > 0 && (
              <ul className="list-disc space-y-1 rounded-2xl bg-brand-50 p-4 pl-8 text-sm text-brand-800 dark:bg-white/5 dark:text-slate-200">
                {est.notes.map((n) => <li key={n}>{n}</li>)}
              </ul>
            )}
          </Card>
        </div>

        <aside className="card p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-bold text-brand-800 dark:text-white">Budget total estimé</h2>
          <p className="mt-3 font-display text-4xl font-bold text-maple-500" aria-live="polite">{xaf(est.total)}</p>
          <ul className="mt-4 space-y-1 text-sm">
            {est.groups.map((g) => <li key={g.key} className="flex justify-between"><span className="muted">{g.title}</span><span className="font-semibold text-brand-800 dark:text-white">{xaf(g.total)}</span></li>)}
          </ul>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Taux indicatif : 1 $ CA = {CAD_TO_XAF} FCFA ({RATE_DATE}).</p>

          <div className="mt-6 border-t border-brand-900/8 pt-6 dark:border-white/10">
            <h3 className="font-semibold text-brand-800 dark:text-white">Votre proforma PDF</h3>
            <p className="muted mt-1 text-sm">Ces champs sont facultatifs : ils s’affichent seulement sur votre document.</p>
            <div className="mt-4 grid gap-3">
              <Field id="p-name" label="Nom (facultatif)"><input id="p-name" className="field" autoComplete="name" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} /></Field>
              <Field id="p-phone" label="Téléphone (facultatif)"><input id="p-phone" type="tel" className="field" autoComplete="tel" value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} /></Field>
            </div>
            <button type="button" onClick={download} disabled={state === 'busy'} className="btn-primary mt-4 w-full disabled:opacity-70">
              {state === 'busy' ? <SpinnerGap className="animate-spin" size={18} /> : <FilePdf size={18} weight="fill" />}
              {state === 'busy' ? 'Création du PDF...' : 'Télécharger mon proforma'}
            </button>
            {state === 'done' && <p className="mt-3 flex items-center gap-2 text-sm font-medium text-brand-700 dark:text-brand-200"><CheckCircle weight="fill" /> Proforma n° {number} téléchargé.</p>}
            {state === 'error' && <p className="mt-3 text-sm font-medium text-maple-600">Le PDF n’a pas pu être créé. Réessayez ou contactez-nous sur WhatsApp.</p>}
          </div>
          <ResultCta summary={summary} label="Valider ce budget avec un conseiller" />
          <Disclaimer>Estimation indicative. Frais officiels selon la grille IRCC et le MIFI (octobre 2026), frais de tiers estimés. Les montants définitifs sont confirmés par votre conseiller.</Disclaimer>
        </aside>
      </div>
      <OtherTools current="estimateur-cout" />
    </>
  )
}
