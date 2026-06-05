// Conteúdo PADRÃO do site (fonte da verdade dos textos atuais).
// O painel /admin sobrepõe isto via Supabase; sem sobreposição, o site usa estes
// valores — então, com a tabela vazia, o site fica idêntico ao que está hoje.
import type { SiteContent } from "@/lib/content/types";

export const DEFAULT_CONTENT: SiteContent = {
  header: {
    brand: "Vetor Automação",
    navServicos: "O que entregamos",
    navComoFunciona: "Como Funciona",
    navProdutos: "Produtos",
    navDuvidas: "Dúvidas",
    areaCliente: "Área do cliente",
    cta: "Fale Conosco",
  },
  home: {
    hero: {
      tag: "Inteligência Artificial · Automação de Processos",
      headline: [
        { text: "Seu processo", accent: false },
        { text: "tem magnitude.", accent: false },
        { text: "Nós damos", accent: true },
        { text: "direção.", accent: false },
      ],
      subtitle:
        "Automatizamos processos com agentes de IA de forma personalizada para o seu negócio, do diagnóstico à operação contínua. Mais velocidade, menos erro, escala real.",
      ctaLabel: "Como funciona",
    },
    servicos: {
      badge: "Serviços",
      title: "O que entregamos",
      intro:
        "Soluções completas, da estratégia à operação. Cada projeto é construído com tecnologia de ponta e responsabilidade de negócio.",
      items: [
        {
          title: "Agentes de IA Conversacional",
          description:
            "Agentes autônomos que entendem o contexto, executam tarefas e se integram ao seu fluxo de trabalho: atendimento, vendas, suporte interno e muito mais.",
        },
        {
          title: "Integrações e Orquestração",
          description:
            "Conectamos suas ferramentas, sistemas e bancos de dados em fluxos inteligentes que movem dados e disparam ações automaticamente entre os sistemas.",
        },
        {
          title: "Diagnóstico e Consultoria",
          description:
            "Mapeamos seus processos, identificamos os maiores gargalos e entregamos um plano de automação com retorno estimado antes de qualquer implementação.",
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
            "Mapeamos seus processos atuais, identificamos gargalos, estimamos o retorno e definimos o escopo ideal de automação.",
        },
        {
          number: "02",
          title: "Projeto",
          description:
            "Arquitetamos a solução, escolhemos as tecnologias certas e desenvolvemos em etapas com validação contínua.",
        },
        {
          number: "03",
          title: "Implementação",
          description:
            "Implantação controlada, testes em produção, treinamento da equipe e monitoramento intensivo na primeira fase de operação.",
        },
        {
          number: "04",
          title: "Operação",
          description:
            "Monitoramento contínuo, ajustes finos, relatórios de desempenho e evoluções graduais conforme o negócio cresce.",
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
          title: "Modelos de IA de última geração",
          description: "Acesso aos modelos mais avançados do mercado.",
        },
        {
          title: "Segurança de nível corporativo",
          description:
            "Dados processados em infraestrutura segura, conformidade com a LGPD e auditoria completa de todas as operações.",
        },
        {
          title: "Conformidade com a LGPD",
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
      badge: "Dúvidas",
      title: "Perguntas\nfrequentes",
      intro:
        "Não encontrou sua resposta? Fale diretamente com a gente pelo formulário abaixo ou pelo WhatsApp.",
      items: [
        {
          question: "Quanto tempo leva para ter uma automação em produção?",
          answer:
            "Depende da complexidade. Para automações simples (atendimento, triagem), de 2 a 5 semanas. Para fluxos mais complexos, com muitas integrações, de 8 a 12 semanas. Nossa metodologia garante que você veja valor antes da entrega final.",
        },
        {
          question: "Quanto custa um projeto de automação com IA?",
          answer:
            "Cada projeto é precificado individualmente após o diagnóstico. Temos a responsabilidade de não entregar nada aquém do que o seu processo exige, mas com consciência em relação ao seu orçamento.",
        },
        {
          question: "Preciso trocar meus sistemas atuais para automatizar?",
          answer:
            "Temos soluções também para projetos que exigem integrações com plataformas que não oferecem conexão automática com outros sistemas.",
        },
        {
          question: "O que acontece se a automação falhar ou tomar uma decisão errada?",
          answer:
            "Todas as automações possuem sistemas de contingência, alertas e, quando necessário, revisão humana. Monitoramos de forma proativa e integral para garantir o sucesso da operação.",
        },
        {
          question: "Preciso de uma equipe especializada para usar as automações?",
          answer:
            "Definitivamente não. Nossas automações são muito simples de serem utilizadas, e nossa equipe cuida da parte operacional. Você apenas nos fornece as informações necessárias.",
        },
        {
          question: "Preciso trocar o número de WhatsApp para utilizar automações?",
          answer:
            "Não! Com um chip novo em mãos, garantimos a qualidade do processo utilizando a API oficial da Meta. Dessa forma, você fica livre de preocupações relacionadas a banimentos.",
        },
      ],
    },
    contato: {
      badge: "Contato",
      title: "Vamos conversar\nsobre o seu processo?",
      intro:
        "Conte o que você precisa automatizar. Respondemos em até 24h com uma proposta de diagnóstico inicial, sem compromisso.",
      whatsappLabel: "Falar pelo WhatsApp",
      whatsappNote: "Ou preencha o formulário ao lado e entraremos em contato.",
    },
  },
  assistente: {
    hero: {
      tag: "Produto · Assistente de Vendas",
      headline: [
        { text: "Seus leads", accent: false },
        { text: "atendidos", accent: false },
        { text: "24 horas", accent: true },
        { text: "7 dias por semana", accent: true },
      ],
      subtitle:
        "O Assistente de Vendas faz o primeiro contato com cada cliente, entende a demanda e gera um resumo completo para a sua equipe com os dados de contato e a necessidade real do cliente. Seu vendedor só precisa concretizar a venda.",
      ctaPrimary: "Ver planos",
      ctaSecondary: "Falar no WhatsApp",
    },
    comoFunciona: {
      badge: "Como funciona",
      title: 'Do primeiro "olá" ao cliente pronto para fechar',
      steps: [
        {
          number: "01",
          title: "Primeiro contato",
          description:
            "O cliente chega e é recebido imediatamente pelo agente, disponível a qualquer hora, sem espera e sem depender da agenda do time de vendas.",
        },
        {
          number: "02",
          title: "Entende a demanda",
          description:
            "Em uma conversa natural, o agente faz as perguntas certas, compreende a real necessidade do cliente e coleta os dados de contato.",
        },
        {
          number: "03",
          title: "Gera o resumo",
          description:
            "Tudo é consolidado em um resumo organizado: quem é o cliente, como falar com ele e exatamente o que ele precisa.",
        },
        {
          number: "04",
          title: "Repassa ao vendedor",
          description:
            "O vendedor recebe o cliente já qualificado e com todo o contexto, pronto para focar no que importa: fechar a venda.",
        },
      ],
    },
    beneficios: {
      badge: "Benefícios",
      title: "Por que adotar o Assistente",
      intro:
        "Mais do que atender, o agente organiza a porta de entrada do seu comercial e entrega clientes prontos para a equipe avançar.",
      items: [
        {
          title: "Potencialize suas conversões",
          description:
            "Com atendimento imediato e organização comercial, alcance o potencial máximo de vendas do seu negócio. Transforme leads em clientes.",
        },
        {
          title: "Responda antes da concorrência",
          description:
            "A equipe recebe um resumo completo da demanda e dos dados do cliente, sem retrabalho, sem perguntar de novo o que o cliente já respondeu.",
        },
        {
          title: "Vendedores focados no fechamento",
          description:
            "Enquanto o assistente cuida do primeiro atendimento e entende a necessidade do lead, seus vendedores focam apenas em avançar a negociação e fechar.",
        },
        {
          title: "Ferramentas mais seguras do mercado",
          description:
            "Utilizamos a API Oficial da Meta, garantindo a proteção contra banimentos indevidos em sua conta do WhatsApp Business.",
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
            "de aumento na conversão ao responder o cliente no primeiro minuto.",
        },
      ],
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
            "Coletamos as informações do seu negócio, como produtos, serviços, tom de voz e diferenciais, e treinamos o agente de acordo com a realidade da sua empresa.",
        },
      ],
      boxTitle: "Já adquiriu o seu plano?",
      boxSubtitle: "Clique no botão correspondente ao seu plano para iniciar a implementação.",
      planButtons: [
        {
          label: "Mensal",
          msg: "Olá! Adquiri o plano Mensal do Assistente de Vendas! Qual é o próximo passo para a implementação?",
        },
        {
          label: "Trimestral",
          msg: "Olá! Adquiri o plano Trimestral do Assistente de Vendas! Qual é o próximo passo para a implementação?",
        },
        {
          label: "Anual",
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
        "Após a contratação, nossa equipe refina o assistente com os dados do seu negócio e conecta a conta oficial do WhatsApp. Você acompanha o andamento pela sua conta.",
      ctaQuestion: "Tem dúvidas antes de assinar?",
    },
    faq: {
      badge: "Dúvidas",
      title: "Perguntas\nfrequentes",
      items: [
        {
          question: "Como o Assistente recebe os clientes?",
          answer:
            "O Assistente recebe os clientes pelo WhatsApp, criando um ambiente humanizado. A partir desse atendimento, ele coleta as informações necessárias para o resumo e as envia para o(s) vendedor(es).",
        },
        {
          question: "Como o resumo do cliente chega para o vendedor?",
          answer:
            "Diretamente no WhatsApp do vendedor. Ele recebe todos os dados necessários para entrar em contato com o cliente, incluindo a demanda completa, urgência, nome e telefone de contato.",
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
      "Automação de processos com agentes de inteligência artificial. Diagnóstico, projeto, implantação e operação.",
    tagline: "Seu processo tem magnitude. Nós damos direção.",
    email: "contato@vetorautomacao.io",
  },
};

/** Rótulos amigáveis das seções para o painel /admin. */
export const SECTION_LABELS: Record<string, { group: string; label: string }> = {
  header: { group: "Geral", label: "Cabeçalho (menu do topo)" },
  "home.hero": { group: "Home", label: "Topo (Hero)" },
  "home.servicos": { group: "Home", label: "Serviços" },
  "home.comoFunciona": { group: "Home", label: "Como funciona" },
  "home.diferenciais": { group: "Home", label: "Diferenciais" },
  "home.faq": { group: "Home", label: "Dúvidas frequentes" },
  "home.contato": { group: "Home", label: "Contato" },
  "assistente.hero": { group: "Assistente de Vendas", label: "Topo (Hero)" },
  "assistente.comoFunciona": { group: "Assistente de Vendas", label: "Como funciona" },
  "assistente.beneficios": { group: "Assistente de Vendas", label: "Benefícios" },
  "assistente.processo": { group: "Assistente de Vendas", label: "Processo de compra" },
  "assistente.planos": { group: "Assistente de Vendas", label: "Planos (textos)" },
  "assistente.faq": { group: "Assistente de Vendas", label: "Dúvidas frequentes" },
  footer: { group: "Geral", label: "Rodapé" },
};
