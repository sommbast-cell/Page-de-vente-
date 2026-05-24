'use client';

import { colorAccents } from '@/lib/data';
import type { WineColor } from '@/lib/types';

interface Props {
  color: WineColor;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Placeholder de bouteille élégant en SVG.
 * Utilisé tant que les vraies photos ne sont pas ajoutées dans /public/images/wines/.
 */
export default function BottlePlaceholder({ color, size = 'medium' }: Props) {
  const fillColor = colorAccents[color] || '#5A5A5A';
  const sizes = {
    small: { w: 60, h: 180 },
    medium: { w: 100, h: 300 },
    large: { w: 140, h: 420 },
  };
  const { w, h } = sizes[size];

  return (
    <div className="flex items-center justify-center w-full h-full">
      <svg
        width={w}
        height={h}
        viewBox="0 0 100 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.95" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id={`shine-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Goulot */}
        <rect x="42" y="10" width="16" height="50" rx="2" fill={fillColor} opacity="0.9" />
        {/* Capsule */}
        <rect x="40" y="8" width="20" height="14" fill="#1a1a1a" />
        {/* Épaule */}
        <path d="M 42 55 Q 30 65 28 90 L 28 270 Q 28 280 38 282 L 62 282 Q 72 280 72 270 L 72 90 Q 70 65 58 55 Z"
          fill={`url(#grad-${color})`} />
        {/* Reflet vertical */}
        <rect x="35" y="80" width="3" height="180" fill={`url(#shine-${color})`} opacity="0.8" />
        {/* Étiquette */}
        <rect x="32" y="155" width="36" height="80" fill="#FAFAFA" stroke="#0A0A0A" strokeWidth="0.5" />
        <line x1="36" y1="170" x2="64" y2="170" stroke="#0A0A0A" strokeWidth="0.3" opacity="0.4" />
        <line x1="36" y1="180" x2="56" y2="180" stroke="#0A0A0A" strokeWidth="0.3" opacity="0.4" />
        <line x1="36" y1="210" x2="64" y2="210" stroke="#0A0A0A" strokeWidth="0.3" opacity="0.4" />
        <line x1="40" y1="220" x2="60" y2="220" stroke="#0A0A0A" strokeWidth="0.3" opacity="0.4" />
      </svg>
    </div>
  );
}
