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
export const getSiteContent = unstable_cache(fetchContent, ["site-content-v2"], {
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
