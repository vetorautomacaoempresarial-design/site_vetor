import { createClient } from "@/lib/supabase/server";
import ConfiguracoesForms from "@/components/conta/ConfiguracoesForms";

export const metadata = { title: "Configurações" };

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <ConfiguracoesForms currentEmail={user!.email ?? ""} />;
}
