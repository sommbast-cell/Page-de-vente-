'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { wines, formatPrice, siteConfig, isSaleActive } from '@/lib/data';
import BottlePlaceholder from '@/components/BottlePlaceholder';
import SaleBanner from '@/components/SaleBanner';

// État du formulaire client
interface ClientForm {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  gdprConsent: boolean;
  ageConsent: boolean;
}

const emptyForm: ClientForm = {
  firstName: '',
  lastName: '',
  birthDate: '',
  email: '',
  phone: '',
  address: '',
  postalCode: '',
  city: '',
  gdprConsent: false,
  ageConsent: false,
};

export default function PanierPage() {
  const items = useCart((s) => s.items);
  const shippingId = useCart((s) => s.shippingId);
  const setShipping = useCart((s) => s.setShipping);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'cart' | 'info'>('cart');
  const [form, setForm] = useState<ClientForm>(emptyForm);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const detailedItems = useMemo(() => {
    return items.map((i) => {
      const wine = wines.find((w) => w.slug === i.slug);
      return wine ? { wine, quantity: i.quantity } : null;
    }).filter(Boolean) as { wine: typeof wines[0]; quantity: number }[];
  }, [items]);

  const subtotal = detailedItems.reduce(
    (sum, { wine, quantity }) => sum + wine.price * quantity,
    0
  );

  const shippingOption = siteConfig.shipping.options.find((o) => o.id === shippingId);
  const shippingPrice = shippingOption?.price ?? 0;
  const isQuoteOnly = shippingOption?.quoteOnly === true;
  const total = subtotal + shippingPrice;
  const saleActive = isSaleActive();

  // Validation du formulaire client
  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!form.firstName.trim()) errors.push('Le prénom est requis.');
    if (!form.lastName.trim()) errors.push('Le nom est requis.');
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.push('Un email valide est requis.');
    }
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 9) {
      errors.push('Un numéro de téléphone valide est requis.');
    }
    if (!form.birthDate) {
      errors.push('La date de naissance est requise.');
    } else {
      const birth = new Date(form.birthDate);
      const age = (Date.now() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 18) errors.push('Vous devez avoir au moins 18 ans pour commander.');
      if (age > 120) errors.push('Date de naissance invalide.');
    }
    // Adresse requise seulement si livraison (pas pour retrait au dépôt)
    if (shippingId !== 'pickup') {
      if (!form.address.trim()) errors.push('L\'adresse de livraison est requise.');
      if (!form.postalCode.trim()) errors.push('Le code postal est requis.');
      if (!form.city.trim()) errors.push('La ville est requise.');
    }
    if (!form.ageConsent) errors.push('Vous devez confirmer avoir plus de 18 ans.');
    if (!form.gdprConsent) errors.push('Vous devez accepter la politique de confidentialité.');
    return errors;
  };

  const handleProceedToInfo = () => {
    if (isQuoteOnly) return;
    setStep('info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = async () => {
    if (!saleActive || isQuoteOnly) return;
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors([]);
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shippingId, customer: form }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (e) {
      setError('Erreur réseau. Réessayez.');
    }
    setLoading(false);
  };

  if (detailedItems.length === 0) {
    return (
      <>
        <SaleBanner />
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <h1 className="font-display text-5xl mb-4">Votre panier est vide</h1>
          <p className="text-ink/60 mb-8">Composez votre cave depuis la boutique.</p>
          <Link href="/boutique" className="btn-primary">Voir les vins</Link>
        </div>
      </>
    );
  }

  // ÉTAPE 1 : RÉCAP PANIER
  if (step === 'cart') {
    return (
      <>
        <SaleBanner />
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
          <h1 className="font-display text-5xl mb-2">Votre commande</h1>
          <p className="text-xs uppercase tracking-widest text-ink/50 mb-12">Étape 1 sur 2 : récapitulatif</p>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Articles */}
            <div className="lg:col-span-2 space-y-6">
              <ul className="space-y-4">
                {detailedItems.map(({ wine, quantity }) => (
                  <li key={wine.slug} className="flex gap-6 p-4 bg-cream/40 border border-stone">
                    <div className="w-24 h-32 bg-paper flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={`/images/wines/${wine.slug}.jpg`}
                        alt={wine.name}
                        className="w-full h-full object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <Link href={`/vins/${wine.slug}`} className="font-display text-xl hover:italic">
                          {wine.name}
                        </Link>
                        <p className="text-xs text-ink/60 mt-1">{wine.appellation} · {wine.vintage}</p>
                        <p className="text-xs text-ink/60">{formatPrice(wine.price)} la bouteille</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-stone bg-paper">
                          <button
                            onClick={() => updateQuantity(wine.slug, quantity - wine.minOrder)}
                            className="px-3 py-1 hover:bg-cream"
                            aria-label="Diminuer"
                          >−</button>
                          <span className="px-3 py-1">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(wine.slug, quantity + wine.minOrder)}
                            className="px-3 py-1 hover:bg-cream"
                            aria-label="Augmenter"
                          >+</button>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-display text-xl">{formatPrice(wine.price * quantity)}</span>
                          <button
                            onClick={() => removeItem(wine.slug)}
                            className="text-xs uppercase tracking-widest text-ink/50 hover:text-accent"
                            aria-label="Retirer"
                          >✕</button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Livraison */}
              <div className="border border-stone p-6 mt-8">
                <h2 className="font-display text-2xl mb-4">Mode de livraison</h2>
                <div className="space-y-3">
                  {siteConfig.shipping.options.map((opt) => (
                    <label
                      key={opt.id}
                      className={`block p-4 border cursor-pointer transition-all ${
                        shippingId === opt.id ? 'border-ink bg-cream' : 'border-stone hover:bg-cream/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={opt.id}
                          checked={shippingId === opt.id}
                          onChange={() => setShipping(opt.id)}
                          className="mt-1.5"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline">
                            <span className="font-medium">{opt.label}</span>
                            <span className="font-display text-lg">
                              {opt.quoteOnly ? 'Devis' : opt.price === 0 ? 'Gratuit' : formatPrice(opt.price)}
                            </span>
                          </div>
                          <p className="text-xs text-ink/60 mt-1">{opt.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Récap */}
            <div>
              <div className="sticky top-32 bg-ink text-paper p-8 space-y-4">
                <h2 className="font-display text-2xl mb-2">Récapitulatif</h2>
                <div className="space-y-2 pb-4 border-b border-paper/20 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-70">Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Livraison</span>
                    <span>
                      {isQuoteOnly ? 'Sur devis' : shippingPrice === 0 ? 'Gratuit' : formatPrice(shippingPrice)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm uppercase tracking-widest">Total</span>
                  <span className="font-display text-3xl">
                    {isQuoteOnly ? 'Sur devis' : formatPrice(total)}
                  </span>
                </div>
                <p className="text-[0.65rem] opacity-60">{siteConfig.legal.tvaNote}</p>

                {isQuoteOnly ? (
                  <Link href="/contact" className="block w-full text-center px-6 py-4 bg-paper text-ink uppercase tracking-widest text-xs">
                    Demander un devis
                  </Link>
                ) : (
                  <button
                    onClick={handleProceedToInfo}
                    disabled={!saleActive}
                    className="w-full px-6 py-4 bg-paper text-ink uppercase tracking-widest text-xs hover:opacity-80 disabled:opacity-50"
                  >
                    {saleActive ? 'Étape suivante : mes infos' : 'Vente fermée'}
                  </button>
                )}

                <div className="pt-4 text-[0.65rem] opacity-60 space-y-1">
                  <p>Paiement 3D Secure via Stripe.</p>
                  <p>Remboursement si rupture de stock.</p>
                  <p>Validation sous 48h après le 5 juin 2026.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ÉTAPE 2 : INFORMATIONS CLIENT
  return (
    <>
      <SaleBanner />
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-12">
        <button
          onClick={() => setStep('cart')}
          className="text-xs uppercase tracking-widest text-ink/60 hover:text-ink mb-4"
        >
          ← Retour au panier
        </button>

        <h1 className="font-display text-5xl mb-2">Vos informations</h1>
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-12">
          Étape 2 sur 2 : création de compte
        </p>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Formulaire */}
          <div className="lg:col-span-2 space-y-8">
            <p className="text-sm text-ink/70 bg-cream/60 p-4">
              Ces informations sont indispensables pour valider votre commande et organiser la livraison.
              Elles sont strictement confidentielles et ne seront jamais transmises à des tiers.
            </p>

            {/* Identité */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl">Identité</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full border border-stone bg-paper px-4 py-3 focus:outline-none focus:border-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Nom *</label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full border border-stone bg-paper px-4 py-3 focus:outline-none focus:border-ink"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">
                  Date de naissance * <span className="text-ink/50 normal-case tracking-normal">(obligatoire, vente d&apos;alcool)</span>
                </label>
                <input
                  type="date"
                  required
                  value={form.birthDate}
                  onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                  className="w-full border border-stone bg-paper px-4 py-3 focus:outline-none focus:border-ink"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h2 className="font-display text-2xl">Contact</h2>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-stone bg-paper px-4 py-3 focus:outline-none focus:border-ink"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2">Téléphone *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="06 12 34 56 78"
                  className="w-full border border-stone bg-paper px-4 py-3 focus:outline-none focus:border-ink"
                />
              </div>
            </div>

            {/* Adresse - uniquement si livraison */}
            {shippingId !== 'pickup' && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl">Adresse de livraison</h2>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2">Adresse *</label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="12 rue des Vignes"
                    className="w-full border border-stone bg-paper px-4 py-3 focus:outline-none focus:border-ink"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2">Code postal *</label>
                    <input
                      type="text"
                      required
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      placeholder="74130"
                      className="w-full border border-stone bg-paper px-4 py-3 focus:outline-none focus:border-ink"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs uppercase tracking-widest mb-2">Ville *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="Bonneville"
                      className="w-full border border-stone bg-paper px-4 py-3 focus:outline-none focus:border-ink"
                    />
                  </div>
                </div>
              </div>
            )}

            {shippingId === 'pickup' && (
              <div className="bg-cream/60 p-4 text-sm text-ink/80">
                <strong>Retrait au dépôt :</strong> l&apos;adresse exacte du dépôt à Bonneville
                vous sera communiquée par email après validation de votre commande, avec proposition
                d&apos;un rendez-vous.
              </div>
            )}

            {/* RGPD et confirmations */}
            <div className="space-y-3 pt-6 border-t border-stone">
              <label className="flex items-start gap-3 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={form.ageConsent}
                  onChange={(e) => setForm({ ...form, ageConsent: e.target.checked })}
                  className="mt-1"
                />
                <span>
                  Je certifie avoir plus de 18 ans et être en mesure d&apos;acheter légalement de
                  l&apos;alcool. *
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={form.gdprConsent}
                  onChange={(e) => setForm({ ...form, gdprConsent: e.target.checked })}
                  className="mt-1"
                />
                <span>
                  J&apos;accepte que mes données personnelles soient utilisées pour le traitement
                  de ma commande, conformément à la <Link href="/confidentialite" className="underline">politique de confidentialité</Link>.
                  Elles ne seront jamais cédées à des tiers. *
                </span>
              </label>
            </div>

            {/* Erreurs */}
            {formErrors.length > 0 && (
              <div className="bg-accent/10 border border-accent p-4 text-sm">
                <p className="font-medium text-accent mb-2">Merci de corriger ces points :</p>
                <ul className="list-disc pl-5 space-y-1 text-ink/80">
                  {formErrors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Récap sticky */}
          <div>
            <div className="sticky top-32 bg-ink text-paper p-8 space-y-4">
              <h2 className="font-display text-2xl mb-2">Votre commande</h2>

              <ul className="space-y-2 pb-4 border-b border-paper/20 text-sm">
                {detailedItems.map(({ wine, quantity }) => (
                  <li key={wine.slug} className="flex justify-between gap-2">
                    <span className="opacity-80 truncate">{quantity}× {wine.name}</span>
                    <span className="flex-shrink-0">{formatPrice(wine.price * quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 pb-4 border-b border-paper/20 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-70">Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Livraison</span>
                  <span>{shippingPrice === 0 ? 'Gratuit' : formatPrice(shippingPrice)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-sm uppercase tracking-widest">Total</span>
                <span className="font-display text-3xl">{formatPrice(total)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || !saleActive}
                className="w-full px-6 py-4 bg-paper text-ink uppercase tracking-widest text-xs hover:opacity-80 disabled:opacity-50"
              >
                {loading ? 'Redirection...' : 'Payer en sécurité'}
              </button>

              {error && <p className="text-xs text-accent bg-paper/10 p-3">{error}</p>}

              <div className="pt-4 text-[0.65rem] opacity-60 space-y-1">
                <p>Paiement 3D Secure via Stripe.</p>
                <p>Aucune donnée bancaire stockée sur ce site.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
