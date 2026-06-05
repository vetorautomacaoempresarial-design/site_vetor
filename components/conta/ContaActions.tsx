"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { PLAN_LIST, PLANS, formatBRL, savingsPercent, type PlanId } from "@/lib/plans";
import { Field, Input, FormError } from "@/components/ui/Form";
import { cn } from "@/lib/cn";

type Mode = "idle" | "subscribe" | "change" | "cancel";

type LegalDocContent = { slug: string; title: string; summary: string; markdown: string };

export default function ContaActions({
  hasActive,
  currentPlan,
  initialPlan,
  defaultName,
  legalDocs,
}: {
  hasActive: boolean;
  currentPlan: PlanId | null;
  initialPlan?: PlanId | null;
  defaultName: string;
  legalDocs: LegalDocContent[];
}) {
  const [mode, setMode] = useState<Mode>("idle");
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(
    currentPlan ?? initialPlan ?? "mensal"
  );
  const [name, setName] = useState(defaultName);
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [openDoc, setOpenDoc] = useState<LegalDocContent | null>(null);

  async function post(url: string, body: unknown) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Algo deu errado. Tente novamente.");
        return null;
      }
      return data;
    } catch {
      setError("Falha de conexão. Tente novamente.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Abre o aceite de termos antes de seguir para o pagamento.
  function startSubscribe() {
    setError(null);
    if (name.trim().length < 2) {
      setError("Informe o nome do titular.");
      return;
    }
    const digits = cpfCnpj.replace(/\D/g, "");
    if (digits.length !== 11 && digits.length !== 14) {
      setError("Informe um CPF ou CNPJ válido.");
      return;
    }
    setAcceptedTerms(false);
    setShowTerms(true);
  }

  async function handleSubscribe() {
    const data = await post("/api/conta/assinar", {
      plan: selectedPlan,
      name,
      cpfCnpj,
      acceptedTerms: true,
    });
    if (data?.invoiceUrl) {
      window.location.href = data.invoiceUrl as string;
    } else if (data) {
      // Assinatura criada, mas sem URL de fatura — fecha o modal e avisa.
      setShowTerms(false);
      setSuccess("Assinatura registrada. Em instantes você poderá concluir o pagamento.");
    }
  }

  async function handleChange() {
    const data = await post("/api/conta/trocar-plano", { plan: selectedPlan });
    if (data) {
      setSuccess("Solicitação de troca registrada. A mudança vale a partir da próxima cobrança.");
      setMode("idle");
    }
  }

  async function handleCancel() {
    const data = await post("/api/conta/cancelar", { message });
    if (data) {
      setSuccess("Cancelamento solicitado. Você receberá a confirmação por e-mail.");
      setMode("idle");
    }
  }

  if (success) {
    return (
      <section className="border border-[#2563EB]/30 bg-[#2563EB]/5 p-8 flex flex-col items-center text-center gap-3">
        <CheckCircle size={36} className="text-[#2563EB]" />
        <p className="font-body text-sm text-[#F5F5F5] leading-relaxed max-w-md">{success}</p>
        <button
          onClick={() => {
            setSuccess(null);
            window.location.reload();
          }}
          className="mt-2 font-display text-sm text-[#2563EB] hover:text-[#3B82F6] transition-colors"
        >
          Voltar
        </button>
      </section>
    );
  }

  return (
    <>
    <section className="border border-[#2A2A2A] bg-[#141414] p-8">
      <h2 className="font-display font-semibold text-lg text-[#F5F5F5] tracking-tight mb-6">
        {hasActive ? "Gerenciar assinatura" : "Assinar o Assistente de Vendas"}
      </h2>

      <FormError message={error} />

      {/* Seleção de plano (assinar ou trocar) */}
      {(mode === "subscribe" || mode === "change" || !hasActive) && (
        <div className="grid sm:grid-cols-3 gap-px bg-[#2A2A2A] mb-6">
          {PLAN_LIST.map((plan) => {
            const isCurrent = hasActive && plan.id === currentPlan;
            const selected = selectedPlan === plan.id;
            const savings = savingsPercent(plan);
            return (
              <button
                key={plan.id}
                type="button"
                disabled={isCurrent}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  "text-left bg-[#0A0A0A] p-5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                  selected ? "ring-1 ring-inset ring-[#2563EB]" : "hover:bg-[#121212]"
                )}
              >
                <p className="font-display font-semibold text-sm text-[#F5F5F5] mb-1 flex items-center gap-2">
                  <span>
                    {plan.name}
                    {isCurrent && <span className="text-[#737373] font-normal"> (atual)</span>}
                  </span>
                  {savings > 0 && (
                    <span className="font-display text-[10px] font-semibold tracking-wide px-1.5 py-0.5 bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/30">
                      −{savings}%
                    </span>
                  )}
                </p>
                <p className="font-display font-bold text-xl text-[#F5F5F5]">
                  {plan.monthlyLabel}
                  <span className="font-body text-xs text-[#737373]">/mês</span>
                </p>
                <p className="font-body text-xs text-[#737373] mt-1">
                  {formatBRL(plan.priceCentsPerCycle)} por ciclo
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Assinar: dados de cobrança */}
      {(mode === "subscribe" || (!hasActive && mode === "idle")) && (
        <div className="flex flex-col gap-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nome do titular">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" />
            </Field>
            <Field label="CPF ou CNPJ" hint="Obrigatório para emitir a cobrança.">
              <Input
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                placeholder="Somente números"
                inputMode="numeric"
              />
            </Field>
          </div>
          <button
            onClick={startSubscribe}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 font-display text-sm font-semibold tracking-wide px-7 py-3.5 bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Gerando cobrança..." : `Assinar plano ${PLANS[selectedPlan].name}`}
          </button>
          <p className="font-body text-xs text-[#737373]">
            Ao continuar, você revisará e aceitará os termos antes de ser direcionado ao
            ambiente seguro do ASAAS para concluir o pagamento.
          </p>
        </div>
      )}

      {/* Trocar plano: confirmação */}
      {mode === "change" && (
        <div className="flex flex-col gap-3">
          <button
            onClick={handleChange}
            disabled={loading || selectedPlan === currentPlan}
            className="inline-flex items-center justify-center gap-2 font-display text-sm font-semibold tracking-wide px-7 py-3.5 bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : `Trocar para ${PLANS[selectedPlan].name}`}
          </button>
          <button
            onClick={() => setMode("idle")}
            className="font-display text-sm text-[#A3A3A3] hover:text-white transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Cancelar: confirmação */}
      {mode === "cancel" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-2 text-[#F59E0B] text-sm font-body border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-3 py-2.5">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>
              Ao confirmar, sua assinatura será cancelada e a renovação automática deixará de
              ocorrer.
            </span>
          </div>
          <Field label="Motivo (opcional)">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Conte por que está cancelando (opcional)"
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-4 py-3 font-body text-sm text-[#F5F5F5] placeholder:text-[#6B7280] focus:outline-none focus:border-[#2563EB] transition-colors resize-none"
            />
          </Field>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 font-display text-sm font-semibold tracking-wide px-7 py-3.5 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Confirmar cancelamento"}
            </button>
            <button
              onClick={() => setMode("idle")}
              className="font-display text-sm text-[#A3A3A3] hover:text-white transition-colors px-4"
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      {/* Botões iniciais para quem já tem assinatura */}
      {hasActive && mode === "idle" && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setSelectedPlan(currentPlan ?? "mensal");
              setMode("change");
            }}
            className="font-display text-sm font-semibold tracking-wide px-6 py-3 border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors"
          >
            Trocar de plano
          </button>
          <button
            onClick={() => setMode("cancel")}
            className="font-display text-sm font-semibold tracking-wide px-6 py-3 border border-[#2A2A2A] text-[#A3A3A3] hover:border-red-500 hover:text-red-400 transition-colors"
          >
            Cancelar assinatura
          </button>
        </div>
      )}
    </section>

    {/* Modal de aceite dos termos — exibido antes de ir ao ASAAS */}
    {showTerms && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        onClick={() => !loading && setShowTerms(false)}
      >
        <div
          className="relative w-full max-w-lg bg-[#0A0A0A] border border-[#2A2A2A] p-8 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => !loading && setShowTerms(false)}
            aria-label="Fechar"
            className="absolute top-4 right-4 text-[#737373] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <h3 className="font-display font-semibold text-lg text-[#F5F5F5] tracking-tight mb-2">
            Antes de continuar
          </h3>
          <p className="font-body font-light text-sm text-[#A3A3A3] leading-relaxed mb-5">
            Para assinar o plano <strong className="text-[#F5F5F5]">{PLANS[selectedPlan].name}</strong>,
            leia e aceite os documentos abaixo. Você será direcionado ao ASAAS para concluir o
            pagamento somente após o aceite.
          </p>

          <ul className="flex flex-col gap-2 mb-6 border border-[#2A2A2A] divide-y divide-[#2A2A2A]">
            {legalDocs.map((d) => (
              <li key={d.slug}>
                <button
                  type="button"
                  onClick={() => setOpenDoc(d)}
                  className="w-full text-left flex items-center justify-between px-4 py-3 font-body text-sm text-[#D4D4D4] hover:bg-[#141414] hover:text-white transition-colors"
                >
                  {d.title}
                  <span className="text-xs text-[#2563EB]">Ler →</span>
                </button>
              </li>
            ))}
          </ul>

          <FormError message={error} />

          <label className="flex items-start gap-3 cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#2563EB]"
            />
            <span className="font-body text-sm text-[#D4D4D4] leading-relaxed">
              Li e concordo com o Contrato de Adesão, os Termos de Uso, a Política de
              Privacidade, a Política de Cookies e o DPA (Acordo de Tratamento de Dados).
            </span>
          </label>

          <div className="flex gap-3">
            <button
              onClick={handleSubscribe}
              disabled={!acceptedTerms || loading}
              className="inline-flex items-center justify-center gap-2 font-display text-sm font-semibold tracking-wide px-6 py-3 bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Gerando cobrança..." : "Concordar e ir para o pagamento"}
            </button>
            <button
              onClick={() => !loading && setShowTerms(false)}
              className="font-display text-sm text-[#A3A3A3] hover:text-white transition-colors px-4"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Pop-up do documento legal — sobre o modal de termos, sem sair da página */}
    {openDoc && (
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label={openDoc.title}
        onClick={() => setOpenDoc(null)}
      >
        <div
          className="relative w-full max-w-2xl bg-[#0A0A0A] border border-[#2A2A2A] max-h-[88vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#2A2A2A] shrink-0">
            <h3 className="font-display font-semibold text-base text-[#F5F5F5] tracking-tight">
              {openDoc.title}
            </h3>
            <button
              onClick={() => setOpenDoc(null)}
              aria-label="Fechar"
              className="text-[#737373] hover:text-white transition-colors shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          <div
            className="overflow-y-auto px-6 py-6 font-body font-light text-[#D4D4D4] text-sm leading-relaxed
              [&_p]:mb-4
              [&_h1]:font-display [&_h1]:font-bold [&_h1]:text-xl [&_h1]:text-[#F5F5F5] [&_h1]:tracking-tight [&_h1]:mb-4
              [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:text-[#F5F5F5] [&_h2]:tracking-tight [&_h2]:mt-8 [&_h2]:mb-3
              [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-base [&_h3]:text-[#F5F5F5] [&_h3]:mt-6 [&_h3]:mb-2
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1.5
              [&_strong]:text-[#F5F5F5] [&_strong]:font-semibold
              [&_a]:text-[#2563EB] [&_a]:underline hover:[&_a]:text-[#3B82F6]
              [&_hr]:border-[#2A2A2A] [&_hr]:my-8
              [&_table]:w-full [&_table]:my-6 [&_table]:border [&_table]:border-[#2A2A2A] [&_table]:text-left
              [&_th]:border [&_th]:border-[#2A2A2A] [&_th]:bg-[#141414] [&_th]:px-3 [&_th]:py-2 [&_th]:font-display [&_th]:font-semibold [&_th]:text-[#F5F5F5] [&_th]:text-xs
              [&_td]:border [&_td]:border-[#2A2A2A] [&_td]:px-3 [&_td]:py-2 [&_td]:align-top
              [&_em]:text-[#A3A3A3]"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{openDoc.markdown}</ReactMarkdown>
          </div>

          <div className="border-t border-[#2A2A2A] px-6 py-3 shrink-0">
            <button
              onClick={() => setOpenDoc(null)}
              className="font-display text-sm font-semibold text-[#2563EB] hover:text-[#3B82F6] transition-colors"
            >
              Fechar e voltar
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
