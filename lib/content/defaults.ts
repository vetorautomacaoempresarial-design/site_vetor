// Conteúdo PADRÃO do site (fonte da verdade dos textos atuais).
// O painel /admin sobrepõe isto via Supabase; sem sobreposição, o site usa estes
// valores — então, com a tabela vazia, o site fica idêntico ao que está hoje.
import type { SiteContent } from "@/lib/content/types";

export const DEFAULT_CONTENT: SiteContent = {
  home: {
    hero: {
      tag: "AI · Process Automation",
      headline: [
        { text: "Seu processo", accent: false },
        { text: "tem magnitude.", accent: false },
        { text: "Nós damos", accent: true },
        { text: "direção.", accent: false },
      ],
      subtitle:
        "Automatizamos processos com agentes de IA — do diagnóstico à operação contínua. Mais velocidade, menos erro, escala real.",
      ctaLabel: "Agendar Demo",
    },
    servicos: {
      badge: "Serviços",
      title: "O que entregamos",
      intro:
        "Soluções end-to-end, da estratégia à operação. Cada projeto é construído com tecnologia de ponta e responsabilidade de negócio.",
      items: [
        {
          title: "Agentes de IA Conversacional",
          description:
            "Agentes autônomos que entendem contexto, executam tarefas e se integram ao seu fluxo de trabalho — atendimento, vendas, suporte interno e muito mais.",
        },
        {
          title: "Integrações & Orquestração",
          description:
            "Conectamos suas ferramentas, APIs e bancos de dados em pipelines inteligentes que movem dados e disparam ações automaticamente entre sistemas.",
        },
        {
          title: "Diagnóstico & Consultoria",
          description:
            "Mapeamos seus processos, identificamos os maiores gargalos e entregamos um roadmap de automação com ROI estimado antes de qualquer implementação.",
        },
      ],
    },
    comoFunciona: {
      badge: "Metodologia",
      title: "Como funciona",
      steps: [
        {
          number: "01",
          title: "Diagnóstico",
          description:
            "Mapeamos seus processos atuais, identificamos gargalos, estimamos ROI e definimos o escopo ideal de automação.",
        },
        {
          number: "02",
          title: "Projeto",
          description:
            "Arquitetamos a solução, escolhemos as tecnologias certas e desenvolvemos em sprints com validação contínua.",
        },
        {
          number: "03",
          title: "Implementação",
          description:
            "Deploy controlado, testes em produção, treinamento da equipe e monitoramento intensivo na primeira fase operacional.",
        },
        {
          number: "04",
          title: "Operação",
          description:
            "Monitoramento contínuo, ajustes finos, relatórios de desempenho e evoluções incrementais conforme o negócio cresce.",
        },
      ],
    },
    diferenciais: {
      badge: "Por que a Vetor",
      title: "Tecnologia séria,\nresultado mensurável.",
      intro:
        "Não vendemos promessa de IA. Entregamos automação que funciona em produção, com monitoramento e responsabilidade pelo resultado.",
      items: [
        {
          title: "LLMs de última geração",
          description: "Acesso aos modelos mais avançados do mercado.",
        },
        {
          title: "Segurança enterprise",
          description:
            "Dados processados em infraestrutura segura, conformidade com LGPD e auditoria completa de todas as operações.",
        },
        {
          title: "Conformidade LGPD",
          description: "Nossa preocupação com a segurança dos seus dados é genuína.",
        },
        {
          title: "Evolução contínua",
          description:
            "Nossa equipe está sempre atualizada com as novidades do mercado. Sua automação em evolução e aprimoramento constantes.",
        },
      ],
    },
    faq: {
      badge: "FAQ",
      title: "Perguntas\nfrequentes",
      intro:
        "Não encontrou sua resposta? Fale diretamente com a gente pelo formulário abaixo ou pelo WhatsApp.",
      items: [
        {
          question: "Quanto tempo leva para ter uma automação em produção?",
          answer:
            "Depende da complexidade. Para automações simples (atendimento, triagem), de 2 a 5 semanas. Para pipelines mais complexos com múltiplas integrações, de 8 a 12 semanas. Nossa metodologia garante que você veja valor antes da entrega final.",
        },
        {
          question: "Quanto custa um projeto de automação com IA?",
          answer:
            "Cada projeto é precificado individualmente após o diagnóstico. Temos a responsabilidade de não entregar nada aquém do que o seu processo exige, mas com consciência com relação ao seu orçamento.",
        },
        {
          question: "Preciso trocar meus sistemas atuais para automatizar?",
          answer:
            "Temos soluções também para projetos que exigem integrações com plataformas que não possuem API pública.",
        },
        {
          question: "O que acontece se a automação falhar ou tomar uma decisão errada?",
          answer:
            "Todas as automações possuem sistemas de fallback, alertas e, quando necessário, revisão humana. Monitoramos proativamente e de forma integral para garantir o sucesso da operação.",
        },
      ],
    },
    contato: {
      badge: "Contato",
      title: "Vamos conversar\nsobre o seu processo?",
      intro:
        "Conte o que você precisa automatizar. Respondemos em até 24h com uma proposta de diagnóstico inicial — sem compromisso.",
      whatsappLabel: "Falar pelo WhatsApp",
      whatsappNote: "Ou preencha o formulário ao lado e entraremos em contato.",
    },
  },
  assistente: {
    hero: {
      tag: "Produto · Assistente de Vendas",
      headline: [
        { text: "Todo lead", accent: false },
        { text: "qualificado.", accent: false },
        { text: "Todo vendedor", accent: true },
        { text: "no contexto.", accent: false },
      ],
      subtitle:
        "O Assistente de Vendas faz o primeiro contato com cada lead, entende a fundo a demanda e entrega um resumo completo para o seu time — com dados de contato e a necessidade real do cliente. Seu processo comercial, organizado de ponta a ponta.",
      ctaPrimary: "Ver planos",
      ctaSecondary: "Falar no WhatsApp",
    },
    comoFunciona: {
      badge: "Como funciona",
      title: 'Do primeiro "olá" ao lead pronto para fechar',
      steps: [
        {
          number: "01",
          title: "Primeiro contato",
          description:
            "O lead chega e é recebido imediatamente pelo agente — disponível 24/7, sem espera e sem depender da agenda do time de vendas.",
        },
        {
          number: "02",
          title: "Entende a demanda",
          description:
            "Em uma conversa natural, o agente faz as perguntas certas, compreende a real necessidade do lead e coleta os dados de contato.",
        },
        {
          number: "03",
          title: "Gera o resumo",
          description:
            "Tudo é consolidado em um resumo estruturado: quem é o lead, como falar com ele e exatamente o que ele precisa.",
        },
        {
          number: "04",
          title: "Repassa ao vendedor",
          description:
            "O vendedor recebe o lead já qualificado e contextualizado — pronto para focar no que importa: fechar a venda.",
        },
      ],
    },
    beneficios: {
      badge: "Benefícios",
      title: "Por que adotar o Assistente",
      intro:
        "Mais do que atender, o agente organiza a porta de entrada do seu comercial e entrega leads prontos para o time avançar.",
      items: [
        {
          title: "Resposta imediata, 24/7",
          description:
            "Nenhum lead espera. O agente atende no instante do primeiro contato, a qualquer hora, e nenhuma oportunidade esfria por falta de resposta.",
        },
        {
          title: "Vendedor sempre no contexto",
          description:
            "O time recebe um resumo completo da demanda e dos dados do lead — sem retrabalho, sem perguntar de novo o que o cliente já respondeu.",
        },
        {
          title: "Processo comercial organizado",
          description:
            "A qualificação vira uma etapa padronizada e previsível. Seu funil fica limpo e seus vendedores focam em quem está pronto para comprar.",
        },
      ],
      stats: [
        {
          value: "78%",
          caption:
            "dos consumidores compram da primeira empresa que responde ao contato.",
        },
        {
          value: "391%",
          caption:
            "de aumento na conversão ao responder o lead no primeiro minuto.",
        },
      ],
      statsNote: "Dados de estudos de mercado sobre tempo de resposta a leads.",
    },
    processo: {
      badge: "Processo de compra",
      title: "Do pagamento à implementação em 3 passos",
      steps: [
        {
          number: "01",
          title: "Escolha e adquira o plano",
          description:
            "Selecione o plano que faz mais sentido para o seu negócio e finalize a compra pelo ASAAS.",
        },
        {
          number: "02",
          title: "Entre em contato pelo WhatsApp",
          description:
            "Após o pagamento, acesse o WhatsApp da Vetor informando qual plano você adquiriu. Nossa equipe estará pronta para iniciar a implementação.",
        },
        {
          number: "03",
          title: "Treinamos o agente para você",
          description:
            "Coletamos as informações do seu negócio — produtos, serviços, tom de voz, diferenciais — e treinamos o agente de acordo com a realidade da sua empresa.",
        },
      ],
      boxTitle: "Já adquiriu o seu plano?",
      boxSubtitle: "Clique no botão correspondente ao seu plano para iniciar a implementação.",
      planButtons: [
        {
          label: "Adquiri o plano Mensal",
          msg: "Olá! Adquiri o plano Mensal do Assistente de Vendas! Qual é o próximo passo para a implementação?",
        },
        {
          label: "Adquiri o plano Trimestral",
          msg: "Olá! Adquiri o plano Trimestral do Assistente de Vendas! Qual é o próximo passo para a implementação?",
        },
        {
          label: "Adquiri o plano Anual",
          msg: "Olá! Adquiri o plano Anual do Assistente de Vendas! Qual é o próximo passo para a implementação?",
        },
      ],
    },
    planos: {
      badge: "Planos",
      title: "Escolha o plano ideal",
      intro:
        "Todos os planos incluem acesso completo ao Assistente de Vendas. A diferença está apenas no período de contratação.",
      noteStrong: "Configuração em até 3 dias úteis.",
      noteRest:
        "Após a contratação, nossa equipe refina o assistente com os dados do seu negócio e conecta a API oficial do WhatsApp. Você acompanha o andamento pela sua conta.",
      ctaQuestion: "Tem dúvidas antes de assinar?",
    },
    faq: {
      badge: "FAQ",
      title: "Perguntas\nfrequentes",
      items: [
        {
          question: "Como o Assistente recebe os leads?",
          answer:
            "Por padrão, o Assistente recebe os leads pelo WhatsApp. Essa funcionalidade pode ser alterada caso o seu principal canal de atendimento seja outro.",
        },
        {
          question: "Como o resumo do lead chega para o vendedor?",
          answer:
            "Diretamente no WhatsApp do vendedor. Ele recebe todos os dados necessários para entrar em contato com o lead, além da demanda completa dele.",
        },
        {
          question: "Posso trocar de plano depois?",
          answer: "Sim, a qualquer momento você pode trocar de plano.",
        },
      ],
    },
  },
  footer: {
    description:
      "Automação de processos com agentes de IA. Diagnóstico, projeto, implantação e operação.",
    tagline: "Seu processo tem magnitude. Nós damos direção.",
    email: "contato@vetorautomacao.io",
  },
};

/** Rótulos amigáveis das seções para o painel /admin. */
export const SECTION_LABELS: Record<string, { group: string; label: string }> = {
  "home.hero": { group: "Home", label: "Topo (Hero)" },
  "home.servicos": { group: "Home", label: "Serviços" },
  "home.comoFunciona": { group: "Home", label: "Como funciona" },
  "home.diferenciais": { group: "Home", label: "Diferenciais" },
  "home.faq": { group: "Home", label: "FAQ" },
  "home.contato": { group: "Home", label: "Contato" },
  "assistente.hero": { group: "Assistente de Vendas", label: "Topo (Hero)" },
  "assistente.comoFunciona": { group: "Assistente de Vendas", label: "Como funciona" },
  "assistente.beneficios": { group: "Assistente de Vendas", label: "Benefícios" },
  "assistente.processo": { group: "Assistente de Vendas", label: "Processo de compra" },
  "assistente.planos": { group: "Assistente de Vendas", label: "Planos (textos)" },
  "assistente.faq": { group: "Assistente de Vendas", label: "FAQ" },
  footer: { group: "Geral", label: "Rodapé" },
};
