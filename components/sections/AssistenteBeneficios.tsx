"use client";
import { Clock, ClipboardList, TrendingUp } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { StaggerChildren, staggerItem, motion } from "@/components/motion";

const beneficios = [
  {
    icon: Clock,
    title: "Resposta imediata, 24/7",
    description:
      "Nenhum lead espera. O agente atende no instante do primeiro contato, a qualquer hora, e nenhuma oportunidade esfria por falta de resposta.",
  },
  {
    icon: ClipboardList,
    title: "Vendedor sempre no contexto",
    description:
      "O time recebe um resumo completo da demanda e dos dados do lead — sem retrabalho, sem perguntar de novo o que o cliente já respondeu.",
  },
  {
    icon: TrendingUp,
    title: "Processo comercial organizado",
    description:
      "A qualificação vira uma etapa padronizada e previsível. Seu funil fica limpo e seus vendedores focam em quem está pronto para comprar.",
  },
];

export default function AssistenteBeneficios() {
  return (
    <section className="py-28 bg-[#0A0A0A] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <Badge className="mb-4">Benefícios</Badge>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#F5F5F5] leading-tight tracking-tight">
              Por que adotar o Assistente
            </h2>
          </div>
          <p className="font-body font-light text-[#A3A3A3] max-w-md leading-relaxed text-sm md:text-right">
            Mais do que atender, o agente organiza a porta de entrada do seu comercial e entrega
            leads prontos para o time avançar.
          </p>
        </div>

        <StaggerChildren className="grid md:grid-cols-3 gap-px bg-[#2A2A2A]" staggerDelay={0.1}>
          {beneficios.map((b) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                variants={staggerItem}
                className="bg-[#0A0A0A] p-8 group hover:bg-[#141414] transition-colors duration-300"
              >
                <div className="w-10 h-10 border border-[#2A2A2A] flex items-center justify-center mb-6 group-hover:border-[#2563EB] group-hover:text-[#2563EB] text-[#A3A3A3] transition-colors">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="font-display font-semibold text-xl text-[#F5F5F5] mb-3 tracking-tight">
                  {b.title}
                </h3>
                <p className="font-body font-light text-[#A3A3A3] text-sm leading-relaxed">
                  {b.description}
                </p>
              </motion.div>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
