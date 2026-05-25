import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

async function sendBrevoEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Epicurios Wine', email: 'agence.epicurios@outlook.com' },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo error: ${err}`);
  }
}

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') || '';
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('[webhook] signature invalide :', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const m = session.metadata || {};

    const firstName = m.customerFirstName || '';
    const lastName = m.customerLastName || '';
    const customerName = `${firstName} ${lastName}`.trim() || 'Client';
    const customerEmail = session.customer_details?.email || '';
    const customerPhone = m.customerPhone || '';
    const customerBirthDate = m.customerBirthDate || '';
    const customerAddress = m.customerAddress || '';
    const customerPostalCode = m.customerPostalCode || '';
    const customerCity = m.customerCity || '';
    const shippingLabel = m.shippingLabel || 'À définir';
    const total = ((session.amount_total || 0) / 100).toFixed(2);

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
      });

      const itemsHtml = lineItems.data.map(li =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${li.description}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${li.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${((li.amount_total || 0) / 100).toFixed(2)} €</td>
        </tr>`
      ).join('');

      if (customerEmail) {
        await sendBrevoEmail(
          customerEmail,
          'Confirmation de votre commande — Epicurios Wine',
          `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#0A0A0A;">
            <h1 style="font-size:28px;font-weight:500;">Merci pour votre commande</h1>
            <p>Bonjour ${firstName || customerName},</p>
            <p>Nous avons bien reçu votre commande. Une fois la vente terminée le 5 juin 2026, une validation sera effectuée sous 48h. Tous les produits hors stock seront remboursés ou se verront proposer une alternative équivalente. Le délai de livraison sera compris entre 5 et 10 jours ouvrés à partir du 7 juin 2026.</p>
            <h2 style="margin-top:32px;font-size:18px;">Détail de votre commande</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <thead><tr style="border-bottom:2px solid #0A0A0A;">
                <th style="text-align:left;padding:8px;">Vin</th>
                <th style="padding:8px;">Qté</th>
                <th style="text-align:right;padding:8px;">Total</th>
              </tr></thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <p style="margin-top:16px;"><strong>Livraison :</strong> ${shippingLabel}</p>
            <p style="font-size:18px;"><strong>Total : ${total} €</strong></p>
            <hr style="margin-top:32px;border:none;border-top:1px solid #eee;">
            <p style="font-size:11px;color:#888;">L'abus d'alcool est dangereux pour la santé. À consommer avec modération. Vente interdite aux mineurs.</p>
          </div>`
        );
      }

      await sendBrevoEmail(
        'agence.epicurios@outlook.com',
        `🍷 Nouvelle commande de ${customerName} — ${total} €`,
        `<div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto;">
          <h1 style="color:#8B1A1A;">🍷 Nouvelle commande</h1>
          <div style="background:#f4f2ee;padding:20px;margin:20px 0;">
            <h2 style="margin-top:0;font-size:16px;">Informations client</h2>
            <p><strong>Nom :</strong> ${customerName}</p>
            <p><strong>Email :</strong> ${customerEmail}</p>
            <p><strong>Téléphone :</strong> ${customerPhone}</p>
            <p><strong>Date de naissance :</strong> ${customerBirthDate}</p>
          </div>
          <div style="background:#fff;border:1px solid #ddd;padding:20px;margin:20px 0;">
            <h2 style="margin-top:0;font-size:16px;">Livraison</h2>
            <p><strong>${shippingLabel}</strong></p>
            ${shippingLabel.includes('Retrait') ? '<p>⚠️ Contacter le client pour fixer un RDV.</p>' :
              `<p>${customerAddress}<br>${customerPostalCode} ${customerCity}</p>`}
          </div>
          <h2 style="font-size:16px;">Commande</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead><tr style="border-bottom:2px solid #0A0A0A;background:#f4f2ee;">
              <th style="text-align:left;padding:8px;">Vin</th>
              <th style="padding:8px;">Qté</th>
              <th style="text-align:right;padding:8px;">Total</th>
            </tr></thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <p style="font-size:20px;text-align:right;margin-top:16px;"><strong>Total : ${total} €</strong></p>
          <p style="font-size:11px;color:#888;">Session Stripe : ${session.id} — ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
        </div>`
      );

    } catch (err) {
      console.error('[webhook] erreur email :', err);
    }
  }

  return NextResponse.json({ received: true });
}
