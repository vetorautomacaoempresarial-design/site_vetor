// Tipos do conteúdo editável do site (textos de marketing).
// Guardamos apenas TEXTO aqui — ícones, cores e links funcionais ficam no código.
// As chaves de cada seção viram os campos editáveis no painel /admin.

/** Uma linha do título principal (hero). `accent` = destaque azul. */
export interface HeroLine {
  text: string;
  accent: boolean;
}

/** Card simples com título e descrição (serviços, benefícios, diferenciais). */
export interface InfoCard {
  title: string;
  description: string;
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
  tag: string;
  headline: HeroLine[];
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

export interface SiteContent {
  home: {
    hero: HomeHero;
    servicos: { badge: string; title: string; intro: string; items: InfoCard[] };
    comoFunciona: { badge: string; title: string; steps: Step[] };
    diferenciais: { badge: string; title: string; intro: string; items: InfoCard[] };
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
      items: InfoCard[];
      stats: StatItem[];
      statsNote: string;
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
  footer: { description: string; tagline: string; email: string };
}

/** Chave de uma seção editável (ex.: "home.hero"). */
export type SectionKey =
  | "home.hero"
  | "home.servicos"
  | "home.comoFunciona"
  | "home.diferenciais"
  | "home.faq"
  | "home.contato"
  | "assistente.hero"
  | "assistente.comoFunciona"
  | "assistente.beneficios"
  | "assistente.processo"
  | "assistente.planos"
  | "assistente.faq"
  | "footer";
