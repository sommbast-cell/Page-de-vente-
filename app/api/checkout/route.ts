import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { wines, siteConfig, isSaleActive } from '@/lib/data';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

interface CustomerInfo {
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

export async function POST(req: Request) {
  if (!isSaleActive()) {
    return NextResponse.json({ error: 'La vente est fermée.' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { items, shippingId, customer } = body as {
      items: { slug: string; quantity: number }[];
      shippingId: string;
      customer: CustomerInfo;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide.' }, { status: 400 });
    }

    // Validation server-side du formulaire client
    if (!customer || !customer.firstName || !customer.lastName || !customer.email || !customer.phone || !customer.birthDate) {
      return NextResponse.json({ error: 'Informations client incomplètes.' }, { status: 400 });
    }
    if (!customer.ageConsent || !customer.gdprConsent) {
      return NextResponse.json({ error: 'Les consentements sont obligatoires.' }, { status: 400 });
    }

    // Vérification âge 18+
    const birth = new Date(customer.birthDate);
    const ageInYears = (Date.now() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (ageInYears < 18) {
      return NextResponse.json({ error: 'Vous devez avoir au moins 18 ans.' }, { status: 400 });
    }

    const shippingOption = siteConfig.shipping.options.find((o) => o.id === shippingId);
    if (!shippingOption || shippingOption.quoteOnly) {
      return NextResponse.json({ error: 'Option de livraison invalide.' }, { status: 400 });
    }

    // Validation adresse pour livraison
    if (shippingId !== 'pickup' && (!customer.address || !customer.postalCode || !customer.city)) {
      return NextResponse.json({ error: 'Adresse de livraison incomplète.' }, { status: 400 });
    }

    // Construit les line_items pour Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      const wine = wines.find((w) => w.slug === item.slug);
      if (!wine) throw new Error(`Vin introuvable : ${item.slug}`);
      if (item.quantity < wine.minOrder) {
        throw new Error(`Quantité minimum non respectée pour ${wine.name}.`);
      }
      if (item.quantity % wine.minOrder !== 0) {
        throw new Error(`${wine.name} se commande par multiple de ${wine.minOrder}.`);
      }
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${wine.name} ${wine.vintage}`,
            description: `${wine.appellation} · ${wine.volume}`,
            metadata: { slug: wine.slug },
          },
          unit_amount: Math.round(wine.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.headers.get('origin') ||
      'http://localhost:3000';

    // On crée d'abord un Customer Stripe pour stocker proprement les infos
    const stripeCustomer = await stripe.customers.create({
      email: customer.email,
      name: `${customer.firstName} ${customer.lastName}`,
      phone: customer.phone,
      address: shippingId !== 'pickup' ? {
        line1: customer.address,
        postal_code: customer.postalCode,
        city: customer.city,
        country: 'FR',
      } : undefined,
      metadata: {
        birthDate: customer.birthDate,
        firstName: customer.firstName,
        lastName: customer.lastName,
        gdprConsent: customer.gdprConsent ? 'oui' : 'non',
        ageConsent: customer.ageConsent ? 'oui' : 'non',
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      // Stripe applique 3DS automatiquement en EU via SCA
      line_items: lineItems,
      shipping_options: shippingOption.price === 0
        ? undefined
        : [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: Math.round(shippingOption.price * 100),
                  currency: 'eur',
                },
                display_name: shippingOption.label,
              },
            },
          ],
      // L'adresse a déjà été collectée en amont, on ne la redemande pas
      locale: 'fr',
      metadata: {
        shippingId,
        shippingLabel: shippingOption.label,
        customerFirstName: customer.firstName,
        customerLastName: customer.lastName,
        customerBirthDate: customer.birthDate,
        customerPhone: customer.phone,
        customerAddress: customer.address || 'Retrait au dépôt',
        customerPostalCode: customer.postalCode || '',
        customerCity: customer.city || '',
      },
      success_url: `${origin}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/panier`,
      custom_text: {
        submit: {
          message:
            'En validant cette commande, vous confirmez avoir 18 ans ou plus et acceptez les CGV. Une fois la vente terminée le 5 juin 2026, votre commande sera validée sous 48h.',
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error('[checkout] erreur :', e);
    return NextResponse.json({ error: e.message || 'Erreur serveur' }, { status: 500 });
  }
}
