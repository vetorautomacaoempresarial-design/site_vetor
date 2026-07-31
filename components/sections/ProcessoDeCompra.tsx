"use client";
import { MessageCircle } from "lucide-react";
import { StaggerChildren, staggerItem, motion } from "@/components/motion";
import { cn } from "@/lib/cn";
import Wave from "@/components/ui/Wave";
import { THEMES, badgeClasses, cardClasses, type SectionTheme } from "@/lib/section-theme";
import type { SiteContent } from "@/lib/content/types";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5554991776175";

export default function ProcessoDeCompra({
  content,
  theme = "azul",
}: {
  content: SiteContent["assistente"]["processo"];
  theme?: SectionTheme;
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

        {/* Caixas independentes: o que agrupa é a proximidade e o alinhamento,
            não um contorno comum. */}
        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.12}>
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
              <h3 className={cn("font-display font-semibold text-2xl mb-3 tracking-tight", t.title)}>
                {step.title}
              </h3>
              <p className={cn("font-body font-light text-sm leading-relaxed", t.body)}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </StaggerChildren>

        <div className={cn("mt-16 p-10 flex flex-col items-center text-center", t.box)}>
          <p className={cn("font-display font-semibold text-lg mb-2", t.title)}>
            {content.boxTitle}
          </p>
          <p className={cn("font-body font-light text-sm mb-8", t.body)}>
            {content.boxSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {content.planButtons.map((p) => (
              <a
                key={p.label}
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(p.msg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-display text-sm font-semibold tracking-wide px-5 py-3 bg-[#25D366] text-white hover:bg-[#22C35E] transition-colors"
              >
                <MessageCircle size={20} />
                {p.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
