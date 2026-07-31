"use client";
import { StaggerChildren, staggerItem, motion } from "@/components/motion";
import { cn } from "@/lib/cn";
import Wave from "@/components/ui/Wave";
import { THEMES, badgeClasses, cardClasses, type SectionTheme } from "@/lib/section-theme";
import type { SiteContent } from "@/lib/content/types";

/**
 * Formato de apresentação dos passos:
 *   "timeline" → linha do tempo vertical, passos alternando os lados.
 *                Usado hoje pelas três páginas (Vetor Sales, Vetor Chat e
 *                Automações Personalizadas).
 *   "colunas"  → 4 colunas lado a lado. Continua sendo o padrão do componente,
 *                mas nenhuma página o usa no momento.
 */
export type ComoFuncionaLayout = "colunas" | "timeline";

/** Passos numerados das páginas de produto. Compartilhado entre os produtos. */
export default function ProdutoComoFunciona({
  content,
  theme = "branco",
  layout = "colunas",
}: {
  content: SiteContent["assistente"]["comoFunciona"];
  theme?: SectionTheme;
  layout?: ComoFuncionaLayout;
}) {
  const t = THEMES[theme];

  return (
    <section className="relative pt-28 pb-40" style={{ backgroundColor: t.bg }}>
      <Wave fill={t.bg} position="top" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className={cn(badgeClasses(t), "mb-4")}>{content.badge}</span>
          <h2
            className={cn(
              "font-display font-bold text-4xl lg:text-5xl leading-tight tracking-tight max-w-xl whitespace-pre-line",
              t.title
            )}
          >
            {content.title}
          </h2>
        </div>

        {layout === "timeline" ? (
          <Timeline content={content} theme={theme} />
        ) : (
          // Caixas independentes: o que agrupa é a proximidade e o alinhamento,
          // não um contorno comum.
          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.12}>
            {content.steps.map((step, i) => (
              <motion.div
                key={step.number || i}
                variants={staggerItem}
                className={cn(cardClasses(t), "relative")}
              >
                <div
                  className={cn(
                    "font-display font-bold text-5xl mb-6 leading-none tracking-tighter",
                    t.ghost
                  )}
                >
                  {step.number}
                </div>
                <div className={cn("w-6 h-px mb-5", t.divide)} />
                <h3
                  className={cn("font-display font-semibold text-2xl mb-3 tracking-tight", t.title)}
                >
                  {step.title}
                </h3>
                <p className={cn("font-body font-light text-sm leading-relaxed", t.body)}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </StaggerChildren>
        )}
      </div>
    </section>
  );
}

/**
 * Linha do tempo vertical: um traço no centro, um ponto por passo e o texto
 * alternando entre a direita e a esquerda. No celular vira uma coluna só, com
 * o traço encostado na margem esquerda.
 */
function Timeline({
  content,
  theme,
}: {
  content: SiteContent["assistente"]["comoFunciona"];
  theme: SectionTheme;
}) {
  const t = THEMES[theme];

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Traço contínuo que liga os passos. */}
      <div
        className={cn("absolute top-3 bottom-3 w-px left-2 md:left-1/2 md:-translate-x-1/2", t.divide)}
      />

      <StaggerChildren className="relative" staggerDelay={0.14}>
        {content.steps.map((step, i) => {
          // Ímpares vão para a esquerda; pares (0, 2...) para a direita.
          const esquerda = i % 2 === 1;
          return (
            <motion.div
              key={step.number || i}
              variants={staggerItem}
              className="relative pl-10 md:pl-0 pb-14 last:pb-0 md:grid md:grid-cols-2 md:gap-x-16"
            >
              {/* Ponto sobre o traço, com um "halo" da cor do fundo da seção. */}
              <span
                className={cn(
                  "absolute top-2 left-2 md:left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-current",
                  t.title
                )}
                style={{ boxShadow: `0 0 0 6px ${t.bg}` }}
                aria-hidden
              />

              <div
                className={cn(
                  esquerda ? "md:text-right md:pr-4" : "md:col-start-2 md:pl-4",
                  "max-w-md",
                  esquerda && "md:ml-auto"
                )}
              >
                <div
                  className={cn(
                    "font-display font-bold text-sm tracking-widest mb-2 leading-none",
                    t.ghost
                  )}
                >
                  {step.number}
                </div>
                <h3
                  className={cn("font-display font-semibold text-2xl mb-3 tracking-tight", t.title)}
                >
                  {step.title}
                </h3>
                <p className={cn("font-body font-light text-sm leading-relaxed", t.body)}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </StaggerChildren>
    </div>
  );
}
