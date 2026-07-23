import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// O navegador manda o `code` (do FB.login) + os ids do Embedded Signup.
// O user_id/e-mail NÃO vêm do navegador: são resolvidos aqui pela sessão,
// para amarrar a conexão ao cliente logado com segurança.
const bodySchema = z.object({
  code: z.string().min(10),
  waba_id: z.string().nullable().optional(),
  phone_number_id: z.string().nullable().optional(),
  business_id: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const webhookUrl = process.env.META_SIGNUP_WEBHOOK_URL;
  const sharedSecret = process.env.META_SIGNUP_SHARED_SECRET;
  if (!webhookUrl || !sharedSecret) {
    console.error("META_SIGNUP_WEBHOOK_URL / META_SIGNUP_SHARED_SECRET ausentes.");
    return NextResponse.json(
      { error: "Integração de WhatsApp indisponível no momento." },
      { status: 503 }
    );
  }

  try {
    // Repassa pro n8n (backend): é lá que o `code` vira token (com o App Secret)
    // e roda o provisionamento (subscribe app, inbox no Chatwoot, override,
    // gravar meta_clientes com este user_id). O segredo compartilhado impede
    // que qualquer um poste direto no webhook.
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-vetor-signup-secret": sharedSecret,
      },
      body: JSON.stringify({
        ...parsed.data,
        user_id: user.id,
        email: user.email ?? null,
      }),
      signal: AbortSignal.timeout(25_000),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("n8n meta-signup falhou:", res.status, data);
      return NextResponse.json(
        { error: data.error ?? "Não foi possível concluir o provisionamento." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, ...data });
  } catch (err) {
    console.error("Erro ao chamar o n8n (meta-signup):", err);
    return NextResponse.json(
      { error: "Falha ao contatar o provisionamento. Tente novamente." },
      { status: 502 }
    );
  }
}
