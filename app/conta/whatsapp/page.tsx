import { createClient } from "@/lib/supabase/server";
import ConectarWhatsApp from "@/components/conta/ConectarWhatsApp";

export const metadata = { title: "Conectar WhatsApp" };

type ConexaoWhatsApp = {
  waba_id: string;
  phone_number_id: string | null;
  display_phone_number: string | null;
  verified_name: string | null;
  status: string | null;
  onboarded_at: string | null;
};

export default async function WhatsAppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // RLS permite ao cliente ler só a(s) própria(s) conexão(ões) (migration 0004).
  const { data } = await supabase
    .from("meta_clientes")
    .select(
      "waba_id, phone_number_id, display_phone_number, verified_name, status, onboarded_at"
    )
    .eq("user_id", user!.id)
    .order("onboarded_at", { ascending: false })
    .limit(1);

  const conexao = (data?.[0] as ConexaoWhatsApp | undefined) ?? null;

  // O cabeçalho vive dentro do próprio ConectarWhatsApp: o texto muda conforme o
  // estado (conectar / processando / conectado), então um título fixo aqui só
  // duplicaria o da seção.
  return <ConectarWhatsApp conexao={conexao} />;
}
