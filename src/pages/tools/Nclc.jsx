import { useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { PageHeader } from '../../components/ui.jsx'
import { Field, Num } from '../../components/form.jsx'
import { ResultCta, Disclaimer, OtherTools } from '../../components/ToolKit.jsx'
import { tcfTable, tcfToNclc } from '../../data/rules.js'
import { site } from '../../config/site.js'

const keys = ['co', 'ce', 'ee', 'eo']

function verdicts(levels) {
  const min = Math.min(...levels)
  return [
    ['Travailleurs qualifiés (fédéral) : NCLC 7 minimum', min >= 7],
    ['Mobilité francophone : NCLC 5 minimum', min >= 5],
    ['Points bonus francophones Entrée express : NCLC 7 partout', min >= 7],
    ['Score linguistique maximal SCG : NCLC 10 partout', min >= 10],
  ]
}

export default function Nclc() {
  const [s, setS] = useState({ co: '', ce: '', ee: '', eo: '' })
  const levels = keys.map((k) => tcfToNclc(k, s[k]))
  const complete = levels.every((n) => n !== null)
  const shown = levels.map((n) => (n === null ? null : n < 4 ? 'Moins de 4' : n))
  const summary = `Bonjour, voici mes résultats TCF Canada : ${keys.map((k, i) => `${tcfTable[k].label} ${s[k]} (NCLC ${shown[i] ?? '?'})`).join(', ')}. J'aimerais savoir quels programmes me sont accessibles.`

  return (
    <>
      <PageHeader title="Calculateur NCLC" text="Entrez vos notes au TCF Canada. Le niveau NCLC de chaque épreuve s’affiche immédiatement, selon le tableau officiel d’IRCC." />
      <div className="container-x mt-12 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        <section className="card p-6 md:p-8">
          <h2 className="mb-6 text-xl font-bold text-brand-800 dark:text-white">Vos notes TCF Canada</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {keys.map((k, i) => (
              <Field key={k} id={`n-${k}`} label={tcfTable[k].label} hint={`Note sur ${tcfTable[k].max}`}>
                <div className="relative">
                  <Num id={`n-${k}`} value={s[k]} onChange={(v) => setS({ ...s, [k]: v })} max={tcfTable[k].max} />
                  {shown[i] !== null && (
                    <span className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-bold ${levels[i] >= 7 ? 'bg-brand-600 text-white' : levels[i] >= 4 ? 'bg-brand-100 text-brand-800' : 'bg-maple-500/15 text-maple-600'}`}>
                      NCLC {shown[i]}
                    </span>
                  )}
                </div>
              </Field>
            ))}
          </div>
          <h3 className="mt-10 font-semibold text-brand-800 dark:text-white">Tableau de correspondance</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead><tr className="text-slate-500">
                <th className="py-2 pr-3 font-medium">NCLC</th>{keys.map((k) => <th key={k} className="py-2 pr-3 font-medium">{tcfTable[k].label}</th>)}
              </tr></thead>
              <tbody>
                {tcfTable.co.steps.map(([n], r) => (
                  <tr key={n} className="border-t border-brand-900/8 dark:border-white/8">
                    <td className="py-2 pr-3 font-bold text-brand-700 dark:text-white">{n === 10 ? '10+' : n}</td>
                    {keys.map((k) => {
                      const [, min] = tcfTable[k].steps[r]
                      const max = r === 0 ? tcfTable[k].max : tcfTable[k].steps[r - 1][1] - 1
                      return <td key={k} className="muted py-2 pr-3">{min === max ? min : `${min} - ${max}`}</td>
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="card p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-bold text-brand-800 dark:text-white">Votre résultat</h2>
          {complete ? (
            <>
              <p className="mt-4 font-display text-5xl font-bold text-brand-700 dark:text-white">NCLC {Math.min(...levels) < 4 ? '< 4' : Math.min(...levels)}</p>
              <p className="muted mt-1 text-sm">Niveau retenu : votre compétence la plus faible.</p>
              <ul className="mt-6 space-y-2 text-sm">
                {verdicts(levels).map(([t, ok]) => (
                  <li key={t} className="flex gap-2">
                    <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-bold ${ok ? 'bg-brand-600 text-white' : 'bg-maple-500/15 text-maple-600'}`}>{ok ? '✓' : '✕'}</span>
                    <span className="text-slate-700 dark:text-slate-200">{t}</span>
                  </li>
                ))}
              </ul>
              <ResultCta summary={summary} />
            </>
          ) : (
            <p className="muted mt-4 text-sm">Remplissez les 4 notes pour voir votre niveau global et les programmes accessibles.</p>
          )}
          <a href={site.tcfExpressUrl} target="_blank" rel="noopener" className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-brand-50 p-4 text-sm font-medium text-brand-800 dark:bg-white/5 dark:text-slate-200">
            Améliorer mon niveau avec TCF Express <ArrowUpRight className="shrink-0 text-maple-500" />
          </a>
          <Disclaimer>Tableau d’équivalence officiel d’IRCC pour le TCF Canada (identique pour le TEF Canada). Vérifié en octobre 2026.</Disclaimer>
        </aside>
      </div>
      <OtherTools current="calculateur-nclc" />
    </>
  )
}
