import { Cpu, Database, FileSpreadsheet, Mail, MessageSquare } from "lucide-react";

const entradas = [
  { Icon: MessageSquare, label: "WhatsApp" },
  { Icon: Mail, label: "E-mail" },
  { Icon: FileSpreadsheet, label: "Planilhas" },
];

const saidas = [
  { Icon: Database, label: "Seu sistema atualizado" },
  { Icon: FileSpreadsheet, label: "Relatório gerado" },
  { Icon: Mail, label: "Time avisado" },
];

/**
 * Ilustração das automações personalizadas: o que entra, o motor da automação
 * e o que sai pronto do outro lado. Texto decorativo, não vem do CMS.
 */
export default function MockupAutomacoes() {
  return (
    <div className="mx-auto w-full max-w-[420px] border border-black/5 bg-white p-6 shadow-2xl shadow-[#101a4a]/25">
      <p className="mb-5 font-display text-[11px] font-bold uppercase tracking-widest text-[#8A8A8A]">
        Fluxo desenhado para você
      </p>

      {/* Entradas */}
      <div className="flex flex-col gap-2">
        {entradas.map(({ Icon, label }) => (
          <div key={label} className="flex items-center gap-3 bg-[#F1F3F9] px-3 py-2.5">
            <Icon size={16} className="shrink-0 text-[#525252]" />
            <span className="font-body text-[12px] text-[#0A0A0A]">{label}</span>
          </div>
        ))}
      </div>

      {/* Conector */}
      <div className="mx-auto h-6 w-px bg-[#D4D9E8]" />

      {/* Motor */}
      <div className="flex items-center gap-3 bg-[#4A6CF7] px-4 py-3.5">
        <Cpu size={18} className="shrink-0 text-white" />
        <div>
          <p className="font-display text-[12px] font-bold leading-tight text-white">
            Automação Vetor
          </p>
          <p className="font-body text-[11px] leading-tight text-white/75">
            regras do seu processo, 24 horas por dia
          </p>
        </div>
      </div>

      {/* Conector */}
      <div className="mx-auto h-6 w-px bg-[#D4D9E8]" />

      {/* Saídas */}
      <div className="flex flex-col gap-2">
        {saidas.map(({ Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 border border-[#E3E7F2] px-3 py-2.5"
          >
            <Icon size={16} className="shrink-0 text-[#4A6CF7]" />
            <span className="font-body text-[12px] text-[#0A0A0A]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
