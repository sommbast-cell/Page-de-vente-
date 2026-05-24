import { siteConfig } from '@/lib/data';

export const metadata = { title: 'Politique de confidentialité' };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-sm text-ink/80 leading-relaxed">
      <h1 className="font-display text-5xl mb-10 text-ink">Politique de confidentialité</h1>

      <section className="space-y-3 mb-8">
        <h2 className="font-display text-2xl text-ink">Données collectées</h2>
        <p>
          {siteConfig.site.name} collecte uniquement les données strictement nécessaires
          au traitement de votre commande : nom, email, téléphone, adresse de livraison.
        </p>
        <p>
          Aucune donnée bancaire n&apos;est stockée sur ce site. Les paiements sont gérés
          par Stripe (PCI-DSS Level 1).
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="font-display text-2xl text-ink">Cookies</h2>
        <p>
          Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement
          (panier d&apos;achat, session de paiement, vérification d&apos;âge). Aucun cookie publicitaire
          ni traceur tiers (pas de Google Analytics, pas de Meta Pixel).
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="font-display text-2xl text-ink">Durée de conservation</h2>
        <p>
          Les données de commande sont conservées 10 ans conformément aux obligations comptables.
          Les emails contact sont conservés 3 ans à des fins de service client.
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="font-display text-2xl text-ink">Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement
          et de portabilité de vos données. Pour les exercer, écrivez à {siteConfig.site.email}.
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="font-display text-2xl text-ink">Sous-traitants</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Stripe</strong> (paiement) : stripe.com/fr/privacy</li>
          <li><strong>Resend</strong> (envoi d&apos;emails transactionnels) : resend.com/legal/privacy-policy</li>
          <li><strong>Vercel</strong> (hébergement) : vercel.com/legal/privacy-policy</li>
        </ul>
      </section>
    </div>
  );
}
