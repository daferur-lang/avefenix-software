import { z } from 'zod';
import { Resend } from 'resend';

async function sendContactEmail(data) {
  const resend = new Resend(undefined                              );
  const to = "daferur@gmail.com";
  await resend.emails.send({
    from: "Avefenix Software <noreply@avefenixsoftware.com>",
    to,
    replyTo: data.email,
    subject: `Nuevo contacto: ${data.name} — ${data.service}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#1C1917;color:#F5F4F2;padding:32px;border-radius:12px;">
        <h2 style="color:#EA580C;margin-bottom:24px;">Nuevo mensaje de contacto</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#A8A29E;width:140px;">Nombre</td><td style="padding:8px 0;">${data.name}</td></tr>
          <tr><td style="padding:8px 0;color:#A8A29E;">Email</td><td style="padding:8px 0;"><a href="mailto:${data.email}" style="color:#EA580C;">${data.email}</a></td></tr>
          ${data.company ? `<tr><td style="padding:8px 0;color:#A8A29E;">Empresa</td><td style="padding:8px 0;">${data.company}</td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#A8A29E;">Servicio</td><td style="padding:8px 0;">${data.service}</td></tr>
        </table>
        <div style="margin-top:24px;padding:20px;background:#0E0D0C;border-radius:8px;border-left:3px solid #EA580C;">
          <p style="color:#A8A29E;margin-bottom:8px;font-size:14px;">Mensaje:</p>
          <p style="white-space:pre-wrap;">${data.message}</p>
        </div>
      </div>
    `
  });
}

const prerender = false;
const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
  service: z.enum(["web", "software", "automatizacion", "seo", "otro"]),
  message: z.string().min(20).max(1e3),
  honeypot: z.string().max(0).optional()
});
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ success: false, error: "Datos inválidos" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const { honeypot, ...data } = parsed.data;
    if (honeypot && honeypot.length > 0) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    await sendContactEmail(data);
    return new Response(
      JSON.stringify({ success: true, message: "Mensaje enviado correctamente" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[contact API]", err);
    return new Response(
      JSON.stringify({ success: false, error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
