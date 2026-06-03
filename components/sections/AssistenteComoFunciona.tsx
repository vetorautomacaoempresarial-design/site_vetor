"use client";
import Badge from "@/components/ui/Badge";
import { StaggerChildren, staggerItem, motion } from "@/components/motion";

const steps = [
  {
    number: "01",
    title: "Primeiro contato",
    description:
      "O lead chega e é recebido imediatamente pelo agente — disponível 24/7, sem espera e sem depender da agenda do time de vendas.",
  },
  {
    number: "02",
    title: "Entende a demanda",
    description:
      "Em uma conversa natural, o agente faz as perguntas certas, compreende a real necessidade do lead e coleta os dados de contato.",
  },
  {
    number: "03",
    title: "Gera o resumo",
    description:
      "Tudo é consolidado em um resumo estruturado: quem é o lead, como falar com ele e exatamente o que ele precisa.",
  },
  {
    number: "04",
    title: "Repassa ao vendedor",
    description:
      "O vendedor recebe o lead já qualificado e contextualizado — pronto para focar no que importa: fechar a venda.",
  },
];

export default function AssistenteComoFunciona() {
  return (
    <section className="py-28 bg-[#141414] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <Badge className="mb-4">Como funciona</Badge>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#F5F5F5] leading-tight tracking-tight max-w-xl">
            Do primeiro &quot;olá&quot; ao lead pronto para fechar
          </h2>
        </div>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0" staggerDelay={0.12}>
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={staggerItem}
              className="relative p-8 border-[#2A2A2A] border-t lg:border-t-0 lg:border-l first:lg:border-l-0"
            >
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
