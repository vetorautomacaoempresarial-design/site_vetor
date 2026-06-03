"use server";
import { revalidateTag } from "next/cache";
import { createServiceClient } from "@/lib/supabase/service";
import { getCurrentAdmin } from "@/lib/content/admin";
import { CONTENT_TAG, isSectionKey } from "@/lib/content";

export interface SaveResult {
  ok: boolean;
  error?: string;
}

/**
 * Salva os textos de uma seção. Só admin pode; grava via service_role e
 * invalida o cache para o site refletir na hora (sem rebuild).
 */
export async function saveSection(key: string, value: unknown): Promise<SaveResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "Não autorizado." };
  if (!isSectionKey(key)) return { ok: false, error: "Seção inválida." };

  const svc = createServiceClient();
  const { error } = await svc.from("site_content").upsert(
    {
      key,
      value: value as Record<string, unknown>,
      updated_by: admin.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) return { ok: false, error: error.message };

  // Next 16: o 2º argumento ("max") é obrigatório. Invalida o cache da tag,
  // então o site reflete a edição na próxima visita (sem rebuild).
  revalidateTag(CONTENT_TAG, "max");
  return { ok: true };
}
