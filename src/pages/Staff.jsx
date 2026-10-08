import { useEffect, useMemo, useState } from 'react'
import { LockKey, Plus, Trash, ArrowCounterClockwise, FilePdf, SpinnerGap, CheckCircle, FilePlus, SignOut } from '@phosphor-icons/react'
import { PageHeader } from '../components/ui.jsx'
import { Card, Field, Select } from '../components/form.jsx'
import Questionnaire from '../components/Questionnaire.jsx'
import { services, getService } from '../data/services.js'
import { buildEstimate, defaultOptions, acquisList } from '../data/estimator.js'
import { CAD_TO_XAF, STAFF_PIN, xaf } from '../config/tarifs.js'

const KEY = 'vc-devis-brouillon'
const GROUPS = [['h', 'Honoraires Vision Consulting'], ['o', 'Frais officiels (gouvernement)'], ['t', 'Frais de tiers estimés']]
let uid = 0
const nid = () => `l${Date.now().toString(36)}${uid++}`
const toXaf = (l) => (Number(l.qty) || 0) * (Number(l.unit) || 0) * (l.currency === 'CAD' ? CAD_TO_XAF : 1)

function fromTemplate(slug, adults, children, options) {
  const est = buildEstimate(slug, { adults, children, options })
  const byKey = Object.fromEntries(est.groups.map((g) => [g.key, g]))
  return {
    groups: GROUPS.map(([key, title]) => ({
      key, title,
      lines: (byKey[key]?.lines || []).map((l) => ({ id: nid(), label: l.label, qty: l.qty, unit: l.cad != null ? l.cad : l.xaf, currency: l.cad != null ? 'CAD' : 'XAF' })),
    })),
    notes: est.notes,
  }
}

const blank = () => {
  const slug = 'etudes-au-canada'
  const options = defaultOptions(slug)
  const t = fromTemplate(slug, 1, 0, options)
  return { client: { name: '', phone: '', email: '', city: '' }, advisor: '', slug, adults: 1, children: 0, options, groups: t.groups, autoNotes: t.notes, notes: '', dirty: false }
}

function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY)); if (d?.groups) return d } catch { /* rien */ }
  return blank()
}

function Gate({ onOk }) {
  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)
  return (
    <section className="container-x mt-16 max-w-md">
      <form className="card p-8" onSubmit={(e) => { e.preventDefault(); if (pin === STAFF_PIN) onOk(); else setErr(true) }}>
        <LockKey size={40} weight="duotone" className="text-maple-500" />
        <h2 className="mt-4 text-2xl font-bold text-brand-800 dark:text-white">Accès réservé à l’équipe</h2>
        <p className="muted mt-2 text-sm">Entrez le code d’accès de l’espace conseiller.</p>
        <div className="mt-6"><Field id="pin" label="Code d’accès"><input id="pin" type="password" inputMode="numeric" className="field" value={pin} onChange={(e) => { setPin(e.target.value); setErr(false) }} autoFocus /></Field></div>
        {err && <p className="mt-2 text-sm font-medium text-maple-600">Code incorrect.</p>}
        <button className="btn-primary mt-6 w-full">Entrer</button>
      </form>
    </section>
  )
}

