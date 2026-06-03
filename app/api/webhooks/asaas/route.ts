import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { PlanId } from "@/lib/plans";

// Webhook do ASAAS: recebe eventos de cobrança e sincroniza o Supabase.
// Autenticação: header `asaas-access-token` deve bater com ASAAS_WEBHOOK_TOKEN.

interface AsaasWebhookPayment {
  id: string;
  customer: string;
  subscription?: string;
  value: number;
  status: string;
  billingType?: string;
  dueDate?: string;
  paymentDate?: string;
  clientPaymentDate?: string;
  invoiceUrl?: string;
  description?: string;
}

interface AsaasWebhookBody {
  event: string;
  payment?: AsaasWebhookPayment;
}

function statusFromEvent(event: string): "ativa" | "vencida" | null {
  switch (event) {
    case "PAYMENT_CONFIRMED":
    case "PAYMENT_RECEIVED":
    case "PAYMENT_RECEIVED_IN_CASH":
      return "ativa";
    case "PAYMENT_OVERDUE":
      return "vencida";
    default:
      return null;
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("asaas-access-token");
  const expected = process.env.ASAAS_WEBHOOK_TOKEN;

  if (!expected || token !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as AsaasWebhookBody | null;
  if (!body?.payment) {
    // Evento sem cobrança (ex.: assinatura) — reconhecemos para não reenviar.
    return NextResponse.json({ ok: true });
  }

  const payment = body.payment;

  let service;
  try {
    service = createServiceClient();
  } catch (err) {
    console.error("Webhook ASAAS: service client indisponível", err);
    return NextResponse.json({ error: "config" }, { status: 500 });
  }

  // Resolve o usuário pela assinatura ou pelo customer.
  let query = service.from("subscriptions").select("*").limit(1);
  query = payment.subscription
    ? query.eq("asaas_subscription_id", payment.subscription)
    : query.eq("asaas_customer_id", payment.customer);

  const { data: subs } = await query;
  const sub = subs?.[0];

  if (!sub) {
    // Não encontramos o cliente — reconhecemos para não travar a fila do ASAAS.
    console.warn("Webhook ASAAS: assinatura não encontrada", {
      subscription: payment.subscription,
      customer: payment.customer,
    });
    return NextResponse.json({ ok: true });
  }

  const paidAt = payment.paymentDate ?? payment.clientPaymentDate ?? null;

  // Upsert idempotente do pagamento (asaas_payment_id é único).
  const { error: payErr } = await service.from("payments").upsert(
    {
      user_id: sub.user_id,
      asaas_payment_id: payment.id,
      asaas_subscription_id: payment.subscription ?? null,
      amount_cents: Math.round((payment.value ?? 0) * 100),
      currency: "BRL",
      plan: sub.plan as PlanId,
      status: payment.status ?? null,
      billing_type: payment.billingType ?? null,
      invoice_url: payment.invoiceUrl ?? null,
      due_date: payment.dueDate ?? null,
      paid_at: paidAt,
      description: payment.description ?? null,
    },
    { onConflict: "asaas_payment_id" }
  );
  if (payErr) console.error("Webhook ASAAS: erro ao gravar payment", payErr);

  // Atualiza o status da assinatura conforme o evento.
  const newStatus = statusFromEvent(body.event);
  if (newStatus) {
    const update: Record<string, unknown> = { status: newStatus };
    if (newStatus === "ativa") {
      if (!sub.started_at) update.started_at = paidAt ?? new Date().toISOString();
      if (payment.dueDate) update.current_period_end = payment.dueDate;
    }
    const { error: subErr } = await service
      .from("subscriptions")
      .update(update)
      .eq("id", sub.id);
    if (subErr) console.error("Webhook ASAAS: erro ao atualizar subscription", subErr);
  }

  return NextResponse.json({ ok: true });
}
