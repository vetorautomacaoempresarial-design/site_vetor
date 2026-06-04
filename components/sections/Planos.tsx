"use client";
import Link from "next/link";
import { MessageCircle, Clock } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { StaggerChildren, staggerItem, motion } from "@/components/motion";
import { PLAN_LIST, savingsPercent } from "@/lib/plans";
import type { SiteContent } from "@/lib/content/types";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5554991776175";
const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Olá! Tenho interesse no Assistente de Vendas da Vetor e gostaria de tirar dúvidas sobre os planos."
)}`;

export default function Planos({ content }: { content: SiteContent["assistente"]["planos"] }) {
  return (
    <section id="planos" className="py-28 bg-[#141414] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <Badge className="mb-4">{content.badge}</Badge>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#F5F5F5] leading-tight tracking-tight mb-4 whitespace-pre-line">
            {content.title}
          </h2>
          <p className="font-body font-light text-[#A3A3A3] text-sm leading-relaxed">
            {content.intro}
          </p>

          <div className="mt-6 inline-flex items-start gap-2.5 text-left border border-[#2563EB]/30 bg-[#2563EB]/5 px-4 py-3">
            <Clock size={16} className="text-[#2563EB] mt-0.5 shrink-0" />
            <p className="font-body text-xs text-[#A3A3A3] leading-relaxed">
              <span className="text-[#F5F5F5] font-medium">{content.noteStrong}</span>{" "}
              {content.noteRest}
            </p>
          </div>
        </div>

        <StaggerChildren className="grid md:grid-cols-3 gap-px bg-[#2A2A2A]" staggerDelay={0.1}>
          {PLAN_LIST.map((plan) => {
            const savings = savingsPercent(plan);
            return (
            <motion.div
              key={plan.name}
              variants={staggerItem}
              className="flex flex-col bg-[#0A0A0A] p-8"
            >
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-display font-semibold text-lg text-[#F5F5F5] tracking-tight">
                  {plan.name}
                </h3>
                {savings > 0 && (
                  <span className="font-display text-[11px] font-semibold tracking-wide px-2 py-0.5 bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/30">
                    Economize {savings}%
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display font-bold text-4xl text-[#F5F5F5]">
                  {plan.monthlyLabel}
                </span>
                <span className="font-body text-sm text-[#737373]">/mês</span>
              </div>
              <p className="font-body font-light text-sm text-[#A3A3A3] leading-relaxed mb-8 flex-1">
                {plan.description}
              </p>

              <Link
                href={`/conta?plano=${plan.id}`}
                className="inline-flex items-center justify-center gap-2 font-display text-sm font-semibold tracking-wide px-7 py-3.5 transition-colors w-full border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
              >
                Assinar {plan.name}
              </Link>
            </motion.div>
            );
          })}
        </StaggerChildren>

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="font-body text-sm text-[#737373]">{content.ctaQuestion}</p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-4 bg-[#25D366] text-white font-display font-semibold text-sm tracking-wide hover:bg-[#22C35E] transition-colors"
          >
            <MessageCircle size={18} />
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
