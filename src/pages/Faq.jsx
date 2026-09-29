import { useState } from 'react'
import { PageHeader, Reveal } from '../components/ui.jsx'
import { Accordion, CtaBand } from '../components/Blocks.jsx'
import { faqs } from '../data/content.js'

export default function Faq() {
  const cats = ['Tout', ...new Set(faqs.map((f) => f.cat))]
  const [cat, setCat] = useState('Tout')
  const list = cat === 'Tout' ? faqs : faqs.filter((f) => f.cat === cat)
  return (
    <>
      <PageHeader title="Questions fréquentes" text="Les réponses aux questions que l’on nous pose le plus souvent. Vous ne trouvez pas la vôtre ? Écrivez-nous." />
      <section className="container-x mt-12 max-w-4xl">
        <div className="flex flex-wrap gap-2" role="tablist">
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${cat === c ? 'bg-brand-600 text-white' : 'bg-white text-slate-700 hover:bg-brand-50 dark:bg-white/5 dark:text-slate-200'}`}>
              {c}
            </button>
          ))}
        </div>
        <Reveal key={cat} className="mt-8"><Accordion items={list} /></Reveal>
      </section>
      <CtaBand />
    </>
  )
}
