'use client';

import { useEffect, useState } from 'react';
import { siteConfig } from '@/lib/data';

const STORAGE_KEY = 'cave-arve-age-verified';

export default function AgeGate() {
  const [verified, setVerified] = useState(true);

  useEffect(() => {
    if (!siteConfig.legal.ageGate) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    setVerified(stored === 'true');
  }, []);

  if (verified) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-md flex items-center justify-center px-6">
      <div className="max-w-lg w-full bg-paper p-10 md:p-14 text-center fade-in-up">
        <div className="mb-6">
          <div className="inline-block w-16 h-1 bg-ink mb-8" />
          <h2 className="font-display text-3xl md:text-4xl mb-4">
            Avez-vous l&apos;âge légal pour consommer de l&apos;alcool ?
          </h2>
          <p className="text-sm text-ink/70 leading-relaxed">
            Pour accéder à ce site, vous devez être âgé(e) d&apos;au moins 18 ans.
            La vente d&apos;alcool aux mineurs est strictement interdite.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, 'true');
              setVerified(true);
            }}
            className="btn-primary"
          >
            J&apos;ai plus de 18 ans
          </button>
          <a href="https://www.google.com" className="btn-secondary">
            Quitter le site
          </a>
        </div>

        <p className="text-xs text-ink/50 mt-8 pt-6 border-t border-stone">
          {siteConfig.legal.evinNotice}
        </p>
      </div>
    </div>
  );
}
