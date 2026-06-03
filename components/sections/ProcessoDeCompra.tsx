"use client";
import { MessageCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { StaggerChildren, staggerItem, motion } from "@/components/motion";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5554991776175";

const steps = [
  {
    number: "01",
    title: "Escolha e adquira o plano",
    description:
      "Selecione o plano que faz mais sentido para o seu negócio e finalize a compra pelo Mercado Pago.",
  },
  {
    number: "02",
    title: "Entre em contato pelo WhatsApp",
    description:
      "Após o pagamento, acesse o WhatsApp da Vetor informando qual plano você adquiriu. Nossa equipe estará pronta para iniciar a implementação.",
  },
  {
    number: "03",
    title: "Treinamos o agente para você",
    description:
      "Coletamos as informações do seu negócio — produtos, serviços, tom de voz, diferenciais — e treinamos o agente de acordo com a realidade da sua empresa.",
  },
];

const planos = [
  {
    label: "Adquiri o plano Mensal",
    msg: "Olá! Adquiri o plano Mensal do Assistente de Vendas! Qual é o próximo passo para a implementação?",
  },
  {
    label: "Adquiri o plano Trimestral",
    msg: "Olá! Adquiri o plano Trimestral do Assistente de Vendas! Qual é o próximo passo para a implementação?",
  },
  {
    label: "Adquiri o plano Anual",
    msg: "Olá! Adquiri o plano Anual do Assistente de Vendas! Qual é o próximo passo para a implementação?",
  },
];

export default function ProcessoDeCompra() {
  return (
    <section className="py-28 bg-[#141414] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <Badge className="mb-4">Processo de compra</Badge>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#F5F5F5] leading-tight tracking-tight max-w-xl">
            Do pagamento à implementação em 3 passos
          </h2>
        </div>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0" staggerDelay={0.12}>
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

        <div className="mt-16 p-10 border border-[#2A2A2A] bg-[#0A0A0A]">
          <p className="font-display font-semibold text-lg text-[#F5F5F5] mb-2">
            Já adquiriu o seu plano?
          </p>
          <p className="font-body font-light text-sm text-[#A3A3A3] mb-8">
            Clique no botão correspondente ao seu plano para iniciar a implementação.
          </p>
          <div className="flex flex-wrap gap-3">
            {planos.map((p) => (
              <a
                key={p.label}
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(p.msg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-display text-sm font-semibold tracking-wide px-5 py-3 bg-[#25D366] text-white hover:bg-[#22C35E] transition-colors"
              >
                <MessageCircle size={16} />
                {p.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
