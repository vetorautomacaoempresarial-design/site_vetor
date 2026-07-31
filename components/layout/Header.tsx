"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Menu, X, ChevronDown } from "lucide-react";
import { PRODUCT_LIST } from "@/lib/plans";
import type { HeaderContent } from "@/lib/content/types";

// Os hrefs (links funcionais) ficam no código; só os textos vêm do CMS.
const NAV_HREFS = {
  navPersonalizadas: "/automacoes-personalizadas",
} as const;

// Produtos com página própria (hoje os dois têm).
const PRODUTOS_ASSINATURA = PRODUCT_LIST.filter((p) => p.href !== null);

export default function Header({ content }: { content: HeaderContent }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [produtosOpen, setProdutosOpen] = useState(false);

  // O menu "Produtos" lista os dois produtos de assinatura e, por último,
  // as automações personalizadas — que não são assinatura, mas são o terceiro
  // caminho de entrada do cliente (por isso o rótulo vem do CMS).
  const produtosMenu = [
    ...PRODUTOS_ASSINATURA.map((p) => ({
      key: p.id,
      label: p.name,
      tagline: p.tagline,
      href: p.href!,
    })),
    {
      key: "personalizadas",
      label: content.navPersonalizadas,
      tagline: "Projetos sob medida, a partir do diagnóstico do seu processo.",
      href: NAV_HREFS.navPersonalizadas,
    },
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
      {/* Marca e menu colados na borda esquerda; ações na borda direita. */}
      <div className="w-full px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <Image
              src="/brand/logo-branco.png"
              alt="Vetor Automação"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-display font-700 text-[15px] tracking-widest uppercase text-[#F5F5F5] group-hover:text-white transition-colors">
              {content.brand}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {/* Produtos: menu, porque agora existe mais de uma página de produto. */}
            <div
              className="relative"
              onMouseEnter={() => setProdutosOpen(true)}
              onMouseLeave={() => setProdutosOpen(false)}
            >
              <button
                type="button"
                onClick={() => setProdutosOpen((v) => !v)}
                aria-expanded={produtosOpen}
                aria-haspopup="true"
                className="flex items-center gap-1.5 font-display text-[16px] text-[#A3A3A3] hover:text-white transition-colors tracking-wide"
              >
                {content.navProdutos}
                <ChevronDown
                  size={14}
                  className={cn("transition-transform", produtosOpen && "rotate-180")}
                />
              </button>
  
              {produtosOpen && (
                <div className="absolute left-0 top-full pt-3 w-72">
                  <div className="bg-[#0A0A0A] border border-[#2A2A2A] divide-y divide-[#2A2A2A] shadow-xl">
                    {produtosMenu.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        onClick={() => setProdutosOpen(false)}
                        className="block px-5 py-4 hover:bg-[#141414] transition-colors group/item"
                      >
                        <p className="font-display font-semibold text-[15px] text-[#F5F5F5] group-hover/item:text-[#4A6CF7] transition-colors">
                          {item.label}
                        </p>
                        <p className="font-body font-light text-xs text-[#737373] leading-relaxed mt-1">
                          {item.tagline}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-5">
          <Link
            href="/conta"
            className="font-display text-[16px] text-[#A3A3A3] hover:text-white transition-colors tracking-wide"
          >
            {content.areaCliente}
          </Link>
          <a
            href="#contato"
            className="font-display text-[16px] font-semibold tracking-wide px-5 py-2 bg-[#4A6CF7] text-white hover:bg-[#6D8AFF] transition-colors"
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
          {/* No mobile os produtos ficam sempre visíveis, sem dropdown. */}
          <div className="flex flex-col gap-3">
            <p className="font-display text-[11px] tracking-widest uppercase text-[#525252]">
              {content.navProdutos}
            </p>
            {produtosMenu.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="font-display text-[16px] text-[#A3A3A3] hover:text-white transition-colors pl-3 border-l border-[#2A2A2A]"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link
            href="/conta"
            className="font-display text-base text-[#A3A3A3] hover:text-white transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            {content.areaCliente}
          </Link>
          <a
            href="#contato"
            className="font-display text-[16px] font-semibold tracking-wide px-5 py-3 bg-[#4A6CF7] text-white text-center hover:bg-[#6D8AFF] transition-colors mt-2"
            onClick={() => setMenuOpen(false)}
          >
            {content.cta}
          </a>
        </div>
      )}
    </header>
  );
}
