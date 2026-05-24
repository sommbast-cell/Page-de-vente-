import Link from 'next/link';
import { wines, getFeaturedWines, siteConfig, formatDateTime } from '@/lib/data';
import WineCard from '@/components/WineCard';
import SaleBanner from '@/components/SaleBanner';

export default function HomePage() {
  const featured = getFeaturedWines(6);
  const totalWines = wines.length;

  return (
    <>
      <SaleBanner />

      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 md:px-10 bg-paper overflow-hidden">
        {/* Décor : grands traits de typo en fond */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-10 -left-20 font-display text-[12rem] md:text-[20rem] leading-none text-cream select-none">
            VIN
          </div>
          <div className="absolute -bottom-20 -right-10 font-display italic text-[8rem] md:text-[14rem] leading-none text-cream select-none">
            2026
          </div>
        </div>

        <div className="relative max-w-4xl text-center fade-in-up">
          <p className="text-xs uppercase tracking-[0.4em] mb-6 text-ink/60">
            Du {formatDateTime(siteConfig.sale.startDate).split(' à')[0]} au {formatDateTime(siteConfig.sale.endDate)}
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8">
            Une vente privée.
            <br />
            <span className="italic">{totalWines} grands vins.</span>
          </h1>
          <p className="text-base md:text-lg text-ink/70 max-w-2xl mx-auto leading-relaxed mb-10">
            Bordeaux, Bourgogne, Provence, Beaujolais, Alsace, Languedoc, Italie. Une sélection serrée,
            des prix négociés, et la livraison locale en vallée de l&apos;Arve à 5 €.
            <br />
            Le moment idéal pour faire sa cave avant l&apos;été.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/boutique" className="btn-primary">
              Découvrir la sélection
            </Link>
            <Link href="#comment-ca-marche" className="btn-secondary">
              Comment ça marche ?
            </Link>
          </div>
        </div>
      </section>

      {/* CHIFFRES CLÉS */}
      <section className="border-y border-stone bg-cream/40">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: totalWines.toString(), label: 'cuvées sélectionnées' },
            { value: '5 €', label: 'livraison Vallée de l\'Arve' },
            { value: '48 h', label: 'validation commande' },
            { value: '3D Secure', label: 'paiement sécurisé' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl md:text-4xl mb-1">{stat.value}</p>
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ink/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COUPS DE CŒUR */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink/50 mb-2">La sélection</p>
            <h2 className="font-display text-4xl md:text-5xl">Nos coups de cœur</h2>
          </div>
          <Link href="/boutique" className="text-xs uppercase tracking-widest hover:opacity-60">
            Tout voir →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {featured.map((wine) => (
            <WineCard key={wine.slug} wine={wine} />
          ))}
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section id="comment-ca-marche" className="bg-ink text-paper py-24 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] opacity-50 mb-4 text-center">
            Le déroulé
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-center mb-16">
            Comment ça marche ?
          </h2>

          <div className="grid md:grid-cols-4 gap-12">
            {[
              { num: '01', title: 'Vous commandez', text: `En ligne, jusqu'au ${formatDateTime(siteConfig.sale.endDate)}.` },
              { num: '02', title: 'Paiement sécurisé', text: 'Carte bancaire avec authentification 3D Secure via Stripe.' },
              { num: '03', title: 'Validation après le 5 juin', text: 'Vérification des stocks sous 48h. En cas de rupture : remboursement immédiat ou substitut proposé. Livraison 5 à 10 jours ouvrés à partir du 7 juin.' },
              { num: '04', title: 'Livraison', text: 'Sous 5 à 10 jours ouvrés. Livraison sur rendez-vous ou retrait au dépôt.' },
            ].map((step) => (
              <div key={step.num}>
                <p className="font-display text-5xl opacity-30 mb-4">{step.num}</p>
                <h3 className="text-sm uppercase tracking-widest mb-3">{step.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI MAINTENANT */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ink/50 mb-4">
              Pourquoi maintenant ?
            </p>
            <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">
              Le bon moment pour faire <span className="italic">sa cave d&apos;été</span>.
            </h2>
            <p className="text-ink/70 leading-relaxed mb-4">
              Apéros au jardin, grandes tablées, barbecues, fête des pères, mariages d&apos;amis…
              L&apos;été qui s&apos;annonce mérite des bouteilles à la hauteur.
            </p>
            <p className="text-ink/70 leading-relaxed mb-4">
              Cette vente privée groupée, c&apos;est l&apos;occasion d&apos;obtenir des cuvées habituellement
              proposées à des prix bien supérieurs : Volnay 2017, Pouilly-Fuissé médaillé d&apos;or, Magnum
              Minuty, Pic Saint Loup signature, Provence bio…
            </p>
            <p className="text-ink/70 leading-relaxed">
              Les quantités sont limitées. Une fois la fenêtre fermée, ces tarifs ne reviendront pas.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Sélection serrée', text: 'Pas de catalogue infini. 17 cuvées choisies pour leur rapport plaisir/prix.' },
              { title: 'Prix négociés', text: 'Tarifs vente privée, en dessous des prix caviste habituels.' },
              { title: 'Livraison locale', text: 'Vallée de l\'Arve à 5 €, Haute-Savoie à 15 €, ou retrait gratuit au dépôt de Bonneville.' },
              { title: 'Sans risque', text: 'En cas de rupture sur un vin commandé : remboursement ou substitut, vous décidez.' },
            ].map((b) => (
              <div key={b.title} className="border-l-2 border-ink pl-5 py-2">
                <h3 className="font-display text-lg mb-1">{b.title}</h3>
                <p className="text-sm text-ink/70 leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-cream py-24 px-6 md:px-10 text-center">
        <h2 className="font-display text-4xl md:text-6xl mb-6 max-w-3xl mx-auto leading-tight">
          Prêt à composer <span className="italic">votre cave</span> ?
        </h2>
        <p className="text-ink/70 max-w-xl mx-auto mb-10">
          {totalWines} cuvées vous attendent. Clôture le {formatDateTime(siteConfig.sale.endDate)}.
        </p>
        <Link href="/boutique" className="btn-primary">
          Accéder à la boutique
        </Link>
      </section>
    </>
  );
}
