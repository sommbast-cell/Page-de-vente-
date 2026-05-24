'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cave-arve-cookies';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const close = (value: 'accepted' | 'refused') => {
    localStorage.setItem(STORAGE_KEY, value);
    setShow(false);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-50 bg-ink text-paper p-6 shadow-2xl fade-in-up">
      <p className="text-xs leading-relaxed mb-4">
        Ce site utilise uniquement les cookies techniques nécessaires à son fonctionnement
        (panier, session de paiement). Aucun traceur publicitaire.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => close('accepted')}
          className="text-xs uppercase tracking-widest px-4 py-2 bg-paper text-ink hover:opacity-80"
        >
          Accepter
        </button>
        <button
          onClick={() => close('refused')}
          className="text-xs uppercase tracking-widest px-4 py-2 border border-paper/40 hover:bg-paper/10"
        >
          Refuser
        </button>
      </div>
    </div>
  );
}
