import { onRequest } from 'firebase-functions/v2/https';
import { Resend } from 'resend';
import { z } from 'zod';

const schema = z.object({
  name:     z.string().min(2).max(100),
  email:    z.string().email(),
  company:  z.string().max(100).optional(),
  service:  z.enum(['web', 'software', 'automatizacion', 'seo', 'otro']),
  message:  z.string().min(20).max(1000),
  honeypot: z.string().max(0).optional(),
});

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? 'daferur@gmail.com';

export const contact = onRequest(
  { region: 'europe-west1', cors: true },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ success: false, error: 'Method not allowed' });
      return;
    }

    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ success: false, error: 'Datos inválidos' });
      return;
    }

    const { honeypot, ...data } = parsed.data;

    // Honeypot anti-spam
    if (honeypot && honeypot.length > 0) {
      res.status(200).json({ success: true });
      return;
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: 'Avefenix Software <noreply@avefenixsoftware.com>',
        to: CONTACT_EMAIL,
        replyTo: data.email,
        subject: `Nuevo contacto: ${data.name} — ${data.service}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#1C1917;color:#F5F4F2;padding:32px;border-radius:12px;">
            <h2 style="color:#EA580C;margin-bottom:24px;">Nuevo mensaje de contacto</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#A8A29E;width:140px;">Nombre</td><td style="padding:8px 0;">${data.name}</td></tr>
              <tr><td style="padding:8px 0;color:#A8A29E;">Email</td><td style="padding:8px 0;"><a href="mailto:${data.email}" style="color:#EA580C;">${data.email}</a></td></tr>
              ${data.company ? `<tr><td style="padding:8px 0;color:#A8A29E;">Empresa</td><td style="padding:8px 0;">${data.company}</td></tr>` : ''}
              <tr><td style="padding:8px 0;color:#A8A29E;">Servicio</td><td style="padding:8px 0;">${data.service}</td></tr>
            </table>
            <div style="margin-top:24px;padding:20px;background:#0E0D0C;border-radius:8px;border-left:3px solid #EA580C;">
              <p style="color:#A8A29E;margin-bottom:8px;font-size:14px;">Mensaje:</p>
              <p style="white-space:pre-wrap;">${data.message}</p>
            </div>
          </div>
        `,
      });

      res.status(200).json({ success: true, message: 'Mensaje enviado correctamente' });
    } catch (err) {
      console.error('[contact function]', err);
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  }
);
