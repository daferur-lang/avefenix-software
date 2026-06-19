import type { APIRoute } from 'astro';

export const prerender = false;
import { z } from 'zod';
import { sendContactEmail } from '@/lib/resend';

const schema = z.object({
  name:     z.string().min(2).max(100),
  email:    z.string().email(),
  company:  z.string().max(100).optional(),
  service:  z.enum(['web', 'software', 'automatizacion', 'seo', 'otro']),
  message:  z.string().min(20).max(1000),
  honeypot: z.string().max(0).optional(),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as unknown;
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ success: false, error: 'Datos inválidos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { honeypot, ...data } = parsed.data;

    // Honeypot — si tiene valor, silenciar sin procesar
    if (honeypot && honeypot.length > 0) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await sendContactEmail(data);

    return new Response(
      JSON.stringify({ success: true, message: 'Mensaje enviado correctamente' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[contact API]', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
