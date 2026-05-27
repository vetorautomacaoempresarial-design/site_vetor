# Site Vetor Automação — Plano de Implementação

## Contexto

A Vetor Automação é uma empresa de automação de processos com agentes de IA. Hoje não possui site. O diretório `SITE VETOR` contém apenas a identidade da marca (`ativos_da_marca/`) e o `CLAUDE.md`. O objetivo é construir um site profissional do zero que comunique posicionamento premium B2B ("AI · Process Automation" — "Seu processo tem magnitude. Nós damos direção."), gere leads qualificados via formulário/WhatsApp e sustente cases de sucesso em páginas próprias.

**Decisões já alinhadas com o usuário:**
- Stack: **Next.js 15 (App Router) + Tailwind CSS + Framer Motion**
- Escopo: **Híbrido** — landing principal + páginas individuais de cases
- Captação: **Formulário → email (Resend) + botão WhatsApp**
- Conteúdo: **copy placeholder profissional** (a ser editado depois)

A identidade visual já está fechada (ver `ativos_da_marca/diretrizes da marca vetor.png`):
- Paleta: Black `#0A0A0A`, Dark Surface, Mid Grey, Light Grey, White, **Electric Blue** (accent)
- Tipografia: **Space Grotesk** (display/headings) + **Inter** (corpo)
- Logo: vetor "V" estilizado apontando para baixo, com profundidade
- Ícones: outline 1.5px, grid 24×24
- Botões: primary (azul preenchido), secondary (azul outline), tertiary (branco outline)

---

## Stack Técnica

| Camada | Escolha | Motivo |
|---|---|---|
| Framework | Next.js 15 (App Router, TS) | RSC, ótimo SEO, deploy trivial |
| Estilo | Tailwind CSS v4 | Velocidade, design tokens consistentes |
| Animação | Framer Motion | Scroll reveal, hover, page transitions |
| Forms | React Hook Form + Zod | Validação tipada |
| Email | Resend | API simples, plano gratuito generoso |
| Fontes | `next/font/google` | Zero CLS, self-hosted Space Grotesk + Inter |
| Ícones | lucide-react | Outline 1.5px alinhado às diretrizes |
| Package manager | pnpm | Mais rápido, lockfile determinístico |
| Deploy | Vercel | Integração nativa com Next.js |

---

## Estrutura de Pastas

```
SITE VETOR/
├── app/
│   ├── layout.tsx              # Fontes, metadata global, header/footer
│   ├── page.tsx                # Landing principal (one-page)
│   ├── globals.css             # Tailwind + tokens base
│   ├── cases/
│   │   ├── page.tsx            # Listagem de cases
│   │   └── [slug]/page.tsx     # Detalhe de cada case
│   ├── api/
│   │   └── contact/route.ts    # POST: valida + envia email via Resend
│   ├── sitemap.ts              # SEO
│   └── robots.ts               # SEO
├── components/
│   ├── sections/               # Hero, Servicos, ComoFunciona, CasesPreview, Diferenciais, Faq, ContatoForm, Footer
│   ├── ui/                     # Button, Card, Input, Textarea, Badge (primitivos)
│   ├── layout/                 # Header (nav fixa com scroll blur), WhatsAppFloat
│   └── motion/                 # FadeInUp, StaggerChildren, RevealOnScroll
├── lib/
│   ├── cases.ts                # Dados estáticos dos cases placeholder
│   ├── cn.ts                   # clsx + tailwind-merge
│   └── validation.ts           # Schemas zod do formulário
├── content/
│   └── cases/                  # Markdown/JSON com placeholder de 3 cases
├── public/
│   ├── brand/                  # Logo SVG (extraído do PNG)
│   └── og/                     # Imagens Open Graph
├── tailwind.config.ts          # Cores + fontes + animações da marca
├── next.config.ts
├── .env.example                # RESEND_API_KEY, EMAIL_TO, NEXT_PUBLIC_WHATSAPP_NUMBER
├── package.json
└── tsconfig.json
```

---

## Seções da Landing (`app/page.tsx`)

1. **Hero** — slogan principal, sub-headline, CTA primário (Agendar Demo → âncora do form) + CTA secundário (Ver Casos → `/cases`). Logo animado entrando + texto com reveal escalonado.
2. **Trust bar** — placeholder de logos de clientes (greyscale, opacity baixa).
3. **Serviços** — 3 a 4 cards (Agentes de IA conversacional, Automação de processos com RPA+IA, Integrações & APIs, Diagnóstico e Consultoria). Cada card com ícone outline + título + 2 linhas.
4. **Como Funciona** — timeline horizontal com 4 etapas (Diagnóstico → Projeto → Implantação → Operação), com linha conectora animada no scroll.
5. **Cases (preview)** — 3 cards com thumbnail, métrica destacada (placeholder), link para `/cases/[slug]`.
6. **Diferenciais / Stack** — bloco escuro com bullets sobre tecnologia (LLMs proprietários e abertos, infra própria, SLA, segurança).
7. **FAQ** — accordion com 6 perguntas comuns (prazo, custo, integração, segurança/LGPD, ROI, manutenção).
8. **CTA + Formulário** — bloco azul accent com formulário inline (nome, email, empresa, telefone, mensagem) e botão WhatsApp ao lado.
9. **Footer** — logo, navegação, contato, redes sociais, copyright.

Componentes globais:
- **Header** fixo no topo com backdrop-blur ao scrollar, nav âncoras + CTA "Agendar Demo".
- **WhatsAppFloat** botão flutuante bottom-right, sempre visível, com leve pulse.

---

## Design System (`tailwind.config.ts`)

