import { wines, siteConfig } from '@/lib/data';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const now = new Date();

  const staticPages = [
    '',
    '/boutique',
    '/domaine',
    '/contact',
    '/cgv',
    '/mentions-legales',
    '/confidentialite',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7,
  }));

  const winePages = wines.map((w) => ({
    url: `${baseUrl}/vins/${w.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...winePages];
}
