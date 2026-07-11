import { z } from "zod";
import { getResend } from "@/lib/resend";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(4000),
  company: z.string().optional().default(""),
  startedAt: z.number().int().positive(),
});

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const limited = rateLimit(`contact:${ip}`, { limit: 8, windowMs: 60 * 60 * 1000 });
    if (!limited.ok) {
      return Response.json(
        { error: "Demasiados intentos. Prueba más tarde o usa el mailto." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Revisa los campos del formulario." }, { status: 400 });
    }

    const { name, email, subject, message, company, startedAt } = parsed.data;

    // Honeypot filled → pretend success
    if (company && company.length > 0) {
      return Response.json({ ok: true });
    }

    // Minimum fill time (~2.5s) against naive bots
    if (Date.now() - startedAt < 2500) {
      return Response.json({ error: "Envío demasiado rápido. Intenta de nuevo." }, { status: 400 });
    }

    const to = process.env.CONTACT_TO_EMAIL || "matespinosa09@gmail.com";
    const from =
      process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY missing");
      return Response.json(
        { error: "El formulario no está configurado aún. Usa el mailto." },
        { status: 503 },
      );
    }

    const resend = getResend();
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `Nombre: ${name}\nEmail: ${email}\nAsunto: ${subject}\n\n${message}`,
    });

    if (error) {
      console.error(error);
      return Response.json({ error: "No se pudo enviar el email." }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Error interno." }, { status: 500 });
  }
}