export default function Staff() {
  const [ok, setOk] = useState(() => { try { return sessionStorage.getItem('vc-staff') === '1' } catch { return false } })
  const [d, setD] = useState(load)
  const [state, setState] = useState('idle')
  const [number, setNumber] = useState('')

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(d)) } catch { /* stockage indisponible */ } }, [d])

  // Tant que les lignes n'ont pas été modifiées à la main, elles suivent le modèle.
  const applyTemplate = (patch) => setD((o) => {
    const n = { ...o, ...patch }
    if (o.dirty && !patch.force) return n
    const t = fromTemplate(n.slug, n.adults, n.children, n.options)
    return { ...n, groups: t.groups, autoNotes: t.notes, dirty: false }
  })
  const setLine = (gk, id, patch) => setD((o) => ({ ...o, dirty: true, groups: o.groups.map((g) => g.key !== gk ? g : { ...g, lines: g.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)) }) }))
  const addLine = (gk, line = {}) => setD((o) => ({ ...o, dirty: true, groups: o.groups.map((g) => g.key !== gk ? g : { ...g, lines: [...g.lines, { id: nid(), label: '', qty: 1, unit: 0, currency: 'XAF', ...line }] }) }))
  const delLine = (gk, id) => setD((o) => ({ ...o, dirty: true, groups: o.groups.map((g) => g.key !== gk ? g : { ...g, lines: g.lines.filter((l) => l.id !== id) }) }))

  const totals = useMemo(() => {
    const groups = d.groups.map((g) => ({ ...g, total: g.lines.reduce((t, l) => t + toXaf(l), 0) }))
    return { groups, total: groups.reduce((t, g) => t + g.total, 0) }
  }, [d.groups])

  if (!ok) return (<><PageHeader title="Espace conseiller" /><Gate onOk={() => { setOk(true); try { sessionStorage.setItem('vc-staff', '1') } catch { /* rien */ } }} /></>)

  const service = getService(d.slug)
  const generate = async () => {
    setState('busy')
    try {
      const { generateProforma } = await import('../lib/proforma.js')
      const groups = totals.groups.filter((g) => g.lines.length).map((g) => ({
        key: g.key, title: g.title, total: g.total,
        lines: g.lines.map((l) => ({ label: l.label || 'Prestation', qty: Number(l.qty) || 0, ...(l.currency === 'CAD' ? { cad: Number(l.unit) || 0 } : { xaf: Number(l.unit) || 0 }) })),
      }))
      const est = { groups, total: totals.total, notes: d.autoNotes || [], toXaf: (l) => (l.cad != null ? l.cad * l.qty * CAD_TO_XAF : l.xaf * l.qty) }
      const n = await generateProforma({
        estimate: est, serviceTitle: service.title, client: d.client, adults: d.adults, children: d.children,
        acquis: acquisList(d.slug, d.options), advisor: d.advisor, extraNotes: d.notes.split('\n').map((x) => x.trim()),
      })
      setNumber(n); setState('done')
    } catch (e) { console.error(e); setState('error') }
  }

  return (
    <>
      <PageHeader title="Espace conseiller : devis et proforma" text="Remplissez le devis d’un client, ajustez chaque ligne, puis générez le proforma PDF à lui envoyer." />
      <div className="container-x mt-10 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="grid gap-6">
          <Card title="1. Client">
            <div className="grid gap-4 sm:grid-cols-2">
              {[['name', 'Nom complet'], ['phone', 'Téléphone'], ['email', 'E-mail'], ['city', 'Ville']].map(([k, l]) => (
                <Field key={k} id={`c-${k}`} label={l}><input id={`c-${k}`} className="field" value={d.client[k]} onChange={(e) => setD({ ...d, client: { ...d.client, [k]: e.target.value } })} /></Field>
              ))}
              <Field id="c-adv" label="Conseiller (imprimé sous la signature)"><input id="c-adv" className="field" value={d.advisor} onChange={(e) => setD({ ...d, advisor: e.target.value })} /></Field>
            </div>
          </Card>

          <Card title="2. Procédure et situation">
            <Field id="c-svc" label="Procédure">
              <Select id="c-svc" value={d.slug} onChange={(slug) => applyTemplate({ slug, options: defaultOptions(slug) })} options={services.map((s) => ({ v: s.slug, label: s.title }))} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="c-ad" label="Adultes"><input id="c-ad" type="number" min="1" max="8" className="field" value={d.adults} onChange={(e) => applyTemplate({ adults: Math.max(1, Number(e.target.value) || 1) })} /></Field>
              <Field id="c-ch" label="Enfants"><input id="c-ch" type="number" min="0" max="10" className="field" value={d.children} onChange={(e) => applyTemplate({ children: Math.max(0, Number(e.target.value) || 0) })} /></Field>
            </div>
            <p className="field-label">Ce que le client a déjà</p>
            <Questionnaire slug={d.slug} options={d.options} onChange={(options) => applyTemplate({ options })} compact />
          </Card>

          <Card title="3. Lignes du devis">
            {d.dirty && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-200">
                Lignes modifiées à la main : elles ne suivent plus le modèle.
                <button type="button" onClick={() => applyTemplate({ force: true })} className="inline-flex items-center gap-1 font-semibold underline"><ArrowCounterClockwise /> Recalculer depuis le modèle</button>
              </div>
            )}
            {totals.groups.map((g) => (
              <div key={g.key}>
                <h3 className="mb-2 text-sm font-bold text-brand-700 dark:text-brand-200">{g.title}</h3>
                <div className="grid gap-2">
                  {g.lines.map((l) => (
                    <div key={l.id} className="grid grid-cols-[1fr_auto] gap-2 rounded-2xl border border-slate-200 p-2 sm:grid-cols-[1fr_64px_120px_100px_auto] sm:items-center dark:border-white/10">
                      <input aria-label="Désignation" className="field col-span-2 py-2 text-sm sm:col-span-1" value={l.label} placeholder="Désignation" onChange={(e) => setLine(g.key, l.id, { label: e.target.value })} />
                      <input aria-label="Quantité" type="number" className="field py-2 text-sm" value={l.qty} onChange={(e) => setLine(g.key, l.id, { qty: e.target.value })} />
                      <input aria-label="Prix unitaire" type="number" className="field py-2 text-sm" value={l.unit} onChange={(e) => setLine(g.key, l.id, { unit: e.target.value })} />
                      <select aria-label="Devise" className="field py-2 text-sm" value={l.currency} onChange={(e) => setLine(g.key, l.id, { currency: e.target.value })}><option value="XAF">FCFA</option><option value="CAD">$ CA</option></select>
                      <button type="button" aria-label="Supprimer la ligne" onClick={() => delLine(g.key, l.id)} className="grid size-10 place-items-center justify-self-end rounded-full text-slate-500 hover:bg-maple-500/10 hover:text-maple-600"><Trash size={18} /></button>
                      <p className="col-span-2 text-right text-xs text-slate-500 sm:col-span-5">= {xaf(toXaf(l))}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" onClick={() => addLine(g.key)} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-brand-600 hover:bg-brand-50 dark:text-brand-200 dark:hover:bg-white/5"><Plus /> Ajouter une ligne</button>
                  {g.key === 'h' && <button type="button" onClick={() => addLine('h', { label: 'Remise commerciale', unit: -50000 })} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-maple-600 hover:bg-maple-500/10"><Plus /> Ajouter une remise</button>}
                </div>
                <p className="mt-2 flex justify-between border-t border-brand-900/10 pt-2 text-sm font-bold text-brand-800 dark:border-white/15 dark:text-white"><span>Sous-total</span><span>{xaf(g.total)}</span></p>
              </div>
            ))}
          </Card>

          <Card title="4. Remarques pour le client">
            <Field id="c-notes" label="Une remarque par ligne (facultatif)" hint="Ex. : Paiement en 3 tranches accepté. Rendez-vous biométrie à Yaoundé.">
              <textarea id="c-notes" rows="4" className="field" value={d.notes} onChange={(e) => setD({ ...d, notes: e.target.value })} />
            </Field>
          </Card>
        </div>

        <aside className="card p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-bold text-brand-800 dark:text-white">Total du devis</h2>
          <p className="mt-3 font-display text-4xl font-bold text-maple-500">{xaf(totals.total)}</p>
          <ul className="mt-4 space-y-1 text-sm">
            {totals.groups.map((g) => <li key={g.key} className="flex justify-between"><span className="muted">{g.title}</span><span className="font-semibold text-brand-800 dark:text-white">{xaf(g.total)}</span></li>)}
          </ul>
          {acquisList(d.slug, d.options).length > 0 && <p className="mt-4 rounded-2xl bg-brand-50 p-3 text-xs text-brand-800 dark:bg-white/5 dark:text-slate-200">Déjà fourni, non facturé : {acquisList(d.slug, d.options).join(', ')}.</p>}
          <button type="button" onClick={generate} disabled={state === 'busy'} className="btn-primary mt-6 w-full disabled:opacity-70">
            {state === 'busy' ? <SpinnerGap className="animate-spin" size={18} /> : <FilePdf size={18} weight="fill" />} Générer le proforma
          </button>
          {state === 'done' && <p className="mt-3 flex items-center gap-2 text-sm font-medium text-brand-700 dark:text-brand-200"><CheckCircle weight="fill" /> Proforma n° {number} téléchargé.</p>}
          {state === 'error' && <p className="mt-3 text-sm font-medium text-maple-600">Le PDF n’a pas pu être créé.</p>}
          <div className="mt-6 grid gap-2 border-t border-brand-900/8 pt-4 dark:border-white/10">
            <button type="button" onClick={() => { if (confirm('Effacer ce devis et en commencer un nouveau ?')) { setD(blank()); setState('idle') } }} className="btn-ghost"><FilePlus /> Nouveau devis</button>
            <button type="button" onClick={() => { try { sessionStorage.removeItem('vc-staff') } catch { /* rien */ } setOk(false) }} className="inline-flex items-center justify-center gap-1 text-sm text-slate-500 hover:text-brand-600"><SignOut /> Verrouiller</button>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Le brouillon est enregistré automatiquement sur cet appareil.</p>
        </aside>
      </div>
    </>
  )
}
