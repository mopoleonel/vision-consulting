import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import mark from '../../assets/logo-mark.png'
import markLight from '../../assets/logo-mark-light.png'
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react'
import { Confetti } from '../../components/Celebrate.jsx'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, WarningCircle, WhatsappLogo, LinkSimple, ShareNetwork, ArrowUpRight, GraduationCap, Info, Sparkle, Check, FilePdf } from '@phosphor-icons/react'
import { PageHeader } from '../../components/ui.jsx'
import { Field } from '../../components/form.jsx'
import { OtherTools } from '../../components/ToolKit.jsx'
import { site, whatsappLink } from '../../config/site.js'
import { qma, isClosed, isOpen, SEC3_NOTE } from '../../data/qma.js'
import { contratQmaUrl } from '../../config/tarifs.js'

const cadFmt = (n) => `${n.toLocaleString('fr-FR').replace(/[  ]/g, ' ')} $ CA`
const HEALTH = qma.programs['Santé']
const EDU = [['lt3', 'Avant la 3e'], ['3e', '3e / BEPC'], ['2nde', 'Seconde'], ['1ere', 'Première / Probatoire'], ['tle', 'Terminale / Baccalauréat'], ['sup', 'Études supérieures (BTS, Licence, Master...)']]
const DOCS = [['passport', 'Passeport (ou carte d’identité nationale)'], ['birth', 'Acte de naissance'], ['diplomas', 'Diplômes et relevés de notes'], ['refs', 'Deux personnes pour les références (hors famille, amis proches et employeur)'], ['prizes', 'Prix ou distinctions (facultatif)']]

function buildSteps(a) {
  const fr = a.lang !== 'en'
  const own = qma.funds[1] - qma.bourseYearly // 24 617 $ exigés - 14 000 $ couverts par la bourse = 10 617 $
  return [
    { id: 'age', type: 'yn', q: 'Avez-vous 18 ans ou plus ?' },
    { id: 'nat', type: 'yn', q: 'Avez-vous la nationalité française ou canadienne ?' },
    { id: 'rp', type: 'yn', q: 'Êtes-vous résident permanent du Canada, ou avez-vous une demande de résidence permanente en cours ?' },
    { id: 'inCanada', type: 'yn', q: 'Êtes-vous actuellement au Canada ?' },
    { id: 'prev', type: 'yn', q: 'Avez-vous déjà reçu une bourse du Québec pour des études de même niveau ou plus élevé ?' },
    { id: 'edu', type: 'choice', q: 'Quel est votre plus haut niveau d’études terminé ?', options: EDU, hint: 'Équivalences approximatives avec le système québécois, confirmées lors de l’admission.' },
    { id: 'lang', type: 'choice', q: 'Dans quelle langue souhaitez-vous étudier ?', options: [['fr', 'En français'], ['en', 'En anglais']] },
    { id: 'program', type: 'program', q: 'Quelle formation professionnelle (DEP) visez-vous ?' },
    {
      id: 'langProof', type: 'choice',
      q: fr ? 'Comment pouvez-vous prouver votre niveau de français ?' : 'Comment pouvez-vous prouver votre niveau d’anglais ?',
      options: fr
        ? [['test', 'Test reconnu de moins de 2 ans (TCF, TEF, TEFAQ...) avec au moins B2 dans les 4 compétences'], ['dipl', 'Diplôme d’études supérieures de 3 ans ou plus, entièrement en français'], ['inscrit', 'Je suis inscrit(e) à un test, résultat attendu avant la date limite'], ['b1', 'J’ai un test, mais en dessous de B2 dans au moins une compétence'], ['aucun', 'Aucune preuve pour le moment']]
        : [['test', 'TOEFL iBT ou IELTS de moins de 2 ans, au moins B2 dans les 4 compétences'], ['dipl', 'Diplôme d’études supérieures de 3 ans ou plus, entièrement en anglais'], ['inscrit', 'Je suis inscrit(e) à un test, résultat attendu avant la date limite'], ['b1', 'J’ai un test, mais en dessous de B2 dans au moins une compétence'], ['aucun', 'Aucune preuve pour le moment']],
    },
    { id: 'funds', type: 'yn', q: `Pouvez-vous prouver au moins ${cadFmt(own)} (${qma.fundsXafRound}) disponibles pour votre projet ?`, hint: 'C’est le montant minimum exigé par le concours pour un boursier. Il se prouve avec des relevés bancaires récents ou une lettre de banque, à votre nom ou à celui d’un ou deux garants.' },
    { id: 'link', type: 'choice', q: 'Avez-vous déjà un lien avec le métier visé ?', options: [['exp', 'Oui, une expérience professionnelle dans ce domaine'], ['form', 'Oui, une formation ou des études proches'], ['interest', 'Non, mais un projet réfléchi et motivé'], ['none', 'Non, je découvre ce métier']] },
    { id: 'docs', type: 'multi', q: 'Quels documents avez-vous déjà ?', options: DOCS },
    { id: 'contact', type: 'contact', q: 'Dernière étape : vos coordonnées' },
  ]
}

