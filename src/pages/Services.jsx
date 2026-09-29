import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { PageHeader, Reveal } from '../components/ui.jsx'
import { CtaBand } from '../components/Blocks.jsx'
import { services } from '../data/services.js'

export default function Services() {
  return (
    <>
      <PageHeader title="Nos services d’immigration" text="Neuf services pour faire reconnaître vos diplômes, venir étudier, travailler, vous installer ou retrouver votre famille au Canada." />
      <section className="container-x mt-16 grid gap-5 md:grid-cols-2">
        {services.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 2) * 0.08}>
            <Link to={`/services/${s.slug}`} className="card group flex h-full gap-6 p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-500/30">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition group-hover:bg-maple-500 group-hover:text-white dark:bg-white/10 dark:text-brand-200">
                <s.icon size={28} weight="duotone" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-brand-800 dark:text-white">{s.title}</h2>
                <p className="muted mt-2 leading-relaxed">{s.short}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-200">
                  Voir le détail <ArrowRight className="transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>
      <CtaBand />
    </>
  )
}
