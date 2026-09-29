import { useState } from 'react'
import { Phone, EnvelopeSimple, MapPin, WhatsappLogo, Clock, ArrowUpRight, CheckCircle } from '@phosphor-icons/react'
import { PageHeader, Reveal } from '../components/ui.jsx'
import { site, whatsappLink } from '../config/site.js'
import { services } from '../data/services.js'

export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const body = `Bonjour, je suis ${f.name}.\nTéléphone : ${f.phone}\nE-mail : ${f.email}\nSujet : ${f.subject || 'Général'}\n\n${f.message}`
  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (f.name.trim().length < 2) er.name = 'Indiquez votre nom.'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Adresse e-mail invalide.'
    if (f.message.trim().length < 10) er.message = 'Votre message est trop court.'
    setErrors(er)
    if (!Object.keys(er).length) setSent(true)
  }

  const cards = [
    [WhatsappLogo, 'WhatsApp', 'Réponse la plus rapide', whatsappLink('Bonjour Vision Consulting !'), 'Écrire'],
    [EnvelopeSimple, 'E-mail', site.email, `mailto:${site.email}`, 'Écrire'],
  ]

  return (
    <>
      <PageHeader title="Contactez-nous" text="Une question sur votre projet ? Nos bureaux de Yaoundé et de Bafoussam vous répondent du lundi au samedi." />
      <section className="container-x mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {site.offices.map((o, i) => (
          <Reveal key={o.city} delay={i * 0.06}>
            <div className="card flex h-full flex-col p-6">
              <MapPin size={30} weight="duotone" className="text-maple-500" />
              <p className="mt-4 font-semibold text-brand-800 dark:text-white">Bureau de {o.city}</p>
              <a href={o.tel} className="muted mt-1 text-sm hover:text-brand-600">{o.phone}</a>
              <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-sm font-semibold">
                <a href={o.tel} className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-200"><Phone /> Appeler</a>
                <a href={whatsappLink(`Bonjour, je souhaite contacter le bureau de ${o.city}.`, o.whatsapp)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-[#1a9a4d]"><WhatsappLogo /> WhatsApp</a>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.mapQuery)}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-maple-500">Itinéraire <ArrowUpRight /></a>
              </div>
            </div>
          </Reveal>
        ))}
        {cards.map(([Icon, t, v, href, cta], i) => (
          <Reveal key={t} delay={(i + 2) * 0.06}>
            <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener" className="card group flex h-full flex-col p-6 transition hover:-translate-y-1">
              <Icon size={30} weight="duotone" className={i === 0 ? 'text-[#1fa855]' : 'text-brand-600 dark:text-brand-300'} />
              <p className="mt-4 font-semibold text-brand-800 dark:text-white">{t}</p>
              <p className="muted mt-1 break-words text-sm">{v}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-maple-500">{cta} <ArrowUpRight /></span>
            </a>
          </Reveal>
        ))}
      </section>

      <section className="container-x mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="card p-6 md:p-10">
          {sent ? (
            <div>
              <CheckCircle size={48} weight="duotone" className="text-maple-500" />
              <h2 className="mt-4 text-2xl font-bold text-brand-800 dark:text-white">Votre message est prêt</h2>
              <p className="muted mt-2">Choisissez comment nous l’envoyer :</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={whatsappLink(body)} target="_blank" rel="noopener" className="btn bg-[#1fa855] text-white hover:bg-[#188a45]"><WhatsappLogo size={18} weight="fill" /> WhatsApp</a>
                <a href={`mailto:${site.email}?subject=${encodeURIComponent(f.subject || 'Demande de contact')}&body=${encodeURIComponent(body)}`} className="btn-dark"><EnvelopeSimple size={18} /> E-mail</a>
              </div>
              <button onClick={() => setSent(false)} className="mt-6 text-sm font-semibold text-slate-500 underline underline-offset-2">Modifier le message</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
              <h2 className="text-2xl font-bold text-brand-800 sm:col-span-2 dark:text-white">Envoyez-nous un message</h2>
              {[
                ['name', 'Nom complet', 'text', 'name'],
                ['email', 'E-mail', 'email', 'email'],
                ['phone', 'Téléphone (facultatif)', 'tel', 'tel'],
              ].map(([k, l, t, ac]) => (
                <div key={k} className="flex flex-col gap-2">
                  <label htmlFor={`c-${k}`} className="field-label">{l}</label>
                  <input id={`c-${k}`} type={t} autoComplete={ac} className="field" value={f[k]} onChange={set(k)} />
                  {errors[k] && <p className="text-sm font-medium text-maple-600 dark:text-maple-400">{errors[k]}</p>}
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <label htmlFor="c-subject" className="field-label">Sujet</label>
                <select id="c-subject" className="field" value={f.subject} onChange={set('subject')}>
                  <option value="">Choisir</option>
                  {services.map((s) => <option key={s.slug}>{s.title}</option>)}
                  <option>Formation TCF</option>
                  <option>Autre</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label htmlFor="c-message" className="field-label">Message</label>
                <textarea id="c-message" rows="5" className="field" value={f.message} onChange={set('message')} />
                {errors.message && <p className="text-sm font-medium text-maple-600 dark:text-maple-400">{errors.message}</p>}
              </div>
              <div className="sm:col-span-2"><button type="submit" className="btn-primary">Envoyer</button></div>
            </form>
          )}
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col gap-6 rounded-3xl bg-brand-700 p-8 text-white">
          <Clock size={32} weight="duotone" className="text-maple-400" />
          <h2 className="text-2xl font-bold">Horaires d’ouverture</h2>
          <ul className="space-y-3">
            {site.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4 border-b border-white/10 pb-3 last:border-0">
                <span className="text-white/75">{h.days}</span><span className="font-semibold">{h.time}</span>
              </li>
            ))}
          </ul>
          <p className="mt-auto text-sm text-white/70">Rendez-vous dans nos bureaux de Yaoundé et Bafoussam sur réservation, ou consultation en visio partout dans le monde.</p>
        </Reveal>
      </section>
    </>
  )
}
