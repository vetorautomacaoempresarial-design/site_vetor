import Link from "next/link";
import { Mail } from "lucide-react";
import Wave from "@/components/ui/Wave";
import VMark from "@/components/ui/VMark";
import { cn } from "@/lib/cn";
import { THEMES, type SectionTheme } from "@/lib/section-theme";
import { getSiteContent } from "@/lib/content";

function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const nav = [
  { label: "O que entregamos", href: "/#solucoes" },
  { label: "Vetor Chat", href: "/vetor-chat" },
  { label: "Vetor Sales", href: "/vetor-sales" },
  { label: "Automações personalizadas", href: "/automacoes-personalizadas" },
  { label: "Dúvidas", href: "/#faq" },
  { label: "Contato", href: "/#contato" },
  { label: "Área do cliente", href: "/conta" },
];

/**
 * Cor do texto do rodapé. "marca" segue o tema da seção (azul no fundo claro);
 * "preto" força o texto em preto, para quando o azul compete com o conteúdo da
 * página. Só faz sentido em fundo claro.
 */
type FooterTone = "marca" | "preto";

const PRETO = {
  title: "text-[#0A0A0A]",
  body: "text-[#0A0A0A]/75",
  muted: "text-[#0A0A0A]/55",
  border: "border-[#0A0A0A]/15",
};

export default async function Footer({
  theme = "branco",
  tone = "marca",
}: {
  theme?: SectionTheme;
  tone?: FooterTone;
}) {
  const { footer } = await getSiteContent();
  const base = THEMES[theme];
  // Só as cores de texto mudam com o tom; o fundo e a onda seguem o tema.
  const t = tone === "preto" ? { ...base, ...PRETO } : base;
  // O logo tem duas versões só: branca em fundo colorido, preta em fundo claro.
  const logoVariant = theme === "azul" ? "branco" : "preto";

  return (
    <footer className="relative" style={{ backgroundColor: t.bg }}>
      <Wave fill={t.bg} position="top" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Marca */}
          <div>
            <Link href="/" className={cn("flex items-center gap-3 mb-4", t.title)}>
              <VMark size={34} variant={logoVariant} />
              <span className="font-display font-semibold text-sm tracking-widest uppercase">
                VETOR AUTOMAÇÃO
              </span>
            </Link>
            <p className={cn("font-body font-light text-xs leading-relaxed max-w-xs", t.body)}>
              {footer.description}
            </p>
            <p className={cn("font-display text-xs tracking-widest uppercase mt-4", t.muted)}>
              Inteligência Artificial · Automação de Processos
            </p>
          </div>

          {/* Navegação */}
          <div>
            <p
              className={cn(
                "font-display text-xs font-semibold tracking-widest uppercase mb-5",
                t.muted
              )}
            >
              Navegação
            </p>
            <ul className="flex flex-col gap-3">
              {nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "font-body text-sm opacity-85 hover:opacity-100 transition-opacity",
                      t.title
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <p
              className={cn(
                "font-display text-xs font-semibold tracking-widest uppercase mb-5",
                t.muted
              )}
            >
              Contato
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${footer.email}`}
                className={cn(
                  "flex items-center gap-2 font-body text-sm opacity-85 hover:opacity-100 transition-opacity",
                  t.title
                )}
              >
                <Mail size={17} />
                {footer.email}
              </a>
            </div>
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.instagram.com/vetor_ai/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-9 h-9 border flex items-center justify-center opacity-75 hover:opacity-100 transition-opacity",
                  t.border,
                  t.title
                )}
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "pt-8 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3",
            t.border
          )}
        >
          <p className={cn("font-body text-xs", t.muted)}>
            © {new Date().getFullYear()} Vetor Automação. Todos os direitos reservados.
          </p>
          <p className={cn("font-body text-xs", t.muted)}>{footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
