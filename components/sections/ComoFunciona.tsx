"use client";
import Badge from "@/components/ui/Badge";
import { StaggerChildren, staggerItem, motion } from "@/components/motion";

const steps = [
  {
    number: "01",
    title: "Diagnóstico",
    description:
      "Mapeamos seus processos atuais, identificamos gargalos, estimamos ROI e definimos o escopo ideal de automação.",
  },
  {
    number: "02",
    title: "Projeto",
    description:
      "Arquitetamos a solução, escolhemos as tecnologias certas e desenvolvemos em sprints com validação contínua.",
  },
  {
    number: "03",
    title: "Implementação",
    description:
      "Deploy controlado, testes em produção, treinamento da equipe e monitoramento intensivo na primeira fase operacional.",
  },
  {
    number: "04",
    title: "Operação",
    description:
      "Monitoramento contínuo, ajustes finos, relatórios de desempenho e evoluções incrementais conforme o negócio cresce.",
  },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="py-28 bg-[#141414]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <Badge className="mb-4">Metodologia</Badge>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#F5F5F5] leading-tight tracking-tight max-w-xl">
            Como funciona
          </h2>
        </div>

        <StaggerChildren
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0"
          staggerDelay={0.12}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={staggerItem}
              className="relative p-8 border-[#2A2A2A] border-t lg:border-t-0 lg:border-l first:lg:border-l-0"
            >
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 right-0 w-px h-4 bg-[#2563EB] translate-x-1/2" />
              )}

              <div className="font-display font-bold text-5xl text-[#383838] mb-6 leading-none tracking-tighter">
                {step.number}
              </div>
              <div className="w-6 h-px bg-[#2563EB] mb-5" />
              <h3 className="font-display font-semibold text-lg text-[#F5F5F5] mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="font-body font-light text-[#A3A3A3] text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
