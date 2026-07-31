"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { AssistenteHero as AssistenteHeroContent } from "@/lib/content/types";

const ease = [0.25, 0.46, 0.45, 0.94] as const;
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5554991776175";

/** Hero das páginas de produto (Vetor Sales, Vetor Chat). */
export default function ProdutoHero({
  content,
  whatsappMessage,
  primaryHref = "#planos",
}: {
  content: AssistenteHeroContent;
  /** Mensagem pré-preenchida do botão de WhatsApp. Varia por produto. */
  whatsappMessage: string;
  /** Destino do botão principal. Páginas sem planos apontam para outra âncora. */
  primaryHref?: string;
}) {
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[55vw] max-w-[700px] opacity-[0.11] pointer-events-none select-none">
        <Image src="/brand/logo-branco.png" alt="" width={700} height={700} className="w-full object-contain" priority />
      </div>
      {/* Véu leve e parelho: mantém o texto legível sem apagar a marca d'água */}
      <div className="absolute inset-0 bg-[#0A0A0A]/35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none" />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4A6CF7] to-transparent origin-left"
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <span className="w-6 h-px bg-[#4A6CF7]" />
            <span className="font-display text-xs font-semibold tracking-[0.2em] uppercase text-[#4A6CF7]">
              {content.tag}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-[#F5F5F5] leading-[1.05] tracking-tight mb-6"
          >
            {content.headline.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                <span className={line.accent ? "text-[#4A6CF7]" : undefined}>{line.text}</span>
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease }}
            className="font-body font-light text-lg text-[#A3A3A3] leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            {content.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href={primaryHref}
              className="inline-flex items-center gap-2 font-display text-sm font-semibold tracking-wide px-7 py-3.5 bg-[#4A6CF7] text-white hover:bg-[#6D8AFF] transition-colors group"
            >
              {content.ctaPrimary}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-display text-sm font-semibold tracking-wide px-7 py-3.5 border border-[#2A2A2A] text-[#A3A3A3] hover:text-white hover:border-[#525252] transition-colors"
            >
              <MessageCircle size={18} />
              {content.ctaSecondary}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
