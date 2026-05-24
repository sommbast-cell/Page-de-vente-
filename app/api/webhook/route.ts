import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { siteConfig } from '@/lib/data';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});
const resend = new Resend(process.env.RESEND_API_KEY);

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

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
        expand: ['data.price.product'],
      });

      const itemsHtml = lineItems.data
        .map(
          (li) =>
            `<tr>
              <td style="padding:8px;border-bottom:1px solid #eee;">${li.description}</td>
              <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${li.quantity}</td>
              <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${((li.amount_total || 0) / 100).toFixed(2)} €</td>
            </tr>`
        )
        .join('');

      // Infos client depuis les metadata
      const m = session.metadata || {};
      const firstName = m.customerFirstName || '';
      const lastName = m.customerLastName || '';
      const customerName = `${firstName} ${lastName}`.trim() || session.customer_details?.name || 'Client';
      const customerEmail = session.customer_details?.email || '';
      const customerPhone = m.customerPhone || session.customer_details?.phone || '';
      const customerBirthDate = m.customerBirthDate || '';
      const customerAddress = m.customerAddress || '';
      const customerPostalCode = m.customerPostalCode || '';
      const customerCity = m.customerCity || '';
      const total = ((session.amount_total || 0) / 100).toFixed(2);
      const shippingLabel = m.shippingLabel || 'À définir';

      // Email au client
      const clientHtml = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #0A0A0A;">
          <h1 style="font-size: 32px; font-weight: 500;">Merci pour votre commande</h1>
          <p>Bonjour ${firstName || customerName},</p>
          <p>Nous avons bien reçu votre commande. Une fois la vente terminée le 5 juin 2026, elle sera validée sous 48h. Tous les produits hors stock seront remboursés ou se verront proposer une alternative équivalente. La livraison aura lieu entre 5 et 10 jours ouvrés à partir du 7 juin.</p>
          <p>En cas de rupture sur un vin, nous vous proposerons un remboursement ou un substitut équivalent.</p>

          <h2 style="margin-top:32px;font-size:20px;">Détails</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="border-bottom:2px solid #0A0A0A;">
                <th style="text-align:left;padding:8px;">Vin</th>
                <th style="padding:8px;">Qté</th>
                <th style="text-align:right;padding:8px;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <p style="margin-top:16px;"><strong>Livraison :</strong> ${shippingLabel}</p>
          <p style="font-size:18px;"><strong>Total : ${total} €</strong></p>

          <p style="margin-top:24px;font-size:12px;color:#666;">${siteConfig.legal.tvaNote}</p>

          <hr style="margin-top:32px;border:none;border-top:1px solid #eee;">
          <p style="font-size:11px;color:#888;">${siteConfig.legal.evinNotice}</p>
          <p style="font-size:11px;color:#888;">${siteConfig.site.name}</p>
        </div>
      `;

      if (customerEmail) {
        await resend.emails.send({
          from: `${siteConfig.site.shortName} <onboarding@resend.dev>`, // À changer pour votre domaine vérifié
          to: customerEmail,
          subject: `Confirmation de votre commande, ${siteConfig.site.name}`,
          html: clientHtml,
        });
      }

      // Email à l'admin (Bastien) avec TOUTES les infos pour préparer le colis
      const adminEmail = process.env.CONTACT_EMAIL || 'agence.epicurios@outlook.com';
      const adminHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #0A0A0A;">
          <h1 style="font-size: 26px; color: #8B1A1A;">🍷 Nouvelle commande</h1>

          <div style="background:#f4f2ee;padding:20px;margin:20px 0;">
            <h2 style="font-size:18px;margin-top:0;">Informations client</h2>
            <table style="width:100%;font-size:14px;">
              <tr><td style="padding:4px 0;width:160px;"><strong>Nom complet :</strong></td><td>${customerName}</td></tr>
              <tr><td style="padding:4px 0;"><strong>Email :</strong></td><td><a href="mailto:${customerEmail}">${customerEmail}</a></td></tr>
              <tr><td style="padding:4px 0;"><strong>Téléphone :</strong></td><td><a href="tel:${customerPhone}">${customerPhone}</a></td></tr>
              <tr><td style="padding:4px 0;"><strong>Date de naissance :</strong></td><td>${customerBirthDate}</td></tr>
            </table>
          </div>

          <div style="background:#fff;border:1px solid #ddd;padding:20px;margin:20px 0;">
            <h2 style="font-size:18px;margin-top:0;">Mode de livraison</h2>
            <p style="font-size:16px;margin:4px 0;"><strong>${shippingLabel}</strong></p>
            ${shippingLabel.includes('Retrait')
              ? '<p style="color:#666;font-size:13px;">⚠️ Recontacter le client pour fixer un RDV au dépôt.</p>'
              : `
                <p style="margin:8px 0;">
                  ${customerAddress}<br>
                  ${customerPostalCode} ${customerCity}
                </p>
                <p style="color:#666;font-size:13px;">⚠️ Livraison sur RDV à organiser sous 5-10 jours ouvrés.</p>
              `}
          </div>

          <h2 style="font-size:18px;">Détail de la commande</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="border-bottom:2px solid #0A0A0A;background:#f4f2ee;">
                <th style="text-align:left;padding:8px;">Vin</th>
                <th style="padding:8px;">Qté</th>
                <th style="text-align:right;padding:8px;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <p style="font-size:20px;text-align:right;margin-top:16px;">
            <strong>Total réglé : ${total} €</strong>
          </p>

          <hr style="margin-top:32px;border:none;border-top:1px solid #eee;">
          <p style="font-size:11px;color:#888;">
            Cette commande a été payée via Stripe avec authentification 3D Secure.<br>
            Session ID : ${session.id}<br>
            Date : ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
          </p>
        </div>
      `;

      await resend.emails.send({
        from: `${siteConfig.site.shortName} <onboarding@resend.dev>`,
        to: adminEmail,
        subject: `🍷 Nouvelle commande de ${customerName}, ${total} €`,
        html: adminHtml,
      });
    } catch (err) {
      console.error('[webhook] erreur envoi email :', err);
    }
  }

  return NextResponse.json({ received: true });
}

export const dynamic = 'force-dynamic';
