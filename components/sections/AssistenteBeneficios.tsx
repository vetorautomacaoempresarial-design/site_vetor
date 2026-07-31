"use client";
import { Clock, TrendingUp, ClipboardCheck, Inbox } from "lucide-react";
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

// Ícones fixos (não editáveis), na ordem dos cards.
const icons = [TrendingUp, Clock, ClipboardCheck, Inbox];

// Fontes das estatísticas (links externos ficam no código), na ordem das stats.
const statSources = [
  {
    label: "Lead Connect",
    url: "https://leadresponse.co/blog/speed-to-lead-statistics#2-78-of-customers-buy-from-the-company-that-responds-first",
  },
  {
    label: "HubSpot",
    url: "https://cdn2.hubspot.net/hubfs/69576/leads360_wp_speed_to_call.pdf?t=1515599992576&utm_source=chatgpt.com",
  },
];

export default function AssistenteBeneficios({
  content,
  theme = "azul",
}: {
  content: SiteContent["assistente"]["beneficios"];
  theme?: SectionTheme;
}) {
  const t = THEMES[theme];

  return (
    <section
      id="beneficios"
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

        {/* Caixas independentes: o que agrupa é a proximidade e o alinhamento,
            não um contorno comum. */}
        <StaggerChildren
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          staggerDelay={0.1}
        >
          {content.items.map((b, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={b.title || i}
                variants={staggerItem}
                className={cn(
                  // Sem descrição, o card guarda só o ícone e a frase — ambos
                  // centralizados, com altura mínima para a grade ficar regular.
                  cardClasses(t),
                  "flex flex-col items-center justify-center text-center min-h-[200px]"
                )}
              >
                <div className={cn(iconCircleClasses(theme), "mb-5")}>
                  <Icon size={26} strokeWidth={1.75} />
                </div>
                <h3 className={cn("font-display font-semibold text-xl tracking-tight", t.title)}>
                  {b.title}
                </h3>
              </motion.div>
            );
          })}
        </StaggerChildren>

        {content.stats?.length > 0 && (
          <div className="mt-20">
            <StaggerChildren className="grid sm:grid-cols-2 gap-6" staggerDelay={0.1}>
              {content.stats.map((s, i) => {
                const src = statSources[i];
                return (
                  <motion.div
                    key={s.value || i}
                    variants={staggerItem}
                    className={cn(
                      cardClasses(t),
                      "px-8 py-12 flex flex-col items-center text-center"
                    )}
                  >
                    <span
                      className={cn(
                        "font-display font-bold text-6xl lg:text-7xl tracking-tight",
                        t.title
                      )}
                    >
                      {s.value}
                    </span>
                    <p
                      className={cn(
                        "font-body font-light text-sm leading-relaxed mt-4 max-w-xs",
                        t.body
                      )}
                    >
                      {s.caption}
                    </p>
                    {src && (
                      <p className={cn("mt-3 font-body text-[10px]", t.muted)}>
                        fonte:{" "}
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 hover:opacity-100 opacity-80 transition-opacity"
                        >
                          {src.label}
                        </a>
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </StaggerChildren>
          </div>
        )}
      </div>
    </section>
  );
}
