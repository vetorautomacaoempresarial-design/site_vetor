// Planos da Vetor — fonte única de verdade.
//
// Um plano é a combinação de DUAS dimensões:
//   - produto (ProductId):      o que o cliente contrata
//   - ciclo   (BillingPeriod):  de quanto em quanto tempo ele paga
//
// Essa separação existe porque o enum `billing_period` do banco (usado por
// subscriptions, payments, subscription_requests e terms_acceptances) só conhece
// mensal/trimestral/anual. O produto entra como coluna própria (enum `product_id`,
// migration 0005) em vez de multiplicar o enum antigo por 3.
//
// Os produtos são MUTUAMENTE EXCLUSIVOS: o cliente tem uma assinatura só. Quem
// tem só o Vetor Chat e quer o agente faz troca de plano para o Vetor Sales.
//
// O Vetor Sales EMBUTE a conexão do número à API oficial (a blindagem): não há
// como rodar o agente sem o número conectado, então não existe Sales avulso.
// A dependência é de mão única — o Vetor Chat funciona sozinho.
//
// `priceCentsPerCycle` é o valor cobrado a cada ciclo no ASAAS
// (trimestral = 3x o mensal exibido; anual = 12x o mensal exibido).

export type ProductId = "assistente" | "blindado";

/** Ciclo de cobrança. Espelha o enum `public.billing_period` do Postgres. */
export type BillingPeriod = "mensal" | "trimestral" | "anual";

export type AsaasCycle = "MONTHLY" | "QUARTERLY" | "YEARLY";

export interface Product {
  id: ProductId;
  name: string;
  /** Frase curta usada em cards e seletores. */
  tagline: string;
  /** Rota da página pública do produto (null = não tem página própria). */
  href: string | null;
  /** Se o produto inclui a conexão do WhatsApp à nossa infraestrutura Meta. */
  includesBlindagem: boolean;
  /** Se o produto inclui o agente de IA do Vetor Sales. */
  includesAssistente: boolean;
}

export const PRODUCTS: Record<ProductId, Product> = {
  blindado: {
    id: "blindado",
    name: "Vetor Chat",
    tagline: "Seu número operando dentro das regras da Meta.",
    href: "/vetor-chat",
    includesBlindagem: true,
    includesAssistente: false,
  },
  assistente: {
    id: "assistente",
    name: "Vetor Sales",
    tagline: "Um agente de IA que atende e qualifica seus leads.",
    href: "/vetor-sales",
    includesBlindagem: true,
    includesAssistente: true,
  },
};

/** Ordem de exibição: do mais simples ao mais completo. */
export const PRODUCT_LIST: Product[] = [PRODUCTS.blindado, PRODUCTS.assistente];

export interface Plan {
  product: ProductId;
  period: BillingPeriod;
  /** Nome do ciclo ("Mensal", "Trimestral", "Anual"). */
  name: string;
  /** Preço exibido por mês (rótulo de marketing). */
  monthlyLabel: string;
  /** Valor efetivamente cobrado a cada ciclo, em centavos (enviado ao ASAAS). */
  priceCentsPerCycle: number;
  cycle: AsaasCycle;
  description: string;
}

const CYCLE_NAMES: Record<BillingPeriod, string> = {
  mensal: "Mensal",
  trimestral: "Trimestral",
  anual: "Anual",
};

const ASAAS_CYCLES: Record<BillingPeriod, AsaasCycle> = {
  mensal: "MONTHLY",
  trimestral: "QUARTERLY",
  anual: "YEARLY",
};

/** Quantidade de meses cobertos por cada ciclo de cobrança. */
const CYCLE_MONTHS: Record<BillingPeriod, number> = {
  mensal: 1,
  trimestral: 3,
  anual: 12,
};

/**
 * Monta um plano a partir do preço MENSAL exibido (em centavos).
 * O valor por ciclo é o mensal multiplicado pelos meses do ciclo.
 */
function plan(
  product: ProductId,
  period: BillingPeriod,
  monthlyCentsLabel: number
): Plan {
  return {
    product,
    period,
    name: CYCLE_NAMES[period],
    monthlyLabel: formatBRL(monthlyCentsLabel),
    priceCentsPerCycle: monthlyCentsLabel * CYCLE_MONTHS[period],
    cycle: ASAAS_CYCLES[period],
    description: `${PRODUCTS[product].name} com cobrança ${period}.`,
  };
}

// Preços por produto e ciclo (valor MENSAL exibido, em centavos).
// A escada de desconto é a mesma nos três produtos: ~10% no trimestral e ~21%
// no anual em relação ao mensal — savingsPercent() confere isso sozinho.
export const PLANS: Record<ProductId, Record<BillingPeriod, Plan>> = {
  blindado: {
    mensal: plan("blindado", "mensal", 9990),
    trimestral: plan("blindado", "trimestral", 8990),
    anual: plan("blindado", "anual", 7890),
  },
  assistente: {
    mensal: plan("assistente", "mensal", 28990),
    trimestral: plan("assistente", "trimestral", 25990),
    anual: plan("assistente", "anual", 22990),
  },
};

export const PERIOD_LIST: BillingPeriod[] = ["mensal", "trimestral", "anual"];

/** Os três ciclos de um produto, na ordem de exibição. */
export function plansOf(product: ProductId): Plan[] {
  return PERIOD_LIST.map((period) => PLANS[product][period]);
}

export function getPlan(product: ProductId, period: BillingPeriod): Plan {
  return PLANS[product][period];
}

/** Valor mensal efetivo (centavos): total do ciclo dividido pelos meses do ciclo. */
export function monthlyCents(p: Plan): number {
  return Math.round(p.priceCentsPerCycle / CYCLE_MONTHS[p.period]);
}

/**
 * Economia percentual no mensal efetivo em relação ao ciclo Mensal DO MESMO
 * PRODUTO. Comparar entre produtos diferentes não faz sentido (a blindagem é
 * mais barata que o Assistente por ser outro serviço, não por ser desconto).
 * Retorna 0 quando não há economia (ex.: o próprio ciclo Mensal).
 */
export function savingsPercent(p: Plan): number {
  const base = monthlyCents(PLANS[p.product].mensal);
  const pct = Math.round((1 - monthlyCents(p) / base) * 100);
  return pct > 0 ? pct : 0;
}

export function isProductId(value: unknown): value is ProductId {
  return value === "assistente" || value === "blindado";
}

export function isBillingPeriod(value: unknown): value is BillingPeriod {
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
