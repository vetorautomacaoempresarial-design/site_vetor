// Planos do Assistente de Vendas — fonte única de verdade.
// Os valores batem com components/sections/Planos.tsx.
// `priceCentsPerCycle` é o valor cobrado a cada ciclo no ASAAS
// (trimestral = 3x o mensal exibido; anual = 12x o mensal exibido).

export type PlanId = "mensal" | "trimestral" | "anual";

export type AsaasCycle = "MONTHLY" | "QUARTERLY" | "YEARLY";

export interface Plan {
  id: PlanId;
  name: string;
  /** Preço exibido por mês (rótulo de marketing). */
  monthlyLabel: string;
  /** Valor efetivamente cobrado a cada ciclo, em centavos (enviado ao ASAAS). */
  priceCentsPerCycle: number;
  cycle: AsaasCycle;
  description: string;
}

export const PLANS: Record<PlanId, Plan> = {
  mensal: {
    id: "mensal",
    name: "Mensal",
    monthlyLabel: "R$ 289,90",
    priceCentsPerCycle: 28990,
    cycle: "MONTHLY",
    description: "Acesso completo ao Assistente de Vendas com cobrança mensal.",
  },
  trimestral: {
    id: "trimestral",
    name: "Trimestral",
    monthlyLabel: "R$ 259,90",
    priceCentsPerCycle: 77970, // 3 x 259,90
    cycle: "QUARTERLY",
    description: "Acesso completo ao Assistente de Vendas com cobrança trimestral.",
  },
  anual: {
    id: "anual",
    name: "Anual",
    monthlyLabel: "R$ 229,90",
    priceCentsPerCycle: 275880, // 12 x 229,90
    cycle: "YEARLY",
    description: "Acesso completo ao Assistente de Vendas com cobrança anual.",
  },
};

export const PLAN_LIST: Plan[] = [PLANS.mensal, PLANS.trimestral, PLANS.anual];

export function isPlanId(value: unknown): value is PlanId {
  return value === "mensal" || value === "trimestral" || value === "anual";
}

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export const STATUS_LABELS: Record<string, string> = {
  ativa: "Ativa",
  vencida: "Vencida",
  cancelada: "Cancelada",
  pendente: "Pendente",
};
