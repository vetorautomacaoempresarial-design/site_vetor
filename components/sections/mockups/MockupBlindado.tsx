import Image from "next/image";
import { BadgeCheck, Mic, Plus, ShieldCheck, Smile } from "lucide-react";

/**
 * Ilustração do Vetor Chat: um celular (proporção real de tela) com a
 * conversa em uma conta oficial verificada. É só imagem — o texto é decorativo
 * e não vem do CMS.
 */
export default function MockupBlindado() {
  return (
    // O padding de baixo reserva o espaço do selo, que fica FORA da conversa.
    <div className="relative mx-auto w-full max-w-[290px] pb-14">
      <div className="rounded-[2.6rem] bg-[#0A0A0A] p-2.5 shadow-2xl shadow-[#101a4a]/40">
        <div className="relative flex aspect-[9/18.5] flex-col overflow-hidden rounded-[2.1rem] bg-[#ECE5DD]">
          {/* Recorte da câmera (dá o formato de celular) */}
          <div className="absolute left-1/2 top-1.5 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-[#0A0A0A]" />

          {/* Topo da conversa */}
          <div className="flex items-center gap-2.5 bg-[#075E54] px-3.5 pb-3 pt-8">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Image
                src="/brand/logo-branco.png"
                alt=""
                width={36}
                height={36}
                className="h-5 w-5 object-contain"
              />
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 font-body text-[13px] font-semibold leading-tight text-white">
                Vetor Automação
                <BadgeCheck size={14} className="shrink-0 text-[#7DD3FC]" />
              </p>
              <p className="font-body text-[11px] leading-tight text-white/70">
                Conta comercial oficial
              </p>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex flex-1 flex-col justify-end gap-2 p-3">
            <div className="mx-auto mb-1 rounded-full bg-white/70 px-3 py-1 font-body text-[10px] text-[#54656F]">
              hoje
            </div>
            <div className="max-w-[82%] rounded-lg rounded-tl-none bg-white px-3 py-2 font-body text-[12px] leading-snug text-[#111B21] shadow-sm">
              Oi! Vi o anúncio de vocês. Ainda dá pra agendar essa semana?
            </div>
            <div className="ml-auto max-w-[82%] rounded-lg rounded-tr-none bg-[#D9FDD3] px-3 py-2 font-body text-[12px] leading-snug text-[#111B21] shadow-sm">
              Dá sim! Tenho quinta às 14h ou sexta às 10h. Qual fica melhor?
            </div>
            <div className="max-w-[82%] rounded-lg rounded-tl-none bg-white px-3 py-2 font-body text-[12px] leading-snug text-[#111B21] shadow-sm">
              Quinta às 14h. Obrigado!
            </div>
            <div className="ml-auto max-w-[82%] rounded-lg rounded-tr-none bg-[#D9FDD3] px-3 py-2 font-body text-[12px] leading-snug text-[#111B21] shadow-sm">
              Combinado, já está reservado.
            </div>
          </div>

          {/* Barra de digitar */}
          <div className="flex items-center gap-2 px-3 pb-4 pt-1">
            <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-2">
              <Smile size={14} className="shrink-0 text-[#8696A0]" />
              <span className="font-body text-[11px] text-[#8696A0]">Mensagem</span>
              <Plus size={14} className="ml-auto shrink-0 text-[#8696A0]" />
            </div>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#075E54]">
              <Mic size={14} className="text-white" />
            </span>
          </div>
        </div>
      </div>

      {/* Selo flutuante, abaixo do celular (não cobre nenhuma mensagem) */}
      <div className="absolute bottom-0 left-0 flex items-center gap-2.5 border border-black/5 bg-white px-4 py-3 shadow-xl shadow-[#101a4a]/20 sm:-left-10">
        <ShieldCheck size={20} className="shrink-0 text-[#4A6CF7]" />
        <div>
          <p className="font-display text-[12px] font-bold leading-tight text-[#0A0A0A]">
            Número protegido
          </p>
          <p className="font-body text-[11px] leading-tight text-[#525252]">
            API oficial da Meta
          </p>
        </div>
      </div>
    </div>
  );
}
