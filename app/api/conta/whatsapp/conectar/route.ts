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

  // Guarda do contrato (docs/contrato-embedded-signup-n8n.md): os ids dos ativos
  // provam que a sessão do Embedded Signup terminou. O `code` sozinho existe até
  // em sessão abandonada — postá-lo queima um código de uso único e gera alerta
  // falso na operação. O navegador já barra isso; aqui é a segunda tranca.
  const faltando = [
    !parsed.data.waba_id ? "waba_id" : null,
    !parsed.data.phone_number_id ? "phone_number_id" : null,
  ].filter(Boolean);
  if (faltando.length > 0) {
    console.warn("meta-signup: sessão incompleta, POST não enviado. Faltando:", faltando);
    return NextResponse.json(
      {
        error:
          "O cadastro não foi concluído na Meta. Refaça a conexão até o final e confira se a Conta do WhatsApp Business aparece na tela de resumo.",
        motivo: "cadastro_incompleto",
      },
      { status: 400 }
    );
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
      // 400 payload_incompleto: o cliente desistiu no meio do fluxo da Meta.
      // Não é erro de sistema — merece mensagem própria, e o campo `faltando`
      // do n8n vai para o log porque é o que permite diagnosticar sem adivinhar.
      if (res.status === 400 && data?.erro === "payload_incompleto") {
        console.warn("n8n meta-signup: payload incompleto. Faltando:", data.faltando);
        return NextResponse.json(
          {
            error:
              "O cadastro não foi concluído na Meta. Refaça a conexão até o final e confira se a Conta do WhatsApp Business aparece na tela de resumo.",
            motivo: "cadastro_incompleto",
          },
          { status: 400 }
        );
      }
      // 401 = segredo compartilhado errado/ausente. É problema de configuração
      // nossa; o cliente não tem o que fazer com essa informação.
      if (res.status === 401) {
        console.error("n8n meta-signup: 401 — x-vetor-signup-secret errado ou ausente.");
        return NextResponse.json(
          { error: "Integração de WhatsApp indisponível no momento. Avise o suporte." },
          { status: 502 }
        );
      }
      console.error("n8n meta-signup falhou:", res.status, data);
      return NextResponse.json(
        {
          error:
            data.error ??
            "A conexão começou, mas não foi concluída. Nossa equipe já foi avisada e vai entrar em contato — não é preciso tentar de novo agora.",
        },
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
