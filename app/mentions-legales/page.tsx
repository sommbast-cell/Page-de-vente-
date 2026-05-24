import { siteConfig } from '@/lib/data';

export const metadata = { title: 'Mentions légales' };

export default function MentionsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-sm text-ink/80 leading-relaxed">
      <h1 className="font-display text-5xl mb-10 text-ink">Mentions légales</h1>

      <section className="space-y-3 mb-8">
        <h2 className="font-display text-2xl text-ink">Éditeur du site</h2>
        <p><strong>{siteConfig.site.name}</strong></p>
        <p>Adresse : {siteConfig.site.address}</p>
        <p>SIRET : {siteConfig.site.siret}</p>
        <p>Email : {siteConfig.site.email}</p>
        <p>Téléphone : {siteConfig.site.phone}</p>
        <p>{siteConfig.legal.tvaNote}</p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="font-display text-2xl text-ink">Hébergement</h2>
        <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
        <p>vercel.com</p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="font-display text-2xl text-ink">Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble du contenu du site (textes, images, logos, structure) est protégé par le droit
          d&apos;auteur. Toute reproduction sans autorisation est interdite.
        </p>
      </section>

      <section className="space-y-3 mb-8">
        <h2 className="font-display text-2xl text-ink">Responsabilité</h2>
        <p>
          {siteConfig.site.name} s&apos;efforce de maintenir le site à jour. Les descriptions des vins
          sont fournies à titre indicatif et peuvent évoluer selon les millésimes.
        </p>
      </section>

      <p className="text-xs text-ink/50 pt-8 border-t border-stone mt-12">
        {siteConfig.legal.evinNotice}
      </p>
    </div>
  );
}
