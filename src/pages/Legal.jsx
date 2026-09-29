import { PageHeader } from '../components/ui.jsx'
import { site } from '../config/site.js'

const Block = ({ title, children }) => (
  <section className="mt-10">
    <h2 className="text-xl font-bold text-brand-800 dark:text-white">{title}</h2>
    <div className="muted mt-3 space-y-3 leading-relaxed">{children}</div>
  </section>
)

export default function Legal() {
  return (
    <>
      <PageHeader title="Mentions légales et confidentialité" />
      <article className="container-x max-w-3xl py-6">
        <Block title="Éditeur du site">
          <p>{site.name}. Bureaux : {site.offices.map((o) => `${o.city} (${o.phone})`).join(' et ')}. E-mail : {site.email}.</p>
          <p>{/* À compléter : forme juridique, numéro RCCM / NIU, responsable de publication */}Forme juridique, numéro d’immatriculation et responsable de la publication : à compléter.</p>
        </Block>
        <Block title="Nature de nos services">
          <p>{site.name} est un cabinet privé d’accompagnement et de conseil. Nous ne sommes pas un organisme gouvernemental et ne sommes pas affiliés à Immigration, Réfugiés et Citoyenneté Canada (IRCC) ni au ministère de l’Immigration, de la Francisation et de l’Intégration du Québec (MIFI).</p>
          <p>Seules les autorités canadiennes et québécoises décident de l’issue d’une demande. Aucun résultat ne peut être garanti. Les frais gouvernementaux sont distincts de nos honoraires et payés directement aux autorités.</p>
          <p>Au Canada, seuls les avocats, notaires du Québec et consultants membres du CICC peuvent représenter un demandeur contre rémunération auprès d’IRCC.</p>
        </Block>
        <Block title="Informations publiées">
          <p>Le contenu de ce site est fourni à titre informatif. Les programmes d’immigration évoluent régulièrement : référez-vous toujours aux sites officiels (canada.ca, quebec.ca) pour les critères en vigueur.</p>
        </Block>
        <Block title="Données personnelles">
          <p>Les informations transmises via nos formulaires sont utilisées uniquement pour répondre à votre demande et assurer le suivi de votre dossier. Elles ne sont ni vendues ni cédées à des tiers.</p>
          <p>Vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à {site.email}.</p>
        </Block>
        <Block title="TCF Express">
          <p>La plateforme d’entraînement TCF Express est accessible à l’adresse <a className="underline" href={site.tcfExpressUrl} target="_blank" rel="noopener">{site.tcfExpressUrl}</a>. Le TCF est un test de France Éducation international ; TCF Express est un outil de préparation indépendant.</p>
        </Block>
      </article>
    </>
  )
}
