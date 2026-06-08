"use client";
import { Clock, TrendingUp, ClipboardCheck, Shield } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { StaggerChildren, staggerItem, motion } from "@/components/motion";
import type { SiteContent } from "@/lib/content/types";

// Ícones fixos (não editáveis), na ordem dos cards.
const icons = [TrendingUp, Clock, ClipboardCheck, Shield];

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
}: {
  content: SiteContent["assistente"]["beneficios"];
}) {
  return (
    <section id="beneficios" className="py-28 bg-[#0A0A0A] border-t border-[#2A2A2A]">
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

        <StaggerChildren className="grid md:grid-cols-2 gap-px bg-[#2A2A2A]" staggerDelay={0.1}>
          {content.items.map((b, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={b.title || i}
                variants={staggerItem}
                className="bg-[#0A0A0A] p-8 group hover:bg-[#141414] transition-colors duration-300"
              >
                <div className="w-12 h-12 border border-[#2A2A2A] flex items-center justify-center mb-6 group-hover:border-[#2563EB] group-hover:text-[#2563EB] text-[#A3A3A3] transition-colors">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-semibold text-2xl text-[#F5F5F5] mb-3 tracking-tight">
                  {b.title}
                </h3>
                <p className="font-body font-light text-[#A3A3A3] text-sm leading-relaxed">
                  {b.description}
                </p>
              </motion.div>
            );
          })}
        </StaggerChildren>

        {content.stats?.length > 0 && (
          <div className="mt-20">
            <StaggerChildren
              className="grid sm:grid-cols-2 gap-px bg-[#2A2A2A] border border-[#2A2A2A]"
              staggerDelay={0.1}
            >
              {content.stats.map((s, i) => {
                const src = statSources[i];
                return (
                  <motion.div
                    key={s.value || i}
                    variants={staggerItem}
                    className="bg-[#0A0A0A] px-8 py-12 flex flex-col items-center text-center"
                  >
                    <span className="font-display font-bold text-6xl lg:text-7xl text-[#2563EB] tracking-tight">
                      {s.value}
                    </span>
                    <p className="font-body font-light text-[#A3A3A3] text-sm leading-relaxed mt-4 max-w-xs">
                      {s.caption}
                    </p>
                    {src && (
                      <p className="mt-3 font-body text-[10px] text-[#525252]">
                        fonte:{" "}
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 hover:text-[#2563EB] transition-colors"
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
