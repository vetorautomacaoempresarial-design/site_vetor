-- ============================================================
-- 0005 — Produtos: separa "o que o cliente contrata" de "de quanto
-- em quanto tempo ele paga".
--
-- Até aqui, "plano" queria dizer só o CICLO de cobrança (o enum
-- public.billing_period: mensal/trimestral/anual), porque só existia
-- um produto — o Assistente de Vendas.
--
-- Com o lançamento do Vetor Chat passam a existir dois produtos
-- MUTUAMENTE EXCLUSIVOS (o cliente tem uma assinatura só):
--   blindado   — só a conexão do número à nossa infraestrutura Meta
--   assistente — o agente de IA, que já embute essa conexão
--
-- A dependência é de mão única: não há como rodar o agente sem o número
-- conectado, então 'assistente' sempre inclui a blindagem.
--
-- Em vez de multiplicar billing_period por 3 (o que exigiria alterar
-- um enum usado por 4 tabelas), o produto entra como coluna própria.
-- billing_period continua intacto e significando apenas o ciclo.
--
-- Toda linha existente é, por definição, do Assistente de Vendas —
-- daí o default 'assistente' nas colunas retroativas.
-- ============================================================

-- ============ ENUM ============
do $$ begin
  create type public.product_id as enum ('assistente', 'blindado');
exception when duplicate_object then null; end $$;

-- ============ subscriptions ============
-- not null com default: as assinaturas que já existem viram 'assistente',
-- que é exatamente o que elas são.
alter table public.subscriptions
  add column if not exists product public.product_id not null default 'assistente';

create index if not exists subscriptions_product_idx
  on public.subscriptions (product);

-- ============ payments ============
-- Nullable: o webhook do ASAAS pode receber uma cobrança antes de
-- conseguir resolver a assinatura correspondente.
alter table public.payments
  add column if not exists product public.product_id;

-- ============ subscription_requests ============
-- Auditoria de troca de plano: além do ciclo desejado (desired_plan),
-- agora registramos o produto desejado.
alter table public.subscription_requests
  add column if not exists desired_product public.product_id;

-- ============ terms_acceptances ============
-- Prova contratual (Cláusula 18.2): precisa registrar QUAL produto foi
-- contratado, não só o ciclo — as condições contratuais diferem entre
-- o Assistente e o WhatsApp Blindado.
alter table public.terms_acceptances
  add column if not exists product public.product_id;
