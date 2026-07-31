import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { changePlanSchema } from "@/lib/validation";
import { PRODUCTS, getPlan } from "@/lib/plans";
import { updateSubscription, AsaasError } from "@/lib/asaas/client";
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

  const body = await req.json().catch(() => null);
  const parsed = changePlanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { plan, product } = parsed.data;
  const planConfig = getPlan(product, plan);
  const productConfig = PRODUCTS[product];

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
  // Só é "o mesmo plano" quando produto E ciclo coincidem — trocar de produto
  // mantendo o ciclo (ex.: Vetor Chat Mensal → Vetor Sales Mensal) é uma troca válida.
  if (sub.plan === plan && sub.product === product) {
    return NextResponse.json({ error: "Você já está nesse plano." }, { status: 400 });
  }

  try {
    await updateSubscription(sub.asaas_subscription_id, {
      valueCents: planConfig.priceCentsPerCycle,
      cycle: planConfig.cycle,
      description: `${productConfig.name}, plano ${planConfig.name}`,
    });

    const service = createServiceClient();
    await service
      .from("subscriptions")
      .update({ plan, product, value_cents: planConfig.priceCentsPerCycle })
      .eq("user_id", user.id);

    await supabase.from("subscription_requests").insert({
      user_id: user.id,
      type: "troca_plano",
      desired_plan: plan,
      desired_product: product,
    });

    await notifyTeam({
      subject: `[Assinatura] Troca de plano — ${user.email}`,
      html: `
        <div style="font-family: sans-serif; color:#1a1a1a; max-width:600px;">
          <h2 style="color:#4A6CF7;">Troca de plano</h2>
          <p><strong>Cliente:</strong> ${user.email}</p>
          <p><strong>ID do usuário:</strong> ${user.id}</p>
          <p><strong>De:</strong> ${PRODUCTS[sub.product]?.name ?? sub.product} ${sub.plan} → <strong>Para:</strong> ${productConfig.name} ${planConfig.name}</p>
          <p><strong>Assinatura ASAAS:</strong> ${sub.asaas_subscription_id}</p>
          <p style="color:#666;">A assinatura já foi atualizada no ASAAS via API; vale a partir da próxima cobrança.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof AsaasError
        ? err.message
        : "Não foi possível trocar o plano. Tente novamente.";
    console.error("Erro em /api/conta/trocar-plano:", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
