import { createClient } from "@/lib/supabase/server";
import { PLANS, STATUS_LABELS, formatBRL, isPlanId, type PlanId } from "@/lib/plans";
import type { Subscription } from "@/lib/db";
import ContaActions from "@/components/conta/ContaActions";

export const metadata = { title: "Minha assinatura" };

const STATUS_STYLES: Record<string, string> = {
  ativa: "text-[#22C35E] border-[#22C35E]/40 bg-[#22C35E]/10",
  vencida: "text-[#F59E0B] border-[#F59E0B]/40 bg-[#F59E0B]/10",
  cancelada: "text-[#A3A3A3] border-[#A3A3A3]/40 bg-[#A3A3A3]/10",
  pendente: "text-[#2563EB] border-[#2563EB]/40 bg-[#2563EB]/10",
};

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function ContaPage({
  searchParams,
}: {
  searchParams: Promise<{ plano?: string }>;
}) {
  const { plano } = await searchParams;
  const initialPlan: PlanId | null = isPlanId(plano) ? plano : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user!.id)
    .maybeSingle();

  const sub = data as Subscription | null;
  const defaultName =
    (user!.user_metadata?.name as string | undefined) ?? user!.email ?? "";

  const hasActive = sub?.status === "ativa" || sub?.status === "pendente";

  return (
    <div className="flex flex-col gap-8">
      <section className="border border-[#2A2A2A] bg-[#141414] p-8">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <p className="font-display text-xs tracking-widest uppercase text-[#737373] mb-2">
              Status da assinatura
            </p>
            {sub ? (
              <span
                className={`inline-flex font-display text-sm font-semibold px-3 py-1 border ${
                  STATUS_STYLES[sub.status] ?? STATUS_STYLES.pendente
                }`}
              >
                {STATUS_LABELS[sub.status] ?? sub.status}
              </span>
            ) : (
              <span className="inline-flex font-display text-sm font-semibold px-3 py-1 border text-[#A3A3A3] border-[#A3A3A3]/40 bg-[#A3A3A3]/10">
                Sem assinatura
              </span>
            )}
          </div>
        </div>

        {sub ? (
          <dl className="grid sm:grid-cols-2 gap-y-5 gap-x-8">
            <Info label="Plano" value={PLANS[sub.plan]?.name ?? sub.plan} />
            <Info
              label="Valor por ciclo"
              value={sub.value_cents != null ? formatBRL(sub.value_cents) : "—"}
            />
            <Info label="Início" value={formatDate(sub.started_at)} />
            <Info
              label={sub.status === "cancelada" ? "Cancelada em" : "Próxima renovação"}
              value={formatDate(
                sub.status === "cancelada" ? sub.canceled_at : sub.current_period_end
              )}
            />
          </dl>
        ) : (
          <p className="font-body text-sm text-[#A3A3A3] leading-relaxed">
            Você ainda não tem uma assinatura ativa do Assistente de Vendas. Escolha um plano abaixo
            para começar.
          </p>
        )}
      </section>

      <ContaActions
        hasActive={hasActive}
        currentPlan={sub?.plan ?? null}
        initialPlan={initialPlan}
        defaultName={defaultName}
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-display text-xs tracking-widest uppercase text-[#737373] mb-1">{label}</dt>
      <dd className="font-body text-base text-[#F5F5F5]">{value}</dd>
    </div>
  );
}
