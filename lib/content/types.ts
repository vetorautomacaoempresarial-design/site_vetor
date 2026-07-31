// Tipos do conteúdo editável do site (textos de marketing).
// Guardamos apenas TEXTO aqui — ícones, cores e links funcionais ficam no código.
// As chaves de cada seção viram os campos editáveis no painel /admin.

/** Uma linha do título principal (hero). `accent` = destaque azul. */
export interface HeroLine {
  text: string;
  accent: boolean;
}

/** Card só com título — a frase é o próprio benefício (diferenciais, benefícios). */
export interface TitleCard {
  title: string;
}

/**
 * Bloco de um produto na faixa azul da Home (nome, chamada, tópicos e botão).
 * O link e a ilustração ficam no código.
 */
export interface SolutionCard {
  /** Nome do produto (etiqueta pequena acima da chamada). */
  title: string;
  /** Chamada grande do bloco. */
  headline: string;
  /** Tópicos com "check" abaixo da chamada. */
  bullets: string[];
  ctaLabel: string;
}

/** Etapa numerada (como funciona, processo de compra). */
export interface Step {
  number: string;
  title: string;
  description: string;
}

/** Item de FAQ. */
export interface FaqItem {
  question: string;
  answer: string;
}

/** Estatística de destaque (número grande + legenda). */
export interface StatItem {
  value: string;
  caption: string;
}

/** Botão de plano no processo de compra (texto + mensagem do WhatsApp). */
export interface PlanButton {
  label: string;
  msg: string;
}

export interface HomeHero {
  /** Frase fixa do título — fica parada na tela. */
  headline: string;
  /** Frases que se revezam abaixo do título, com efeito de digitação. */
  typedLines: string[];
  subtitle: string;
  ctaLabel: string;
}

export interface AssistenteHero {
  tag: string;
  headline: HeroLine[];
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

/** Item da seção "o custo de perder o número" (Vetor Chat) — só título. */
export interface RiskItem {
  title: string;
}

/** Cabeçalho/menu do topo. Só TEXTO — os links (hrefs) ficam no código. */
export interface HeaderContent {
  brand: string;
  navPersonalizadas: string;
  navProdutos: string;
  areaCliente: string;
  cta: string;
}

export interface SiteContent {
  header: HeaderContent;
  home: {
    hero: HomeHero;
    solucoes: { items: SolutionCard[] };
    diferenciais: { badge: string; title: string; intro: string; items: TitleCard[] };
    faq: { badge: string; title: string; intro: string; items: FaqItem[] };
    contato: {
      badge: string;
      title: string;
      intro: string;
      whatsappLabel: string;
      whatsappNote: string;
    };
  };
  assistente: {
    hero: AssistenteHero;
    comoFunciona: { badge: string; title: string; steps: Step[] };
    beneficios: {
      badge: string;
      title: string;
      intro: string;
      items: TitleCard[];
      stats: StatItem[];
    };
    processo: {
      badge: string;
      title: string;
      steps: Step[];
      boxTitle: string;
      boxSubtitle: string;
      planButtons: PlanButton[];
    };
    planos: {
      badge: string;
      title: string;
      intro: string;
      noteStrong: string;
      noteRest: string;
      ctaQuestion: string;
    };
    faq: { badge: string; title: string; items: FaqItem[] };
  };
  blindado: {
    hero: AssistenteHero;
    problema: {
      badge: string;
      title: string;
      intro: string;
      items: RiskItem[];
    };
    comoFunciona: { badge: string; title: string; intro: string; steps: Step[] };
    beneficios: { badge: string; title: string; intro: string; items: TitleCard[] };
    planos: {
      badge: string;
      title: string;
      intro: string;
      noteStrong: string;
      noteRest: string;
      ctaQuestion: string;
    };
    faq: { badge: string; title: string; items: FaqItem[] };
  };
  personalizadas: {
    hero: AssistenteHero;
    comoFunciona: { badge: string; title: string; steps: Step[] };
  };
  footer: { description: string; tagline: string; email: string };
}

/** Chave de uma seção editável (ex.: "home.hero"). */
export type SectionKey =
  | "header"
  | "home.hero"
  | "home.solucoes"
  | "home.diferenciais"
  | "home.faq"
  | "home.contato"
  | "assistente.hero"
  | "assistente.comoFunciona"
  | "assistente.beneficios"
  | "assistente.processo"
  | "assistente.planos"
  | "assistente.faq"
  | "blindado.hero"
  | "blindado.problema"
  | "blindado.comoFunciona"
  | "blindado.beneficios"
  | "blindado.planos"
  | "blindado.faq"
  | "personalizadas.hero"
  | "personalizadas.comoFunciona"
  | "footer";
