-- ============================================================
-- 0004 — meta_clientes: vínculo com o cliente logado no site
--
-- A tabela public.meta_clientes já existe no projeto (foi criada
-- fora deste repo, pela migration "meta_callback_tables" do fluxo
-- do n8n). Aqui garantimos que ela exista (create if not exists,
-- espelhando o schema conhecido) e ADICIONAMOS o vínculo com o
-- usuário do site: quem, na Área do Cliente, conectou aquele
-- WhatsApp. Escrita continua só via service_role (o n8n grava);
-- o cliente logado passa a poder LER a(s) própria(s) conexão(ões).
-- ============================================================

create extension if not exists pgcrypto;

-- Espelho do schema conhecido (idempotente). Se a tabela já existe,
-- este bloco não altera nada.
create table if not exists public.meta_clientes (
  id                    uuid        primary key default gen_random_uuid(),
  waba_id               text        not null unique,
  phone_number_id       text,
  display_phone_number  text,
  verified_name         text,
  owner_business_id     text,
  chatwoot_inbox_id     text,
  webhook_verify_token  text,
  onboarded_at          timestamptz,
  status                text
);

-- Novo: a qual usuário do site (auth.users) pertence esta conexão.
-- on delete set null: se a conta do site sumir, o registro do
-- provisionamento (WABA/inbox) não é apagado — só perde o vínculo.
alter table public.meta_clientes
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists meta_clientes_user_id_idx
  on public.meta_clientes (user_id);

-- RLS já está LIGADO nesta tabela. O n8n escreve via service_role
-- (bypassa RLS). Aqui adicionamos APENAS leitura da própria linha
-- para o cliente autenticado — é o que a página /conta/whatsapp usa
-- para mostrar o status "conectado".
alter table public.meta_clientes enable row level security;

drop policy if exists "cliente le seus meta_clientes" on public.meta_clientes;
create policy "cliente le seus meta_clientes"
  on public.meta_clientes for select
  to authenticated
  using (user_id = auth.uid());
