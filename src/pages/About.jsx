import { Link } from 'react-router-dom'
import { Eye, Compass, HandHeart, ArrowUpRight } from '@phosphor-icons/react'
import { PageHeader, Reveal, SectionTitle } from '../components/ui.jsx'
import { CtaBand } from '../components/Blocks.jsx'
import { values } from '../data/content.js'
import { site, officialLinks } from '../config/site.js'
import logoFull from '../assets/logo-full.png'

export default function About() {
  return (
    <>
      <PageHeader title="Un cabinet qui voit loin pour vous" text={`${site.name} est né d’une conviction : chacun mérite des informations claires et un accompagnement sérieux pour réussir son projet au Canada.`} />

      <section className="container-x mt-20 grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="relative">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 to-brand-900 p-10 md:p-14">
            <div className="absolute inset-0 [background:repeating-radial-gradient(circle_at_30%_40%,transparent_0_30px,rgb(255_255_255/0.05)_31px_32px)]" aria-hidden />
            <div className="relative mx-auto max-w-md rounded-3xl bg-white p-8 shadow-2xl"><img src={logoFull} alt="Logo Vision Consulting" className="w-full" /></div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <SectionTitle title="Notre histoire" />
          <div className="muted mt-6 space-y-4 text-lg leading-relaxed">
            <p>Nous avons vu trop de candidats perdre du temps et de l’argent à cause de dossiers incomplets ou de conseils approximatifs. {site.name} a été créé pour offrir l’inverse : de la méthode, de la transparence et un vrai suivi.</p>
            <p>Parce que le français est un avantage réel pour immigrer au Canada, nous avons aussi lancé <a href={site.tcfExpressUrl} target="_blank" rel="noopener" className="font-semibold text-brand-600 underline underline-offset-2 dark:text-brand-200">TCF Express</a>, notre plateforme d’entraînement au TCF Canada.</p>
          </div>
        </Reveal>
      </section>

      <section className="container-x mt-28 grid gap-4 md:grid-cols-3">
        {[
          [Eye, 'Notre vision', 'Rendre le projet canadien accessible, compréhensible et réalisable pour les candidats francophones.'],
          [Compass, 'Notre mission', 'Orienter chaque personne vers le programme le plus adapté et l’aider à monter un dossier solide.'],
          [HandHeart, 'Notre engagement', 'Dire la vérité sur vos chances, respecter vos délais et protéger vos données.'],
        ].map(([Icon, t, d], i) => (
          <Reveal key={t} delay={i * 0.08}>
            <div className={`h-full rounded-3xl p-8 ${i === 1 ? 'bg-maple-500 text-white' : 'card'}`}>
              <Icon size={36} weight="duotone" className={i === 1 ? 'text-white' : 'text-brand-600 dark:text-brand-300'} />
              <h3 className={`mt-5 text-xl font-bold ${i === 1 ? '' : 'text-brand-800 dark:text-white'}`}>{t}</h3>
              <p className={`mt-3 leading-relaxed ${i === 1 ? 'text-white/90' : 'muted'}`}>{d}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="container-x mt-28">
        <Reveal><SectionTitle title="Nos valeurs" /></Reveal>
        <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06} className="flex gap-5">
              <span className="font-display text-4xl font-bold text-maple-500">{i + 1}.</span>
              <div><h3 className="text-xl font-semibold text-brand-800 dark:text-white">{v.title}</h3><p className="muted mt-2 leading-relaxed">{v.text}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x mt-28">
        <Reveal className="card p-8 md:p-10">
          <h2 className="text-2xl font-bold text-brand-800 dark:text-white">Sources officielles</h2>
          <p className="muted mt-2 max-w-[65ch]">Nous vous encourageons à vérifier toute information auprès des autorités. Voici les liens de référence :</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {officialLinks.map((l) => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-full border border-brand-600/15 px-4 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50 dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/5">
                {l.label} <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
          <p className="muted mt-6 text-sm">Pour être représenté officiellement auprès d’IRCC contre rémunération, un consultant doit être membre du Collège des consultants en immigration et en citoyenneté (CICC). <Link to="/mentions-legales" className="underline underline-offset-2">En savoir plus</Link>.</p>
        </Reveal>
      </section>
      <CtaBand />
    </>
  )
}
