'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Wine } from '@/lib/types';
import { formatPrice, colorLabels } from '@/lib/data';
import BottlePlaceholder from './BottlePlaceholder';

export default function WineCard({ wine }: { wine: Wine }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/vins/${wine.slug}`}
      className="group block bg-paper transition-all duration-500 hover:bg-cream"
    >
      {/* Image */}
      <div className="aspect-[3/4] bg-cream/40 flex items-center justify-center overflow-hidden relative">
        {!imageError ? (
          <Image
            src={`/images/wines/${wine.slug}.jpg`}
            alt={`${wine.name} ${wine.vintage}`}
            width={400}
            height={534}
            className="w-full h-full object-contain p-4 transform transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="transform transition-transform duration-700 group-hover:scale-105">
            <BottlePlaceholder color={wine.color} size="large" />
          </div>
        )}
        {wine.tags?.[0] && (
          <span className="absolute top-4 left-4 bg-ink text-paper text-[0.6rem] uppercase tracking-widest px-3 py-1">
            {wine.tags[0]}
          </span>
        )}
      </div>

      {/* Infos */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-ink/50 mb-2">
          <span>{colorLabels[wine.color]}</span>
          <span>·</span>
          <span>{wine.region}</span>
        </div>

        <h3 className="font-display text-xl md:text-2xl leading-tight mb-1 group-hover:italic transition-all">
          {wine.name}
        </h3>
        <p className="text-xs text-ink/60 mb-4">
          {wine.appellation} · {wine.vintage}
        </p>

        <div className="flex items-end justify-between pt-4 border-t border-stone">
          <div>
            <p className="font-display text-2xl">{formatPrice(wine.price)}</p>
            <p className="text-[0.65rem] uppercase tracking-widest text-ink/50 mt-1">
              la bouteille
            </p>
          </div>
          <span className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Découvrir
          </span>
        </div>
      </div>
    </Link>
  );
}
