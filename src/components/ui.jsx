import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import mark from '../assets/logo-mark.png'
import markLight from '../assets/logo-mark-light.png'
import { site } from '../config/site.js'

export function Logo({ className = '', light = false }) {
  return (
    <Link to="/" className={`group flex items-center gap-3 ${className}`} aria-label={`${site.name}, accueil`}>
      <span className="relative block h-9 w-[68px] shrink-0">
        <img src={mark} alt="" width="68" height="30" className={`absolute inset-0 m-auto w-full transition group-hover:scale-105 ${light ? 'hidden' : 'dark:hidden'}`} />
        <img src={markLight} alt="" width="68" height="30" className={`absolute inset-0 m-auto w-full transition group-hover:scale-105 ${light ? '' : 'hidden dark:block'}`} />
      </span>
      <span className="leading-none">
        <span className={`block font-display text-lg font-bold ${light ? 'text-white' : 'text-brand-700 dark:text-white'}`}>
          Vision <span className="text-maple-500">Consulting</span>
        </span>
        <span className={`mt-1 block text-[11px] font-medium ${light ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
          Immigration Canada & TCF
        </span>
      </span>
    </Link>
  )
}

export function Reveal({ children, delay = 0, className = '', y = 24, as = 'div' }) {
  const reduce = useReducedMotion()
  const M = motion[as]
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </M>
  )
}

export function PageHeader({ title, text, children }) {
  return (
    <section className="relative overflow-hidden border-b border-brand-900/8 bg-white dark:border-white/8 dark:bg-brand-900/40">
      <div className="maple-grid absolute inset-0 opacity-70" aria-hidden />
      <div className="absolute -right-24 -top-24 size-72 rounded-full bg-maple-500/10 blur-3xl" aria-hidden />
      <div className="container-x relative py-16 md:py-20">
        <Reveal>
          <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] text-brand-800 md:text-5xl dark:text-white">{title}</h1>
          {text && <p className="muted mt-5 max-w-[60ch] text-lg leading-relaxed">{text}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  )
}

export function SectionTitle({ title, text, center = false, className = '' }) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-2xl ${className}`}>
      <h2 className="text-3xl font-bold leading-tight text-brand-800 md:text-4xl dark:text-white">{title}</h2>
      {text && <p className={`muted mt-4 text-lg leading-relaxed ${center ? 'mx-auto' : ''} max-w-[60ch]`}>{text}</p>}
    </div>
  )
}
