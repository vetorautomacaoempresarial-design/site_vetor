import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com a chave **service_role**. Ignora o RLS — use APENAS no
 * servidor (webhook do ASAAS e rotas de API), nunca em código que chega ao browser.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase service client indisponível: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
