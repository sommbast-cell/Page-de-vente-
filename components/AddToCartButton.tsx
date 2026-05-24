'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { isSaleActive } from '@/lib/data';
import type { Wine } from '@/lib/types';

export default function AddToCartButton({ wine }: { wine: Wine }) {
  const [quantity, setQuantity] = useState(wine.minOrder);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.open);

  const saleActive = isSaleActive();

  const handleAdd = () => {
    if (!saleActive) return;
    addItem(wine.slug, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 600);
  };

  const dec = () => setQuantity((q) => Math.max(wine.minOrder, q - wine.minOrder));
  const inc = () => setQuantity((q) => q + wine.minOrder);

  if (!saleActive) {
    return (
      <div className="bg-stone text-ink/70 text-center py-4 text-sm">
        La vente est actuellement fermée
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-xs uppercase tracking-widest">Quantité</label>
        <div className="flex items-center border border-ink">
          <button onClick={dec} className="px-4 py-2 hover:bg-ink hover:text-paper" aria-label="Diminuer">−</button>
          <span className="px-5 py-2 font-display text-lg">{quantity}</span>
          <button onClick={inc} className="px-4 py-2 hover:bg-ink hover:text-paper" aria-label="Augmenter">+</button>
        </div>
        {wine.minOrder > 1 && (
          <span className="text-xs text-ink/60">par multiples de {wine.minOrder}</span>
        )}
      </div>

      <button
        onClick={handleAdd}
        disabled={added}
        className="btn-primary w-full"
      >
        {added ? '✓ Ajouté' : 'Ajouter au panier'}
      </button>
    </div>
  );
}
