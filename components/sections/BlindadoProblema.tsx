"use client";
import { PhoneOff, Archive, Users, Hourglass } from "lucide-react";
import { StaggerChildren, staggerItem, motion } from "@/components/motion";
import { cn } from "@/lib/cn";
import Wave from "@/components/ui/Wave";
import {
  THEMES,
  badgeClasses,
  cardClasses,
  iconCircleClasses,
  type SectionTheme,
} from "@/lib/section-theme";
import type { SiteContent } from "@/lib/content/types";

// Ícones fixos (não editáveis), na ordem dos cards de risco.
const icons = [PhoneOff, Archive, Users, Hourglass];

/**
 * Seção "o custo de perder o número" — abre a página do Vetor Chat
 * ancorando no problema antes de apresentar a solução.
 */
export default function BlindadoProblema({
  content,
  theme = "azul",
}: {
  content: SiteContent["blindado"]["problema"];
  theme?: SectionTheme;
}) {
  const t = THEMES[theme];

  return (
    <section
      id="problema"
      className="relative pt-28 pb-40"
      style={{ backgroundColor: t.bg }}
    >
      <Wave fill={t.bg} position="top" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className={cn(badgeClasses(t), "mb-4")}>{content.badge}</span>
            <h2
              className={cn(
                "font-display font-bold text-4xl lg:text-5xl leading-tight tracking-tight whitespace-pre-line",
                t.title
              )}
            >
              {content.title}
            </h2>
          </div>
          <p
            className={cn(
              "font-body font-light max-w-md leading-relaxed text-sm md:text-right",
              t.body
            )}
          >
            {content.intro}
          </p>
        </div>

        {/* Quatro caixas independentes: o que agrupa é a proximidade e o
            alinhamento, não um contorno comum. */}
        <StaggerChildren className="grid sm:grid-cols-2 gap-6" staggerDelay={0.1}>
          {content.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={item.title || i}
                variants={staggerItem}
                className={cn(
                  // Sem descrição, os cards mantêm a altura original da seção
                  // e o conteúdo fica centralizado.
                  cardClasses(t),
                  "flex flex-col items-center justify-center text-center min-h-[200px] sm:min-h-[270px]"
                )}
              >
                <div className={cn(iconCircleClasses(theme), "mb-6")}>
                  <Icon size={26} strokeWidth={1.75} />
                </div>
                <h3
                  className={cn(
                    "font-display font-semibold text-xl lg:text-2xl tracking-tight",
                    t.title
                  )}
                >
                  {item.title}
                </h3>
              </motion.div>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
