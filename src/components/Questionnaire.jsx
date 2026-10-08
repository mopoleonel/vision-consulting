import { CheckCircle } from '@phosphor-icons/react'
import { questionsFor } from '../data/estimator.js'

// Sondage « Ce que vous avez déjà » : chaque réponse ajoute ou retire des lignes du devis.
export default function Questionnaire({ slug, options, onChange, compact = false }) {
  const qs = questionsFor(slug)
  if (!qs.length) return null
  const answer = (q, yes) => onChange({ ...options, [q.key]: q.kind === 'have' ? !yes : yes })
  const isYes = (q) => (q.kind === 'have' ? options[q.key] === false : options[q.key] === true)
  return (
    <ul className={`grid ${compact ? 'gap-2' : 'gap-3'}`}>
      {qs.map((q) => {
        const yes = isYes(q)
        const acquired = q.kind === 'have' && yes
        return (
          <li key={q.key} className={`flex flex-col gap-3 rounded-2xl border px-4 py-3 transition sm:flex-row sm:items-center sm:justify-between ${acquired ? 'border-brand-500/40 bg-brand-50 dark:border-white/20 dark:bg-white/5' : 'border-slate-300 dark:border-white/15'}`}>
            <span className="flex items-start gap-2 text-sm text-ink dark:text-slate-100">
              {acquired && <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-brand-600 dark:text-brand-300" />}
              <span>{q.text}{acquired && <span className="block text-xs text-brand-700 dark:text-brand-200">Déjà acquis : retiré du devis</span>}</span>
            </span>
            <span className="inline-flex shrink-0 rounded-full bg-slate-100 p-1 dark:bg-white/5" role="radiogroup" aria-label={q.text}>
              {[[true, 'Oui'], [false, 'Non']].map(([v, l]) => (
                <button key={l} type="button" role="radio" aria-checked={yes === v} onClick={() => answer(q, v)}
                  className={`min-w-14 rounded-full px-3 py-1.5 text-xs font-semibold transition ${yes === v ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300'}`}>
                  {l}
                </button>
              ))}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
