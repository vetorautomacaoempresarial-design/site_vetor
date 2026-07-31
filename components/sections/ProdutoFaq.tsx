"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FadeInUp } from "@/components/motion";
import { cn } from "@/lib/cn";
import Wave from "@/components/ui/Wave";
import { THEMES, badgeClasses, type SectionTheme } from "@/lib/section-theme";
import type { SiteContent } from "@/lib/content/types";

/** FAQ das páginas de produto. Compartilhado entre os produtos. */
export default function ProdutoFaq({
  content,
  theme = "azul",
}: {
  content: SiteContent["assistente"]["faq"];
  theme?: SectionTheme;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const t = THEMES[theme];

  return (
    <section className="relative pt-28 pb-40" style={{ backgroundColor: t.bg }}>
      <Wave fill={t.bg} position="top" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <FadeInUp>
            <span className={cn(badgeClasses(t), "mb-4")}>{content.badge}</span>
            <h2
              className={cn(
                "font-display font-bold text-4xl lg:text-5xl leading-tight tracking-tight whitespace-pre-line",
                t.title
              )}
            >
              {content.title}
            </h2>
          </FadeInUp>

          <div className={cn("flex flex-col divide-y", t.border)}>
            {content.items.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-start justify-between gap-4 py-6 text-left group"
                >
                  <span
                    className={cn(
                      "font-display font-medium text-base leading-snug tracking-tight transition-opacity",
                      t.title,
                      open === i ? "opacity-100" : "opacity-75 group-hover:opacity-100"
                    )}
                  >
                    {faq.question}
                  </span>
                  <span className={cn("shrink-0 mt-0.5 transition-opacity", t.title, "opacity-70 group-hover:opacity-100")}>
                    {open === i ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>
                {open === i && (
                  <div className="pb-6">
                    <p className={cn("font-body font-light text-sm leading-relaxed", t.body)}>
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
