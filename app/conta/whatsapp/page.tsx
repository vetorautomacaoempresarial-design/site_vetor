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

  return (
    <div className="flex flex-col gap-8">
      <section className="border border-[#2A2A2A] bg-[#141414] p-8">
        <p className="font-display text-xs tracking-widest uppercase text-[#737373] mb-2">
          WhatsApp Business
        </p>
        <h2 className="font-display font-semibold text-lg text-[#F5F5F5] tracking-tight mb-3">
          Conectar seu número
        </h2>
        <p className="font-body font-light text-sm text-[#A3A3A3] leading-relaxed max-w-2xl">
          Conecte o WhatsApp Business da sua empresa à nossa infraestrutura oficial da
          Meta. O processo é da própria Meta: você entra na sua conta do Facebook,
          escolhe (ou cria) a conta do WhatsApp Business e autoriza. Nada da sua senha
          passa pela Vetor.
        </p>
      </section>

      <ConectarWhatsApp conexao={conexao} />
    </div>
  );
}
