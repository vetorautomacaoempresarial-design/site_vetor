"use client";
import { Bot, Plug, Search } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { StaggerChildren, staggerItem, motion } from "@/components/motion";

const services = [
  {
    icon: Bot,
    title: "Agentes de IA Conversacional",
    description:
      "Agentes autônomos que entendem contexto, executam tarefas e se integram ao seu fluxo de trabalho — atendimento, vendas, suporte interno e muito mais.",
  },
  {
    icon: Plug,
    title: "Integrações & Orquestração",
    description:
      "Conectamos suas ferramentas, APIs e bancos de dados em pipelines inteligentes que movem dados e disparam ações automaticamente entre sistemas.",
  },
  {
    icon: Search,
    title: "Diagnóstico & Consultoria",
    description:
      "Mapeamos seus processos, identificamos os maiores gargalos e entregamos um roadmap de automação com ROI estimado antes de qualquer implementação.",
  },
];

export default function Servicos() {
  return (
    <section id="servicos" className="py-28 bg-[#0A0A0A] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <Badge className="mb-4">Serviços</Badge>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#F5F5F5] leading-tight tracking-tight">
              O que entregamos
            </h2>
          </div>
          <p className="font-body font-light text-[#A3A3A3] max-w-md leading-relaxed text-sm md:text-right">
            Soluções end-to-end, da estratégia à operação. Cada projeto é construído
            com tecnologia de ponta e responsabilidade de negócio.
          </p>
        </div>

        <StaggerChildren className="grid md:grid-cols-3 gap-px bg-[#2A2A2A]" staggerDelay={0.1}>
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={staggerItem}
                className="bg-[#0A0A0A] p-8 group hover:bg-[#141414] transition-colors duration-300"
              >
                <div className="w-10 h-10 border border-[#2A2A2A] flex items-center justify-center mb-6 group-hover:border-[#2563EB] group-hover:text-[#2563EB] text-[#A3A3A3] transition-colors">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-semibold text-xl text-[#F5F5F5] mb-3 tracking-tight">
                  {service.title}
                </h3>
                <p className="font-body font-light text-[#A3A3A3] text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
