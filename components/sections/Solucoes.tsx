"use client";
import Link from "next/link";
import { ArrowRight, Package, Wrench } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { StaggerChildren, staggerItem, motion } from "@/components/motion";
import type { SiteContent } from "@/lib/content/types";

// Ícones e destinos fixos (não editáveis), na ordem dos cards:
// 0 = Automações prontas → Produtos; 1 = Automações personalizadas → Como funciona.
const cards = [
  { Icon: Package, href: "/assistente-de-vendas#beneficios" },
  { Icon: Wrench, href: "/#como-funciona" },
];

export default function Solucoes({
  content,
}: {
  content: SiteContent["home"]["solucoes"];
}) {
  return (
    <section id="solucoes" className="py-28 bg-[#0A0A0A] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <Badge className="mb-4">{content.badge}</Badge>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#F5F5F5] leading-tight tracking-tight whitespace-pre-line">
              {content.title}
            </h2>
          </div>
          <p className="font-body font-light text-[#A3A3A3] max-w-md leading-relaxed text-sm md:text-right">
            {content.intro}
          </p>
        </div>

        <StaggerChildren className="grid md:grid-cols-2 gap-px bg-[#2A2A2A]" staggerDelay={0.12}>
          {content.items.map((item, i) => {
            const { Icon, href } = cards[i % cards.length];
            return (
              <motion.div
                key={item.title || i}
                variants={staggerItem}
                className="bg-[#0A0A0A] p-10 flex flex-col group hover:bg-[#141414] transition-colors duration-300"
              >
                <div className="w-12 h-12 border border-[#2A2A2A] flex items-center justify-center mb-6 group-hover:border-[#2563EB] group-hover:text-[#2563EB] text-[#A3A3A3] transition-colors">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-semibold text-2xl lg:text-3xl text-[#F5F5F5] mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="font-body font-light text-[#A3A3A3] text-sm leading-relaxed mb-8 flex-1">
                  {item.description}
                </p>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 self-start font-display text-sm font-semibold tracking-wide px-6 py-3 bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-colors group/btn"
                >
                  {item.ctaLabel}
                  <ArrowRight
                    size={18}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </Link>
              </motion.div>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
