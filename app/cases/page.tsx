import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cases } from "@/lib/cases";
import Badge from "@/components/ui/Badge";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Casos de Sucesso",
  description: "Resultados reais de automação com agentes de IA. Veja como a Vetor Automação transformou processos em diferentes setores.",
};

export default function CasesPage() {
  return (
    <>
      <main className="min-h-screen bg-[#0A0A0A] pt-24">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-display text-xs text-[#737373] hover:text-[#A3A3A3] transition-colors tracking-widest uppercase mb-8"
            >
              <ArrowLeft size={12} />
              Voltar
            </Link>
          </div>

          <Badge className="mb-6">Casos de sucesso</Badge>
          <h1 className="font-display font-bold text-5xl lg:text-6xl text-[#F5F5F5] leading-tight tracking-tight mb-4">
            Resultados reais
          </h1>
          <p className="font-body font-light text-[#A3A3A3] text-lg mb-16 max-w-xl leading-relaxed">
            Projetos entregues, métricas reais. Veja como automatizamos processos
            complexos em diferentes setores.
          </p>

          <div className="grid md:grid-cols-3 gap-px bg-[#2A2A2A]">
            {cases.map((c) => (
              <Link
                key={c.slug}
                href={`/cases/${c.slug}`}
                className="group flex flex-col bg-[#0A0A0A] hover:bg-[#141414] p-8 transition-colors duration-300"
              >
                <span className="font-display text-xs tracking-widest uppercase text-[#737373] mb-6">
                  {c.industry}
                </span>

                <div className="mb-5">
                  <div className="font-display font-bold text-6xl text-[#2563EB] leading-none">
                    {c.metric}
                  </div>
                  <div className="font-body text-xs text-[#A3A3A3] mt-1.5">{c.metricLabel}</div>
                </div>

                <h2 className="font-display font-semibold text-xl text-[#F5F5F5] leading-snug tracking-tight mb-3 group-hover:text-white transition-colors flex-1">
                  {c.title}
                </h2>
                <p className="font-body font-light text-sm text-[#A3A3A3] leading-relaxed mb-6">
                  {c.summary}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {c.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="font-display text-[10px] px-2 py-1 border border-[#2A2A2A] text-[#737373]">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-[#2563EB] font-display text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver caso completo
                  <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-20 p-10 border border-[#2A2A2A] bg-[#141414] flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-display font-semibold text-xl text-[#F5F5F5] mb-2">
                Quer resultados como esses?
              </p>
              <p className="font-body font-light text-sm text-[#A3A3A3]">
                Comece com um diagnóstico sem compromisso.
              </p>
            </div>
            <Link
              href="/#contato"
              className="inline-flex items-center gap-2 font-display text-sm font-semibold tracking-wide px-7 py-3.5 bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-colors shrink-0"
            >
              Falar com a Vetor
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
