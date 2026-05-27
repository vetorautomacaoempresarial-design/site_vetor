export interface Case {
  slug: string;
  title: string;
  client: string;
  industry: string;
  metric: string;
  metricLabel: string;
  summary: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  technologies: string[];
}

export const cases: Case[] = [
  {
    slug: "automacao-atendimento-financeiro",
    title: "Automação de Atendimento no Setor Financeiro",
    client: "Fintech Corp",
    industry: "Serviços Financeiros",
    metric: "87%",
    metricLabel: "redução no tempo de resposta",
    summary:
      "Implementamos agentes de IA conversacional que automatizaram 87% das interações de atendimento, reduzindo custos e aumentando a satisfação de clientes.",
    challenge:
      "A empresa processava mais de 15.000 chamados por mês com 40 atendentes. Os tempos de espera chegavam a 48 horas, causando insatisfação e churn.",
    solution:
      "Desenvolvemos uma camada de agentes de IA integrada ao CRM existente, capaz de resolver autonomamente consultas de saldo, extratos, renegociação e cadastro. Casos complexos são escalados para humanos com contexto completo.",
    results: [
      { label: "Redução no tempo de resposta", value: "87%" },
      { label: "Chamados resolvidos sem humano", value: "73%" },
      { label: "Melhora no NPS", value: "+42 pts" },
      { label: "Economia anual", value: "R$ 380k" },
    ],
    technologies: ["LLM Proprietário", "RAG", "API REST", "CRM Integration", "Webhook"],
  },
  {
    slug: "pipeline-vendas-automatizado",
    title: "Pipeline de Vendas com Agentes Autônomos",
    client: "SaaS Scale",
    industry: "Tecnologia B2B",
    metric: "3.2×",
    metricLabel: "aumento na taxa de conversão",
    summary:
      "Agentes autônomos que qualificam leads, personalizam propostas e fazem follow-up inteligente — triplicando a conversão do pipeline comercial.",
    challenge:
      "O time comercial perdia 60% do tempo em tarefas repetitivas: qualificação de leads frios, envio de materiais genéricos e follow-ups manuais.",
    solution:
      "Implantamos agentes que analisam o perfil de cada lead, personalizam a comunicação por segmento e comportamento, executam follow-ups no timing ideal e atualizam o CRM automaticamente.",
    results: [
      { label: "Aumento na taxa de conversão", value: "3.2×" },
      { label: "Tempo economizado por vendedor/mês", value: "62h" },
      { label: "Leads qualificados automaticamente", value: "94%" },
      { label: "ROI em 6 meses", value: "780%" },
    ],
    technologies: ["Multi-Agent System", "LangChain", "CRM API", "Email Automation", "Analytics"],
  },
  {
    slug: "processamento-documentos-logistica",
    title: "Processamento Inteligente de Documentos",
    client: "LogiFlow",
    industry: "Logística & Supply Chain",
    metric: "99.4%",
    metricLabel: "precisão no processamento",
    summary:
      "Sistema de extração e validação de dados de documentos logísticos (NF-e, CTe, manifestos) com 99.4% de precisão, eliminando digitação manual.",
    challenge:
      "A operação processava 8.000 documentos por dia manualmente. Erros causavam atrasos, multas fiscais e retrabalho — com 12 pessoas dedicadas exclusivamente a isso.",
    solution:
      "Pipeline de IDP (Intelligent Document Processing) com modelos de visão computacional e LLMs especializados para extração, validação e integração automática com o ERP.",
    results: [
      { label: "Precisão no processamento", value: "99.4%" },
      { label: "Documentos processados/dia", value: "8.000+" },
      { label: "Redução de erros manuais", value: "98%" },
      { label: "Economia anual", value: "R$ 1.2M" },
    ],
    technologies: ["Computer Vision", "OCR + LLM", "ERP Integration", "Python", "Document AI"],
  },
];

export function getCaseBySlug(slug: string): Case | undefined {
  return cases.find((c) => c.slug === slug);
}
