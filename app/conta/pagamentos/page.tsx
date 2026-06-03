import { createClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/plans";
import type { Payment } from "@/lib/db";

export const metadata = { title: "Pagamentos" };

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Confirmado",
  RECEIVED: "Recebido",
  PENDING: "Pendente",
  OVERDUE: "Vencido",
  REFUNDED: "Estornado",
  RECEIVED_IN_CASH: "Recebido",
};

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function PagamentosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user!.id)
    .order("paid_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  const payments = (data ?? []) as Payment[];

  return (
    <section className="border border-[#2A2A2A] bg-[#141414]">
      <div className="p-8 border-b border-[#2A2A2A]">
        <h2 className="font-display font-semibold text-lg text-[#F5F5F5] tracking-tight">
          Histórico de pagamentos
        </h2>
        <p className="font-body text-sm text-[#737373] mt-1">
          Cobranças sincronizadas automaticamente com o ASAAS.
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="p-8">
          <p className="font-body text-sm text-[#A3A3A3]">
            Nenhuma cobrança registrada até o momento.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#2A2A2A]">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 px-8 py-5">
              <div>
                <p className="font-body text-sm text-[#F5F5F5]">
                  {p.description ?? "Assinatura — Assistente de Vendas"}
                </p>
                <p className="font-body text-xs text-[#737373] mt-0.5">
                  {formatDate(p.paid_at ?? p.due_date)}
                  {p.billing_type ? ` · ${p.billing_type}` : ""}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display font-semibold text-sm text-[#F5F5F5]">
                  {formatBRL(p.amount_cents)}
                </p>
                <p className="font-body text-xs text-[#737373] mt-0.5">
                  {p.status ? PAYMENT_STATUS_LABELS[p.status] ?? p.status : "—"}
                </p>
                {p.invoice_url && (
                  <a
                    href={p.invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-xs text-[#2563EB] hover:text-[#3B82F6] transition-colors"
                  >
                    Ver fatura
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
