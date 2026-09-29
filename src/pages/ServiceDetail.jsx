import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, FileText, Handshake, UserFocus, Info } from '@phosphor-icons/react'
import { PageHeader, Reveal } from '../components/ui.jsx'
import { CtaBand } from '../components/Blocks.jsx'
import { getService, services } from '../data/services.js'
import { site, whatsappLink } from '../config/site.js'
import NotFound from './NotFound.jsx'

function List({ items, icon: Icon = Check }) {
  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3">
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-white/10 dark:text-brand-200"><Icon size={14} weight="bold" /></span>
          <span className="muted leading-relaxed">{t}</span>
        </li>
      ))}
    </ul>
  )
}

export default function ServiceDetail() {
  const { slug } = useParams()
  const s = getService(slug)
  if (!s) return <NotFound />
  const idx = services.indexOf(s)
  const next = services[(idx + 1) % services.length]
  const usesFrench = ['entree-express', 'mobilite-francophone', 'immigration-quebec', 'programmes-provinciaux'].includes(s.slug)

  return (
    <>
      <PageHeader title={s.title} text={s.intro}>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={`/evaluation?service=${s.slug}`} className="btn-primary">Évaluation gratuite <ArrowRight weight="bold" /></Link>
          <Link to="/services" className="btn-ghost"><ArrowLeft /> Tous les services</Link>
        </div>
      </PageHeader>

      <div className="container-x mt-16 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-14">
          <Reveal>
            <h2 className="flex items-center gap-3 text-2xl font-bold text-brand-800 dark:text-white"><UserFocus className="text-maple-500" /> Pour qui ?</h2>
            <div className="mt-6"><List items={s.forWho} /></div>
          </Reveal>

          <Reveal>
            <h2 className="text-2xl font-bold text-brand-800 dark:text-white">Conditions principales</h2>
            <div className="card mt-6 p-7"><List items={s.requirements} /></div>
          </Reveal>

          <Reveal>
            <h2 className="text-2xl font-bold text-brand-800 dark:text-white">Les étapes avec nous</h2>
            <ol className="mt-8 space-y-0">
              {s.steps.map((st, i) => (
                <li key={st.title} className="relative flex gap-5 pb-8 last:pb-0">
                  {i < s.steps.length - 1 && <span className="absolute left-5 top-11 bottom-0 w-px bg-brand-200 dark:bg-white/15" aria-hidden />}
                  <span className={`grid size-10 shrink-0 place-items-center rounded-full font-display font-bold ${i === 0 ? 'bg-maple-500 text-white' : 'bg-brand-600 text-white'}`}>{i + 1}</span>
                  <div className="pt-1.5">
                    <h3 className="font-semibold text-brand-800 dark:text-white">{st.title}</h3>
                    <p className="muted mt-1 leading-relaxed">{st.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2">
            <Reveal className="card p-7">
              <h2 className="flex items-center gap-2 text-lg font-bold text-brand-800 dark:text-white"><FileText className="text-maple-500" /> Documents courants</h2>
              <div className="mt-5"><List items={s.documents} /></div>
            </Reveal>
            <Reveal delay={0.08} className="rounded-3xl bg-brand-700 p-7 text-white">
              <h2 className="flex items-center gap-2 text-lg font-bold"><Handshake className="text-maple-400" /> Ce que nous faisons pour vous</h2>
              <ul className="mt-5 space-y-3">
                {s.help.map((h) => <li key={h} className="flex gap-3 text-white/85"><Check size={18} weight="bold" className="mt-0.5 shrink-0 text-maple-400" /> {h}</li>)}
              </ul>
            </Reveal>
          </div>

          <Reveal className="flex gap-4 rounded-3xl border border-brand-600/15 bg-brand-50 p-6 dark:border-white/10 dark:bg-white/5">
            <Info size={24} className="shrink-0 text-brand-600 dark:text-brand-200" />
            <p className="text-sm leading-relaxed text-brand-800 dark:text-slate-200">
              Ces informations sont générales et peuvent évoluer. Consultez toujours la{' '}
              <a href={s.official} target="_blank" rel="noopener" className="font-semibold underline underline-offset-2">page officielle</a>{' '}
              pour les critères et frais en vigueur.
            </p>
          </Reveal>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6">
            <h2 className="font-display text-lg font-bold text-brand-800 dark:text-white">Parlons de votre projet</h2>
            <p className="muted mt-2 text-sm">Un conseiller vous répond rapidement.</p>
            <div className="mt-5 grid gap-2">
              <Link to={`/evaluation?service=${s.slug}`} className="btn-primary">Évaluation gratuite</Link>
              <a href={whatsappLink(`Bonjour, je suis intéressé(e) par : ${s.title}.`)} target="_blank" rel="noopener" className="btn-ghost">WhatsApp</a>
            </div>
          </div>
          {usesFrench && (
            <a href={site.tcfExpressUrl} target="_blank" rel="noopener" className="group block rounded-3xl bg-maple-500 p-6 text-white">
              <p className="font-display text-lg font-bold">Le français compte ici</p>
              <p className="mt-2 text-sm text-white/85">Préparez votre TCF Canada sur TCF Express pour maximiser vos points.</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">S’entraîner <ArrowUpRight className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
            </a>
          )}
          <Link to={`/services/${next.slug}`} className="card group flex items-center justify-between gap-3 p-5">
            <span>
              <span className="block text-xs text-slate-500">Service suivant</span>
              <span className="font-semibold text-brand-800 dark:text-white">{next.title}</span>
            </span>
            <ArrowRight className="shrink-0 text-maple-500 transition group-hover:translate-x-1" />
          </Link>
        </aside>
      </div>
      <CtaBand />
    </>
  )
}
