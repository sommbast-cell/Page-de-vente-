'use client';

import { useState, useMemo } from 'react';
import { wines, colorLabels } from '@/lib/data';
import WineCard from '@/components/WineCard';
import SaleBanner from '@/components/SaleBanner';

type SortType = 'featured' | 'price-asc' | 'price-desc' | 'name';

export default function BoutiquePage() {
  const [activeColor, setActiveColor] = useState<string>('all');
  const [sort, setSort] = useState<SortType>('featured');

  const filteredAndSorted = useMemo(() => {
    let result = activeColor === 'all'
      ? [...wines]
      : wines.filter((w) => w.color === activeColor);

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return result;
  }, [activeColor, sort]);

  const colors = ['all', 'rouge', 'blanc', 'rose', 'effervescent', 'pack'];

  return (
    <>
      <SaleBanner />

      {/* En-tête */}
      <section className="border-b border-stone px-6 md:px-10 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-ink/50 mb-3">La boutique</p>
        <h1 className="font-display text-5xl md:text-6xl mb-4">
          Notre <span className="italic">sélection</span>
        </h1>
        <p className="text-ink/70 max-w-xl mx-auto">
          {wines.length} cuvées à composer librement. Cliquez sur une bouteille pour découvrir sa fiche détaillée.
        </p>
      </section>

      {/* Filtres */}
      <section className="sticky top-20 z-30 bg-paper border-b border-stone">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setActiveColor(color)}
                className={`px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                  activeColor === color
                    ? 'bg-ink text-paper'
                    : 'hover:bg-cream'
                }`}
              >
                {color === 'all' ? 'Tous' : colorLabels[color]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <label htmlFor="sort" className="uppercase tracking-widest text-ink/60">Trier :</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="bg-transparent border border-stone px-3 py-2 text-xs uppercase tracking-widest cursor-pointer"
            >
              <option value="featured">À la une</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom A-Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grille */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        {filteredAndSorted.length === 0 ? (
          <p className="text-center text-ink/60 py-20">Aucun vin dans cette catégorie.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredAndSorted.map((wine) => (
              <WineCard key={wine.slug} wine={wine} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
