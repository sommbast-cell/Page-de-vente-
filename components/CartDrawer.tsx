'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { wines, formatPrice, siteConfig, isSaleActive } from '@/lib/data';
import { useMemo } from 'react';

export default function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  const detailedItems = useMemo(() => {
    return items.map((i) => {
      const wine = wines.find((w) => w.slug === i.slug);
      return wine ? { wine, quantity: i.quantity } : null;
    }).filter(Boolean) as { wine: typeof wines[0]; quantity: number }[];
  }, [items]);

  const subtotal = detailedItems.reduce(
    (sum, { wine, quantity }) => sum + wine.price * quantity,
    0
  );

  const saleActive = isSaleActive();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={`fixed inset-0 bg-ink/50 z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-paper z-50 flex flex-col transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone">
          <h2 className="font-display text-2xl">Votre Panier</h2>
          <button onClick={close} aria-label="Fermer" className="text-2xl hover:opacity-60">
            ×
          </button>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto p-6">
          {detailedItems.length === 0 ? (
            <div className="text-center py-16 text-ink/60">
              <p className="font-display text-xl mb-2">Votre panier est vide</p>
              <p className="text-sm mb-6">Découvrez notre sélection.</p>
              <Link
                href="/boutique"
                onClick={close}
                className="btn-secondary"
              >
                Voir les vins
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {detailedItems.map(({ wine, quantity }) => (
                <li key={wine.slug} className="flex gap-4 pb-6 border-b border-stone last:border-0">
                  <div className="w-20 h-28 bg-cream/40 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img
                      src={`/images/wines/${wine.slug}.jpg`}
                      alt={wine.name}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                        img.parentElement!.innerHTML = '<div class="text-2xl">🍷</div>';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base leading-tight truncate">{wine.name}</h3>
                    <p className="text-xs text-ink/60 mb-2">{wine.vintage}</p>
                    <p className="font-display text-lg mb-3">{formatPrice(wine.price * quantity)}</p>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-stone">
                        <button
                          onClick={() => updateQuantity(wine.slug, quantity - wine.minOrder)}
                          className="px-3 py-1 hover:bg-cream"
                          aria-label="Diminuer"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-sm">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(wine.slug, quantity + wine.minOrder)}
                          className="px-3 py-1 hover:bg-cream"
                          aria-label="Augmenter"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(wine.slug)}
                        className="text-xs text-ink/50 hover:text-accent uppercase tracking-widest"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {detailedItems.length > 0 && (
          <div className="border-t border-stone p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-widest">Sous-total</span>
              <span className="font-display text-2xl">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-ink/60">
              Frais de livraison calculés à l&apos;étape suivante.
            </p>
            {!saleActive ? (
              <div className="p-4 bg-cream text-center text-xs">
                La vente est actuellement fermée. Vous ne pouvez pas finaliser de commande.
              </div>
            ) : (
              <Link
                href="/panier"
                onClick={close}
                className="btn-primary w-full"
              >
                Voir mon panier
              </Link>
            )}
            <p className="text-[0.65rem] text-ink/50 text-center pt-2">
              {siteConfig.legal.evinNotice}
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
