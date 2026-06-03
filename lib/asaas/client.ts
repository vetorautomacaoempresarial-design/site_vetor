// Wrapper mínimo da API do ASAAS (v3).
// Docs: https://docs.asaas.com  — autenticação via header `access_token`.

import type { AsaasCycle } from "@/lib/plans";

const BASE_URLS = {
  sandbox: "https://api-sandbox.asaas.com/v3",
  production: "https://api.asaas.com/v3",
} as const;

function baseUrl(): string {
  if (process.env.ASAAS_API_URL) return process.env.ASAAS_API_URL;
  const env = process.env.ASAAS_ENV === "production" ? "production" : "sandbox";
  return BASE_URLS[env];
}

function apiKey(): string {
  const key = process.env.ASAAS_API_KEY;
  if (!key) throw new Error("ASAAS_API_KEY não configurada.");
  return key;
}

export class AsaasError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "AsaasError";
    this.status = status;
    this.body = body;
  }
}

async function asaasFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      access_token: apiKey(),
      "Content-Type": "application/json",
      "User-Agent": "VetorAutomacao",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg =
      body?.errors?.[0]?.description ??
      `Erro ASAAS (${res.status}) em ${path}`;
    throw new AsaasError(msg, res.status, body);
  }

  return body as T;
}

// ---------- Tipos ----------

export interface AsaasCustomer {
  id: string;
  name: string;
  email?: string;
  cpfCnpj?: string;
  externalReference?: string;
}

export interface AsaasSubscription {
  id: string;
  customer: string;
  value: number;
  cycle: AsaasCycle;
  status: string;
  billingType: string;
  nextDueDate: string;
  externalReference?: string;
}

export interface AsaasPayment {
  id: string;
  customer: string;
  subscription?: string;
  value: number;
  netValue?: number;
  status: string;
  billingType: string;
  dueDate?: string;
  paymentDate?: string;
  clientPaymentDate?: string;
  invoiceUrl?: string;
  description?: string;
}

interface AsaasList<T> {
  data: T[];
  hasMore: boolean;
  totalCount: number;
}

// ---------- Operações ----------

/** Procura um customer pelo externalReference (id do usuário Supabase) ou cria um novo. */
export async function findOrCreateCustomer(params: {
  name: string;
  email: string;
  cpfCnpj: string;
  externalReference: string;
}): Promise<AsaasCustomer> {
  const found = await asaasFetch<AsaasList<AsaasCustomer>>(
    `/customers?externalReference=${encodeURIComponent(params.externalReference)}&limit=1`
  );
  if (found.data.length > 0) return found.data[0];

  return asaasFetch<AsaasCustomer>("/customers", {
    method: "POST",
    body: JSON.stringify({
      name: params.name,
      email: params.email,
      cpfCnpj: params.cpfCnpj,
      externalReference: params.externalReference,
    }),
  });
}

/** Cria uma assinatura recorrente. billingType UNDEFINED deixa o cliente escolher na fatura. */
export async function createSubscription(params: {
  customer: string;
  valueCents: number;
  cycle: AsaasCycle;
  description: string;
  externalReference: string;
  nextDueDate?: string;
}): Promise<AsaasSubscription> {
  // 1ª cobrança vence em +5 dias corridos: dá prazo real para boleto
  // (compensação bancária leva alguns dias) sem atrapalhar Pix/cartão,
  // que podem ser pagos imediatamente de qualquer forma.
  const defaultDueDate = new Date();
  defaultDueDate.setDate(defaultDueDate.getDate() + 5);
  const nextDueDate =
    params.nextDueDate ?? defaultDueDate.toISOString().slice(0, 10); // YYYY-MM-DD

  return asaasFetch<AsaasSubscription>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      customer: params.customer,
      billingType: "UNDEFINED",
      value: params.valueCents / 100,
      cycle: params.cycle,
      nextDueDate,
      description: params.description,
      externalReference: params.externalReference,
    }),
  });
}

export async function updateSubscription(
  subscriptionId: string,
  params: { valueCents: number; cycle: AsaasCycle; description?: string }
): Promise<AsaasSubscription> {
  return asaasFetch<AsaasSubscription>(`/subscriptions/${subscriptionId}`, {
    method: "POST",
    body: JSON.stringify({
      value: params.valueCents / 100,
      cycle: params.cycle,
      ...(params.description ? { description: params.description } : {}),
      updatePendingPayments: true,
    }),
  });
}

export async function cancelSubscription(
  subscriptionId: string
): Promise<{ deleted: boolean; id: string }> {
  return asaasFetch(`/subscriptions/${subscriptionId}`, { method: "DELETE" });
}

/** Primeira cobrança da assinatura (para obter a invoiceUrl do checkout). */
export async function getFirstSubscriptionPayment(
  subscriptionId: string
): Promise<AsaasPayment | null> {
  const list = await asaasFetch<AsaasList<AsaasPayment>>(
    `/subscriptions/${subscriptionId}/payments?limit=1`
  );
  return list.data[0] ?? null;
}

export async function getPayment(paymentId: string): Promise<AsaasPayment> {
  return asaasFetch<AsaasPayment>(`/payments/${paymentId}`);
}
