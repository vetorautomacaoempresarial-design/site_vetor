-- Área do Cliente: assinaturas, pagamentos e solicitações (Supabase + ASAAS)
-- Conforme docs/area-do-cliente-supabase.md
-- Aplicar no projeto Supabase "Vetor's Project" (ymiznwbepxlrloreznfa).

-- ============ ENUMS ============
do $$ begin
  create type public.subscription_status as enum ('ativa', 'vencida', 'cancelada', 'pendente');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.billing_period as enum ('mensal', 'trimestral', 'anual');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.request_type as enum ('cancelamento', 'troca_plano');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.request_status as enum ('pendente', 'resolvido', 'cancelado');
exception when duplicate_object then null; end $$;

-- ============ updated_at trigger ============
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============ subscriptions ============
-- Uma assinatura por cliente (Assistente de Vendas).
-- Escrita apenas pela service_role (webhook/servidor); cliente só lê a própria linha.
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan public.billing_period not null default 'mensal',
  status public.subscription_status not null default 'pendente',
  asaas_customer_id text,
  asaas_subscription_id text unique,
  value_cents integer check (value_cents is null or value_cents >= 0),
  billing_type text,
  started_at timestamptz,
  current_period_end timestamptz,
  canceled_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists subscriptions_asaas_customer_idx on public.subscriptions(asaas_customer_id);

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ============ payments ============
-- Histórico de cobranças, alimentado pelo webhook do ASAAS (idempotente por asaas_payment_id).
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  asaas_payment_id text unique,
  asaas_subscription_id text,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'BRL',
  plan public.billing_period,
  status text,
  billing_type text,
  invoice_url text,
  due_date timestamptz,
  paid_at timestamptz,
  description text,
  created_at timestamptz not null default now()
);

create index if not exists payments_user_id_idx on public.payments(user_id);
create index if not exists payments_paid_at_idx on public.payments(paid_at desc);

-- ============ subscription_requests ============
-- Auditoria dos pedidos de cancelar/trocar plano feitos pelo cliente.
create table if not exists public.subscription_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type public.request_type not null,
  desired_plan public.billing_period,
  status public.request_status not null default 'pendente',
  message text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists subscription_requests_user_id_idx on public.subscription_requests(user_id);
create index if not exists subscription_requests_status_idx on public.subscription_requests(status);

-- ============ RLS ============
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.subscription_requests enable row level security;

-- subscriptions: cliente lê só a própria linha. Escrita fica a cargo da service_role
-- (que ignora RLS), usada pelo webhook e pelas rotas de servidor.
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
  on public.subscriptions for select
  to authenticated
  using (auth.uid() = user_id);

-- payments: cliente lê só os próprios.
drop policy if exists "payments_select_own" on public.payments;
create policy "payments_select_own"
  on public.payments for select
  to authenticated
  using (auth.uid() = user_id);

-- subscription_requests: cliente lê e insere os próprios (sem update/delete).
drop policy if exists "subscription_requests_select_own" on public.subscription_requests;
create policy "subscription_requests_select_own"
  on public.subscription_requests for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "subscription_requests_insert_own" on public.subscription_requests;
create policy "subscription_requests_insert_own"
  on public.subscription_requests for insert
  to authenticated
  with check (auth.uid() = user_id);
