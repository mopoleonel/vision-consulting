import { ArrowUpRight, Headphones, BookOpenText, PencilLine, ChatsCircle, Target } from '@phosphor-icons/react'
import { PageHeader, Reveal, SectionTitle } from '../components/ui.jsx'
import { tcfFeatures } from '../components/Blocks.jsx'
import { site } from '../config/site.js'
import logo from '../assets/logo.webp'

const epreuves = [
  { icon: Headphones, title: 'Compréhension orale', meta: '39 questions, environ 35 min', text: 'Comprendre des documents audio de la vie courante et professionnelle.' },
  { icon: BookOpenText, title: 'Compréhension écrite', meta: '39 questions, 60 min', text: 'Lire et interpréter des textes de difficulté croissante.' },
  { icon: PencilLine, title: 'Expression écrite', meta: '3 tâches, 60 min', text: 'Rédiger un message, un article et un texte argumentatif.' },
  { icon: ChatsCircle, title: 'Expression orale', meta: '3 tâches, environ 12 min', text: 'Entretien, interaction et expression d’un point de vue.' },
]

export default function Tcf() {
  return (
    <>
      <PageHeader
        title="Préparez votre TCF Canada avec TCF Express"
        text="Le test de français est souvent décisif dans un dossier d’immigration. Nous avons créé TCF Express pour vous entraîner efficacement, à votre rythme."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={site.tcfExpressUrl} target="_blank" rel="noopener" className="btn-primary">Essayer gratuitement <ArrowUpRight weight="bold" /></a>
        </div>
      </PageHeader>

      <section className="container-x mt-20 grid items-center gap-12 lg:grid-cols-2">
        <Reveal className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-0 rotate-6 rounded-[2.5rem] bg-maple-500" aria-hidden />
          <div className="relative rounded-[2.5rem] bg-brand-700 p-10">
            <img src={logo} alt="Logo TCF Express" className="mx-auto w-full max-w-[280px] rounded-full bg-white p-2" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <SectionTitle title="Pourquoi le TCF Canada change tout" />
          <ul className="mt-8 space-y-5">
            {[
              ['Des points en plus', 'Le français rapporte des points dans Entrée express, y compris comme seconde langue officielle.'],
              ['Des tirages réservés', 'Des invitations sont régulièrement ciblées sur les candidats avec de bonnes compétences en français.'],
              ['Mobilité francophone', 'Un niveau suffisant permet un permis de travail hors Québec sans EIMT.'],
              ['Le Québec', 'Le français est au cœur de la sélection des immigrants au Québec.'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-4">
                <Target size={26} weight="duotone" className="mt-0.5 shrink-0 text-maple-500" />
                <div><p className="font-semibold text-brand-800 dark:text-white">{t}</p><p className="muted mt-1 leading-relaxed">{d}</p></div>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="container-x mt-28">
        <Reveal><SectionTitle center title="Les 4 épreuves du TCF Canada" text="Chaque épreuve donne un niveau converti en NCLC, utilisé par IRCC." /></Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {epreuves.map((e, i) => (
            <Reveal key={e.title} delay={i * 0.07}>
              <div className="card h-full p-6">
                <e.icon size={32} weight="duotone" className="text-brand-600 dark:text-brand-300" />
                <h3 className="mt-5 text-lg font-semibold text-brand-800 dark:text-white">{e.title}</h3>
                <p className="mt-1 text-xs font-semibold text-maple-500">{e.meta}</p>
                <p className="muted mt-3 text-sm leading-relaxed">{e.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="muted mt-6 text-center text-xs">Format donné à titre indicatif. Référez-vous à France Éducation international pour les modalités officielles.</p>
      </section>

      <section className="container-x mt-28">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-800 p-8 text-white md:p-14 dark:bg-brand-900">
          <div className="absolute -right-24 -top-24 size-96 rounded-full bg-maple-500/30 blur-3xl" aria-hidden />
          <div className="relative">
            <h2 className="max-w-2xl text-3xl font-bold md:text-5xl">Ce que vous trouverez sur TCF Express</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tcfFeatures.map((f) => (
                <div key={f.title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
                  <f.icon size={28} weight="duotone" className="text-maple-400" />
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{f.text}</p>
                </div>
              ))}
            </div>
            <a href={site.tcfExpressUrl} target="_blank" rel="noopener" className="btn-primary mt-10 px-7 py-4 text-base">Aller sur TCF Express <ArrowUpRight weight="bold" /></a>
          </div>
        </div>
      </section>
    </>
  )
}
