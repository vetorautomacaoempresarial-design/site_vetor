# Site Vetor Automação

Site institucional + **Área do Cliente** da Vetor Automação (`vetorautomacao.io`).
Reúne o marketing institucional, a página do produto **Assistente de Vendas**, login de
clientes, **assinatura recorrente via ASAAS** e um **painel administrativo** (`/admin`) que
edita os textos do site sem precisar de rebuild.

> Para o guia interno de arquitetura voltado a quem desenvolve (e ao Claude Code), veja
> [`CLAUDE.md`](./CLAUDE.md). Para o passo a passo de deploy, veja
> [`docs/deploy-producao.md`](./docs/deploy-producao.md) e `_HANDOFF_DEPLOY_HOSTINGER.md`.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — fontes `Space_Grotesk` (display) e `Inter` (texto)
- **Supabase** — autenticação + Postgres com RLS
- **ASAAS** (API v3) — gateway de pagamento / assinaturas recorrentes
- **Resend** — e-mails (leads do formulário + notificações internas)
- **Zod** + **react-hook-form** (validação), **framer-motion** (animações), **lucide-react** (ícones)
- Gerenciador de pacotes: **pnpm**

## Rodando localmente

Pré-requisitos: Node.js + pnpm.

```bash
pnpm install
cp .env.example .env.local   # preencha os valores reais
pnpm dev                     # http://localhost:3000
```

Scripts:

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Servidor de desenvolvimento. |
| `pnpm build` | Build de produção. |
| `pnpm start` | Sobe o build de produção. |
| `pnpm lint` | ESLint. |

No Windows há também o `iniciar.bat` (atalho para subir o dev).

## Variáveis de ambiente

Modelo em [`.env.example`](./.env.example). Valores reais ficam em `.env.local` (não versionado).

| Variável | Uso |
|----------|-----|
| `NEXT_PUBLIC_SITE_URL` | URL canônica (metadata, sitemap, fallback de redirects). |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número do botão flutuante e CTAs de WhatsApp. |
| `RESEND_API_KEY` | Envio de e-mail. Sem ela, os e-mails são pulados (apenas log). |
| `EMAIL_TO` | Destino de leads/notificações (default `administrativo@vetorautomacao.io`). |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente Supabase (browser + SSR). |
| `SUPABASE_SERVICE_ROLE_KEY` | **Só servidor** — ignora RLS. Nunca expor ao browser. |
| `ASAAS_API_KEY` | Chave ASAAS. Produção `$aact_prod_...`, sandbox `$aact_hmlg_...`. |
| `ASAAS_ENV` | `sandbox` (default) ou `production`. |
| `ASAAS_WEBHOOK_TOKEN` | Token esperado no header `asaas-access-token` do webhook. |

> ⚠️ A chave ASAAS começa com `$`. Em `.env.local` é preciso escapar com `\$` (armadilha do
> dotenv-expand). Em painéis (Vercel/VPS) cole o valor **cru**, começando com `$`.

## Estrutura

```
app/
  page.tsx                     Home (consome getSiteContent)
  assistente-de-vendas/        Página do produto (consome getSiteContent)
  cases/                       Lista e detalhe ([slug]) de cases
  entrar · cadastro · recuperar-senha · redefinir-senha
  auth/callback · auth/confirm  Troca de code/token por sessão (Supabase)
  conta/                       Área do cliente (assinatura, pagamentos, configurações)
  admin/                       Painel de edição de textos (CMS-lite)
  api/
    contact/                   Formulário de contato (Resend + rate limit + honeypot)
    conta/assinar · trocar-plano · cancelar   Operações de assinatura (ASAAS)
    webhooks/asaas/            Recebe eventos de cobrança do ASAAS
  (páginas legais: contrato-de-adesao, termos-de-uso, politica-de-privacidade, ...)
components/   sections/ (blocos do site), conta/, admin/, auth/, layout/, ui/, legal/
lib/
  plans.ts                     Fonte única dos planos (preços e ciclos)
  asaas/client.ts              Wrapper da API do ASAAS
  content/                     CMS-lite (defaults, types, index, actions, admin)
  supabase/                    client / server / middleware / service
  legal.ts · validation.ts · notify.ts · db.ts · cases.ts
content/legal/*.md             Texto dos documentos legais (renderizados em Markdown)
supabase/migrations/           Esquema do banco (3 migrations)
proxy.ts                       Middleware (refresh de sessão + proteção de rotas)
```

## Como o site funciona

### Conteúdo editável (CMS-lite)

Os textos do site não são hardcoded nas seções: vêm de `getSiteContent()`, que mescla os
**defaults** (`lib/content/defaults.ts`) com as **sobreposições** salvas na tabela
`site_content` do Supabase — com cache (`unstable_cache`). Admins editam em `/admin`; ao
salvar, um `revalidateTag` publica a mudança em segundos, **sem rebuild**. Se o banco estiver
indisponível, o site continua no ar com os defaults.

Acesso ao `/admin` exige login **e** estar na tabela `admins`.

### Assinatura (Assistente de Vendas)

1. Cliente logado em `/conta` informa nome + CPF/CNPJ e escolhe o plano.
2. Aceita os documentos legais (registrado em `terms_acceptances` **antes** da cobrança).
3. `POST /api/conta/assinar` cria o cliente e a **assinatura recorrente** no ASAAS e redireciona para a fatura.
4. O **webhook** (`/api/webhooks/asaas`) recebe os eventos de pagamento e mantém o status sincronizado no banco.

Trocar plano e cancelar atualizam direto a assinatura no ASAAS e notificam a equipe por e-mail.

Planos (`lib/plans.ts`): mensal R$ 289,90 · trimestral R$ 259,90/mês (3× por ciclo) ·
anual R$ 229,90/mês (12× por ciclo). A UI deriva tudo de `lib/plans.ts` (fonte única).

### Autenticação

Supabase Auth (e-mail/senha com confirmação). A sessão é renovada a cada request no
`proxy.ts`, que também protege `/conta/*` e `/admin/*`. Atrás do Traefik (produção), os
redirects de auth respeitam o header `x-forwarded-host`.

## Banco de dados

Migrations em `supabase/migrations/` (projeto `ymiznwbepxlrloreznfa`):

- `0001_area_do_cliente.sql` — `subscriptions`, `payments`, `subscription_requests` (+ RLS).
- `0002_terms_acceptances.sql` — log append-only dos aceites legais (prova contratual).
- `0003_site_content.sql` — `site_content` (textos do site) e `admins`.

Padrão de segurança: cliente lê apenas as próprias linhas (RLS); **escrita é feita pela
`service_role`** (webhook, rotas de API e server actions do admin).

## Deploy

**A produção roda na VPS Hostinger (Docker Compose + Traefik), não na Vercel.** O DNS de
`vetorautomacao.io` aponta para a VPS; o Traefik faz o TLS e roteia para o container do site.

- Passo a passo das integrações (ASAAS, Supabase, webhook): [`docs/deploy-producao.md`](./docs/deploy-producao.md).
- Detalhes de infra e migração para a VPS: `_HANDOFF_DEPLOY_HOSTINGER.md` (interno, não público).

> Observação: o `docs/deploy-producao.md` foi escrito quando o host era a Vercel; os passos de
> ASAAS/Supabase continuam válidos, mas a hospedagem hoje é a VPS Hostinger.
</content>
