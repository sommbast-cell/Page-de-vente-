import Link from 'next/link';
import { siteConfig } from '@/lib/data';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper mt-24">
      {/* Mention Évin proéminente */}
      <div className="border-b border-paper/10 py-4 text-center">
        <p className="text-[0.7rem] uppercase tracking-[0.25em] opacity-80">
          {siteConfig.legal.evinNotice}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="font-display text-2xl mb-4">{siteConfig.site.name}</h3>
          <p className="text-sm opacity-70 leading-relaxed">
            {siteConfig.site.tagline}
          </p>
          <p className="text-xs opacity-50 mt-4">{siteConfig.legal.tvaNote}</p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] mb-4 opacity-60">
            Boutique
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/boutique" className="hover:opacity-60">Tous les vins</Link></li>
            <li><Link href="/boutique?couleur=rouge" className="hover:opacity-60">Rouges</Link></li>
            <li><Link href="/boutique?couleur=blanc" className="hover:opacity-60">Blancs</Link></li>
            <li><Link href="/boutique?couleur=rose" className="hover:opacity-60">Rosés</Link></li>
            <li><Link href="/boutique?couleur=effervescent" className="hover:opacity-60">Effervescents</Link></li>
            <li><Link href="/boutique?couleur=pack" className="hover:opacity-60">Packs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] mb-4 opacity-60">
            Informations
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/domaine" className="hover:opacity-60">La Maison</Link></li>
            <li><Link href="/contact" className="hover:opacity-60">Contact</Link></li>
            <li><Link href="/cgv" className="hover:opacity-60">CGV</Link></li>
            <li><Link href="/mentions-legales" className="hover:opacity-60">Mentions légales</Link></li>
            <li><Link href="/confidentialite" className="hover:opacity-60">Confidentialité</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] mb-4 opacity-60">
            Paiement sécurisé
          </h4>
          <p className="text-sm opacity-70 leading-relaxed">
            Paiement par carte bancaire avec authentification 3D Secure via Stripe.
          </p>
          <div className="flex gap-3 mt-4 opacity-60">
            <span className="text-xs border border-paper/30 px-2 py-1">VISA</span>
            <span className="text-xs border border-paper/30 px-2 py-1">MASTERCARD</span>
            <span className="text-xs border border-paper/30 px-2 py-1">CB</span>
          </div>
        </div>
      </div>

      <div className="border-t border-paper/10 py-6 text-center text-xs opacity-50">
        © {year} {siteConfig.site.name}. Tous droits réservés.
      </div>
    </footer>
  );
}
