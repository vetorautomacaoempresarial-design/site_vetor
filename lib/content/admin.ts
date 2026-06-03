import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export interface AdminUser {
  id: string;
  email: string;
}

/**
 * Retorna o usuário logado SE ele estiver na tabela `admins`; senão null.
 * A checagem usa a service_role (ignora RLS) só para ler a lista de admins.
 */
export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const svc = createServiceClient();
  const { data, error } = await svc
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  return { id: user.id, email: user.email };
}
