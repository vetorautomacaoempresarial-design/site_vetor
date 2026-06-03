import Image from "next/image";
import Link from "next/link";
import { Globe, Mail } from "lucide-react";

const nav = [
  { label: "Serviços", href: "/#servicos" },
  { label: "Como Funciona", href: "/#como-funciona" },
  { label: "Produtos", href: "/assistente-de-vendas" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contato", href: "/#contato" },
  { label: "Área do cliente", href: "/conta" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src="/brand/logo.png" alt="Vetor Automação" width={28} height={28} className="object-contain brightness-0 invert" />
              <span className="font-display font-semibold text-sm tracking-widest uppercase text-[#F5F5F5]">
                VETOR AUTOMAÇÃO
              </span>
            </Link>
            <p className="font-body font-light text-xs text-[#737373] leading-relaxed max-w-xs">
              Automação de processos com agentes de IA.
              Diagnóstico, projeto, implantação e operação.
            </p>
            <p className="font-display text-xs text-[#2563EB] tracking-widest uppercase mt-4">
              AI · Process Automation
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="font-display text-xs font-semibold tracking-widest uppercase text-[#737373] mb-5">
              Navegação
            </p>
            <ul className="flex flex-col gap-3">
              {nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-[#A3A3A3] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-display text-xs font-semibold tracking-widest uppercase text-[#737373] mb-5">
              Contato
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:contato@vetorautomacao.io"
                className="flex items-center gap-2 font-body text-sm text-[#A3A3A3] hover:text-white transition-colors"
              >
                <Mail size={14} />
                contato@vetorautomacao.io
              </a>
            </div>
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-9 h-9 border border-[#2A2A2A] flex items-center justify-center text-[#737373] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                aria-label="LinkedIn"
              >
                <Globe size={15} />
              </a>
              <a
                href="#"
                className="w-9 h-9 border border-[#2A2A2A] flex items-center justify-center text-[#737373] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                aria-label="Instagram"
              >
                <Globe size={15} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="font-body text-xs text-[#737373]">
            © {new Date().getFullYear()} Vetor Automação. Todos os direitos reservados.
          </p>
          <p className="font-body text-xs text-[#737373]">
            Seu processo tem magnitude. Nós damos direção.
          </p>
        </div>
      </div>
    </footer>
  );
}
