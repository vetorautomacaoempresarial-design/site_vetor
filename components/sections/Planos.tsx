"use client";
import Link from "next/link";
import { MessageCircle, Clock } from "lucide-react";
import { StaggerChildren, staggerItem, motion } from "@/components/motion";
import { cn } from "@/lib/cn";
import Wave from "@/components/ui/Wave";
import { THEMES, badgeClasses, cardClasses, type SectionTheme } from "@/lib/section-theme";
import { PRODUCTS, plansOf, savingsPercent, type ProductId } from "@/lib/plans";
import type { SiteContent } from "@/lib/content/types";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5554991776175";

/** Bloco de planos de UM produto. Usado nas páginas públicas de cada produto. */
export default function Planos({
  content,
  product,
  theme = "branco",
}: {
  content: SiteContent["assistente"]["planos"];
  /** Qual produto está sendo vendido nesta página. */
  product: ProductId;
  theme?: SectionTheme;
}) {
  const productConfig = PRODUCTS[product];
  const t = THEMES[theme];

  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Olá! Tenho interesse no ${productConfig.name} da Vetor e gostaria de tirar dúvidas sobre os planos.`
  )}`;

  return (
    <section
      id="planos"
      className="relative pt-28 pb-40"
      style={{ backgroundColor: t.bg }}
    >
      <Wave fill={t.bg} position="top" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <span className={cn(badgeClasses(t), "mb-4")}>{content.badge}</span>
          <h2
            className={cn(
              "font-display font-bold text-4xl lg:text-5xl leading-tight tracking-tight mb-4 whitespace-pre-line",
              t.title
            )}
          >
            {content.title}
          </h2>
          <p className={cn("font-body font-light text-sm leading-relaxed", t.body)}>
            {content.intro}
          </p>

          <div className={cn("mt-6 inline-flex items-start gap-2.5 text-left px-4 py-3", t.box)}>
            <Clock size={18} className={cn("mt-0.5 shrink-0", t.title)} />
            <p className={cn("font-body text-xs leading-relaxed", t.body)}>
              <span className={cn("font-medium", t.title)}>{content.noteStrong}</span>{" "}
              {content.noteRest}
            </p>
          </div>
        </div>

        {/* Caixas independentes: o que agrupa é a proximidade e o alinhamento,
            não um contorno comum. */}
        <StaggerChildren className="grid md:grid-cols-3 gap-6" staggerDelay={0.1}>
          {plansOf(product).map((plan) => {
            const savings = savingsPercent(plan);
            return (
              <motion.div
                key={plan.period}
                variants={staggerItem}
                className={cn(cardClasses(t), "flex flex-col")}
              >
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={cn("font-display font-semibold text-lg tracking-tight", t.title)}>
                    {plan.name}
                  </h3>
                  {savings > 0 && (
                    <span
                      className={cn(
                        "font-display text-[11px] font-semibold tracking-wide px-2 py-0.5 border",
                        t.badge
                      )}
                    >
                      Economize {savings}%
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={cn("font-display font-bold text-4xl", t.title)}>
                    {plan.monthlyLabel}
                  </span>
                  <span className={cn("font-body text-sm", t.muted)}>/mês</span>
                </div>
                <p className={cn("font-body font-light text-sm leading-relaxed mb-8 flex-1", t.body)}>
                  {plan.description}
                </p>

                <Link
                  href={`/conta?produto=${plan.product}&plano=${plan.period}`}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 font-display text-sm font-semibold tracking-wide px-7 py-3.5 transition-colors w-full",
                    t.buttonOutline
                  )}
                >
                  Assinar {plan.name}
                </Link>
              </motion.div>
            );
          })}
        </StaggerChildren>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className={cn("font-body text-sm", t.body)}>{content.ctaQuestion}</p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-4 bg-[#25D366] text-white font-display font-semibold text-sm tracking-wide hover:bg-[#22C35E] transition-colors"
          >
            <MessageCircle size={22} />
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