function evaluate(a) {
  const blockers = [], conditions = [], strengths = [], improve = []
  if (a.age === false) blockers.push('Il faut avoir au moins 18 ans au moment de déposer la candidature.')
  if (a.nat === true) blockers.push('Les personnes de nationalité française ou canadienne ne peuvent pas participer au concours.')
  if (a.rp === true) blockers.push('Les résidents permanents et les personnes en démarche de résidence permanente sont exclus (ils sont déjà exemptés des droits de scolarité).')
  if (a.inCanada === true) blockers.push('Il faut être à l’extérieur du Canada au dépôt de la candidature et jusqu’à l’annonce des résultats.')
  if (a.prev === true) blockers.push('Une bourse du Québec a déjà été reçue pour des études de niveau égal ou supérieur.')
  if (a.edu === 'lt3') blockers.push('Le niveau d’études minimal (équivalent secondaire 3 ou 4 au Québec) n’est pas atteint.')
  const health = HEALTH.includes(a.program)
  if (a.edu === '3e') conditions.push(SEC3_NOTE + ' La plupart des formations demandent l’équivalent du secondaire 4 (Seconde).')
  if (health && ['3e', '2nde'].includes(a.edu)) conditions.push('Les formations en santé demandent l’équivalent du secondaire 5 (Première ou plus), à vérifier.')
  if (a.langProof === 'inscrit') conditions.push(`Le résultat du test (B2 minimum dans les 4 compétences) doit être déposé avant la ${qma.frenchResultDeadline}.`)
  if (a.langProof === 'b1') conditions.push('Le niveau B2 est exigé dans chacune des 4 compétences : un nouveau test est nécessaire avant la date limite.')
  if (a.langProof === 'aucun') conditions.push('Une preuve de langue (test B2 dans les 4 compétences ou diplôme supérieur de 3 ans dans la langue) est obligatoire.')
  if (a.funds === false) blockers.push(`Il faut pouvoir prouver au moins 10 617 $ CA (${qma.fundsXafRound}) disponibles pour le projet.`)
  if (isClosed()) conditions.push(`Les inscriptions ${qma.edition} sont closes : le dossier pourra être préparé pour la prochaine édition.`)

  // Force indicative du dossier, inspirée des critères de sélection publiés (motivation 30 %, parcours 30 %, qualité 20 %, références 15 %, prix 5 %)
  const docs = a.docs || []
  const eduPts = { '3e': 12, '2nde': 18, '1ere': 22, tle: 26, sup: 30 }[a.edu] || 0
  const linkPts = { exp: 30, form: 24, interest: 16, none: 8 }[a.link] || 0
  const quality = (['passport', 'birth', 'diplomas'].filter((d) => docs.includes(d)).length / 3) * 20
  const refs = docs.includes('refs') ? 15 : 0
  const prizes = docs.includes('prizes') ? 5 : 0
  const score = Math.round(eduPts + linkPts + quality + refs + prizes)

  if (a.program && a.program !== 'autre' && a.program !== 'nsp') strengths.push('Formation priorisée par le Québec (au moins 50 % des bourses lui sont réservées).')
  if (a.link === 'exp' || a.link === 'form') strengths.push('Lien avec le métier visé, un atout pour la partie motivation (30 % de l’évaluation).')
  if (!docs.includes('refs')) improve.push('Trouver deux personnes pour les formulaires de référence (15 % de l’évaluation).')
  if (!docs.includes('diplomas')) improve.push('Rassembler diplômes et relevés de notes de chaque niveau.')
  if (!docs.includes('passport') || !docs.includes('birth')) improve.push('Préparer passeport (même expiré) et acte de naissance.')
  if (a.program === 'nsp') improve.push('Choisir une seule formation et un seul centre : un seul choix est possible.')
  if (a.link === 'none') improve.push('Construire un projet professionnel solide pour la lettre de motivation.')

  const verdict = blockers.length ? 'not' : conditions.length ? 'conditional' : 'eligible'
  return { verdict, blockers, conditions, strengths, improve, score }
}

