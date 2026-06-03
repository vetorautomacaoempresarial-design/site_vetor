import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Faz o refresh da sessão (cookies) a cada request e protege as rotas /conta/*.
 * Visitante sem sessão tentando acessar /conta é redirecionado para /entrar.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: não rode código entre createServerClient e getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Proteção das rotas da área do cliente.
  if (!user && pathname.startsWith("/conta")) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Usuário logado não precisa ver as telas de auth.
  if (user && (pathname === "/entrar" || pathname === "/cadastro")) {
    const url = request.nextUrl.clone();
    url.pathname = "/conta";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
