import { ListChecks, ChartBar, Translate, Receipt, Compass } from '@phosphor-icons/react'

export const tools = [
  { slug: 'orientation', icon: Compass, title: 'Évaluation gratuite', short: 'Quel programme pour votre profil ? Réponse en 1 minute.', path: '/evaluation' },
  { slug: 'test-admissibilite', icon: ListChecks, title: 'Test d’admissibilité', short: 'Grille officielle des 67 points (travailleurs qualifiés).' },
  { slug: 'calculateur-scg', icon: ChartBar, title: 'Calculateur de score SCG', short: 'Votre score Entrée express, détaillé point par point.' },
  { slug: 'calculateur-nclc', icon: Translate, title: 'Calculateur NCLC', short: 'Convertissez vos notes TCF Canada en niveaux NCLC.' },
  { slug: 'estimateur-cout', icon: Receipt, title: 'Estimateur de coût', short: 'Budget de votre procédure et proforma PDF.' },
]
