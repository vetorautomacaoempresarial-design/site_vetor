"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { StaggerChildren, staggerItem, motion } from "@/components/motion";
import { cases } from "@/lib/cases";

export default function CasesPreview() {
  return (
    <section id="cases" className="py-28 bg-[#0A0A0A] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <Badge className="mb-4">Cases</Badge>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#F5F5F5] leading-tight tracking-tight">
              Resultados reais
            </h2>
          </div>
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 font-display text-sm text-[#A3A3A3] hover:text-white transition-colors group"
          >
            Ver todos os cases
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <StaggerChildren className="grid md:grid-cols-3 gap-px bg-[#2A2A2A]" staggerDelay={0.1}>
          {cases.map((c) => (
            <motion.div key={c.slug} variants={staggerItem}>
              <Link
                href={`/cases/${c.slug}`}
                className="group flex flex-col bg-[#0A0A0A] hover:bg-[#141414] p-8 h-full transition-colors duration-300"
              >
                <div className="mb-6">
                  <span className="font-display text-xs tracking-widest uppercase text-[#737373]">
                    {c.industry}
                  </span>
                </div>

                {/* Metric */}
                <div className="mb-4">
                  <div className="font-display font-bold text-5xl text-[#2563EB] leading-none">
                    {c.metric}
                  </div>
                  <div className="font-body text-xs text-[#A3A3A3] mt-1">{c.metricLabel}</div>
                </div>

                <h3 className="font-display font-semibold text-lg text-[#F5F5F5] leading-snug tracking-tight mb-3 group-hover:text-white transition-colors">
                  {c.title}
                </h3>
                <p className="font-body font-light text-sm text-[#A3A3A3] leading-relaxed flex-1">
                  {c.summary}
                </p>

                <div className="flex items-center gap-2 mt-6 text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-display text-xs tracking-widest uppercase">Ver case</span>
                  <ArrowRight size={12} />
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
