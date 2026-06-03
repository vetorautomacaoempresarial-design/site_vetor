"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const links = [
  { label: "Assinatura", href: "/conta" },
  { label: "Pagamentos", href: "/conta/pagamentos" },
  { label: "Configurações", href: "/conta/configuracoes" },
];

export default function ContaNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-[#2A2A2A]">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "font-display text-sm tracking-wide px-4 py-3 -mb-px border-b-2 transition-colors",
              active
                ? "border-[#2563EB] text-white"
                : "border-transparent text-[#A3A3A3] hover:text-white"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
