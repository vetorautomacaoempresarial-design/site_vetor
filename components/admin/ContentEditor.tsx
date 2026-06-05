"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Check, RotateCcw } from "lucide-react";
import { saveSection } from "@/lib/content/actions";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

// Rótulos amigáveis para os campos conhecidos.
const LABELS: Record<string, string> = {
  brand: "Nome da marca (ao lado do logo)",
  navServicos: "Menu · O que entregamos",
  navComoFunciona: "Menu · Como Funciona",
  navProdutos: "Menu · Produtos",
  navDuvidas: "Menu · Dúvidas",
  areaCliente: "Link · Área do cliente",
  cta: "Botão · Fale Conosco",
  tag: "Etiqueta (texto pequeno acima do título)",
  badge: "Selo",
  title: "Título",
  intro: "Texto de apoio",
  subtitle: "Subtítulo",
  description: "Descrição",
  headline: "Título principal (linhas)",
  ctaLabel: "Texto do botão",
  ctaPrimary: "Botão principal",
  ctaSecondary: "Botão secundário",
  whatsappLabel: "Texto do botão do WhatsApp",
  whatsappNote: "Aviso abaixo do botão",
  items: "Itens",
  stats: "Estatísticas (números grandes)",
  value: "Número em destaque",
  caption: "Legenda",
  steps: "Etapas",
  planButtons: "Botões de plano",
  question: "Pergunta",
  answer: "Resposta",
  number: "Número",
  text: "Texto da linha",
  accent: "Destacar em azul",
  label: "Texto do botão",
  msg: "Mensagem enviada no WhatsApp",
  boxTitle: "Título da caixa",
  boxSubtitle: "Subtítulo da caixa",
  noteStrong: "Aviso (parte em destaque)",
  noteRest: "Aviso (restante)",
  ctaQuestion: "Pergunta acima do botão",
  description_: "Descrição",
  email: "E-mail de contato",
  tagline: "Frase do rodapé",
};

function humanize(key: string): string {
  if (LABELS[key]) return LABELS[key];
  const spaced = key.replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function blankLike(v: Json): Json {
  if (typeof v === "string") return "";
  if (typeof v === "boolean") return false;
  if (typeof v === "number") return 0;
  if (Array.isArray(v)) return [];
  if (v && typeof v === "object") {
    const o: Record<string, Json> = {};
    for (const k of Object.keys(v)) o[k] = blankLike(v[k]);
    return o;
  }
  return "";
}

function getAt(obj: Json, path: (string | number)[]): Json {
  let cur: Json = obj;
  for (const p of path) {
    if (cur == null || typeof cur !== "object") return null;
    cur = (cur as Record<string | number, Json>)[p as never];
  }
  return cur;
}

function setAt(obj: Json, path: (string | number)[], value: Json): Json {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(obj)) {
    const copy = obj.slice();
    copy[head as number] = setAt(copy[head as number] ?? null, rest, value);
    return copy;
  }
  const copy: Record<string, Json> = { ...(obj as Record<string, Json>) };
  copy[head as string] = setAt(copy[head as string] ?? null, rest, value);
  return copy;
}

