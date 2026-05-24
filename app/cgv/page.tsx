import { siteConfig } from '@/lib/data';

export const metadata = { title: 'Conditions Générales de Vente' };

export default function CGVPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 prose-custom">
      <h1 className="font-display text-5xl mb-10">Conditions Générales de Vente</h1>

      <div className="space-y-8 text-ink/80 leading-relaxed text-sm">
        <section>
          <h2 className="font-display text-2xl text-ink mb-3">1. Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent les ventes de vins effectuées
            par <strong>{siteConfig.site.name}</strong> (SIRET : {siteConfig.site.siret}, adresse :
            {siteConfig.site.address}) à destination des consommateurs particuliers majeurs via le site
            internet de vente privée.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">2. Acceptation des CGV</h2>
          <p>
            Toute commande implique l&apos;acceptation pleine et entière des présentes CGV. Le client
            déclare avoir au moins 18 ans et être en mesure d&apos;acheter légalement des boissons
            alcoolisées.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">3. TVA</h2>
          <p>
            <strong>{siteConfig.legal.tvaNote}</strong>. Les prix affichés sont des prix nets, sans TVA.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">4. Période de vente</h2>
          <p>
            La vente se déroule en ligne du <strong>27 mai 2026</strong> au <strong>5 juin 2026 à 19h</strong>.
            Passé cette date, aucune commande n&apos;est possible.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">5. Validation des commandes</h2>
          <p>
            Les commandes sont enregistrées dès réception du paiement. La validation effective a lieu
            sous <strong>48 heures après la clôture de la vente, le 5 juin 2026</strong>. À cette date,
            la disponibilité de chaque produit est vérifiée. En cas de rupture de stock :
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Le client est remboursé du montant correspondant sur sa carte bancaire (délai 5 à 10 jours selon la banque), ou</li>
            <li>Un substitut équivalent lui est proposé (validation requise du client).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">6. Livraison & retrait</h2>
          <p>
            Le délai de mise à disposition est de <strong>5 à 10 jours ouvrés à partir du 7 juin 2026</strong>.
            La livraison se fait sur rendez-vous pour les clients ayant choisi cette option.
          </p>
          <p>Options de livraison :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Retrait au dépôt (Bonneville)</strong> : gratuit, adresse communiquée après commande.</li>
            <li><strong>Vallée de l&apos;Arve</strong> : 5 € (Cluses, Thyez, Marnaz, Scionzier, Marignier, Vougy, Ayze, Bonneville, Saint-Pierre-en-Faucigny, La Roche-sur-Foron).</li>
            <li><strong>Autres communes Haute-Savoie</strong> : 15 €.</li>
            <li><strong>Hors Haute-Savoie</strong> : sur devis uniquement.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">7. Paiement</h2>
          <p>
            Le paiement s&apos;effectue exclusivement en ligne par carte bancaire via Stripe, avec
            authentification <strong>3D Secure</strong>. {siteConfig.site.name} ne stocke aucune donnée bancaire.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">8. Droit de rétractation</h2>
          <p>
            Conformément à l&apos;article L221-28 du Code de la consommation, le droit de rétractation
            de 14 jours s&apos;applique. Les vins doivent être retournés non ouverts, dans leur emballage
            d&apos;origine, à la charge du client. Les frais de retour ne sont pas remboursés.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">9. Vente d&apos;alcool, mention légale</h2>
          <p className="bg-cream p-4 italic">
            {siteConfig.legal.evinNotice}
          </p>
          <p>
            La vente d&apos;alcool aux mineurs de moins de 18 ans est strictement interdite (art. L3342-1
            du Code de la santé publique). En passant commande, le client atteste avoir 18 ans révolus.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">10. Litiges</h2>
          <p>
            En cas de litige, le client s&apos;engage à contacter d&apos;abord {siteConfig.site.name}
            pour rechercher une solution amiable. À défaut, les tribunaux français sont compétents.
          </p>
        </section>

        <p className="text-xs text-ink/50 pt-8 border-t border-stone">
          Dernière mise à jour : mai 2026.
        </p>
      </div>
    </div>
  );
}
