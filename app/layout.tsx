import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AgeGate from '@/components/AgeGate';
import CookieBanner from '@/components/CookieBanner';
import CartDrawer from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.site.name} · ${siteConfig.site.tagline}`,
    template: `%s | ${siteConfig.site.name}`,
  },
  description: siteConfig.site.description,
  openGraph: {
    title: siteConfig.site.name,
    description: siteConfig.site.description,
    type: 'website',
    locale: 'fr_FR',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <AgeGate />
        <Header />
        <CartDrawer />
        <main className="min-h-screen pt-20">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
