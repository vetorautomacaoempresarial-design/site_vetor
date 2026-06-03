import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SECTION_LABELS } from "@/lib/content/defaults";

export default function AdminHomePage() {
  // Agrupa as seções por área (Home, Assistente de Vendas, Geral).
  const groups = new Map<string, { key: string; label: string }[]>();
  for (const [key, { group, label }] of Object.entries(SECTION_LABELS)) {
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push({ key, label });
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display font-bold text-3xl tracking-tight mb-2">Editar textos do site</h1>
        <p className="font-body text-sm text-[#A3A3A3] max-w-xl leading-relaxed">
          Escolha uma seção para editar. Ao salvar, as mudanças vão ao ar em segundos — sem
          precisar mexer no servidor.
        </p>
      </div>

      {[...groups.entries()].map(([group, sections]) => (
        <div key={group}>
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-[#737373] mb-3">
            {group}
          </p>
          <div className="border border-[#2A2A2A] divide-y divide-[#2A2A2A]">
            {sections.map((s) => (
              <Link
                key={s.key}
                href={`/admin/${s.key}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-[#141414] transition-colors group"
              >
                <span className="font-display text-sm text-[#F5F5F5]">{s.label}</span>
                <ChevronRight size={16} className="text-[#525252] group-hover:text-[#2563EB] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
