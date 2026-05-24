'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart';
import Logo from './Logo';
import { useEffect, useState } from 'react';

export default function Header() {
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-paper/95 backdrop-blur-md border-b border-stone' : 'bg-paper'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <Logo />

        <nav className="hidden md:flex items-center gap-10 text-xs uppercase tracking-[0.2em]">
          <Link href="/boutique" className="hover:opacity-60 transition-opacity">
            Boutique
          </Link>
          <Link href="/domaine" className="hover:opacity-60 transition-opacity">
            La Maison
          </Link>
          <Link href="/contact" className="hover:opacity-60 transition-opacity">
            Contact
          </Link>
        </nav>

        <button
          onClick={openCart}
          aria-label="Ouvrir le panier"
          className="relative flex items-center gap-2 hover:opacity-60 transition-opacity"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {mounted && count > 0 && (
            <span className="absolute -top-2 -right-3 bg-ink text-paper rounded-full w-5 h-5 flex items-center justify-center text-[0.65rem] font-medium">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