export default function ContentEditor({
  sectionKey,
  initial,
  defaults,
}: {
  sectionKey: string;
  initial: Json;
  defaults: Json;
}) {
  const router = useRouter();
  const [data, setData] = useState<Json>(initial);
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  function update(path: (string | number)[], value: Json) {
    setData((prev) => setAt(prev, path, value));
    setFeedback(null);
  }

  function onSave() {
    setFeedback(null);
    startTransition(async () => {
      const res = await saveSection(sectionKey, data);
      if (res.ok) {
        setFeedback({ ok: true, msg: "Salvo! As alterações já estão no ar." });
        router.refresh();
      } else {
        setFeedback({ ok: false, msg: res.error ?? "Erro ao salvar." });
      }
    });
  }

  function renderNode(value: Json, path: (string | number)[], keyName: string): React.ReactNode {
    // Booleano → checkbox
    if (typeof value === "boolean") {
      return (
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => update(path, e.target.checked)}
            className="w-4 h-4 accent-[#2563EB]"
          />
          <span className="font-display text-xs text-[#A3A3A3]">{humanize(keyName)}</span>
        </label>
      );
    }

    // Texto → textarea
    if (typeof value === "string" || typeof value === "number") {
      const str = String(value);
      const rows = Math.min(8, Math.max(1, Math.ceil(str.length / 64)));
      const isLong = str.length > 48;
      return (
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-xs text-[#A3A3A3] tracking-wide">{humanize(keyName)}</span>
          {isLong ? (
            <textarea
              value={str}
              rows={rows}
              onChange={(e) => update(path, e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-2 font-body text-sm text-[#F5F5F5] focus:outline-none focus:border-[#2563EB] transition-colors resize-y"
            />
          ) : (
            <input
              value={str}
              onChange={(e) => update(path, e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-2 font-body text-sm text-[#F5F5F5] focus:outline-none focus:border-[#2563EB] transition-colors"
            />
          )}
        </label>
      );
    }

    // Array → lista de itens com adicionar/remover
    if (Array.isArray(value)) {
      const templateSource =
        (value[0] as Json) ?? (getAt(defaults, [...path, 0]) as Json) ?? "";
      return (
        <div className="flex flex-col gap-3">
          <span className="font-display text-xs font-semibold uppercase tracking-wider text-[#737373]">
            {humanize(keyName)}
          </span>
          {value.map((item, i) => (
            <div key={i} className="relative border border-[#2A2A2A] bg-[#0F0F0F] p-4 pt-9">
              <div className="absolute top-2 left-3 font-display text-[10px] uppercase tracking-wider text-[#525252]">
                #{i + 1}
              </div>
              <button
                type="button"
                onClick={() => {
                  const next = (value as Json[]).slice();
                  next.splice(i, 1);
                  update(path, next);
                }}
                className="absolute top-2 right-2 text-[#737373] hover:text-red-400 transition-colors"
                aria-label="Remover item"
                title="Remover"
              >
                <Trash2 size={15} />
              </button>
              {renderNode(item, [...path, i], keyName)}
            </div>
          ))}
          <button
            type="button"
            onClick={() => update(path, [...(value as Json[]), blankLike(templateSource)])}
            className="inline-flex items-center gap-2 self-start font-display text-xs font-semibold text-[#2563EB] hover:text-[#3B82F6] transition-colors"
          >
            <Plus size={14} /> Adicionar item
          </button>
        </div>
      );
    }

    // Objeto → campos aninhados
    if (value && typeof value === "object") {
      return (
        <div className="flex flex-col gap-4">
          {Object.keys(value).map((k) => (
            <div key={k}>{renderNode(value[k], [...path, k], k)}</div>
          ))}
        </div>
      );
    }

    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">{renderNode(data, [], sectionKey)}</div>

      {feedback && (
        <div
          className={`font-body text-sm px-4 py-3 border ${
            feedback.ok
              ? "text-[#22C35E] border-[#22C35E]/40 bg-[#22C35E]/10"
              : "text-red-400 border-red-500/40 bg-red-500/10"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 sticky bottom-0 bg-[#0A0A0A] py-4 border-t border-[#2A2A2A]">
        <button
          type="button"
          onClick={onSave}
          disabled={pending}
          className="inline-flex items-center gap-2 font-display text-sm font-semibold tracking-wide px-6 py-3 bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check size={16} />
          {pending ? "Salvando..." : "Salvar alterações"}
        </button>
        <button
          type="button"
          onClick={() => {
            setData(defaults);
            setFeedback(null);
          }}
          className="inline-flex items-center gap-2 font-display text-sm font-semibold tracking-wide px-5 py-3 border border-[#2A2A2A] text-[#A3A3A3] hover:text-white hover:border-[#525252] transition-colors"
          title="Volta os textos para o padrão de fábrica (você ainda precisa Salvar)"
        >
          <RotateCcw size={15} />
          Restaurar padrão
        </button>
      </div>
    </div>
  );
}
