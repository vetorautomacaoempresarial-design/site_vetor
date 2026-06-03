-- Conteúdo editável do site (CMS-lite) + lista de admins do painel /admin.
-- Os TEXTOS do site passam a ser sobrepostos por linhas desta tabela; quando
-- não há linha, o site usa os defaults definidos em lib/content/defaults.ts.
-- Aplicar no projeto Supabase "Vetor's Project" (ymiznwbepxlrloreznfa).

-- ============ site_content ============
-- Uma linha por seção (key = "home.hero", "assistente.faq", ...).
-- `value` guarda só os TEXTOS daquela seção (sem ícones/cores, que ficam no código).
-- Escrita apenas pela service_role (server action do /admin); leitura é pública
-- (textos de marketing, sem segredo).
create table if not exists public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;

-- Leitura pública (anon + authenticated). Escrita fica a cargo da service_role,
-- que ignora o RLS e é usada só pela server action do painel, após checar admin.
drop policy if exists "site_content_select_public" on public.site_content;
create policy "site_content_select_public"
  on public.site_content for select
  to anon, authenticated
  using (true);

-- ============ admins ============
-- Quem pode acessar/editar o painel /admin. Sem políticas de leitura pública:
-- com RLS ligado e nenhuma policy, anon/authenticated NÃO leem; só a service_role
-- (usada na checagem server-side) enxerga.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists admins_email_idx on public.admins(lower(email));

alter table public.admins enable row level security;
