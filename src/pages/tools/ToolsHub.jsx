import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { PageHeader, Reveal } from '../../components/ui.jsx'
import { CtaBand } from '../../components/Blocks.jsx'
import { tools } from '../../data/tools.js'

export default function ToolsHub() {
  return (
    <>
      <PageHeader title="Outils gratuits" text="Évaluez votre profil, calculez vos points et estimez votre budget. Résultats immédiats, sans inscription." />
      <section className="container-x mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {tools.map((t, i) => (
          <Reveal key={t.slug} delay={(i % 3) * 0.06} className={i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}>
            <Link
              to={t.path || `/outils/${t.slug}`}
              className={`group flex h-full flex-col justify-between gap-10 rounded-3xl p-7 transition duration-300 hover:-translate-y-1 ${i === 4 ? 'bg-maple-500 text-white' : i === 0 ? 'bg-brand-700 text-white' : 'card'}`}
            >
              <t.icon size={36} weight="duotone" className={i === 0 || i === 4 ? 'text-white' : 'text-brand-600 dark:text-brand-300'} />
              <div>
                <h2 className={`text-2xl font-bold ${i === 0 || i === 4 ? '' : 'text-brand-800 dark:text-white'}`}>{t.title}</h2>
                <p className={`mt-2 ${i === 0 || i === 4 ? 'text-white/85' : 'muted'}`}>{t.short}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold">Commencer <ArrowRight className="transition group-hover:translate-x-1" /></span>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>
      <CtaBand />
    </>
  )
}
