"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { FadeInUp } from "@/components/motion";
import { cn } from "@/lib/cn";

const faqs = [
  {
    question: "Quanto tempo leva para ter uma automação em produção?",
    answer:
      "Depende da complexidade. Para automações simples (atendimento, triagem), de 2 a 5 semanas. Para pipelines mais complexos com múltiplas integrações, de 8 a 12 semanas. Nossa metodologia garante que você veja valor antes da entrega final.",
  },
  {
    question: "Quanto custa um projeto de automação com IA?",
    answer:
      "Cada projeto é precificado individualmente após o diagnóstico. Temos a responsabilidade de não entregar nada aquém do que o seu processo exige, mas com consciência com relação ao seu orçamento.",
  },
  {
    question: "Preciso trocar meus sistemas atuais para automatizar?",
    answer:
      "Temos soluções também para projetos que exigem integrações com plataformas que não possuem API pública.",
  },
  {
    question: "O que acontece se a automação falhar ou tomar uma decisão errada?",
    answer:
      "Todas as automações possuem sistemas de fallback, alertas e, quando necessário, revisão humana. Monitoramos proativamente e de forma integral para garantir o sucesso da operação.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-28 bg-[#0A0A0A] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <FadeInUp>
            <Badge className="mb-4">FAQ</Badge>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#F5F5F5] leading-tight tracking-tight">
              Perguntas
              <br />
              frequentes
            </h2>
            <p className="font-body font-light text-[#A3A3A3] text-sm leading-relaxed mt-6 max-w-sm">
              Não encontrou sua resposta? Fale diretamente com a gente pelo formulário
              abaixo ou pelo WhatsApp.
            </p>
          </FadeInUp>

          <div className="flex flex-col divide-y divide-[#2A2A2A]">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-start justify-between gap-4 py-6 text-left group"
                >
                  <span
                    className={cn(
                      "font-display font-medium text-sm leading-snug tracking-tight transition-colors",
                      open === i ? "text-white" : "text-[#A3A3A3] group-hover:text-[#F5F5F5]"
                    )}
                  >
                    {faq.question}
                  </span>
                  <span className="shrink-0 mt-0.5 text-[#737373] group-hover:text-[#A3A3A3] transition-colors">
                    {open === i ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                {open === i && (
                  <div className="pb-6">
                    <p className="font-body font-light text-sm text-[#A3A3A3] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
