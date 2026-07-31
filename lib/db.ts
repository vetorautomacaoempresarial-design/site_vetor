// Tipos das tabelas da Área do Cliente (espelham supabase/migrations/0001_area_do_cliente.sql
// e 0005_produtos.sql).
//
// Atenção à nomenclatura: a coluna `plan` guarda o CICLO de cobrança
// (billing_period), não o produto. O produto vive na coluna `product`.
import type { BillingPeriod, ProductId } from "@/lib/plans";

export type SubscriptionStatus = "ativa" | "vencida" | "cancelada" | "pendente";
export type RequestType = "cancelamento" | "troca_plano";
export type RequestStatus = "pendente" | "resolvido" | "cancelado";

export interface Subscription {
  id: string;
  user_id: string;
  /** Ciclo de cobrança (coluna `plan`, enum billing_period). */
  plan: BillingPeriod;
  product: ProductId;
  status: SubscriptionStatus;
  asaas_customer_id: string | null;
  asaas_subscription_id: string | null;
  value_cents: number | null;
  billing_type: string | null;
  started_at: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  asaas_payment_id: string | null;
  asaas_subscription_id: string | null;
  amount_cents: number;
  currency: string;
  plan: BillingPeriod | null;
  product: ProductId | null;
  status: string | null;
  billing_type: string | null;
  invoice_url: string | null;
  due_date: string | null;
  paid_at: string | null;
  description: string | null;
  created_at: string;
}

export interface SubscriptionRequest {
  id: string;
  user_id: string;
  type: RequestType;
  desired_plan: BillingPeriod | null;
  desired_product: ProductId | null;
  status: RequestStatus;
  message: string | null;
  created_at: string;
  resolved_at: string | null;
}
