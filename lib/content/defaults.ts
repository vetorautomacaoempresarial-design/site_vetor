// Conteúdo PADRÃO do site (fonte da verdade dos textos atuais).
// O painel /admin sobrepõe isto via Supabase; sem sobreposição, o site usa estes
// valores — então, com a tabela vazia, o site fica idêntico ao que está hoje.
import type { SiteContent } from "@/lib/content/types";

export const DEFAULT_CONTENT: SiteContent = {
  header: {
    brand: "Vetor Automação",
    navPersonalizadas: "Automações personalizadas",
    navProdutos: "Produtos",
    areaCliente: "Área do cliente",
    cta: "Fale Conosco",
  },
  home: {
    hero: {
      headline: "Automatize processos com IA:",
      typedLines: [
        "seu WhatsApp fora do radar de restrições da Meta",
        "agentes que turbinam as suas vendas",
        "automações personalizadas com a cara do seu negócio",
      ],
      subtitle:
        "Automatizamos processos com agentes de IA e colocamos o WhatsApp da sua empresa na infraestrutura oficial da Meta.",
      ctaLabel: "Como funciona",
    },
    solucoes: {
      items: [
        {
          title: "Vetor Chat",
          headline: "O canal das suas vendas\nlonge do risco de bloqueio",
          bullets: [
            "Seu número atual na conta oficial da Meta, sem trocar de chip.",
            "Vários atendentes no mesmo número, com o histórico centralizado.",
            "Sua empresa identificada na conversa, mesmo para quem não salvou o número.",
          ],
          ctaLabel: "Conhecer",
        },
        {
          title: "Vetor Sales",
          headline: "Seus leads atendidos\n24 horas por dia",
          bullets: [
            "Resposta na hora a qualquer momento, inclusive fim de semana.",
            "O agente entende a demanda e coleta os dados do cliente.",
            "Seu vendedor recebe o resumo pronto e foca em fechar a venda.",
          ],
          ctaLabel: "Conhecer",
        },
        {
          title: "Automações personalizadas",
          headline: "A automação exata\nque o seu processo pede",
          bullets: [
            "Diagnóstico do seu processo antes de qualquer linha de código.",
            "Integração com os sistemas que a sua empresa já usa.",
            "Acompanhamento e ajustes contínuos depois da entrega.",
          ],
          ctaLabel: "Conhecer",
        },
      ],
    },
    diferenciais: {
      badge: "Por que a Vetor",
      title: "Tecnologia séria,\nresultado mensurável.",
      intro:
        "Não vendemos promessa de IA. Entregamos automação que funciona em produção, com monitoramento e responsabilidade pelo resultado.",
      items: [
        { title: "Modelos de IA de última geração" },
        { title: "Segurança e conformidade com a LGPD" },
        { title: "Infraestrutura oficial da Meta" },
        { title: "Evolução contínua" },
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
            "Não. Conectamos o seu número atual à API oficial da Meta, preservando o histórico das conversas. Esse é justamente o nosso Vetor Chat, que também pode ser contratado sozinho, sem automação nenhuma.",
        },
        {
          question: "Meu WhatsApp já foi bloqueado antes. Como vocês evitam que aconteça de novo?",
          answer:
            "A causa mais comum de restrição é o envio ativo de mensagens fora das regras da Meta. Ao migrar seu número para a conta oficial e operá-lo por uma plataforma profissional, esse comportamento deixa de ser possível na sua operação.",
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
      tag: "Produto · Vetor Sales",
      headline: [
        { text: "Seus leads", accent: false },
        { text: "atendidos", accent: false },
        { text: "24 horas", accent: true },
        { text: "7 dias por semana", accent: true },
      ],
      subtitle:
        "O Vetor Sales faz o primeiro contato com cada cliente, entende a demanda e gera um resumo completo para a sua equipe com os dados de contato e a necessidade real do cliente. Seu vendedor só precisa concretizar a venda.",
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
      title: "Por que adotar o Vetor Sales",
      intro:
        "Mais do que atender, o agente organiza a porta de entrada do seu comercial e entrega clientes prontos para a equipe avançar.",
      items: [
        { title: "Atendimento imediato que transforma mais leads em clientes" },
        { title: "Sua equipe recebe o lead com o resumo da conversa pronto" },
        { title: "Seus vendedores só entram na hora de fechar" },
        { title: "Nenhum lead esquecido, nem de madrugada ou no fim de semana" },
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
          msg: "Olá! Adquiri o plano Mensal do Vetor Sales! Qual é o próximo passo para a implementação?",
        },
        {
          label: "Trimestral",
          msg: "Olá! Adquiri o plano Trimestral do Vetor Sales! Qual é o próximo passo para a implementação?",
        },
        {
          label: "Anual",
          msg: "Olá! Adquiri o plano Anual do Vetor Sales! Qual é o próximo passo para a implementação?",
        },
      ],
    },
    planos: {
      badge: "Planos",
      title: "Escolha o plano ideal",
      intro:
        "Todos os planos incluem acesso completo ao Vetor Sales. A diferença está apenas no período de contratação.",
      noteStrong: "Configuração em até 3 dias úteis.",
      noteRest:
        "Após a contratação, nossa equipe refina o Vetor Sales com os dados do seu negócio e conecta a conta oficial do WhatsApp. Você acompanha o andamento pela sua conta.",
      ctaQuestion: "Tem dúvidas antes de assinar?",
    },
    faq: {
      badge: "Dúvidas",
      title: "Perguntas\nfrequentes",
      items: [
        {
          question: "Como o Vetor Sales recebe os clientes?",
          answer:
            "O Vetor Sales recebe os clientes pelo WhatsApp, criando um ambiente humanizado. A partir desse atendimento, ele coleta as informações necessárias para o resumo e as envia para o(s) vendedor(es).",
        },
        {
          question: "Como o resumo do cliente chega para o vendedor?",
          answer:
            "Diretamente no WhatsApp do vendedor. Ele recebe todos os dados necessários para entrar em contato com o cliente, incluindo a demanda completa, urgência, nome e telefone de contato.",
        },
        {
          question: "Posso trocar de plano depois?",
          answer: "Sim, a qualquer momento você pode trocar de plano pela sua área do cliente.",
        },
      ],
    },
  },
  blindado: {
    hero: {
      tag: "Produto · Vetor Chat",
      headline: [
        { text: "Seu número", accent: false },
        { text: "fora do radar", accent: true },
        { text: "das restrições", accent: false },
        { text: "da Meta.", accent: false },
      ],
      subtitle:
        "Conectamos o WhatsApp da sua empresa à infraestrutura oficial da Meta e passamos a operá-lo por uma plataforma profissional de atendimento. Seu número passa a trabalhar dentro das regras da Meta por construção, não por sorte.",
      ctaPrimary: "Ver planos",
      ctaSecondary: "Falar no WhatsApp",
    },
    problema: {
      badge: "O problema",
      title: "Perder o número não é\num perrengue. É um prejuízo.",
      intro:
        "A maioria das empresas só descobre o quanto depende do WhatsApp no dia em que ele para. E, quando para, não para só o aparelho: para a operação inteira.",
      items: [
        { title: "O canal de vendas fecha e sua empresa não consegue se comunicar" },
        { title: "O histórico de anos de operação é perdido" },
        { title: "Sua empresa precisa reconquistar contato por contato" },
        { title: "A recuperação é lenta e incerta" },
      ],
    },
    comoFunciona: {
      badge: "Como funciona",
      title: "Quatro passos, sem trocar de número",
      intro:
        "A migração acontece com o seu número atual e sem perder o histórico das conversas. Nossa equipe conduz todo o processo.",
      steps: [
        {
          number: "01",
          title: "Você conecta o seu número",
          description:
            "Pela sua área do cliente, em poucos cliques, você autoriza a conexão do seu número à nossa infraestrutura oficial da Meta. Sem trocar de chip e sem perder as conversas.",
        },
        {
          number: "02",
          title: "Seu número vira uma conta oficial",
          description:
            "O número passa a existir dentro da API oficial do WhatsApp, com a empresa identificada para o cliente, no mesmo padrão técnico usado por grandes marcas.",
        },
        {
          number: "03",
          title: "O atendimento migra para a plataforma",
          description:
            "Sua equipe passa a atender por um painel profissional, no computador ou no celular, com vários atendentes no mesmo número e histórico centralizado.",
        },
        {
          number: "04",
          title: "A operação passa a seguir as regras",
          description:
            "A plataforma trabalha dentro dos limites que a Meta define para envio de mensagens. Na prática, o comportamento que causa a maioria das restrições deixa de ser possível, e é isso que protege o seu número.",
        },
      ],
    },
    beneficios: {
      badge: "O que você ganha",
      title: "Mais que proteção:\numa operação de verdade",
      intro:
        "A conta oficial resolve o risco. A plataforma de atendimento resolve o resto.",
      items: [
        { title: "O motivo mais comum de bloqueio deixa de existir" },
        { title: "Vários atendentes no mesmo número, cada um com seu acesso" },
        { title: "O histórico fica com a empresa, não no celular do vendedor" },
        { title: "Sua empresa identificada, mesmo para quem não salvou o número" },
        { title: "Base pronta para o Vetor Sales, quando você quiser" },
        { title: "Implantação e treinamento conduzidos pela nossa equipe" },
      ],
    },
    planos: {
      badge: "Planos",
      title: "Escolha o plano ideal",
      intro:
        "Todos os planos incluem a conexão do seu número, a plataforma de atendimento e o suporte da nossa equipe. A diferença está apenas no período de contratação.",
      noteStrong: "Conexão em até 3 dias úteis.",
      noteRest:
        "Após a contratação, nossa equipe conduz a verificação junto à Meta e a migração do atendimento. Você acompanha o andamento pela sua conta.",
      ctaQuestion: "Tem dúvidas antes de assinar?",
    },
    faq: {
      badge: "Dúvidas",
      title: "Perguntas\nfrequentes",
      items: [
        {
          question: "Preciso trocar o meu número de WhatsApp?",
          answer:
            "Não. A migração é feita com o seu número atual, o mesmo que seus clientes já conhecem e já têm salvo na agenda.",
        },
        {
          question: "Vou perder minhas conversas antigas?",
          answer:
            "Não. A conexão é feita em modo de coexistência, que preserva o histórico das conversas e mantém o WhatsApp Business funcionando no celular durante a transição.",
        },
        {
          question: "Posso disparar mensagens para uma lista de contatos?",
          answer:
            "Não da forma como se faz hoje, e essa é justamente a mudança que protege o seu número. Para clientes que falaram com você nas últimas 24 horas, a conversa é livre. Fora dessa janela, o envio acontece por modelos de mensagem previamente aprovados pela Meta, que nossa equipe ajuda a cadastrar. O disparo em massa para quem nunca te procurou é exatamente o comportamento que derruba números, e ele deixa de fazer parte da sua operação.",
        },
        {
          question: "Isso é uma garantia de que meu número nunca será bloqueado?",
          answer:
            "Seria desonesto prometer isso, porque a decisão final é sempre da Meta. O que fazemos é eliminar a causa mais comum de restrição, que é o envio ativo fora das regras, e colocar sua operação no mesmo padrão técnico usado por grandes empresas. A Meta ainda pode agir em casos de denúncias de usuários ou violação das políticas de conteúdo, e por isso orientamos sua equipe sobre boas práticas na implantação.",
        },
        {
          question: "Minha equipe precisa saber mexer com tecnologia?",
          answer:
            "Não. A plataforma de atendimento é parecida com qualquer aplicativo de mensagens: abre a conversa, lê e responde. Nossa equipe treina o seu time durante a implantação.",
        },
        {
          question: "Preciso contratar o Vetor Sales junto?",
          answer:
            "Não. O Vetor Chat funciona sozinho. Se mais para a frente você quiser o agente de IA atendendo seus leads, basta trocar para o Vetor Sales pela sua área do cliente, porque a infraestrutura já estará pronta.",
        },
      ],
    },
  },
  personalizadas: {
    hero: {
      tag: "Serviço · Automações personalizadas",
      headline: [
        { text: "Automação", accent: false },
        { text: "sob medida", accent: true },
        { text: "para o seu processo.", accent: false },
      ],
      subtitle:
        "Sua operação no piloto automático. Mapeamos o que existe hoje, desenhamos a automação que o seu negócio precisa e acompanhamos o funcionamento no dia a dia.",
      ctaPrimary: "Falar com a nossa equipe",
      ctaSecondary: "Falar no WhatsApp",
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
  "home.solucoes": { group: "Home", label: "Nossas soluções" },
  "home.diferenciais": { group: "Home", label: "Diferenciais" },
  "home.faq": { group: "Home", label: "Dúvidas frequentes" },
  "home.contato": { group: "Home", label: "Contato" },
  "assistente.hero": { group: "Vetor Sales", label: "Topo (Hero)" },
  "assistente.comoFunciona": { group: "Vetor Sales", label: "Como funciona" },
  "assistente.beneficios": { group: "Vetor Sales", label: "Benefícios" },
  "assistente.processo": { group: "Vetor Sales", label: "Processo de compra" },
  "assistente.planos": { group: "Vetor Sales", label: "Planos (textos)" },
  "assistente.faq": { group: "Vetor Sales", label: "Dúvidas frequentes" },
  "blindado.hero": { group: "Vetor Chat", label: "Topo (Hero)" },
  "blindado.problema": { group: "Vetor Chat", label: "O problema" },
  "blindado.comoFunciona": { group: "Vetor Chat", label: "Como funciona" },
  "blindado.beneficios": { group: "Vetor Chat", label: "O que você ganha" },
  "blindado.planos": { group: "Vetor Chat", label: "Planos (textos)" },
  "blindado.faq": { group: "Vetor Chat", label: "Dúvidas frequentes" },
  "personalizadas.hero": { group: "Automações personalizadas", label: "Topo (Hero)" },
  "personalizadas.comoFunciona": {
    group: "Automações personalizadas",
    label: "Como funciona (metodologia)",
  },
  footer: { group: "Geral", label: "Rodapé" },
};
