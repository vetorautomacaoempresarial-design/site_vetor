"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Serviços", href: "#servicos" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#2A2A2A]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/brand/logo.png"
            alt="Vetor Automação"
            width={32}
            height={32}
            className="object-contain brightness-0 invert"
          />
          <span className="font-display font-700 text-sm tracking-widest uppercase text-[#F5F5F5] group-hover:text-white transition-colors">
            VETOR AUTOMAÇÃO
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display text-sm text-[#A3A3A3] hover:text-white transition-colors tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="#contato"
            className="font-display text-sm font-semibold tracking-wide px-5 py-2 bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-colors"
          >
            Agendar Demo
          </a>
        </div>

        <button
          className="md:hidden text-[#A3A3A3] hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-t border-[#2A2A2A] px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display text-base text-[#A3A3A3] hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contato"
            className="font-display text-sm font-semibold tracking-wide px-5 py-3 bg-[#2563EB] text-white text-center hover:bg-[#3B82F6] transition-colors mt-2"
            onClick={() => setMenuOpen(false)}
          >
            Agendar Demo
          </a>
        </div>
      )}
    </header>
  );
}
