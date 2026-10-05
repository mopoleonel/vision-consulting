import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import {
  List, X, CaretDown, Moon, Sun, ArrowUpRight, WhatsappLogo, Phone, EnvelopeSimple, MapPin,
  FacebookLogo, InstagramLogo, TiktokLogo, LinkedinLogo, YoutubeLogo, ArrowRight,
} from '@phosphor-icons/react'
import { Logo } from './ui.jsx'
import { site, whatsappLink, officialLinks } from '../config/site.js'
import { services } from '../data/services.js'

const nav = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/services', label: 'Services', menu: true },
  { to: '/outils', label: 'Outils' },
  { to: '/formation-tcf', label: 'Formation TCF' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
]

function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try { localStorage.setItem('vc-theme', dark ? 'dark' : 'light') } catch { /* stockage indisponible */ }
  }, [dark])
  return [dark, setDark]
}

function TopBar() {
  return (
    <div className="bg-brand-700 text-white">
      <div className="container-x flex h-10 items-center justify-between gap-4 text-xs sm:text-sm">
        <a href={site.tcfExpressUrl} target="_blank" rel="noopener" className="group flex min-w-0 items-center gap-2 font-medium">
          <span className="rounded-full bg-maple-500 px-2 py-0.5 text-[11px] font-bold">TCF</span>
          <span className="truncate">Entraînez-vous au TCF Canada sur TCF Express</span>
          <ArrowUpRight weight="bold" className="shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
        <div className="hidden items-center gap-5 text-white/80 lg:flex">
          {site.offices.map((o) => (
            <a key={o.city} href={o.tel} className="flex items-center gap-1.5 hover:text-white"><Phone /> <span className="text-white/60">{o.city}</span> {o.phone}</a>
          ))}
        </div>
      </div>
    </div>
  )
}

