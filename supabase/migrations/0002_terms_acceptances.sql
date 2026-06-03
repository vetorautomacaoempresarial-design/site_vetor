-- Log de aceite dos documentos legais (prova da formação contratual)
-- Conforme Cláusula 18.2 do Contrato de Adesão: registra data/hora, IP,
-- e-mail do CLIENTE e versão dos documentos aceitos.
-- Aplicar no projeto Supabase "Vetor's Project" (ymiznwbepxlrloreznfa).
-- Depende de 0001_area_do_cliente.sql (enum public.billing_period).

-- ============ terms_acceptances ============
-- Registro append-only (imutável): cada aceite gera uma linha nova.
-- Escrita apenas pela service_role (rota /api/conta/assinar); cliente só lê os
-- próprios registros. Sem políticas de update/delete = somente service_role altera.
create table if not exists public.terms_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  ip text,
  user_agent text,
  terms_version text not null,
  documents jsonb not null default '[]'::jsonb,
  plan public.billing_period,
  accepted_at timestamptz not null default now()
);

create index if not exists terms_acceptances_user_id_idx
  on public.terms_acceptances(user_id);
create index if not exists terms_acceptances_accepted_at_idx
  on public.terms_acceptances(accepted_at desc);

-- ============ RLS ============
alter table public.terms_acceptances enable row level security;

-- Cliente lê apenas os próprios aceites. A inserção fica a cargo da service_role
-- (que ignora RLS), usada pela rota de servidor /api/conta/assinar.
drop policy if exists "terms_acceptances_select_own" on public.terms_acceptances;
create policy "terms_acceptances_select_own"
  on public.terms_acceptances for select
  to authenticated
  using (auth.uid() = user_id);
