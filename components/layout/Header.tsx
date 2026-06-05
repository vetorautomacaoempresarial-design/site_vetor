"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Menu, X } from "lucide-react";
import type { HeaderContent } from "@/lib/content/types";

// Os hrefs (links funcionais) ficam no código; só os textos vêm do CMS.
const NAV_HREFS = {
  navServicos: "/#servicos",
  navComoFunciona: "/#como-funciona",
  navProdutos: "/assistente-de-vendas",
  navDuvidas: "/#faq",
} as const;

export default function Header({ content }: { content: HeaderContent }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: content.navServicos, href: NAV_HREFS.navServicos },
    { label: content.navComoFunciona, href: NAV_HREFS.navComoFunciona },
    { label: content.navProdutos, href: NAV_HREFS.navProdutos },
    { label: content.navDuvidas, href: NAV_HREFS.navDuvidas },
  ];

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
          <span className="font-display font-700 text-[13px] tracking-widest uppercase text-[#F5F5F5] group-hover:text-white transition-colors">
            {content.brand}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-[14px] text-[#A3A3A3] hover:text-white transition-colors tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/conta"
            className="font-display text-[14px] text-[#A3A3A3] hover:text-white transition-colors tracking-wide"
          >
            {content.areaCliente}
          </Link>
          <a
            href="#contato"
            className="font-display text-[14px] font-semibold tracking-wide px-5 py-2 bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-colors"
          >
            {content.cta}
          </a>
        </div>

        <button
          className="md:hidden text-[#A3A3A3] hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-t border-[#2A2A2A] px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-[15px] text-[#A3A3A3] hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/conta"
            className="font-display text-base text-[#A3A3A3] hover:text-white transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {content.areaCliente}
          </Link>
          <a
            href="#contato"
            className="font-display text-[14px] font-semibold tracking-wide px-5 py-3 bg-[#2563EB] text-white text-center hover:bg-[#3B82F6] transition-colors mt-2"
            onClick={() => setMenuOpen(false)}
          >
            {content.cta}
          </a>
        </div>
      )}
    </header>
  );
}