function ServicesMenu({ open }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="absolute left-1/2 top-full w-[640px] -translate-x-1/2 pt-3"
        >
          <div className="card grid grid-cols-2 gap-1 p-3">
            {services.map((s) => (
              <Link key={s.slug} to={`/services/${s.slug}`} className="flex gap-3 rounded-2xl p-3 transition hover:bg-brand-50 dark:hover:bg-white/5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-white/10 dark:text-brand-200">
                  <s.icon size={20} weight="duotone" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-brand-800 dark:text-white">{s.title}</span>
                  <span className="muted mt-0.5 block text-xs leading-snug">{s.short}</span>
                </span>
              </Link>
            ))}
            <a href={site.tcfExpressUrl} target="_blank" rel="noopener" className="flex gap-3 rounded-2xl bg-maple-500 p-3 text-white transition hover:bg-maple-600">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15"><ArrowUpRight size={20} weight="bold" /></span>
              <span>
                <span className="block text-sm font-semibold">Formation TCF Express</span>
                <span className="mt-0.5 block text-xs leading-snug text-white/85">Entraînez-vous au TCF Canada en ligne.</span>
              </span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const [dark, setDark] = useTheme()
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false); setMenu(false) }, [pathname])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  const linkCls = ({ isActive }) =>
    `rounded-full px-3.5 py-2 text-sm font-medium transition ${isActive ? 'bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-white' : 'text-slate-700 hover:text-brand-600 dark:text-slate-300 dark:hover:text-white'}`

  return (
    <header className="sticky top-0 z-40 border-b border-brand-900/8 bg-paper/85 backdrop-blur-xl dark:border-white/8 dark:bg-brand-950/85">
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {nav.map((n) =>
            n.menu ? (
              <div key={n.to} className="relative" onMouseEnter={() => setMenu(true)} onMouseLeave={() => setMenu(false)}>
                <NavLink to={n.to} className={(p) => `${linkCls(p)} inline-flex items-center gap-1`} aria-haspopup="true" aria-expanded={menu} onFocus={() => setMenu(true)}>
                  {n.label} <CaretDown size={12} weight="bold" className={`transition ${menu ? 'rotate-180' : ''}`} />
                </NavLink>
                <ServicesMenu open={menu} />
              </div>
            ) : (
              <NavLink key={n.to} to={n.to} end={n.end} className={linkCls}>{n.label}</NavLink>
            ),
          )}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setDark(!dark)} className="grid size-10 place-items-center rounded-full text-slate-700 transition hover:bg-brand-50 dark:text-slate-200 dark:hover:bg-white/10" aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}>
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/evaluation" className="btn-primary hidden sm:inline-flex">Évaluation gratuite</Link>
          <button onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full text-brand-800 lg:hidden dark:text-white" aria-label="Ouvrir le menu">
            <List size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-brand-950/50" onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="absolute right-0 top-0 flex h-[100dvh] w-[86%] max-w-sm flex-col overflow-y-auto bg-paper p-5 dark:bg-brand-950"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full" aria-label="Fermer le menu"><X size={22} /></button>
              </div>
              <nav className="mt-8 flex flex-col gap-1">
                {nav.map((n) => (
                  <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `rounded-2xl px-4 py-3 text-lg font-semibold ${isActive ? 'bg-brand-50 text-brand-700 dark:bg-white/10 dark:text-white' : 'text-ink dark:text-slate-100'}`}>
                    {n.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-4 border-t border-brand-900/10 pt-4 dark:border-white/10">
                <p className="px-4 text-xs font-semibold text-slate-500">Nos services</p>
                {services.map((s) => (
                  <Link key={s.slug} to={`/services/${s.slug}`} className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300">
                    <s.icon size={18} weight="duotone" className="text-brand-500" /> {s.title}
                  </Link>
                ))}
              </div>
              <div className="mt-auto grid gap-2 pt-6">
                <Link to="/evaluation" className="btn-primary">Évaluation gratuite</Link>
                <a href={site.tcfExpressUrl} target="_blank" rel="noopener" className="btn-ghost">Aller sur TCF Express <ArrowUpRight /></a>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function Footer() {
  const socials = [
    [FacebookLogo, site.social.facebook, 'Facebook'],
    [InstagramLogo, site.social.instagram, 'Instagram'],
    [TiktokLogo, site.social.tiktok, 'TikTok'],
    [LinkedinLogo, site.social.linkedin, 'LinkedIn'],
    [YoutubeLogo, site.social.youtube, 'YouTube'],
  ].filter(([, url]) => url)
  return (
    <footer className="mt-24 bg-brand-900 text-white dark:bg-black/30">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">{site.description}</p>
          <div className="mt-6 flex gap-2">
            {socials.map(([Icon, url, label]) => (
              <a key={label} href={url} target="_blank" rel="noopener" aria-label={label} className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-maple-500">
                <Icon size={18} weight="fill" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            {services.map((s) => <li key={s.slug}><Link to={`/services/${s.slug}`} className="hover:text-white">{s.title}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Cabinet</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            <li><Link to="/a-propos" className="hover:text-white">À propos</Link></li>
            <li><Link to="/formation-tcf" className="hover:text-white">Formation TCF</Link></li>
            <li><Link to="/evaluation" className="hover:text-white">Évaluation gratuite</Link></li>
            <li><Link to="/outils" className="hover:text-white">Outils (SCG, NCLC, budget)</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/mentions-legales" className="hover:text-white">Mentions légales</Link></li>
          </ul>
          <h3 className="mt-8 text-sm font-semibold text-white">Liens officiels</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70">
            {officialLinks.slice(0, 3).map((l) => <li key={l.url}><a href={l.url} target="_blank" rel="noopener" className="hover:text-white">{l.label}</a></li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Nous joindre</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {site.offices.map((o) => (
              <li key={o.city}>
                <p className="flex gap-2 font-semibold text-white"><MapPin size={18} className="shrink-0 text-maple-400" /> Bureau de {o.city}</p>
                <a href={o.tel} className="ml-[26px] mt-1 block hover:text-white">{o.phone}</a>
              </li>
            ))}
            <li><a href={`mailto:${site.email}`} className="flex gap-2 hover:text-white"><EnvelopeSimple size={18} className="shrink-0 text-maple-400" /> {site.email}</a></li>
          </ul>
          <a href={site.tcfExpressUrl} target="_blank" rel="noopener" className="group mt-6 flex items-center justify-between gap-3 rounded-2xl bg-white/10 p-4 transition hover:bg-white/15">
            <span>
              <span className="block text-sm font-semibold">TCF Express</span>
              <span className="block text-xs text-white/60">Plateforme d’entraînement au TCF</span>
            </span>
            <ArrowRight className="transition group-hover:translate-x-1" />
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Tous droits réservés.</p>
          <p className="max-w-xl md:text-right">Cabinet privé d’accompagnement, non affilié au gouvernement du Canada. Les décisions relèvent exclusivement d’IRCC et du MIFI.</p>
        </div>
      </div>
    </footer>
  )
}

function WhatsAppFab() {
  return (
    <a
      href={whatsappLink('Bonjour Vision Consulting, je souhaite des informations sur l’immigration au Canada.')}
      target="_blank" rel="noopener"
      aria-label="Écrire sur WhatsApp"
      className="fixed bottom-5 right-5 z-30 grid size-14 place-items-center rounded-full bg-[#1fa855] text-white shadow-[0_12px_30px_-8px_rgb(31_168_85/0.7)] transition hover:scale-105 active:scale-95"
    >
      <WhatsappLogo size={28} weight="fill" />
    </a>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">Aller au contenu</a>
      <TopBar />
      <Navbar />
      <main id="contenu"><Outlet /></main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
