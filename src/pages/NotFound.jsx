import { Link } from 'react-router-dom'
import { AirplaneTilt } from '@phosphor-icons/react'

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60dvh] flex-col items-center justify-center py-20 text-center">
      <AirplaneTilt size={56} weight="duotone" className="text-maple-500" />
      <h1 className="mt-6 text-4xl font-bold text-brand-800 md:text-5xl dark:text-white">Cette page a changé de destination</h1>
      <p className="muted mt-4 max-w-md">La page demandée n’existe pas ou a été déplacée.</p>
      <Link to="/" className="btn-primary mt-8">Retour à l’accueil</Link>
    </section>
  )
}
