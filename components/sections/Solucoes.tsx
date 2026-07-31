"use client";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import Wave from "@/components/ui/Wave";
import MockupBlindado from "@/components/sections/mockups/MockupBlindado";
import MockupAssistente from "@/components/sections/mockups/MockupAssistente";
import MockupAutomacoes from "@/components/sections/mockups/MockupAutomacoes";
import { FadeInUp } from "@/components/motion";
import type { SiteContent } from "@/lib/content/types";

// Destino e ilustração de cada produto (fixos, não editáveis), na ordem dos itens:
// 0 = Vetor Chat; 1 = Vetor Sales; 2 = Automações personalizadas.
const produtos = [
  { href: "/vetor-chat", Visual: MockupBlindado },
  { href: "/vetor-sales", Visual: MockupAssistente },
  { href: "/automacoes-personalizadas", Visual: MockupAutomacoes },
];

export default function Solucoes({
  content,
}: {
  content: SiteContent["home"]["solucoes"];
}) {
  return (
    <section id="solucoes" className="relative bg-[var(--brand-soft)]">
      {/* Transição ondulada: entra o azul por cima da faixa escura do topo.
          A saída para a seção seguinte é a onda que a própria seção desenha. */}
      <Wave fill="var(--brand-soft)" position="top" />

      {content.items.map((item, i) => {
        const { href, Visual } = produtos[i % produtos.length];
        const inverso = i % 2 === 1;

        return (
          // Cada produto ocupa uma tela inteira: quem está lendo um produto não
          // vê pedaço do próximo. O primeiro ganha espaço extra em cima por
          // causa da onda que entra sobre ele.
          <div
            key={item.title || i}
            className={cn(
              "relative flex items-center py-20 lg:min-h-screen lg:py-24",
              i === 0 && "pt-28 lg:pt-40"
            )}
          >
            <div className="w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
              <FadeInUp className={inverso ? "lg:order-2" : undefined}>
                <p className="font-display text-base font-bold tracking-[0.18em] uppercase text-white mb-5">
                  {item.title}
                </p>
                {/* A quebra manual da chamada só vale no desktop; no celular o
                    texto corre normalmente para não quebrar em lugar estranho. */}
                <h3 className="font-display font-bold text-[2.6rem] lg:text-[3.05rem] text-white leading-[1.1] tracking-tight mb-8 lg:whitespace-pre-line">
                  {item.headline}
                </h3>

                <ul className="flex flex-col gap-4 mb-10">
                  {item.bullets.map((bullet, b) => (
                    <li key={b} className="flex items-start gap-3">
                      <Check
                        size={22}
                        className="shrink-0 mt-1 text-white"
                        strokeWidth={2.5}
                      />
                      <span className="font-body text-lg text-white/90 leading-relaxed">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={href}
                  className="inline-flex items-center gap-2 font-display text-base font-semibold tracking-wide px-8 py-4 bg-white text-[var(--brand-soft-ink)] hover:bg-[#EEF2FF] transition-colors group/btn"
                >
                  {item.ctaLabel}
                  <ArrowRight
                    size={20}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </Link>
              </FadeInUp>

              <FadeInUp delay={0.15} className={inverso ? "lg:order-1" : undefined}>
                <Visual />
              </FadeInUp>
            </div>
          </div>
        );
      })}

      {/* Espaço para a onda de saída não cobrir o último produto. */}
      <div className="h-16 sm:h-24 lg:h-32" />
    </section>
  );
}
