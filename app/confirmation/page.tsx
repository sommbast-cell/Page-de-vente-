import Link from 'next/link';
import Stripe from 'stripe';
import ClearCart from '@/components/ClearCart';
import { siteConfig } from '@/lib/data';

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export default async function ConfirmationPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;
  let customerEmail = '';
  let total = '';
  let isPaid = false;

  if (sessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      customerEmail = session.customer_details?.email || '';
      total = ((session.amount_total || 0) / 100).toFixed(2);
      isPaid = session.payment_status === 'paid';
    } catch (e) {
      console.error('[confirmation] session introuvable :', e);
    }
  }

  return (
    <>
      <ClearCart />
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-ink mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-display text-5xl mb-4">Merci !</h1>
          <p className="text-ink/70 leading-relaxed">
            Votre commande a bien été enregistrée.
            {customerEmail && (
              <>
                <br />Une confirmation vous a été envoyée à <strong>{customerEmail}</strong>.
              </>
            )}
          </p>
        </div>

        {total && (
          <div className="bg-cream p-6 mb-8 inline-block">
            <p className="text-xs uppercase tracking-widest text-ink/60">Total réglé</p>
            <p className="font-display text-4xl">{total} €</p>
          </div>
        )}

        <div className="space-y-4 text-left bg-paper border border-stone p-6 mb-8 text-sm">
          <h2 className="font-display text-xl text-center mb-2">Et maintenant ?</h2>
          <div className="flex gap-3">
            <span className="font-display text-2xl text-ink/40">01</span>
            <p className="text-ink/75">
              Nous validons votre commande sous <strong>48h après la clôture de la vente (5 juin 2026)</strong>
              et vérifions la disponibilité de chaque vin.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="font-display text-2xl text-ink/40">02</span>
            <p className="text-ink/75">
              En cas de rupture, nous vous proposons un <strong>remboursement immédiat</strong> ou
              un substitut équivalent. Vous choisissez.
            </p>
          </div>
          <div className="flex gap-3">
            <span className="font-display text-2xl text-ink/40">03</span>
            <p className="text-ink/75">
              Délai de mise à disposition : <strong>5 à 10 jours ouvrés à partir du 7 juin 2026</strong>.
              Nous vous contactons pour fixer un rendez-vous de livraison ou de retrait.
            </p>
          </div>
        </div>

        <Link href="/" className="btn-secondary">Retour à l&apos;accueil</Link>
      </div>
    </>
  );
}
