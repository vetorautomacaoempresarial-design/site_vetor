import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";

const rateLimit = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60_000; // 1 minute
  const max = 5;
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.reset) {
    rateLimit.set(ip, { count: 1, reset: now + window });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "Muitas tentativas. Aguarde 1 minuto." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body inválido." }, { status: 400 });
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ ok: false, error: "Dados inválidos.", issues: result.error.issues }, { status: 400 });
  }

  const { name, email, company, phone, message, honeypot } = result.data;

  // Honeypot check
  if (honeypot) {
    return NextResponse.json({ ok: true }); // silently ignore bots
  }

  const apiKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.EMAIL_TO ?? "administrativo@vetorautomacao.io";

  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping email send in dev");
    return NextResponse.json({ ok: true });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "Vetor Automação <noreply@contato.vetorautomacao.io>",
      to: [emailTo],
      replyTo: email,
      subject: `[Lead] ${name} — ${company}`,
      html: `
        <div style="font-family: sans-serif; color: #1a1a1a; max-width: 600px;">
          <h2 style="color: #2563EB; margin-bottom: 24px;">Novo lead via site</h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color:#666; width:100px;">Nome</td><td style="padding: 8px 0; font-weight:600;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color:#666;">E-mail</td><td style="padding: 8px 0;">${email}</td></tr>
            <tr><td style="padding: 8px 0; color:#666;">Empresa</td><td style="padding: 8px 0; font-weight:600;">${company}</td></tr>
            <tr><td style="padding: 8px 0; color:#666;">Telefone</td><td style="padding: 8px 0;">${phone || "—"}</td></tr>
          </table>
          <div style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-left: 3px solid #2563EB;">
            <p style="margin: 0; color:#333; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ ok: false, error: "Erro ao enviar e-mail." }, { status: 500 });
  }
}
