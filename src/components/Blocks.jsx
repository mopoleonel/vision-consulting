import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Plus, ArrowRight, ArrowUpRight, WhatsappLogo, Brain, Exam, Calculator, Microphone } from '@phosphor-icons/react'
import { Reveal } from './ui.jsx'
import logo from '../assets/logo.webp'
import { site, whatsappLink } from '../config/site.js'

export function Accordion({ items }) {
  const [open, setOpen] = useState(0)
  return (
    <div className="card divide-y divide-brand-900/8 overflow-hidden dark:divide-white/8">
      {items.map((f, i) => {
        const isOpen = open === i
        return (
          <div key={f.q}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-display text-lg font-semibold text-brand-800 transition hover:bg-brand-50/60 dark:text-white dark:hover:bg-white/5"
            >
              {f.q}
              <Plus size={20} weight="bold" className={`shrink-0 text-maple-500 transition duration-300 ${isOpen ? 'rotate-45' : ''}`} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                  <p className="muted max-w-[70ch] px-6 pb-6 leading-relaxed">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export function CtaBand() {
  return (
    <section className="container-x mt-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-maple-500 px-6 py-14 text-white md:px-14 md:py-16">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" aria-hidden />
          <img src={logo} alt="" aria-hidden className="absolute -bottom-16 -right-10 hidden w-72 rotate-12 opacity-25 md:block" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl font-bold leading-tight md:text-5xl">Prêt à préparer votre départ ?</h2>
            <p className="mt-4 max-w-[52ch] text-lg text-white/90">Dites-nous où vous en êtes. Nous vous répondons avec les options réalistes pour votre profil.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/evaluation" className="btn bg-white text-maple-600 hover:bg-brand-50">Évaluation gratuite <ArrowRight weight="bold" /></Link>
              <a href={whatsappLink('Bonjour, je souhaite échanger avec un conseiller.')} target="_blank" rel="noopener" className="btn border border-white/40 text-white hover:bg-white/10">
                <WhatsappLogo size={18} weight="fill" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

export const tcfFeatures = [
  { icon: Brain, title: 'Correction par IA', text: 'Retour détaillé sur vos productions écrites en quelques minutes.' },
  { icon: Exam, title: '500+ exercices', text: 'Compréhension orale, écrite, expression écrite et orale.' },
  { icon: Microphone, title: 'Simulateurs', text: 'Entraînement en conditions réelles pour l’écrit et l’oral.' },
  { icon: Calculator, title: 'Calculateur NCLC', text: 'Convertissez vos scores en niveaux NCLC pour l’immigration.' },
]

export function TcfPromo() {
  return (
    <section className="container-x mt-28">
      <div className="relative overflow-hidden rounded-[2rem] bg-brand-800 text-white dark:bg-brand-900">
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-brand-500/40 blur-3xl" aria-hidden />
        <div className="absolute -bottom-40 right-0 size-96 rounded-full bg-maple-500/30 blur-3xl" aria-hidden />
        <div className="relative grid gap-12 p-8 md:p-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <Reveal>
            <div className="flex items-center gap-4">
              <img src={logo} alt="Logo TCF Express" className="size-16 rounded-full bg-white p-0.5" />
              <span className="font-display text-xl font-bold">TCF Express</span>
            </div>
            <h2 className="mt-8 text-3xl font-bold leading-tight md:text-5xl">Votre français, votre meilleur atout pour le Canada.</h2>
            <p className="mt-5 max-w-[52ch] text-lg text-white/80">
              Notre plateforme vous entraîne au TCF Canada. Plus de 3 500 apprenants s’y préparent déjà, en Afrique, au Canada et ailleurs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={site.tcfExpressUrl} target="_blank" rel="noopener" className="btn-primary">S’entraîner sur TCF Express <ArrowUpRight weight="bold" /></a>
              <Link to="/formation-tcf" className="btn border border-white/25 text-white hover:bg-white/10">En savoir plus</Link>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {tcfFeatures.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08} className={i % 2 ? 'sm:translate-y-8' : ''}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
                  <f.icon size={28} weight="duotone" className="text-maple-400" />
                  <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
