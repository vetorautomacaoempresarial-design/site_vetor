// Tema de cor das seções do site — fonte única de verdade.
//
// Fora do topo (hero), que é preto, toda seção é de um destes dois tipos:
//   "azul"   → fundo azul da marca com texto branco
//   "branco" → fundo branco com texto azul
//
// Cada página escolhe o tema de cada seção (ver app/page.tsx e as páginas de
// produto). Mudar um tom aqui muda o site inteiro de uma vez.

export type SectionTheme = "azul" | "branco";

const AZUL = "#4A6CF7";

export interface ThemeTokens {
  /** Cor de fundo da seção (também é a cor da onda que a separa da anterior). */
  bg: string;
  /** Título e textos de destaque. */
  title: string;
  /** Texto corrido. */
  body: string;
  /** Texto secundário (legendas, notas). */
  muted: string;
  /** Cor de borda (bordas de caixas e divisórias). */
  border: string;
  /** Divisória usada como FUNDO de grade (grid gap-px). */
  divide: string;
  /** Fundo de card (a mesma cor da seção — as divisórias é que desenham a grade). */
  card: string;
  /** Realce do card ao passar o mouse. */
  cardHover: string;
  /** Etiqueta pequena acima do título. */
  badge: string;
  /** Botão principal. */
  button: string;
  /** Botão de contorno. */
  buttonOutline: string;
  /** Ícone em repouso e no hover do card (usa `group`). */
  icon: string;
  iconHover: string;
  /** Números grandes de fundo (etapas) e outros elementos apagados. */
  ghost: string;
  /** Caixa de destaque (aviso, resumo). */
  box: string;
  /** Texto de exemplo dentro dos campos de formulário. */
  placeholder: string;
}

export const THEMES: Record<SectionTheme, ThemeTokens> = {
  azul: {
    bg: AZUL,
    title: "text-white",
    body: "text-white/85",
    muted: "text-white/70",
    border: "border-white/25",
    divide: "bg-white/25",
    card: "bg-[#4A6CF7]",
    cardHover: "hover:bg-[#5B7AF8]",
    badge: "text-white border-white/40 bg-white/10",
    button: "bg-white text-[#4A6CF7] hover:bg-[#EEF2FF]",
    buttonOutline: "border border-white text-white hover:bg-white hover:text-[#4A6CF7]",
    icon: "text-white/75",
    iconHover: "group-hover:text-white group-hover:border-white",
    ghost: "text-white/30",
    box: "border border-white/30 bg-white/10",
    placeholder: "placeholder:text-white/55",
  },
  branco: {
    bg: "#FFFFFF",
    title: "text-[#4A6CF7]",
    body: "text-[#4A6CF7]/80",
    muted: "text-[#4A6CF7]/65",
    border: "border-[#4A6CF7]/25",
    divide: "bg-[#4A6CF7]/20",
    card: "bg-white",
    cardHover: "hover:bg-[#F2F5FF]",
    badge: "text-[#4A6CF7] border-[#4A6CF7]/40 bg-[#4A6CF7]/8",
    button: "bg-[#4A6CF7] text-white hover:bg-[#6D8AFF]",
    buttonOutline:
      "border border-[#4A6CF7] text-[#4A6CF7] hover:bg-[#4A6CF7] hover:text-white",
    icon: "text-[#4A6CF7]/60",
    iconHover: "group-hover:text-[#4A6CF7] group-hover:border-[#4A6CF7]",
    ghost: "text-[#4A6CF7]/30",
    box: "border border-[#4A6CF7]/30 bg-[#4A6CF7]/5",
    placeholder: "placeholder:text-[#4A6CF7]/45",
  },
};

/** Classes da etiqueta pequena (badge) no tema escolhido. */
export function badgeClasses(t: ThemeTokens): string {
  return `inline-flex items-center px-3 py-1 text-xs font-display font-semibold tracking-widest uppercase border ${t.badge}`;
}

/**
 * Card solto de uma grade: contorno e fundo próprios. O que agrupa os cards é
 * o espaço entre eles (`gap`) e o alinhamento, não uma moldura em volta de
 * todos. Use com `grid ... gap-6`.
 */
export function cardClasses(t: ThemeTokens): string {
  return `p-8 transition-colors duration-300 ${t.box}`;
}

/**
 * Círculo cheio do ícone de um card — ponto focal de contraste máximo,
 * monocromático. Em seção azul: círculo branco com ícone azul escuro.
 * Em seção branca: o inverso, círculo azul com ícone branco.
 */
export function iconCircleClasses(theme: SectionTheme): string {
  const cor = theme === "azul" ? "bg-white text-[#3A57D6]" : "bg-[#4A6CF7] text-white";
  return `w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${cor}`;
}
