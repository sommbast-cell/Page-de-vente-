import Link from 'next/link';
import { siteConfig, formatDateTime } from '@/lib/data';

export const metadata = {
  title: 'La Maison',
  description: 'Découvrez notre histoire et notre démarche de vente privée de vins.',
};

export default function DomainePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-ink/50 mb-3">La Maison</p>
      <h1 className="font-display text-5xl md:text-6xl mb-10 leading-tight">
        Une <span className="italic">vente privée</span>,<br />
        pas un magasin.
      </h1>

      <div className="prose-custom space-y-6 text-ink/80 leading-relaxed">
        <p className="text-lg">
          <strong>{siteConfig.site.name}</strong> est une opération de vente groupée organisée
          depuis {siteConfig.site.city}. L&apos;idée est simple : sélectionner une poignée de cuvées
          remarquables, négocier des prix justes, et les proposer pendant une fenêtre limitée
          à un cercle d&apos;amateurs.
        </p>

        <p>
          Pas de catalogue infini, pas de stock permanent, pas d&apos;intermédiaires inutiles.
          Une sélection serrée : des classiques bordelais, des grands bourgognes, du Beaujolais
          cru, des rosés de Provence bio, des italiens primés. Pensée pour faire sa cave
          avant l&apos;été ou pour offrir.
        </p>

        <p>
          Cette édition se tient du <strong>{formatDateTime(siteConfig.sale.startDate)}</strong>
          {' '}au <strong>{formatDateTime(siteConfig.sale.endDate)}</strong>. Passé cette date,
          les commandes ne sont plus possibles.
        </p>

        <h2 className="font-display text-3xl pt-8 mt-12 border-t border-stone">Notre engagement</h2>

        <ul className="space-y-4 list-none">
          <li className="border-l-2 border-ink pl-5">
            <strong className="block mb-1">Transparence sur les stocks.</strong>
            Les quantités sont volontairement limitées. En cas de rupture sur un vin que vous avez
            commandé, nous vous proposons un remboursement immédiat ou un substitut équivalent.
            Vous décidez.
          </li>
          <li className="border-l-2 border-ink pl-5">
            <strong className="block mb-1">Livraison locale soignée.</strong>
            En Vallée de l&apos;Arve, nous livrons sur rendez-vous pour 5 €. Dans le reste de
            la Haute-Savoie, 15 €. Et pour les amateurs proches du dépôt à Bonneville,
            le retrait est gratuit.
          </li>
          <li className="border-l-2 border-ink pl-5">
            <strong className="block mb-1">Paiement sécurisé.</strong>
            Toutes les transactions passent par Stripe avec authentification 3D Secure.
            Aucune information bancaire n&apos;est stockée sur ce site.
          </li>
          <li className="border-l-2 border-ink pl-5">
            <strong className="block mb-1">Vente responsable.</strong>
            L&apos;abus d&apos;alcool est dangereux pour la santé. Notre sélection s&apos;adresse
            aux adultes (18 ans et plus) qui partagent le plaisir d&apos;une belle table.
          </li>
        </ul>

        <div className="pt-12 text-center">
          <Link href="/boutique" className="btn-primary">Voir la sélection</Link>
        </div>
      </div>
    </div>
  );
}
