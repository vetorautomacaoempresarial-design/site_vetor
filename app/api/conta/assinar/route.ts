import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { subscribeSchema } from "@/lib/validation";
import { PLANS } from "@/lib/plans";
import { LEGAL_VERSION, legalAcceptanceSnapshot } from "@/lib/legal";
import {
  findOrCreateCustomer,
  createSubscription,
  getFirstSubscriptionPayment,
  AsaasError,
} from "@/lib/asaas/client";

/** IP do cliente a partir dos headers do proxy (Vercel/Next). */
function getClientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip");
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { plan, name, cpfCnpj } = parsed.data;
  const planConfig = PLANS[plan];

  const service = createServiceClient();

  // Cláusula 18.2 do Contrato: registra a prova do aceite (data/hora, IP, e-mail
  // e versão dos documentos) ANTES de criar a assinatura. Append-only: cada
  // aceite gera uma linha. Se a gravação falhar, não seguimos para a cobrança —
  // não pode existir contratação sem o registro de prova exigido pelo contrato.
  const { error: acceptanceError } = await service
    .from("terms_acceptances")
    .insert({
      user_id: user.id,
      email: user.email!,
      ip: getClientIp(req),
      user_agent: req.headers.get("user-agent"),
      terms_version: LEGAL_VERSION,
      documents: legalAcceptanceSnapshot(),
      plan,
    });
  if (acceptanceError) {
    console.error("Erro ao registrar aceite dos termos:", acceptanceError);
    return NextResponse.json(
      { error: "Não foi possível registrar o aceite dos termos. Tente novamente." },
      { status: 500 }
    );
  }

  try {
    const customer = await findOrCreateCustomer({
      name,
      email: user.email!,
      cpfCnpj,
      externalReference: user.id,
    });

    const subscription = await createSubscription({
      customer: customer.id,
      valueCents: planConfig.priceCentsPerCycle,
      cycle: planConfig.cycle,
      description: `Assistente de Vendas — plano ${planConfig.name}`,
      externalReference: user.id,
    });

    const firstPayment = await getFirstSubscriptionPayment(subscription.id);

    // Grava/atualiza a assinatura no Supabase (escrita via service_role).
    const { error: upsertError } = await service.from("subscriptions").upsert(
      {
        user_id: user.id,
        plan,
        status: "pendente",
        asaas_customer_id: customer.id,
        asaas_subscription_id: subscription.id,
        value_cents: planConfig.priceCentsPerCycle,
        billing_type: subscription.billingType ?? null,
      },
      { onConflict: "user_id" }
    );
    if (upsertError) {
      console.error("Erro ao gravar subscription:", upsertError);
    }

    return NextResponse.json({
      ok: true,
      invoiceUrl: firstPayment?.invoiceUrl ?? null,
    });
  } catch (err) {
    const message =
      err instanceof AsaasError
        ? err.message
        : "Não foi possível criar a assinatura. Tente novamente.";
    console.error("Erro em /api/conta/assinar:", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
