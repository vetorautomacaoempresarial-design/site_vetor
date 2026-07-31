"use client";
import { Shield, Zap, Lock, RefreshCw } from "lucide-react";
import { FadeInUp, StaggerChildren, staggerItem, motion } from "@/components/motion";
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

// Ícones fixos (não editáveis), na ordem dos cards.
const icons = [Zap, Shield, Lock, RefreshCw];

/** "Por que a Vetor": entre a faixa azul dos produtos e as dúvidas. */
export default function Diferenciais({
  content,
  theme = "branco",
}: {
  content: SiteContent["home"]["diferenciais"];
  theme?: SectionTheme;
}) {
  const t = THEMES[theme];

  return (
    <section
      id="diferenciais"
      className="relative pt-28 pb-40"
      style={{ backgroundColor: t.bg }}
    >
      <Wave fill={t.bg} position="top" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeInUp>
            <span className={cn(badgeClasses(t), "mb-4")}>{content.badge}</span>
            <h2
              className={cn(
                "font-display font-bold text-4xl lg:text-5xl leading-tight tracking-tight mb-6 whitespace-pre-line",
                t.title
              )}
            >
              {content.title}
            </h2>
            <p className={cn("font-body font-light leading-relaxed text-sm max-w-md", t.body)}>
              {content.intro}
            </p>
          </FadeInUp>

          {/* Quatro caixas independentes: o que agrupa é a proximidade e o
              alinhamento, não um contorno comum. */}
          <StaggerChildren className="grid sm:grid-cols-2 gap-6" staggerDelay={0.08}>
            {content.items.map((d, i) => {
              const Icon = icons[i % icons.length];
              return (
                <motion.div
                  key={d.title || i}
                  variants={staggerItem}
                  className={cn(
                    // Sem descrição, os cards mantêm a altura original da seção
                    // e o conteúdo fica centralizado.
                    cardClasses(t),
                    "flex flex-col items-center justify-center text-center min-h-[180px] sm:min-h-[260px]"
                  )}
                >
                  <div className={cn(iconCircleClasses(theme), "mb-5")}>
                    <Icon size={26} strokeWidth={1.75} />
                  </div>
                  <h3 className={cn("font-display font-semibold text-xl tracking-tight", t.title)}>
                    {d.title}
                  </h3>
                </motion.div>
              );
            })}
          </StaggerChildren>
        </div>
      </div>
    </section>
  );
}
