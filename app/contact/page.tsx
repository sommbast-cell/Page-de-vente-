'use client';

import { useState } from 'react';
import { siteConfig } from '@/lib/data';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-ink/50 mb-3">Contact</p>
      <h1 className="font-display text-5xl mb-4">Une question ?</h1>
      <p className="text-ink/70 mb-10">
        Devis livraison, conseil sur les vins, retrait au dépôt, organisation d&apos;une commande
        groupée pour un événement. Écrivez-nous, on revient vers vous rapidement.
      </p>

      {/* Bloc contacts directs */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {/* WhatsApp */}
        <a
          href={`https://wa.me/${siteConfig.site.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group block bg-ink text-paper p-6 transition-all hover:bg-accent"
        >
          <div className="flex items-center gap-3 mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <h3 className="font-display text-xl">WhatsApp</h3>
          </div>
          <p className="text-sm opacity-90 mb-2">Réponse rapide en journée.</p>
          <p className="font-medium tracking-wide">{siteConfig.site.phone}</p>
          <p className="text-[0.65rem] uppercase tracking-widest opacity-70 mt-3 group-hover:opacity-100">
            Démarrer un chat →
          </p>
        </a>

        {/* Email */}
        <a
          href={`mailto:${siteConfig.site.email}`}
          className="group block bg-cream p-6 transition-all hover:bg-stone"
        >
          <div className="flex items-center gap-3 mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="1"/>
              <path d="m3 7 9 6 9-6"/>
            </svg>
            <h3 className="font-display text-xl">Email</h3>
          </div>
          <p className="text-sm text-ink/70 mb-2">Pour les demandes détaillées.</p>
          <p className="font-medium tracking-wide text-sm break-all">{siteConfig.site.email}</p>
        </a>

        {/* Téléphone */}
        <a
          href={`tel:+${siteConfig.site.whatsapp}`}
          className="group block bg-cream p-6 transition-all hover:bg-stone"
        >
          <div className="flex items-center gap-3 mb-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z"/>
            </svg>
            <h3 className="font-display text-xl">Téléphone</h3>
          </div>
          <p className="text-sm text-ink/70 mb-2">Pour parler de vive voix.</p>
          <p className="font-medium tracking-wide">{siteConfig.site.phone}</p>
        </a>
      </div>

      {/* Formulaire */}
      <div className="border-t border-stone pt-12">
        <h2 className="font-display text-3xl mb-2">Ou via ce formulaire</h2>
        <p className="text-ink/60 text-sm mb-8">Nous vous répondons par email sous 24 heures.</p>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">Nom</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-stone bg-paper px-4 py-3 focus:outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-stone bg-paper px-4 py-3 focus:outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2">Message</label>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-stone bg-paper px-4 py-3 focus:outline-none focus:border-ink resize-none"
            />
          </div>

          <button type="submit" disabled={status === 'sending'} className="btn-primary">
            {status === 'sending' ? 'Envoi en cours' : 'Envoyer'}
          </button>

          {status === 'sent' && (
            <p className="text-sm bg-cream p-4">Merci ! Votre message a bien été envoyé.</p>
          )}
          {status === 'error' && (
            <p className="text-sm bg-accent/10 text-accent p-4">
              Une erreur est survenue. Réessayez ou écrivez-nous directement par email.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
