import { useState } from 'react'
import { Link } from 'react-router-dom'
import { tcfTable, tcfToNclc } from '../data/rules.js'

export function Field({ label, hint, children, id }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="field-label">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  )
}

export function Select({ id, value, onChange, options }) {
  return (
    <select id={id} className="field" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
    </select>
  )
}

export function Num({ id, value, onChange, min = 0, max = 99 }) {
  return (
    <input
      id={id} type="number" inputMode="numeric" min={min} max={max} className="field"
      value={value}
      onChange={(e) => {
        const v = e.target.value === '' ? '' : Math.max(min, Math.min(max, Number(e.target.value)))
        onChange(v)
      }}
    />
  )
}

export function YesNo({ label, value, onChange, hint }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="field-label">{label}</span>
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={label}>
        {[[true, 'Oui'], [false, 'Non']].map(([v, l]) => (
          <button
            key={l} type="button" role="radio" aria-checked={value === v} onClick={() => onChange(v)}
            className={`rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${value === v ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white text-ink hover:border-brand-400 dark:border-white/15 dark:bg-brand-950 dark:text-slate-100'}`}
          >
            {l}
          </button>
        ))}
      </div>
      {hint && <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  )
}

const nclcOptions = [
  { v: 0, label: 'Aucun / moins de 4' },
  ...[4, 5, 6, 7, 8, 9, 10].map((n) => ({ v: n, label: n === 10 ? 'NCLC 10 ou plus' : `NCLC ${n}` })),
]
const skills = ['co', 'ce', 'ee', 'eo']

// Saisie des 4 compétences linguistiques, en niveaux NCLC ou en notes TCF Canada
export function LangInput({ value, onChange, idPrefix, allowTcf = true }) {
  const [mode, setMode] = useState('nclc')
  const [scores, setScores] = useState({ co: '', ce: '', ee: '', eo: '' })
  const setScore = (k, v) => {
    const next = { ...scores, [k]: v }
    setScores(next)
    const n = tcfToNclc(k, v)
    onChange({ ...value, [k]: n === null ? 0 : n < 4 ? 0 : n })
  }
  return (
    <div className="rounded-2xl border border-brand-900/10 p-4 dark:border-white/10">
      {allowTcf && (
        <div className="mb-4 inline-flex rounded-full bg-brand-50 p-1 text-xs font-semibold dark:bg-white/5">
          {[['nclc', 'Je connais mes niveaux NCLC'], ['tcf', 'J’ai mes notes TCF Canada']].map(([m, l]) => (
            <button key={m} type="button" onClick={() => setMode(m)} className={`rounded-full px-3 py-1.5 transition ${mode === m ? 'bg-white text-brand-700 shadow-sm dark:bg-brand-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{l}</button>
          ))}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {skills.map((k) => (
          <Field key={k} id={`${idPrefix}-${k}`} label={tcfTable[k].label}
            hint={mode === 'tcf' ? `Note sur ${tcfTable[k].max}${scores[k] !== '' ? ` : NCLC ${value[k] || 'inférieur à 4'}` : ''}` : undefined}>
            {mode === 'nclc' ? (
              <select id={`${idPrefix}-${k}`} className="field" value={value[k]} onChange={(e) => onChange({ ...value, [k]: Number(e.target.value) })}>
                {nclcOptions.map((o) => <option key={o.v} value={o.v}>{o.label}</option>)}
              </select>
            ) : (
              <Num id={`${idPrefix}-${k}`} value={scores[k]} onChange={(v) => setScore(k, v)} max={tcfTable[k].max} />
            )}
          </Field>
        ))}
      </div>
      {allowTcf && mode === 'nclc' && (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Vous ne connaissez pas vos niveaux ? <Link to="/outils/calculateur-nclc" className="font-semibold text-brand-600 underline underline-offset-2 dark:text-brand-200">Convertissez vos notes TCF</Link>.</p>
      )}
    </div>
  )
}

export function Card({ title, children, className = '' }) {
  return (
    <section className={`card p-6 md:p-8 ${className}`}>
      {title && <h2 className="mb-6 text-xl font-bold text-brand-800 dark:text-white">{title}</h2>}
      <div className="grid gap-5">{children}</div>
    </section>
  )
}