```ts
colors: {
  black: '#0A0A0A',
  surface: '#141414',
  midGrey: '#2A2A2A',
  lightGrey: '#A0A0A0',
  white: '#F5F5F5',
  electric: { DEFAULT: '#1A4FFF', hover: '#3D6BFF' }, // ajustar via eyedropper no PNG
}
fontFamily: {
  display: ['var(--font-space-grotesk)'],
  body: ['var(--font-inter)'],
}
```

Animações Framer Motion reutilizáveis em `components/motion/`:
- `FadeInUp` (delay, distance configuráveis)
- `StaggerChildren` (para grids de cards)
- `RevealOnScroll` (usa `useInView`)

---

## Formulário `/api/contact`

- Endpoint POST que valida o body com zod (`lib/validation.ts`).
- Honeypot field oculto contra bots básicos.
- Rate limit simples por IP em memória (suficiente para MVP — upgrade futuro para Upstash).
- Envia email via Resend (`RESEND_API_KEY`, `EMAIL_TO` em `.env`).
- Resposta: `{ ok: true }` ou `{ ok: false, error: string }`.
- UI mostra estados: idle / loading / success / error com mensagens claras.

---

## Páginas de Cases

- **`/cases`**: grid de todos os cases (`lib/cases.ts` retorna lista).
- **`/cases/[slug]`**: hero do case + desafio + solução + resultados (métricas) + tecnologias usadas + CTA final.
- Dados em `content/cases/` ou objeto TS em `lib/cases.ts` (mais simples para MVP). 3 cases placeholder iniciais.
- `generateStaticParams` para SSG.

---

## SEO & Performance

- `metadata` global em `app/layout.tsx` (title, description, OG, Twitter cards, favicon).
- `app/sitemap.ts` e `app/robots.ts` gerados dinamicamente.
- JSON-LD `Organization` schema injetado no `<head>` do layout.
- Imagens via `next/image` (otimização automática AVIF/WebP).
- Fontes via `next/font/google` (zero CLS, preload).
- Meta de Lighthouse: **95+** em todas as quatro métricas.

---

## Arquivos Críticos a Criar

1. `app/layout.tsx` — fontes, metadata, providers
2. `app/page.tsx` — composição da landing
3. `app/api/contact/route.ts` — endpoint do formulário
4. `app/cases/[slug]/page.tsx` — template de case
5. `components/sections/Hero.tsx` — primeira impressão crítica
6. `components/sections/ContatoForm.tsx` — formulário com RHF + Zod
7. `components/layout/Header.tsx` — nav fixa com blur
8. `components/layout/WhatsAppFloat.tsx` — botão flutuante
9. `tailwind.config.ts` — cores e fontes da marca
10. `lib/cases.ts` — dados placeholder dos cases
11. `lib/validation.ts` — schemas zod
12. `public/brand/logo.svg` — logo extraído do PNG (ou usar PNG mesmo via `next/image`)

---

## Plano de Execução (ordem sugerida)

1. **Setup** — `pnpm create next-app`, instalar dependências (`framer-motion`, `react-hook-form`, `zod`, `resend`, `lucide-react`, `clsx`, `tailwind-merge`).
2. **Design system** — configurar `tailwind.config.ts`, fontes em `layout.tsx`, primitivos em `components/ui/`.
3. **Layout global** — Header, Footer, WhatsAppFloat.
4. **Landing** — Hero → Serviços → Como Funciona → Cases preview → Diferenciais → FAQ → Contato.
5. **Animações** — Framer Motion em cada seção.
6. **Páginas de cases** — listagem + template `[slug]` + 3 cases placeholder.
7. **API & formulário** — endpoint `/api/contact` + integração Resend.
8. **SEO** — sitemap, robots, metadata, JSON-LD.
9. **Polish** — responsividade mobile/tablet, microinterações, dark mode é o default.

---

## Verificação

**Local:**
```powershell
pnpm install
pnpm dev          # http://localhost:3000
```

**Screenshots de validação visual** (Puppeteer já instalado, ver CLAUDE.md):
```powershell
node "C:\Users\User\AppData\Local\Temp\puppeteer-test\screenshot.js" http://localhost:3000 home.png
node "C:\Users\User\AppData\Local\Temp\puppeteer-test\screenshot.js" http://localhost:3000/cases cases.png
```

**Checklist de validação:**
- [ ] Visual fiel às diretrizes (paleta, tipografia, peso das fontes)
- [ ] Logo aparece corretamente em todas as páginas
- [ ] Hero responsivo em 375px / 768px / 1440px
- [ ] CTAs levam às âncoras corretas
- [ ] Formulário valida campos e mostra erros
- [ ] Endpoint `/api/contact` retorna 200 com payload válido (testar com Resend em modo teste)
- [ ] Botão WhatsApp abre conversa no número correto
- [ ] Páginas de cases renderizam via SSG
- [ ] `pnpm build` sem warnings/errors
- [ ] Lighthouse 95+ em Performance, Accessibility, Best Practices, SEO

**Variáveis de ambiente necessárias (`.env.local`):**
```
RESEND_API_KEY=re_xxx
EMAIL_TO=contato@vetorautomacao.com.br
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
NEXT_PUBLIC_SITE_URL=https://vetorautomacao.com.br
```

---

## Fora do Escopo (deixar para iteração 2)

- CMS (Sanity/Contentful) — usar dados estáticos por enquanto
- Blog/Insights — não solicitado
- Internacionalização (i18n)
- Painel admin para leads (Supabase) — Resend cobre o MVP
- Analytics avançado (apenas Vercel Analytics + GA4 básico no MVP)
