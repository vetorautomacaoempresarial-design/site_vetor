import { NextResponse, type NextRequest } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { updateEmailSchema } from "@/lib/validation";

// Troca o e-mail do cliente logado de forma imediata.
// Fluxo: re-autentica pela senha atual e, confirmada a identidade, aplica a
// mudança via Admin API (service_role) com email_confirm — sem link de confirmação.
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = updateEmailSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  if (email.toLowerCase() === user.email.toLowerCase()) {
    return NextResponse.json(
      { error: "Informe um e-mail diferente do atual." },
      { status: 400 }
    );
  }

  // Re-autenticação: valida a senha atual num cliente isolado (sem persistir
  // sessão), para não interferir nos cookies da sessão vigente.
  const authCheck = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const { error: signInError } = await authCheck.auth.signInWithPassword({
    email: user.email,
    password,
  });
  if (signInError) {
    return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });
  }

  // Aplica a troca de e-mail (e mantém o metadado em dia).
  const service = createServiceClient();
  const { error: updateError } = await service.auth.admin.updateUserById(user.id, {
    email,
    email_confirm: true,
    user_metadata: { ...user.user_metadata, email },
  });
  if (updateError) {
    const alreadyUsed = /registered|already|exists|duplicate/i.test(updateError.message);
    return NextResponse.json(
      {
        error: alreadyUsed
          ? "Este e-mail já está em uso por outra conta."
          : "Não foi possível alterar o e-mail. Tente novamente.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
