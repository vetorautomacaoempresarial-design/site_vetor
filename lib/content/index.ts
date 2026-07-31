import "server-only";
import { unstable_cache } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { DEFAULT_CONTENT, SECTION_LABELS } from "@/lib/content/defaults";
import type { SiteContent } from "@/lib/content/types";

/** Tag de cache: invalidada quando o admin salva uma seção. */
export const CONTENT_TAG = "site-content";

export function isSectionKey(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(SECTION_LABELS, key);
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * Sobrepõe `override` (vindo do banco) sobre `base` (default), preservando a
 * forma do default: só considera chaves que existem no default e, em arrays,
 * substitui o array inteiro pelo do banco (o editor sempre envia o array completo).
 */
function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }
  if (isPlainObject(base) && isPlainObject(override)) {
    const out: Record<string, unknown> = { ...base };
    for (const k of Object.keys(base)) {
      out[k] = deepMerge((base as Record<string, unknown>)[k], override[k]);
    }
    return out as T;
  }
  return (typeof override === typeof base ? override : base) as T;
}

function getByPath(obj: unknown, key: string): unknown {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (isPlainObject(acc)) return acc[part];
    return undefined;
  }, obj);
}

function applyOverride(content: SiteContent, key: string, value: unknown) {
  const parts = key.split(".");
  let target: Record<string, unknown> = content as unknown as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    const next = target[parts[i]];
    if (!isPlainObject(next)) return;
    target = next;
  }
  const last = parts[parts.length - 1];
  if (target[last] === undefined) return;
  target[last] = deepMerge(target[last], value);
}

async function fetchContent(): Promise<SiteContent> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from("site_content").select("key, value");
    if (error || !data) return DEFAULT_CONTENT;

    const content = structuredClone(DEFAULT_CONTENT);
    for (const row of data) {
      if (isSectionKey(row.key)) applyOverride(content, row.key, row.value);
    }
    return content;
  } catch {
    // Banco indisponível → site continua no ar com os textos padrão.
    return DEFAULT_CONTENT;
  }
}

/**
 * Conteúdo efetivo do site (defaults + sobreposições do banco), com cache.
 * O banco só é consultado quando o cache é invalidado (ou seja, quando o admin
 * salva) — visitantes não pesam no banco.
 */
// A chave é VERSIONADA de propósito: o valor em cache guarda a forma do
// SiteContent de quando foi gravado. Ao adicionar/remover campos do tipo,
// incremente o sufixo — senão um cache antigo (sem as chaves novas) continua
// sendo servido e as páginas que leem esses campos quebram.
// v3: seção `blindado` (Vetor Chat).
// v4: seção `personalizadas` (página própria); `home.comoFunciona` saiu da Home.
// v5: header perdeu `navPorqueVetor` e `navDuvidas` (menu só com "Produtos").
// v7: seção de soluções perdeu o `title` e o `description` de cada card.
// v8: seção de soluções perdeu também o `badge` e o `intro` (só os produtos).
// v9: hero da Home perdeu a `tag`, o `headline` virou texto único e ganhou
//     `typedLines` (frases que se revezam com efeito de digitação).
// v10: cards de "Por que a Vetor" perderam a `description` (só título).
// v11: cards de "O problema" (Vetor Chat) perderam a `description` (só título).
// v12: "O problema" perdeu os destaques numéricos (`stats` e `statsNote`).
// v13: cards de "O que você ganha" (Vetor Chat) perderam a `description` —
//      o título virou a própria frase-benefício.
// v14: cards de "Benefícios" (Vetor Sales) perderam a `description` —
//      o título virou a própria frase-benefício.
export const getSiteContent = unstable_cache(fetchContent, ["site-content-v14"], {
  tags: [CONTENT_TAG],
});

/** Recorte efetivo de uma seção (para pré-preencher o editor do /admin). */
export async function getSection(key: string): Promise<unknown> {
  const content = await getSiteContent();
  return getByPath(content, key);
}

/** Recorte padrão (de fábrica) de uma seção — usado no "restaurar padrão". */
export function getDefaultSection(key: string): unknown {
  return structuredClone(getByPath(DEFAULT_CONTENT, key));
}
