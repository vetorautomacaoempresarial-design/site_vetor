"use client";
import { Shield, Zap, Lock, RefreshCw } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { FadeInUp, StaggerChildren, staggerItem, motion } from "@/components/motion";

const diferenciais = [
  {
    icon: Zap,
    title: "LLMs de última geração",
    description: "Acesso aos modelos mais avançados do mercado.",
  },
  {
    icon: Shield,
    title: "Segurança enterprise",
    description: "Dados processados em infraestrutura segura, conformidade com LGPD e auditoria completa de todas as operações.",
  },
  {
    icon: Lock,
    title: "Conformidade LGPD",
    description: "Nossa preocupação com a segurança dos seus dados é genuína.",
  },
  {
    icon: RefreshCw,
    title: "Evolução contínua",
    description: "Nossa equipe está sempre atualizada com as novidades do mercado. Sua automação em evolução e aprimoramento constantes.",
  },
];

export default function Diferenciais() {
  return (
    <section className="py-28 bg-[#141414] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <FadeInUp>
            <Badge className="mb-4">Por que a Vetor</Badge>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#F5F5F5] leading-tight tracking-tight mb-6">
              Tecnologia séria,
              <br />
              resultado mensurável.
            </h2>
            <p className="font-body font-light text-[#A3A3A3] leading-relaxed text-sm max-w-md">
              Não vendemos promessa de IA. Entregamos automação que funciona em produção,
              com monitoramento e responsabilidade pelo resultado.
            </p>
          </FadeInUp>

          <StaggerChildren className="grid sm:grid-cols-2 gap-px bg-[#2A2A2A]" staggerDelay={0.08}>
            {diferenciais.map((d) => {
              const Icon = d.icon;
              return (
                <motion.div
                  key={d.title}
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