const label = (opts, v) => opts.find(([k]) => k === v)?.[1] || '-'

export default function BoursesQma({ standalone = false }) {
  const [params] = useSearchParams()
  const office = site.offices.find((o) => o.city.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') === (params.get('bureau') || '').toLowerCase())
  const waNumber = office?.whatsapp || site.whatsapp
  const reduce = useReducedMotion()
  const [a, setA] = useState({ docs: [] })
  const [step, setStep] = useState(-1)
  const [contact, setContact] = useState({ name: '', phone: '', city: '' })
  const [err, setErr] = useState('')
  const [copied, setCopied] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [sent, setSent] = useState(false)
  const [shown, setShown] = useState(0)
  const navigate = useNavigate()

  const steps = useMemo(() => buildSteps(a), [a])
  const done = step >= steps.length
  const cur = steps[step]
  const set = (id, v, advance = true) => { setA((o) => ({ ...o, [id]: v })); if (advance) setStep((s) => s + 1) }
  const res = useMemo(() => evaluate(a), [a])

  const shareUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] + '#/test/bourses-qma' + (office ? `?bureau=${params.get('bureau')}` : '') : ''
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: 'Test d’éligibilité Bourses Québec Métiers d’avenir', url: shareUrl })
      else { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2500) }
    } catch { /* partage annulé */ }
  }

  const verdictText = { eligible: 'Admissible', conditional: 'Admissible sous conditions', not: 'Non admissible pour le moment' }[res.verdict]
  const summary = [
    `Bonjour Vision Consulting, voici mon résultat au test Bourses QMA ${qma.edition} :`,
    `RÉSULTAT : ${verdictText}${res.verdict !== 'not' ? ` (force du dossier : ${res.score}/100)` : ''}`,
    '',
    `Nom : ${contact.name}`, `Téléphone : ${contact.phone}`, contact.city && `Ville / pays : ${contact.city}`,
    '',
    `Niveau d’études : ${label(EDU, a.edu)}`,
    `Langue d’études : ${a.lang === 'en' ? 'Anglais' : 'Français'} | Preuve : ${a.langProof || '-'}`,
    `Formation visée : ${a.program === 'autre' ? 'Autre formation' : a.program === 'nsp' ? 'Pas encore choisie' : a.program || '-'}`,
    `Capacité financière (10 617 $ CA, ${qma.fundsXafRound}) : ${a.funds ? 'oui' : 'non'}`,
    `Documents prêts : ${(a.docs || []).map((d) => label(DOCS, d).split(' (')[0]).join(', ') || 'aucun'}`,
    res.blockers.length && `Bloquant : ${res.blockers.join(' ')}`,
    res.conditions.length && `Conditions : ${res.conditions.join(' ')}`,
  ].filter((l) => l !== false && l !== undefined && l !== null).join('\n')

  const submitContact = (e) => {
    e.preventDefault()
    if (contact.name.trim().length < 2) return setErr('Indiquez votre nom pour que le conseiller vous identifie.')
    if (contact.phone.replace(/\D/g, '').length < 8) return setErr('Indiquez un numéro de téléphone ou WhatsApp valide.')
    setErr(''); setAnalyzing(true)
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    setTimeout(() => { setAnalyzing(false); setStep(steps.length) }, reduce ? 300 : 2400)
  }

  // Compteur animé de la force du dossier
  useEffect(() => {
    if (!done) { setShown(0); return }
    if (reduce) { setShown(res.score); return }
    const c = animate(0, res.score, { duration: 1.4, delay: 0.6, ease: 'easeOut', onUpdate: (v) => setShown(Math.round(v)) })
    return () => c.stop()
  }, [done, res.score, reduce])

  // Lien partagé : après l'envoi WhatsApp, le candidat est redirigé une seule fois vers le site
  const onSend = () => {
    if (!standalone) return
    setSent(true)
    setTimeout(() => navigate('/', { replace: true }), 4000)
  }

  const pop = (i = 0) => reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.05 + i * 0.06, duration: 0.3 } }
  const tap = reduce ? {} : { whileHover: { scale: 1.015 }, whileTap: { scale: 0.97 } }
  const reveal = (i) => reduce ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.45 + i * 0.12, duration: 0.4 } }

  const anim = reduce ? {} : { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 }, transition: { duration: 0.25 } }
  const progress = step < 0 ? 0 : Math.round((Math.min(step, steps.length) / steps.length) * 100)
  const btn = 'rounded-2xl border-2 px-5 py-4 text-left font-semibold transition hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-white/5'

  return (
    <>
      {standalone ? (
        <header className="border-b border-brand-900/8 bg-white dark:border-white/8 dark:bg-brand-900/40">
          <div className="container-x flex max-w-3xl items-center justify-between gap-4 py-4">
            <span className="flex items-center gap-3">
              <img src={mark} alt="" className="h-8 w-auto dark:hidden" /><img src={markLight} alt="" className="hidden h-8 w-auto dark:block" />
              <span className="font-display text-lg font-bold text-brand-700 dark:text-white">Vision <span className="text-maple-500">Consulting</span></span>
            </span>
            <span className="hidden text-xs font-medium text-slate-500 sm:block">Test Bourses QMA {qma.edition}</span>
          </div>
          <div className="container-x max-w-3xl pb-8 pt-4">
            <h1 className="text-3xl font-bold text-brand-800 md:text-4xl dark:text-white">Bourses Québec Métiers d’avenir</h1>
            <p className="muted mt-3">Vérifiez en quelques minutes si vous pouvez candidater au concours de bourses d’excellence {qma.edition}.</p>
          </div>
        </header>
      ) : (
      <PageHeader title="Bourses Québec Métiers d’avenir" text={`Vérifiez en quelques minutes si vous pouvez candidater au concours de bourses d’excellence ${qma.edition} pour une formation professionnelle au Québec.`}>
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={share} className="btn-ghost"><ShareNetwork /> {copied ? 'Lien copié !' : 'Partager ce test'}</button>
          <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2500) } catch { /* rien */ } }} className="btn-ghost"><LinkSimple /> Copier le lien</button>
        </div>
      </PageHeader>
      )}

      <section className="container-x mt-12 max-w-3xl">
        <div className="card overflow-hidden">
          <div className="h-1.5 bg-brand-50 dark:bg-white/10" aria-hidden><div className="h-full bg-maple-500 transition-[width] duration-500" style={{ width: `${progress}%` }} /></div>
          <div className="p-6 md:p-10">
            {step >= 0 && !done && !analyzing && (
              <div className="mb-6 flex items-center justify-between text-sm">
                <button type="button" onClick={() => setStep((s) => s - 1)} className="inline-flex items-center gap-1 font-semibold text-slate-500 hover:text-brand-600"><ArrowLeft /> Retour</button>
                <span className="text-slate-500">Étape {step + 1} sur {steps.length}</span>
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.div key={analyzing ? 'analyzing' : step < 0 ? 'intro' : done ? 'result' : cur.id} {...anim}>
                {analyzing && (
                  <div className="flex flex-col items-center py-12 text-center" role="status" aria-live="polite">
                    <div className="relative size-24">
                      <motion.span className="absolute inset-0 rounded-full border-4 border-brand-100 border-t-maple-500 dark:border-white/10 dark:border-t-maple-500" animate={reduce ? {} : { rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} />
                      <motion.img src={mark} alt="" className="absolute inset-0 m-auto h-10 w-auto dark:hidden" animate={reduce ? {} : { scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} />
                      <motion.img src={markLight} alt="" className="absolute inset-0 m-auto hidden h-10 w-auto dark:block" animate={reduce ? {} : { scale: [1, 1.12, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} />
                    </div>
                    <p className="mt-6 font-display text-xl font-bold text-brand-800 dark:text-white">Analyse de votre profil...</p>
                    <AnalyzeSteps reduce={reduce} />
                  </div>
                )}
                {step < 0 && (
                  <>
                    <motion.span className="inline-block" animate={reduce ? {} : { y: [0, -6, 0], rotate: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}><GraduationCap size={48} weight="duotone" className="text-maple-500" /></motion.span>
                    <h2 className="mt-4 text-2xl font-bold text-brand-800 md:text-3xl dark:text-white">Bourse d’excellence et exemption des droits de scolarité</h2>
                    <ul className="mt-5 space-y-2 text-slate-700 dark:text-slate-200">
                      <li className="flex gap-2"><CheckCircle weight="fill" className="mt-1 shrink-0 text-brand-600" /> Bourse {qma.bourseRange} pour les frais de subsistance</li>
                      <li className="flex gap-2"><CheckCircle weight="fill" className="mt-1 shrink-0 text-brand-600" /> Exemption des droits de scolarité et assurance maladie (RAMQ)</li>
                      <li className="flex gap-2"><CheckCircle weight="fill" className="mt-1 shrink-0 text-brand-600" /> Formations professionnelles (DEP) en santé, construction, industrie, aérospatiale...</li>
                    </ul>
                    <div className={`mt-6 rounded-2xl p-4 text-sm ${isOpen() ? 'bg-brand-50 text-brand-800 dark:bg-white/5 dark:text-slate-200' : 'bg-amber-50 text-amber-900 dark:bg-amber-400/10 dark:text-amber-200'}`}>
                      {isOpen() ? <>Inscriptions ouvertes jusqu’au <b>28 octobre 2026 à 23 h 59</b> (heure du Québec). Le dépôt de candidature est gratuit.</>
                        : isClosed() ? <>Les inscriptions {qma.edition} sont closes. Faites le test pour préparer la prochaine édition.</>
                          : <>Les inscriptions ouvrent le 16 septembre 2026 à midi (heure du Québec).</>}
                    </div>
                    <motion.button {...tap} type="button" onClick={() => setStep(0)} className="btn-primary group mt-8 px-6 py-3.5 text-base">Commencer le test <ArrowRight weight="bold" className="transition group-hover:translate-x-1" /></motion.button>
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Environ 3 minutes. Votre résultat est ensuite envoyé à un conseiller sur WhatsApp.</p>
                  </>
                )}

                {!done && cur?.type === 'yn' && (
                  <>
                    <h2 className="text-2xl font-bold leading-snug text-brand-800 md:text-3xl dark:text-white">{cur.q}</h2>
                    {cur.hint && <p className="muted mt-3 text-sm">{cur.hint}</p>}
                    <div className="mt-8 grid grid-cols-2 gap-3">
                      {[[true, 'Oui'], [false, 'Non']].map(([v, l], i) => (
                        <motion.button {...pop(i)} {...tap} key={l} type="button" onClick={() => set(cur.id, v)} className={`${btn} text-center font-display text-xl ${a[cur.id] === v ? 'border-brand-600 bg-brand-50 dark:bg-white/10' : 'border-slate-300 dark:border-white/15'} text-ink dark:text-slate-100`}>{l}</motion.button>
                      ))}
                    </div>
                  </>
                )}

                {!done && cur?.type === 'choice' && (
                  <>
                    <h2 className="text-2xl font-bold leading-snug text-brand-800 md:text-3xl dark:text-white">{cur.q}</h2>
                    {cur.hint && <p className="muted mt-3 text-sm">{cur.hint}</p>}
                    <div className="mt-6 grid gap-2">
                      {cur.options.map(([v, l], i) => (
                        <motion.button {...pop(i)} {...tap} key={v} type="button" onClick={() => set(cur.id, v)} className={`${btn} ${a[cur.id] === v ? 'border-brand-600 bg-brand-50 dark:bg-white/10' : 'border-slate-300 dark:border-white/15'} text-ink dark:text-slate-100`}>{l}</motion.button>
                      ))}
                    </div>
                  </>
                )}

                {!done && cur?.type === 'program' && (
                  <>
                    <h2 className="text-2xl font-bold leading-snug text-brand-800 md:text-3xl dark:text-white">{cur.q}</h2>
                    <p className="muted mt-3 text-sm">Liste des formations priorisées par le Québec. Les autres formations restent possibles.</p>
                    <Field id="q-prog" label="Formation">
                      <select id="q-prog" className="field mt-4" value={a.program || ''} onChange={(e) => setA((o) => ({ ...o, program: e.target.value }))}>
                        <option value="" disabled>Choisir une formation</option>
                        {Object.entries(qma.programs).map(([sector, list]) => (
                          <optgroup key={sector} label={sector}>{list.map((p) => <option key={p} value={p}>{p}</option>)}</optgroup>
                        ))}
                        <optgroup label="Autre"><option value="autre">Une autre formation (non priorisée)</option><option value="nsp">Je ne sais pas encore</option></optgroup>
                      </select>
                    </Field>
                    <button type="button" disabled={!a.program} onClick={() => setStep((s) => s + 1)} className="btn-dark mt-6 disabled:opacity-40">Continuer <ArrowRight weight="bold" /></button>
                  </>
                )}

                {!done && cur?.type === 'multi' && (
                  <>
                    <h2 className="text-2xl font-bold leading-snug text-brand-800 md:text-3xl dark:text-white">{cur.q}</h2>
                    <p className="muted mt-3 text-sm">Cochez tout ce qui est déjà prêt.</p>
                    <div className="mt-6 grid gap-2">
                      {cur.options.map(([v, l], i) => {
                        const on = a.docs.includes(v)
                        return (
                          <motion.label {...pop(i)} key={v} className={`flex cursor-pointer items-center gap-3 ${btn} ${on ? 'border-brand-600 bg-brand-50 dark:bg-white/10' : 'border-slate-300 dark:border-white/15'} text-ink dark:text-slate-100`}>
                            <input type="checkbox" className="size-5 accent-brand-600" checked={on} onChange={() => setA((o) => ({ ...o, docs: on ? o.docs.filter((d) => d !== v) : [...o.docs, v] }))} />
                            {l}
                          </motion.label>
                        )
                      })}
                    </div>
                    <button type="button" onClick={() => setStep((s) => s + 1)} className="btn-dark mt-6">Continuer <ArrowRight weight="bold" /></button>
                  </>
                )}

                {!done && !analyzing && cur?.type === 'contact' && (
                  <form onSubmit={submitContact} noValidate>
                    <h2 className="text-2xl font-bold leading-snug text-brand-800 md:text-3xl dark:text-white">{cur.q}</h2>
                    <p className="muted mt-3 text-sm">Votre résultat s’affiche juste après, et vous pourrez l’envoyer en un clic à un conseiller sur WhatsApp.</p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <Field id="c-name" label="Nom complet"><input id="c-name" className="field" autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} /></Field>
                      <Field id="c-phone" label="Téléphone / WhatsApp"><input id="c-phone" type="tel" className="field" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+237 6XX XX XX XX" /></Field>
                      <div className="sm:col-span-2"><Field id="c-city" label="Ville et pays (facultatif)"><input id="c-city" className="field" value={contact.city} onChange={(e) => setContact({ ...contact, city: e.target.value })} /></Field></div>
                    </div>
                    {err && <p className="mt-3 text-sm font-medium text-maple-600 dark:text-maple-400">{err}</p>}
                    <button type="submit" className="btn-primary mt-6">Voir mon résultat <ArrowRight weight="bold" /></button>
                  </form>
                )}

                {done && (
                  <>
                    {res.verdict === 'eligible' && !reduce && <Confetti />}
                    <ResultHero verdict={res.verdict} reduce={reduce} />
                    <motion.p {...reveal(0)} className="mt-4 text-sm font-medium text-slate-500">{contact.name}, voici votre résultat</motion.p>
                    <motion.h2 {...reveal(0)} className={`mt-1 text-3xl font-bold md:text-4xl ${res.verdict === 'eligible' ? 'text-brand-700 dark:text-white' : res.verdict === 'conditional' ? 'text-amber-600 dark:text-amber-300' : 'text-maple-600 dark:text-maple-400'}`}>{verdictText}</motion.h2>
                    <motion.p {...reveal(1)} className="muted mt-2">{{
                      eligible: 'Félicitations ! Votre profil répond aux critères du concours. Un conseiller peut maintenant vous aider à monter un dossier gagnant.',
                      conditional: 'Bonne nouvelle : vous pouvez candidater, à condition de régler les points ci-dessous. Un conseiller vous accompagne pour y arriver.',
                      not: 'Ce n’est pas encore le bon moment, mais ce n’est pas une fin : un conseiller peut vous orienter vers la meilleure solution pour votre projet.',
                    }[res.verdict]}</motion.p>

                    {res.verdict !== 'not' && (
                      <motion.div {...reveal(2)} className="mt-6 rounded-2xl bg-brand-50 p-5 dark:bg-white/5">
                        <div className="flex items-end justify-between"><p className="text-sm font-semibold text-brand-800 dark:text-white">Force estimée de votre dossier</p><p className="font-display text-3xl font-bold tabular-nums text-brand-700 dark:text-white">{shown}<span className="text-base text-slate-500">/100</span></p></div>
                        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white dark:bg-white/10"><motion.div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-maple-500" initial={{ width: reduce ? `${res.score}%` : 0 }} animate={{ width: `${res.score}%` }} transition={{ duration: 1.4, delay: 0.6, ease: 'easeOut' }} /></div>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Indicateur basé sur les critères publiés (motivation, parcours, qualité du dossier, références, prix). La sélection reste faite par les centres et par QMA.</p>
                      </motion.div>
                    )}

                    {[['Points bloquants', res.blockers, 'text-maple-600 dark:text-maple-400', XCircle], ['Conditions à remplir', res.conditions, 'text-amber-600', WarningCircle], ['Vos atouts', res.strengths, 'text-brand-600 dark:text-brand-300', CheckCircle], ['À renforcer', res.improve, 'text-slate-500', Info]].filter(([, list]) => list.length > 0).map(([t, list, c, Icon], i) => (
                      <motion.div {...reveal(3 + i)} key={t} className="mt-6">
                        <h3 className="font-semibold text-brand-800 dark:text-white">{t}</h3>
                        <ul className="mt-2 space-y-2">{list.map((x) => <li key={x} className="flex gap-2 text-sm text-slate-700 dark:text-slate-200"><Icon weight="fill" className={`mt-0.5 shrink-0 ${c}`} size={18} />{x}</li>)}</ul>
                      </motion.div>
                    ))}

                    <motion.div {...reveal(7)} className="mt-8 rounded-2xl border-2 border-[#1fa855]/40 bg-[#1fa855]/5 p-5">
                      <p className="font-semibold text-brand-800 dark:text-white">Dernière étape : envoyez votre résultat à un conseiller</p>
                      <p className="muted mt-1 text-sm">Il analysera votre profil et vous aidera à préparer un dossier solide{office ? ` (bureau de ${office.city})` : ''}.</p>
                      <motion.a
                        href={whatsappLink(summary, waNumber)} target="_blank" rel="noopener" onClick={onSend}
                        animate={reduce || sent ? {} : { scale: [1, 1.03, 1], boxShadow: ['0 0 0 0 rgba(31,168,85,0.45)', '0 0 0 14px rgba(31,168,85,0)', '0 0 0 0 rgba(31,168,85,0)'] }}
                        transition={{ repeat: Infinity, duration: 1.8, delay: 1.6 }}
                        className="btn mt-4 w-full whitespace-normal bg-[#1fa855] px-4 py-4 text-center text-base leading-tight text-white hover:bg-[#188a45]"
                      ><WhatsappLogo size={22} weight="fill" className="shrink-0" /> Envoyer mon résultat sur WhatsApp</motion.a>
                    </motion.div>

                    {res.verdict !== 'not' && (
                      <motion.a {...reveal(8)} href={contratQmaUrl} target="_blank" rel="noopener" download className="mt-4 flex items-center gap-4 rounded-2xl border border-brand-900/10 p-4 transition hover:border-brand-500 hover:bg-brand-50 dark:border-white/10 dark:hover:bg-white/5">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-maple-50 text-maple-500 dark:bg-maple-500/15"><FilePdf size={24} weight="fill" /></span>
                        <span><span className="block font-semibold text-brand-800 dark:text-white">Lire notre contrat d’accompagnement</span><span className="block text-sm text-slate-500 dark:text-slate-400">PDF à télécharger : honoraires, étapes et engagements. Frais d’assistance non remboursables.</span></span>
                      </motion.a>
                    )}

                    <motion.p {...reveal(9)} className="mt-6 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      Le dépôt de candidature est gratuit et doit être fait par le candidat lui-même sur la plateforme officielle. Vision Consulting vous conseille et vous aide à préparer vos documents, sans déposer à votre place. Test indicatif, non affilié à Québec Métiers d’avenir.
                      {!standalone && <>{' '}<a href={qma.links.inscription} target="_blank" rel="noopener" className="font-semibold underline">Page officielle <ArrowUpRight className="inline" /></a></>}
                    </motion.p>
                    {!standalone && <button type="button" onClick={() => { setStep(-1); setA({ docs: [] }) }} className="mt-4 text-sm font-semibold text-slate-500 underline underline-offset-2">Refaire le test</button>}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {!standalone && <section className="container-x mt-16 max-w-3xl">
        <details className="card p-6">
          <summary className="cursor-pointer font-display text-lg font-bold text-brand-800 dark:text-white">Formations et régions priorisées {qma.edition}</summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {Object.entries(qma.programs).map(([s, list]) => (
              <div key={s}><p className="text-sm font-semibold text-maple-600">{s}</p><ul className="muted mt-1 text-sm">{list.map((p) => <li key={p}>{p}</li>)}</ul></div>
            ))}
            <div><p className="text-sm font-semibold text-maple-600">Régions priorisées</p><ul className="muted mt-1 text-sm">{qma.regions.map((r) => <li key={r}>{r}</li>)}</ul></div>
          </div>
          <p className="mt-4 text-xs text-slate-500">Sources : <a className="underline" href={qma.links.formations} target="_blank" rel="noopener">liste officielle</a>, <a className="underline" href={qma.links.faq} target="_blank" rel="noopener">FAQ du concours</a>.</p>
        </details>
      </section>}

      <AnimatePresence>
        {sent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-900/85 p-6 backdrop-blur-sm" role="status" aria-live="polite">
            <motion.div initial={reduce ? false : { scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-brand-900">
              <motion.span initial={reduce ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.15 }} className="mx-auto grid size-16 place-items-center rounded-full bg-[#1fa855] text-white"><Check size={34} weight="bold" /></motion.span>
              <p className="mt-5 font-display text-2xl font-bold text-brand-800 dark:text-white">Merci {contact.name.split(' ')[0]} !</p>
              <p className="muted mt-2 text-sm">Votre résultat part vers notre conseiller sur WhatsApp. Nous vous conduisons maintenant sur le site de Vision Consulting.</p>
              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-brand-50 dark:bg-white/10"><motion.div className="h-full bg-maple-500" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 4, ease: 'linear' }} /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {standalone ? <p className="container-x max-w-3xl py-10 text-center text-xs text-slate-500">© {new Date().getFullYear()} Vision Consulting, Yaoundé et Bafoussam</p> : <OtherTools current="bourses-qma" />}
    </>
  )
}

const ANALYZE = ['Vérification des critères d’admissibilité', 'Analyse de votre parcours scolaire', 'Calcul de la force de votre dossier']
function AnalyzeSteps({ reduce }) {
  return (
    <ul className="mt-5 space-y-2 text-left text-sm">
      {ANALYZE.map((t, i) => (
        <motion.li key={t} initial={reduce ? false : { opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.65 }} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <motion.span initial={reduce ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.65, type: 'spring', stiffness: 400, damping: 15 }}><CheckCircle weight="fill" className="text-brand-600 dark:text-brand-300" size={18} /></motion.span>{t}
        </motion.li>
      ))}
    </ul>
  )
}

// Icône animée selon le verdict : célébration, encouragement ou réconfort
function ResultHero({ verdict, reduce }) {
  if (verdict === 'eligible') return (
    <div className="relative inline-grid size-24 place-items-center">
      {!reduce && [0, 1].map((i) => <motion.span key={i} className="absolute inset-0 rounded-full bg-brand-500/25" initial={{ scale: 0.6, opacity: 0.8 }} animate={{ scale: 1.9, opacity: 0 }} transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.9 }} />)}
      <motion.span initial={reduce ? false : { scale: 0, rotate: -120 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 12 }} className="relative grid size-20 place-items-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30">
        <svg viewBox="0 0 24 24" className="size-11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.5 }} /></svg>
      </motion.span>
      {!reduce && [[-46, -30], [48, -26], [-40, 38], [44, 40]].map(([x, y], i) => (
        <motion.span key={i} className="absolute text-amber-400" initial={{ scale: 0, x: 0, y: 0, opacity: 0 }} animate={{ scale: [0, 1.2, 1], x, y, opacity: [0, 1, 1] }} transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}><Sparkle weight="fill" size={18} /></motion.span>
      ))}
    </div>
  )
  if (verdict === 'conditional') return (
    <motion.span initial={reduce ? false : { scale: 0 }} animate={reduce ? { scale: 1 } : { scale: 1, rotate: [0, -10, 10, -6, 6, 0] }} transition={{ scale: { type: 'spring', stiffness: 260, damping: 14 }, rotate: { delay: 0.4, duration: 0.8 } }} className="inline-grid size-20 place-items-center rounded-full bg-amber-100 text-amber-500 dark:bg-amber-400/15">
      <WarningCircle size={48} weight="duotone" />
    </motion.span>
  )
  return (
    <motion.span initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-grid size-20 place-items-center rounded-full bg-maple-50 text-maple-500 dark:bg-maple-500/15">
      <XCircle size={48} weight="duotone" />
    </motion.span>
  )
}
