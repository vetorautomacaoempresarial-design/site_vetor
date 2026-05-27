import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { cases, getCaseBySlug } from "@/lib/cases";
import Badge from "@/components/ui/Badge";
import Footer from "@/components/sections/Footer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.summary,
  };
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) notFound();

  return (
    <>
      <main className="min-h-screen bg-[#0A0A0A] pt-24">
        {/* Hero */}
        <div className="border-b border-[#2A2A2A] bg-[#141414]">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 font-display text-xs text-[#737373] hover:text-[#A3A3A3] transition-colors tracking-widest uppercase mb-10"
            >
              <ArrowLeft size={12} />
              Todos os Cases
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-end">
              <div>
                <Badge className="mb-5">{c.industry}</Badge>
                <h1 className="font-display font-bold text-4xl lg:text-5xl text-[#F5F5F5] leading-tight tracking-tight mb-4">
                  {c.title}
                </h1>
                <p className="font-body font-light text-[#A3A3A3] text-base leading-relaxed">
                  {c.summary}
                </p>
              </div>
              <div className="lg:text-right">
                <div className="font-display font-bold text-8xl text-[#2563EB] leading-none">
                  {c.metric}
                </div>
                <div className="font-body text-sm text-[#A3A3A3] mt-2">{c.metricLabel}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2 flex flex-col gap-14">
              <div>
                <h2 className="font-display font-semibold text-xs tracking-widest uppercase text-[#2563EB] mb-4">
                  O Desafio
                </h2>
                <p className="font-body font-light text-[#A3A3A3] leading-relaxed text-base">
                  {c.challenge}
                </p>
              </div>

              <div>
                <h2 className="font-display font-semibold text-xs tracking-widest uppercase text-[#2563EB] mb-4">
                  A Solução
                </h2>
                <p className="font-body font-light text-[#A3A3A3] leading-relaxed text-base">
                  {c.solution}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Results */}
              <div className="border border-[#2A2A2A] p-6 bg-[#141414]">
                <h3 className="font-display text-xs font-semibold tracking-widest uppercase text-[#737373] mb-5">
                  Resultados
                </h3>
                <div className="flex flex-col gap-4">
                  {c.results.map((r) => (
                    <div key={r.label} className="flex items-start gap-3">
                      <CheckCircle size={14} className="text-[#2563EB] mt-0.5 shrink-0" />
                      <div>
                        <div className="font-display font-bold text-xl text-white">{r.value}</div>
                        <div className="font-body text-xs text-[#737373] mt-0.5">{r.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="border border-[#2A2A2A] p-6 bg-[#141414]">
                <h3 className="font-display text-xs font-semibold tracking-widest uppercase text-[#737373] mb-4">
                  Tecnologias
                </h3>
                <div className="flex flex-wrap gap-2">
                  {c.technologies.map((tech) => (
                    <span key={tech} className="font-display text-xs px-3 py-1.5 border border-[#2A2A2A] text-[#A3A3A3]">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="border border-[#2563EB]/30 bg-[#2563EB]/5 p-6">
                <p className="font-display font-semibold text-sm text-[#F5F5F5] mb-2">
                  Quer resultados semelhantes?
                </p>
                <p className="font-body text-xs text-[#A3A3A3] mb-4 leading-relaxed">
                  Fale com a Vetor e descubra como podemos automatizar o seu processo.
                </p>
                <Link
                  href="/#contato"
                  className="inline-flex items-center gap-2 font-display text-xs font-semibold tracking-wide px-5 py-2.5 bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-colors"
                >
                  Agendar Diagnóstico
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
