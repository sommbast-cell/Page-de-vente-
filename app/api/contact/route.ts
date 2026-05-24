import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { siteConfig } from '@/lib/data';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    const adminEmail = process.env.CONTACT_EMAIL;
    if (!adminEmail) {
      return NextResponse.json({ error: 'Email destinataire non configuré' }, { status: 500 });
    }

    await resend.emails.send({
      from: `${siteConfig.site.name} <onboarding@resend.dev>`,
      to: adminEmail,
      replyTo: email,
      subject: `📩 Nouveau message de ${name}`,
      html: `
        <h2>Nouveau message</h2>
        <p><strong>De :</strong> ${name} (${email})</p>
        <p><strong>Message :</strong></p>
        <p style="white-space:pre-wrap;background:#f4f2ee;padding:16px;">${message}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[contact] erreur :', e);
    return NextResponse.json({ error: e.message || 'Erreur serveur' }, { status: 500 });
  }
}
