import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { MapPin, Phone, WhatsappLogo, ArrowRight, ArrowUpRight, AirplaneTakeoff, CheckCircle, ChatCircleDots, Translate, ShieldCheck, Clock } from '@phosphor-icons/react'
import { Reveal, SectionTitle } from '../components/ui.jsx'
import { Accordion, CtaBand, TcfPromo } from '../components/Blocks.jsx'
import { services } from '../data/services.js'
import { steps, values, faqs } from '../data/content.js'
import logo from '../assets/logo.webp'
import { site, whatsappLink } from '../config/site.js'

function Hero() {
  const reduce = useReducedMotion()
  const float = reduce ? {} : { y: [0, -10, 0] }
  return (
    <section className="relative overflow-hidden">
      <div className="maple-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden />
      <div className="container-x relative grid items-center gap-12 pb-16 pt-12 md:pt-20 lg:min-h-[calc(100dvh-112px)] lg:grid-cols-[1.1fr_1fr] lg:py-12">
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-600/15 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 dark:border-white/10 dark:bg-white/5 dark:text-brand-200"
          >
            <AirplaneTakeoff size={16} weight="bold" className="text-maple-500" /> Cabinet d’accompagnement en immigration
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-5xl font-bold leading-[1.02] text-brand-800 md:text-6xl lg:text-7xl dark:text-white"
          >
            Votre avenir au <span className="text-maple-500">Canada</span> commence ici.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="muted mt-6 max-w-[46ch] text-lg leading-relaxed"
          >
            Études, travail, résidence permanente : un accompagnement clair et honnête, du premier conseil jusqu’à votre arrivée.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link to="/evaluation" className="btn-primary px-6 py-3.5 text-base">Évaluation gratuite <ArrowRight weight="bold" /></Link>
            <Link to="/services" className="btn-ghost px-6 py-3.5 text-base">Nos services</Link>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto aspect-square w-full max-w-[520px]"
        >
          <div className="absolute inset-[6%] rounded-full bg-gradient-to-br from-brand-600 to-brand-900 shadow-[0_40px_80px_-30px_rgb(0_49_151/0.6)]" />
          <div className="absolute inset-[6%] rounded-full border border-white/10 [background:repeating-radial-gradient(circle_at_center,transparent_0_38px,rgb(255_255_255/0.06)_39px_40px)]" />
          <motion.img
            src={logo} alt="Logo TCF Express" width="512" height="512"
            animate={float} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-[21%] top-[21%] h-[58%] w-[58%] rounded-full bg-white p-2 shadow-2xl"
          />
          {/* Carte d'embarquement stylisée */}
          <motion.div
            animate={reduce ? {} : { y: [0, 8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="card absolute bottom-[4%] left-0 w-[62%] p-4 sm:p-5"
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span>Carte d’embarquement</span>
              <AirplaneTakeoff size={16} className="text-maple-500" />
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div><p className="font-display text-2xl font-bold text-brand-700 sm:text-3xl dark:text-white">NSI</p><p className="text-xs text-slate-500">Yaoundé</p></div>
              <div className="mb-3 h-px flex-1 border-t-2 border-dashed border-brand-200 mx-3 dark:border-white/20" />
              <div className="text-right"><p className="font-display text-2xl font-bold text-maple-500 sm:text-3xl">YUL</p><p className="text-xs text-slate-500">Montréal</p></div>
            </div>
          </motion.div>
          <motion.div
            animate={reduce ? {} : { y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="card absolute right-0 top-[8%] flex items-center gap-3 px-4 py-3"
          >
            <span className="grid size-9 place-items-center rounded-full bg-maple-500/10 text-maple-500"><Translate size={18} weight="bold" /></span>
            <span className="text-sm font-semibold text-brand-800 dark:text-white">Profil francophone</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function Promises() {
  const items = [
    [CheckCircle, 'Évaluation gratuite', 'Réponse sous 48 h ouvrées'],
    [ChatCircleDots, 'Suivi sur WhatsApp', 'Un conseiller dédié'],
    [Translate, 'Préparation TCF', 'Avec la plateforme TCF Express'],
    [ShieldCheck, 'Conseils honnêtes', 'Pas de fausses promesses'],
  ]
  return (
    <section className="container-x">
      <div className="card grid gap-px overflow-hidden bg-brand-900/8 sm:grid-cols-2 lg:grid-cols-4 dark:bg-white/8">
        {items.map(([Icon, t, s], i) => (
          <Reveal key={t} delay={i * 0.06} className="flex items-center gap-4 bg-white p-6 dark:bg-brand-900">
            <Icon size={30} weight="duotone" className="shrink-0 text-brand-600 dark:text-brand-300" />
            <div><p className="font-semibold text-brand-800 dark:text-white">{t}</p><p className="muted text-sm">{s}</p></div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function ServicesBento() {
  const [first, ...rest] = services
  return (
    <section className="container-x mt-28">
      <Reveal><SectionTitle title="Un accompagnement pour chaque projet" text="Choisissez la voie qui correspond à votre situation. Nous vous aidons à constituer un dossier complet et cohérent." /></Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Reveal className="md:col-span-2 lg:row-span-2">
          <Link to={`/services/${first.slug}`} className="group relative flex h-full min-h-80 flex-col justify-between overflow-hidden rounded-3xl bg-brand-700 p-8 text-white">
            <div className="absolute -right-20 -top-20 size-80 rounded-full bg-brand-500/50 blur-2xl transition duration-700 group-hover:scale-125" aria-hidden />
            <first.icon size={44} weight="duotone" className="relative text-maple-400" />
            <div className="relative">
              <h3 className="text-3xl font-bold md:text-4xl">{first.title}</h3>
              <p className="mt-3 max-w-[40ch] text-white/75">{first.intro.split('.')[0]}.</p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold">Découvrir <ArrowRight className="transition group-hover:translate-x-1" /></span>
            </div>
          </Link>
        </Reveal>
        {rest.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 0.06} className={i === 0 ? 'lg:col-span-1' : ''}>
            <Link
              to={`/services/${s.slug}`}
              className={`group flex h-full flex-col justify-between gap-8 rounded-3xl p-6 transition duration-300 hover:-translate-y-1 ${
                i === 0 ? 'bg-maple-500 text-white' : 'card hover:border-brand-500/30'
              }`}
            >
              <s.icon size={32} weight="duotone" className={i === 0 ? 'text-white' : 'text-brand-600 dark:text-brand-300'} />
              <div>
                <h3 className={`text-xl font-semibold ${i === 0 ? '' : 'text-brand-800 dark:text-white'}`}>{s.title}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${i === 0 ? 'text-white/85' : 'muted'}`}>{s.short}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="container-x mt-28">
      <Reveal><SectionTitle center title="Comment ça se passe" text="Cinq étapes, un seul interlocuteur." /></Reveal>
      <ol className="relative mt-14 grid gap-8 md:grid-cols-5 md:gap-4">
        <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent md:block dark:via-white/20" aria-hidden />
        {steps.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 0.08} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
            <span className={`relative grid size-14 shrink-0 place-items-center rounded-full font-display text-lg font-bold ring-8 ring-paper dark:ring-brand-950 ${i === 0 ? 'bg-maple-500 text-white' : 'bg-white text-brand-700 shadow-md dark:bg-brand-800 dark:text-white'}`}>{i + 1}</span>
            <div>
              <h3 className="text-lg font-semibold text-brand-800 md:mt-4 dark:text-white">{s.title}</h3>
              <p className="muted mt-1.5 text-sm leading-relaxed">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

function Why() {
  return (
    <section className="container-x mt-28 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
      <Reveal className="lg:sticky lg:top-28">
        <SectionTitle title="Pourquoi nous faire confiance" text="L’immigration est un projet de vie. Nous le traitons avec le sérieux qu’il mérite." />
        <div className="mt-8 flex items-center gap-4 rounded-3xl bg-brand-50 p-5 dark:bg-white/5">
          <Clock size={32} weight="duotone" className="shrink-0 text-maple-500" />
          <p className="text-sm text-brand-800 dark:text-slate-200">Les critères officiels changent souvent. Nous suivons les annonces d’IRCC et du Québec pour vous conseiller sur des bases à jour.</p>
        </div>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2">
        {values.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.08} className={i % 2 ? 'sm:mt-10' : ''}>
            <div className="card h-full p-7">
              <p className="font-display text-5xl font-bold text-brand-100 dark:text-white/10">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-2 text-xl font-semibold text-brand-800 dark:text-white">{v.title}</h3>
              <p className="muted mt-2 leading-relaxed">{v.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function FaqPreview() {
  return (
    <section className="container-x mt-28 max-w-4xl">
      <Reveal><SectionTitle center title="Questions fréquentes" /></Reveal>
      <Reveal delay={0.1} className="mt-10"><Accordion items={faqs.slice(0, 5)} /></Reveal>
      <div className="mt-8 text-center">
        <Link to="/faq" className="inline-flex items-center gap-2 font-semibold text-brand-600 hover:text-maple-500 dark:text-brand-200">Toutes les questions <ArrowUpRight /></Link>
      </div>
    </section>
  )
}

function Offices() {
  return (
    <section className="container-x mt-28">
      <Reveal><SectionTitle title="Deux bureaux pour vous recevoir" text="Rencontrez un conseiller à Yaoundé ou à Bafoussam, ou échangez avec nous à distance." /></Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {site.offices.map((o, i) => (
          <Reveal key={o.city} delay={i * 0.08}>
            <div className={`flex h-full flex-col gap-6 rounded-3xl p-8 sm:flex-row sm:items-center sm:justify-between ${i === 0 ? 'bg-brand-700 text-white' : 'card'}`}>
              <div className="flex items-center gap-4">
                <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${i === 0 ? 'bg-white/10 text-maple-400' : 'bg-maple-500/10 text-maple-500'}`}><MapPin size={28} weight="duotone" /></span>
                <div>
                  <h3 className={`text-2xl font-bold ${i === 0 ? '' : 'text-brand-800 dark:text-white'}`}>{o.city}</h3>
                  <a href={o.tel} className={`mt-1 block font-medium ${i === 0 ? 'text-white/80 hover:text-white' : 'muted hover:text-brand-600'}`}>{o.phone}</a>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={o.tel} aria-label={`Appeler le bureau de ${o.city}`} className={`grid size-12 place-items-center rounded-full transition ${i === 0 ? 'bg-white/10 hover:bg-white/20' : 'bg-brand-50 text-brand-600 hover:bg-brand-100 dark:bg-white/10 dark:text-white'}`}><Phone size={20} /></a>
                <a href={whatsappLink(`Bonjour, je souhaite contacter le bureau de ${o.city}.`, o.whatsapp)} target="_blank" rel="noopener" aria-label={`WhatsApp du bureau de ${o.city}`} className="grid size-12 place-items-center rounded-full bg-[#1fa855] text-white transition hover:bg-[#188a45]"><WhatsappLogo size={22} weight="fill" /></a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Promises />
      <ServicesBento />
      <TcfPromo />
      <Process />
      <Why />
      <Offices />
      <FaqPreview />
      <CtaBand />
    </>
  )
}
