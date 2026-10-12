// ============================================================
//  BOURSES QUÉBEC MÉTIERS D'AVENIR (QMA) - concours 2026-2027
//  Source : boursesqma.com, FAQ et liste des formations priorisées (vérifié le 12 octobre 2026).
//  À mettre à jour à chaque nouveau concours.
// ============================================================

export const qma = {
  edition: '2026-2027',
  // Dates en heure du Québec (UTC-4 en automne)
  opens: '2026-09-16T12:00:00-04:00',
  closes: '2026-10-28T23:59:00-04:00',
  frenchResultDeadline: 'mi-novembre 2026 (date exacte indiquée sur la plateforme)',
  announcement: '25 janvier 2027 (1re vague) et 1er mars 2027 (2e vague)',
  startOfStudies: 'entre janvier et décembre 2028',
  bourseRange: 'de 14 000 $ à 26 600 $ CA selon la durée du programme',
  bourseYearly: 14000,
  links: {
    site: 'https://boursesqma.com/',
    inscription: 'https://boursesqma.com/minscrire-au-concours/',
    plateforme: 'https://bourses.boursesqma.com/',
    faq: 'https://eiappblob.blob.core.windows.net/qmabourses/fr_bourses_faq.pdf',
    formations: 'https://bourses-805928eb7b-endpoint.azureedge.net/blobbourses805928eb7b/wp-content/uploads/2025/06/FR-EN-RegionsFormationsPriorisees.pdf',
  },
  // Capacité financière exigée pour 1 an, personne seule (CAD, depuis le 1er janvier 2026).
  // Le boursier doit prouver ce montant moins la bourse annuelle (14 000 $), soit 10 617 $.
  funds: { 1: 24617 },
  regions: ['Bas-Saint-Laurent', 'Saguenay-Lac-Saint-Jean', 'Mauricie', 'Estrie', 'Abitibi-Témiscamingue', 'Côte-Nord', 'Nord-du-Québec', 'Gaspésie-Îles-de-la-Madeleine', 'Chaudière-Appalaches', 'Centre-du-Québec'],
  programs: {
    'Santé': ['Assistance à la personne en établissement et à domicile', 'Assistance technique en pharmacie', 'Retraitement des dispositifs médicaux', 'Santé, assistance et soins infirmiers'],
    'Construction': ['Briquetage-maçonnerie', 'Calorifugeage', 'Charpenterie-menuiserie', 'Électricité', 'Ferblanterie', 'Installation et entretien de systèmes de sécurité', 'Installation de revêtements souples', 'Installation et fabrication de produits verriers', 'Mécanique d’ascenseur', 'Mécanique d’engins de chantier', 'Mécanique de protection contre les incendies', 'Montage de lignes électriques et de télécommunication', 'Montage structural et architectural', 'Peinture en bâtiment', 'Plomberie et chauffage', 'Préparation et finition de béton', 'Réfrigération', 'Soudage-assemblage'],
    'Industrie et batteries': ['Conduite de machines de traitement du minerai', 'Électromécanique de systèmes automatisés', 'Extraction de minerai', 'Transformation des métaux en fusion', 'Mécanique industrielle de construction et d’entretien', 'Mécanique de machines fixes', 'Tôlerie de précision', 'Usinage'],
    'Aérospatiale': ['Fabrication de pièces industrielles et aérospatiales en composite', 'Montage de structures en aérospatiale', 'Montage mécanique en aérospatiale'],
    'Autres secteurs': ['Conduite de procédés de traitement de l’eau', 'Mécanique automobile', 'Mécanique de véhicules lourds routiers'],
  },
}

// Programmes accessibles avec un niveau secondaire 3 seulement (exemples cités dans la FAQ)
export const SEC3_NOTE = 'Avec un niveau 3e seulement, seuls quelques programmes sont accessibles (ex. : boucherie de détail, service de la restauration, pêche professionnelle).'

export const isOpen = (now = new Date()) => now >= new Date(qma.opens) && now <= new Date(qma.closes)
export const isClosed = (now = new Date()) => now > new Date(qma.closes)
