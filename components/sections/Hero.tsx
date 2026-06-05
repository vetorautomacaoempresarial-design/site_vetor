"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { HomeHero } from "@/lib/content/types";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function Hero({ content }: { content: HomeHero }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0A0A0A]">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Giant logo watermark */}
      <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[55vw] max-w-[700px] opacity-[0.11] pointer-events-none select-none">
        <Image
          src="/brand/logo.png"
          alt=""
          width={700}
          height={700}
          className="w-full object-contain brightness-0 invert"
          priority
        />
      </div>

      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent pointer-events-none" />

      {/* Electric accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2563EB] to-transparent origin-left"
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="w-6 h-px bg-[#2563EB]" />
            <span className="font-display text-xs font-semibold tracking-[0.2em] uppercase text-[#2563EB]">
              {content.tag}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-[#F5F5F5] leading-[1.05] tracking-tight mb-6"
          >
            {content.headline.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                <span className={line.accent ? "text-[#2563EB]" : undefined}>{line.text}</span>
              </span>
            ))}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease }}
            className="font-body font-light text-lg text-[#A3A3A3] leading-relaxed mb-10 max-w-xl"
          >
            {content.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease }}
            className="flex flex-wrap items-center gap-4"
          >
            <a
              href="#contato"
              className="inline-flex items-center gap-2 font-display text-sm font-semibold tracking-wide px-7 py-3.5 bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-colors group"
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
