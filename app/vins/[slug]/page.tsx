import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { wines, getWineBySlug, formatPrice, colorLabels, siteConfig } from '@/lib/data';
import AddToCartButton from '@/components/AddToCartButton';
import BottlePlaceholder from '@/components/BottlePlaceholder';
import SaleBanner from '@/components/SaleBanner';
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

// Next.js 15+ : params est désormais une Promise
interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return wines.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const wine = getWineBySlug(slug);
  if (!wine) return { title: 'Vin introuvable' };
  return {
    title: `${wine.name} ${wine.vintage}`,
    description: wine.shortDescription,
  };
}

// Vérifie si une vraie photo existe dans /public/images/wines/
function imageExists(slug: string): boolean {
  try {
    const imagePath = path.join(process.cwd(), 'public', 'images', 'wines', `${slug}.jpg`);
    return fs.existsSync(imagePath);
  } catch {
    return false;
  }
}

export default async function WinePage({ params }: Props) {
  const { slug } = await params;
  const wine = getWineBySlug(slug);
  if (!wine) notFound();

  const hasRealPhoto = imageExists(wine.slug);

  return (
    <>
      <SaleBanner />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-6 md:px-10 py-6 text-xs uppercase tracking-widest text-ink/50">
        <Link href="/" className="hover:text-ink">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/boutique" className="hover:text-ink">Boutique</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{wine.name}</span>
      </nav>

      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* IMAGE */}
          <div className="bg-cream/40 aspect-square lg:aspect-[4/5] flex items-center justify-center md:sticky md:top-32 md:self-start overflow-hidden">
            {hasRealPhoto ? (
              <Image
                src={`/images/wines/${wine.slug}.jpg`}
                alt={`${wine.name} ${wine.vintage}`}
                width={800}
                height={1067}
                className="w-full h-full object-contain p-8"
                priority
              />
            ) : (
              <BottlePlaceholder color={wine.color} size="large" />
            )}
          </div>

          {/* INFOS */}
          <div className="space-y-8">
            {/* En-tête */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {wine.tags.map((tag) => (
                  <span key={tag} className="text-[0.65rem] uppercase tracking-widest border border-ink px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="text-xs uppercase tracking-[0.2em] text-ink/60 mb-3">
                {colorLabels[wine.color]} · {wine.region} · {wine.appellation}
              </div>

              <h1 className="font-display text-4xl md:text-5xl leading-tight mb-2">
                {wine.name}
              </h1>
              <p className="text-ink/60 mb-6">{wine.vintage}</p>

              <p className="text-lg text-ink/80 leading-relaxed">{wine.shortDescription}</p>
            </div>

            {/* Prix + Achat */}
            <div className="bg-cream/60 p-8 space-y-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="font-display text-4xl">{formatPrice(wine.price)}</p>
                  <p className="text-xs text-ink/60 mt-1">
                    la bouteille · {wine.volume} · {siteConfig.legal.tvaNote}
                  </p>
                </div>
                {wine.minOrder > 1 && (
                  <span className="text-xs uppercase tracking-widest px-3 py-1 bg-ink text-paper">
                    Par multiple de {wine.minOrder}
                  </span>
                )}
              </div>

              <AddToCartButton wine={wine} />

              <div className="pt-4 border-t border-stone text-xs text-ink/70 space-y-1.5">
                <p>Livraison Vallée de l&apos;Arve : 5 €. Haute-Savoie : 15 €. Retrait au dépôt : gratuit.</p>
                <p>Paiement sécurisé 3D Secure via Stripe.</p>
                <p>Remboursement immédiat si rupture de stock.</p>
              </div>
            </div>

            {/* L'histoire */}
            {wine.story && (
              <div>
                <h2 className="font-display text-2xl mb-3">L&apos;histoire</h2>
                <p className="text-ink/75 leading-relaxed whitespace-pre-line">{wine.story}</p>
              </div>
            )}

            {/* Composition pack */}
            {wine.composition && (
              <div>
                <h2 className="font-display text-2xl mb-3">Composition du pack</h2>
                <ul className="space-y-2 text-sm text-ink/75">
                  {wine.composition.map((item) => (
                    <li key={item} className="pl-4 border-l border-stone">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fiche technique */}
            <div>
              <h2 className="font-display text-2xl mb-4">Informations</h2>
              <dl className="grid grid-cols-2 gap-y-3 text-sm">
                <dt className="text-ink/50 uppercase tracking-widest text-[0.7rem]">Millésime</dt>
                <dd>{wine.vintage}</dd>

                <dt className="text-ink/50 uppercase tracking-widest text-[0.7rem]">Pays</dt>
                <dd>{wine.country}</dd>

                <dt className="text-ink/50 uppercase tracking-widest text-[0.7rem]">Région</dt>
                <dd>{wine.region}</dd>

                <dt className="text-ink/50 uppercase tracking-widest text-[0.7rem]">Appellation</dt>
                <dd>{wine.appellation}</dd>

                <dt className="text-ink/50 uppercase tracking-widest text-[0.7rem]">Domaine</dt>
                <dd>{wine.domain}</dd>

                <dt className="text-ink/50 uppercase tracking-widest text-[0.7rem]">Cépage</dt>
                <dd>{wine.grapes}</dd>

                <dt className="text-ink/50 uppercase tracking-widest text-[0.7rem]">Degré d&apos;alcool</dt>
                <dd>{wine.alcohol}</dd>

                <dt className="text-ink/50 uppercase tracking-widest text-[0.7rem]">Contenance</dt>
                <dd>{wine.volume}</dd>

                <dt className="text-ink/50 uppercase tracking-widest text-[0.7rem]">Garde</dt>
                <dd>{wine.keeping}</dd>

                <dt className="text-ink/50 uppercase tracking-widest text-[0.7rem]">Allergènes</dt>
                <dd>Contient des sulfites</dd>
              </dl>
            </div>

            {/* Notes de dégustation */}
            <div className="bg-ink text-paper p-8 space-y-4">
              <h2 className="font-display text-2xl mb-2">Notes de dégustation</h2>

              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.25em] opacity-50 mb-1">Robe</p>
                <p className="text-sm leading-relaxed">{wine.tasting.robe}</p>
              </div>
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.25em] opacity-50 mb-1">Nez</p>
                <p className="text-sm leading-relaxed">{wine.tasting.nez}</p>
              </div>
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.25em] opacity-50 mb-1">Bouche</p>
                <p className="text-sm leading-relaxed">{wine.tasting.bouche}</p>
              </div>
            </div>

            {/* Accords */}
            <div>
              <h2 className="font-display text-2xl mb-3">Accords mets et vins</h2>
              <p className="text-ink/75 leading-relaxed">{wine.pairings}</p>
            </div>

            {/* Récompenses */}
            {wine.awards.length > 0 && (
              <div>
                <h2 className="font-display text-2xl mb-3">Récompenses et notes</h2>
                <ul className="space-y-2">
                  {wine.awards.map((award) => (
                    <li key={award} className="flex items-start gap-3 text-sm">
                      <span className="text-accent mt-1">★</span>
                      <span>{award}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mention obligatoire */}
            <div className="text-xs text-ink/50 pt-6 border-t border-stone">
              {siteConfig.legal.evinNotice}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
