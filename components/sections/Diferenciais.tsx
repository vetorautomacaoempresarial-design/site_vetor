"use client";
import { Shield, Zap, Lock, RefreshCw } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { FadeInUp, StaggerChildren, staggerItem, motion } from "@/components/motion";
import type { SiteContent } from "@/lib/content/types";

// Ícones fixos (não editáveis), na ordem dos cards.
const icons = [Zap, Shield, Lock, RefreshCw];

export default function Diferenciais({
  content,
}: {
  content: SiteContent["home"]["diferenciais"];
}) {
  return (
    <section className="py-28 bg-[#141414] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <FadeInUp>
            <Badge className="mb-4">{content.badge}</Badge>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#F5F5F5] leading-tight tracking-tight mb-6 whitespace-pre-line">
              {content.title}
            </h2>
            <p className="font-body font-light text-[#A3A3A3] leading-relaxed text-sm max-w-md">
              {content.intro}
            </p>
          </FadeInUp>

          <StaggerChildren className="grid sm:grid-cols-2 gap-px bg-[#2A2A2A]" staggerDelay={0.08}>
            {content.items.map((d, i) => {
              const Icon = icons[i % icons.length];
              return (
                <motion.div
                  key={d.title || i}
                  variants={staggerItem}
                  className="bg-[#141414] p-6 hover:bg-[#1C1C1C] transition-colors group"
                >
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    className="text-[#737373] group-hover:text-[#2563EB] transition-colors mb-4"
                  />
                  <h3 className="font-display font-semibold text-sm text-[#F5F5F5] mb-2 tracking-tight">
                    {d.title}
                  </h3>
                  <p className="font-body text-xs text-[#A3A3A3] leading-relaxed">{d.description}</p>
                </motion.div>
              );
            })}
          </StaggerChildren>
        </div>
      </div>
    </section>
  );
}
