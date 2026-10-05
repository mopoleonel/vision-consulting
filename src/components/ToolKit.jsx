import { Link } from 'react-router-dom'
import { WhatsappLogo, Info, ArrowRight } from '@phosphor-icons/react'
import { whatsappLink } from '../config/site.js'
import { tools } from '../data/tools.js'

// Bouton facultatif sous un résultat : envoie le résumé sur WhatsApp, sans formulaire.
export function ResultCta({ summary, label = 'Discuter de mon résultat avec un conseiller' }) {
  return (
    <div className="mt-6 grid gap-2">
      <a href={whatsappLink(summary)} target="_blank" rel="noopener" className="btn bg-[#1fa855] text-white hover:bg-[#188a45]">
        <WhatsappLogo size={18} weight="fill" /> {label}
      </a>
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">Facultatif. Aucune inscription demandée.</p>
    </div>
  )
}

export function Disclaimer({ children }) {
  return (
    <p className="mt-6 flex gap-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
      <Info size={16} className="mt-0.5 shrink-0" />
      <span>{children || 'Estimation indicative basée sur les grilles officielles d’IRCC. Seule l’évaluation d’IRCC fait foi.'}</span>
    </p>
  )
}

export function ScoreBar({ value, max, accent = false }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-brand-50 dark:bg-white/10">
      <div className={`h-full rounded-full transition-[width] duration-500 ${accent ? 'bg-maple-500' : 'bg-brand-600 dark:bg-brand-300'}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function OtherTools({ current }) {
  return (
    <section className="container-x mt-20">
      <h2 className="text-2xl font-bold text-brand-800 dark:text-white">Nos autres outils</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.filter((t) => t.slug !== current).map((t) => (
          <Link key={t.slug} to={t.path || `/outils/${t.slug}`} className="card group flex items-center gap-4 p-5 transition hover:-translate-y-1">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-white/10 dark:text-brand-200"><t.icon size={24} weight="duotone" /></span>
            <span className="flex-1">
              <span className="block font-semibold text-brand-800 dark:text-white">{t.title}</span>
              <span className="muted block text-sm">{t.short}</span>
            </span>
            <ArrowRight className="shrink-0 text-maple-500 transition group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </section>
  )
}
