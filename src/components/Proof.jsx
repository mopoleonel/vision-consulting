import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView, useReducedMotion } from 'motion/react'
import { Star, Quotes, WhatsappLogo, ArrowUpRight } from '@phosphor-icons/react'
import { Reveal, SectionTitle } from './ui.jsx'
import { getService } from '../data/services.js'
import { whatsappLink } from '../config/site.js'
import {
  shownStats, shownRates, shownTestimonials, stats, successRates, testimonials, isExample, googleReviewsUrl,
} from '../data/proof.js'

export function ExampleBadge() {
  return (
    <span className="ml-2 inline-block rounded-full border border-slate-300 px-2 py-0.5 align-middle font-sans text-[10px] font-medium text-slate-500 dark:border-white/15 dark:text-slate-400">
      Données de démonstration
    </span>
  )
}

function CountUp({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? value : 0)
  useEffect(() => {
    if (!inView || reduce) return
    let raf, start
    const tick = (t) => {
      start ??= t
      const p = Math.min(1, (t - start) / 1400)
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, reduce])
  return <span ref={ref}>{n.toLocaleString('fr-FR')}{suffix}</span>
}

export function StatsBand() {
  if (!shownStats.length) return null
  const example = isExample(shownStats, stats)
  return (
    <section className="container-x mt-20">
      {example && <p className="mb-3 text-right"><ExampleBadge /></p>}
      <div className="grid gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {shownStats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} className={`p-8 ${i % 2 ? 'bg-brand-800' : 'bg-brand-700'} text-white`}>
            <p className="font-display text-5xl font-bold"><CountUp value={s.value} suffix={s.suffix} /></p>
            <p className="mt-2 text-sm text-white/75">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export function SuccessRates({ only }) {
  const list = only ? shownRates.filter((r) => r.service === only) : shownRates
  if (!list.length) return null
  const example = isExample(shownRates, successRates)
  if (only) {
    const r = list[0]
    return (
      <div className="rounded-3xl bg-brand-50 p-6 dark:bg-white/5">
        <p className="text-sm font-semibold text-brand-800 dark:text-white">Notre taux de réussite{example && <ExampleBadge />}</p>
        <p className="mt-2 font-display text-5xl font-bold text-brand-700 dark:text-white">{r.rate} %</p>
        <p className="muted mt-1 text-xs">Sur {r.cases} dossiers accompagnés ({r.period}).</p>
      </div>
    )
  }
  return (
    <section className="container-x mt-28">
      <Reveal><SectionTitle title="Nos résultats par procédure" text="Part des dossiers accompagnés ayant reçu une décision favorable." /></Reveal>
      {example && <p className="mt-3"><ExampleBadge /></p>}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {list.map((r, i) => {
          const s = getService(r.service)
          return (
            <Reveal key={r.service} delay={(i % 2) * 0.08}>
              <Link to={`/services/${r.service}`} className="card group flex items-center gap-6 p-6 transition hover:-translate-y-1">
                <div className="relative grid size-24 shrink-0 place-items-center">
                  <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden>
                    <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="3" className="stroke-brand-50 dark:stroke-white/10" />
                    <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${r.rate} 100`} className="stroke-maple-500" />
                  </svg>
                  <span className="font-display text-xl font-bold text-brand-800 dark:text-white">{r.rate} %</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-800 dark:text-white">{s?.title}</h3>
                  <p className="muted mt-1 text-sm">{r.cases} dossiers, {r.period}</p>
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

function Stars({ n }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} weight="fill" className={i <= n ? 'text-amber-400' : 'text-slate-300 dark:text-white/20'} />)}
    </div>
  )
}

export function Testimonials({ only }) {
  const list = only ? shownTestimonials.filter((t) => t.service === only) : shownTestimonials.slice(0, 3)
  const example = isExample(shownTestimonials, testimonials)
  if (!list.length) return null
  return (
    <section className={only ? 'mt-14' : 'container-x mt-28'}>
      {only ? <h2 className="text-2xl font-bold text-brand-800 dark:text-white">Ils l’ont fait avec nous{example && <ExampleBadge />}</h2>
        : <Reveal><SectionTitle title="Ils ont réalisé leur projet avec nous" />{example && <p className="mt-3"><ExampleBadge /></p>}</Reveal>}
      <div className={`mt-8 grid gap-4 ${only ? '' : 'md:grid-cols-3'}`}>
        {list.map((t, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <figure className={`flex h-full flex-col rounded-3xl p-7 ${i === 1 && !only ? 'bg-brand-700 text-white' : 'card'}`}>
              <Quotes size={32} weight="fill" className={i === 1 && !only ? 'text-maple-400' : 'text-maple-500'} />
              <blockquote className={`mt-4 flex-1 leading-relaxed ${i === 1 && !only ? 'text-white/90' : 'text-slate-700 dark:text-slate-200'}`}>“{t.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {t.photo ? <img src={t.photo} alt="" className="size-11 rounded-full object-cover" />
                  : <span className={`grid size-11 place-items-center rounded-full font-display font-bold ${i === 1 && !only ? 'bg-white/15' : 'bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-white'}`}>{t.name.charAt(0)}</span>}
                <span className="flex-1">
                  <span className="block font-semibold">{t.name}</span>
                  <span className={`block text-xs ${i === 1 && !only ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>{getService(t.service)?.title}, {t.city}, {t.year}</span>
                </span>
                <Stars n={t.rating} />
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      {!only && (
        <div className="mt-6 flex flex-wrap gap-3">
          {googleReviewsUrl && <a href={googleReviewsUrl} target="_blank" rel="noopener" className="btn-ghost">Voir nos avis Google <ArrowUpRight /></a>}
          <a href={whatsappLink('Bonjour, je souhaite partager mon expérience avec Vision Consulting.')} target="_blank" rel="noopener" className="btn-ghost"><WhatsappLogo /> Vous êtes client ? Laissez votre avis</a>
        </div>
      )}
    </section>
  )
}
