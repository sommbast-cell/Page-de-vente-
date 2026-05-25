'use client';

import { useEffect, useState } from 'react';
import { siteConfig, getSaleStatus, formatDateTime } from '@/lib/data';

export default function SaleBanner() {
  // On ne rend rien côté serveur, et on attend que le client soit "monté"
  // pour éviter les erreurs d'hydratation (le temps évolue à chaque render).
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<'upcoming' | 'active' | 'ended'>('upcoming');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    setMounted(true);

    const update = () => {
      setStatus(getSaleStatus());

      const end = new Date(siteConfig.sale.endDate).getTime();
      
      const now = Date.now();

      // Si la vente est à venir, on affiche le temps avant l'ouverture
      // Si la vente est en cours, on affiche le temps avant la clôture
      const target = end;
      const diff = target - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        setTimeLeft(`${days}j ${hours}h ${minutes}min`);
      }
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  // Avant le mount, on rend un placeholder neutre pour éviter le mismatch
  if (!mounted) {
    return (
      <div className="bg-ink text-paper py-3 px-6 text-center text-xs uppercase tracking-[0.2em]">
        Vente en cours · Clôture le {formatDateTime(siteConfig.sale.endDate)}
      </div>
    );
  }

  if (status === 'ended') {
    return (
      <div className="bg-ink text-paper py-3 px-6 text-center text-xs uppercase tracking-[0.2em]">
        La vente est terminée. Merci à tous les participants.
      </div>
    );
  }

  if (status === 'upcoming') {
    return (
      <div className="bg-ink text-paper py-3 px-6 text-center text-xs uppercase tracking-[0.2em]">
        <span className="opacity-80">Ouverture dans </span>
        <span className="font-medium">{timeLeft}</span>
      </div>
    );
  }

  return (
    <div className="bg-ink text-paper py-3 px-6 text-center text-xs uppercase tracking-[0.2em]">
      <span className="opacity-80">Vente en cours · Clôture dans </span>
      <span className="font-medium">{timeLeft}</span>
    </div>
  );
}
