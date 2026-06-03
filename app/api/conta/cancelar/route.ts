import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { cancelSchema } from "@/lib/validation";
import { PLANS } from "@/lib/plans";
import { cancelSubscription, AsaasError } from "@/lib/asaas/client";
import { notifyTeam } from "@/lib/notify";
import type { Subscription } from "@/lib/db";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = cancelSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  const sub = data as Subscription | null;

  if (!sub?.asaas_subscription_id) {
    return NextResponse.json(
      { error: "Nenhuma assinatura ativa encontrada." },
      { status: 400 }
    );
  }

  try {
    await cancelSubscription(sub.asaas_subscription_id);

    const service = createServiceClient();
    await service
      .from("subscriptions")
      .update({ status: "cancelada", canceled_at: new Date().toISOString() })
      .eq("user_id", user.id);

    // Auditoria (cliente insere a própria solicitação — permitido por RLS).
    await supabase.from("subscription_requests").insert({
      user_id: user.id,
      type: "cancelamento",
      message: parsed.data.message ?? null,
    });

    await notifyTeam({
      subject: `[Assinatura] Cancelamento — ${user.email}`,
      html: `
        <div style="font-family: sans-serif; color:#1a1a1a; max-width:600px;">
          <h2 style="color:#2563EB;">Cancelamento de assinatura</h2>
          <p><strong>Cliente:</strong> ${user.email}</p>
          <p><strong>ID do usuário:</strong> ${user.id}</p>
          <p><strong>Plano:</strong> ${PLANS[sub.plan]?.name ?? sub.plan}</p>
          <p><strong>Assinatura ASAAS:</strong> ${sub.asaas_subscription_id}</p>
          ${parsed.data.message ? `<p><strong>Motivo:</strong> ${parsed.data.message}</p>` : ""}
          <p style="color:#666;">A assinatura já foi cancelada no ASAAS via API.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof AsaasError
        ? err.message
        : "Não foi possível cancelar a assinatura. Tente novamente.";
    console.error("Erro em /api/conta/cancelar:", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
