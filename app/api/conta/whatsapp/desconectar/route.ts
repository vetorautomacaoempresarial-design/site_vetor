import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { notifyTeam } from "@/lib/notify";

// O cliente informa que o número não está mais conectado (trocou de número,
// desvinculou pelo painel da Meta, perdeu o acesso etc.).
//
// NÃO apagamos a linha de meta_clientes: ela é o registro do provisionamento
// (WABA, inbox do Chatwoot, tokens) e a equipe precisa dele para investigar.
// Apenas soltamos o vínculo com o usuário do site — o mesmo efeito do
// `on delete set null` previsto na migration 0004. Com user_id nulo, a RLS
// deixa de expor a linha ao cliente e a tela volta a oferecer "Conectar".
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const service = createServiceClient();

  // Guarda o que estava vinculado para poder informar a equipe.
  const { data: antes } = await service
    .from("meta_clientes")
    .select("waba_id, display_phone_number, verified_name")
    .eq("user_id", user.id);

  if (!antes || antes.length === 0) {
    // Já não havia vínculo: idempotente, responde ok para a UI seguir.
    return NextResponse.json({ ok: true, desvinculadas: 0 });
  }

  const { error } = await service
    .from("meta_clientes")
    .update({ user_id: null })
    .eq("user_id", user.id);

  if (error) {
    console.error("Erro ao desvincular meta_clientes:", error);
    return NextResponse.json(
      { error: "Não foi possível concluir. Tente novamente." },
      { status: 500 }
    );
  }

  const numeros = antes
    .map((c) => `${c.verified_name ?? "—"} · ${c.display_phone_number ?? c.waba_id}`)
    .join("<br>");

  await notifyTeam({
    subject: `[WhatsApp] Cliente reportou desconexão — ${user.email}`,
    html: `
      <div style="font-family: sans-serif; color:#1a1a1a; max-width:600px;">
        <h2 style="color:#4A6CF7;">Desconexão de WhatsApp reportada</h2>
        <p><strong>Cliente:</strong> ${user.email}</p>
        <p><strong>ID do usuário:</strong> ${user.id}</p>
        <p><strong>Conexão(ões) desvinculada(s):</strong><br>${numeros}</p>
        <p style="color:#666;">O registro do provisionamento foi preservado; apenas o vínculo com a conta do site foi removido. O cliente pode reconectar pela Área do Cliente.</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true, desvinculadas: antes.length });
}
