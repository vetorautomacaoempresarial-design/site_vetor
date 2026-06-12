import { createClient } from "@/lib/supabase/server";
import ConfiguracoesForms from "@/components/conta/ConfiguracoesForms";

export const metadata = { title: "Configurações" };

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const currentName = (user!.user_metadata?.name as string | undefined) ?? "";

  return <ConfiguracoesForms currentEmail={user!.email ?? ""} currentName={currentName} />;
}
