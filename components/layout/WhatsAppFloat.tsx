"use client";
import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5554991776175";
  const message = encodeURIComponent(
    "Olá! Vim pelo site da Vetor Automação e gostaria de saber mais sobre automação de processos com IA."
  );
  const href = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 shadow-lg hover:bg-[#22C35E] transition-all duration-200 hover:scale-105 group"
    >
      <MessageCircle size={20} className="shrink-0" />
      <span className="font-display text-sm font-semibold tracking-wide hidden sm:block">
        WhatsApp
      </span>
    </a>
  );
}
