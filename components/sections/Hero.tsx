"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { HomeHero } from "@/lib/content/types";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

// Ritmo do efeito de digitação do título.
const DIGITAR_MS = 55; // cada letra digitada
const APAGAR_MS = 25; // apagar é mais rápido que digitar
const PAUSA_MS = 3000; // frase inteira na tela antes de apagar
const TROCA_MS = 400; // respiro entre apagar uma frase e começar a próxima

/**
 * Frases que se revezam sob o título, como se estivessem sendo digitadas:
 * digita → segura 3s → apaga → próxima frase (em loop).
 *
 * Uma cópia invisível da frase ATUAL ocupa o mesmo espaço do grid: o bloco já
 * nasce com a altura da frase inteira, então nada abaixo dele se mexe enquanto
 * as letras aparecem. Reservar a altura da maior frase deixaria buraco nas
 * curtas — por isso a reserva acompanha a frase da vez.
 */
function FrasesDigitadas({ lines }: { lines: string[] }) {
  const [indice, setIndice] = useState(0);
  const [letras, setLetras] = useState(0);
  const [apagando, setApagando] = useState(false);
  const [semAnimacao, setSemAnimacao] = useState(false);

  // Respeita quem pediu menos animação no sistema: nada de digitação, só troca.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setSemAnimacao(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const frase = lines[indice] ?? "";

  useEffect(() => {
    if (lines.length === 0) return;

    if (semAnimacao) {
      if (lines.length === 1) return;
      const t = setTimeout(() => setIndice((i) => (i + 1) % lines.length), PAUSA_MS);
      return () => clearTimeout(t);
    }

    // Quanto esperar até o próximo passo, conforme a fase atual.
    let espera: number;
    if (!apagando) {
      if (letras < frase.length) espera = DIGITAR_MS;
      else if (lines.length === 1) return; // frase única: digita e para
      else espera = PAUSA_MS;
    } else {
      espera = letras > 0 ? APAGAR_MS : TROCA_MS;
    }

    const t = setTimeout(() => {
      if (!apagando) {
        if (letras < frase.length) setLetras(letras + 1);
        else setApagando(true);
      } else if (letras > 0) {
        setLetras(letras - 1);
      } else {
        setApagando(false);
        setIndice((i) => (i + 1) % lines.length);
      }
    }, espera);
    return () => clearTimeout(t);
  }, [letras, apagando, frase, lines.length, semAnimacao]);

  if (lines.length === 0) return null;

  return (
    // `min-w-0`: sem isso um item de grid nunca encolhe abaixo da maior palavra
    // e uma frase longa demais empurraria o título para fora da tela.
    <span className="grid text-[#4A6CF7]">
      <span aria-hidden className="col-start-1 row-start-1 min-w-0 invisible">
        {frase}
      </span>
      <span className="col-start-1 row-start-1 min-w-0">
        {/* Leitores de tela e buscadores leem o título completo, sem a animação. */}
        <span className="sr-only">{lines[0]}</span>
        <span aria-hidden>{semAnimacao ? frase : frase.slice(0, letras)}</span>
      </span>
    </span>
  );
}

export default function Hero({ content }: { content: HomeHero }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Marca d'água gigante do logo: fica na direita, mesmo com o texto
          centralizado (o "V" é o contraponto visual do bloco de texto). */}
      <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[55vw] max-w-[700px] opacity-[0.11] pointer-events-none select-none">
        <Image
          src="/brand/logo-branco.png"
          alt=""
          width={700}
          height={700}
          className="w-full object-contain"
          priority
        />
      </div>

      {/* Véu leve e parelho: mantém o texto legível sem apagar a marca d'água */}
      <div className="absolute inset-0 bg-[#0A0A0A]/35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none" />

      {/* Da metade da tela para baixo o preto vai clareando de leve, fazendo a
          passagem para a faixa azul da seção seguinte. */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/[0.08] pointer-events-none" />

      {/* Electric accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4A6CF7] to-transparent origin-left"
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline: primeira linha fixa, segunda se revezando "digitada" */}
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl text-[#F5F5F5] leading-[1.05] tracking-tight mb-6"
          >
            {content.headline}
            {/* Mesmo tamanho do título fixo — só muda a cor. */}
            <span className="block">
              <FrasesDigitadas lines={content.typedLines} />
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease }}
            className="font-body font-bold text-lg text-[#A3A3A3] leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            {content.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="/automacoes-personalizadas"
              className="inline-flex items-center gap-2 font-display text-sm font-semibold tracking-wide px-7 py-3.5 bg-[#4A6CF7] text-white hover:bg-[#6D8AFF] transition-colors group"
            >
              {content.ctaLabel}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
