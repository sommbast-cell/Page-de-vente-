import winesData from '@/data/wines.json';
import siteConfigData from '@/data/site-config.json';
import type { Wine, SiteConfig } from './types';

export const wines = winesData as Wine[];
export const siteConfig = siteConfigData as SiteConfig;

export function getWineBySlug(slug: string): Wine | undefined {
  return wines.find((w) => w.slug === slug);
}

export function getFeaturedWines(limit = 3): Wine[] {
  return wines.filter((w) => w.featured).slice(0, limit);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);
}

/**
 * Vérifie si la vente est encore active (entre startDate et endDate).
 * Si terminée, le site reste consultable mais désactive panier/achat.
 */
export function isSaleActive(): boolean {
  const now = new Date();
  const start = new Date(siteConfig.sale.startDate);
  const end = new Date(siteConfig.sale.endDate);
  return now >= start && now <= end;
}

export function getSaleStatus(): 'upcoming' | 'active' | 'ended' {
  const now = new Date();
  const start = new Date(siteConfig.sale.startDate);
  const end = new Date(siteConfig.sale.endDate);
  if (now < start) return 'upcoming';
  if (now > end) return 'ended';
  return 'active';
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export const colorLabels: Record<string, string> = {
  rouge: 'Rouge',
  blanc: 'Blanc',
  rose: 'Rosé',
  effervescent: 'Effervescent',
  pack: 'Pack',
  mixte: 'Pack',
};

export const colorAccents: Record<string, string> = {
  rouge: '#7A1A1A',
  blanc: '#C9B27A',
  rose: '#E8A8B0',
  effervescent: '#D4C76F',
  pack: '#3A3A3A',
  mixte: '#5A5A5A',
};
