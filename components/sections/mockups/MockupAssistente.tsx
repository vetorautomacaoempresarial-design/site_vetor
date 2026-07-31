"use client";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Building2, Mic, Plus, Smile } from "lucide-react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/**
 * Ilustração do Vetor Sales: um celular com o WhatsApp onde a conversa acontece
 * na frente de quem está olhando — as mensagens vão surgindo uma a uma, com o
 * "digitando…" entre elas, e a conversa reinicia sozinha.
 *
 * A animação só roda quando o celular está visível na tela e é desligada para
 * quem pediu menos animação no sistema (nesse caso a conversa aparece inteira).
 * Texto decorativo: não vem do CMS.
 */

type Autor = "lead" | "agente";
interface Mensagem {
  de: Autor;
  texto: string;
}

const CONVERSA: Mensagem[] = [
  { de: "lead", texto: "Oi, vi um apartamento de vocês no Instagram" },
  { de: "agente", texto: "Olá, Marcos! Tudo bem? Que bom que você chegou até a gente!" },
  { de: "agente", texto: "Você está buscando um imóvel para comprar ou para alugar?" },
  { de: "lead", texto: "comprar, vi um de 2 quartos no bairro jardim das flores" },
  { de: "agente", texto: "Legal, apartamento de 2 quartos no Jardim das Flores." },
  {
    de: "agente",
    texto:
      "Só pra eu te direcionar certinho: esse imóvel seria para morar ou é uma compra para investimento?",
  },
  { de: "lead", texto: "pra morar, com minha esposa" },
  { de: "agente", texto: "Perfeito." },
  {
    de: "agente",
    texto:
      "E você já tem uma faixa de valor em mente, ou uma condição de pagamento definida (à vista, financiamento)?",
  },
  { de: "lead", texto: "financiamento, algo até uns 450 mil" },
  { de: "agente", texto: "Show, isso ajuda bastante na busca." },
  {
    de: "agente",
    texto:
      "Uma última coisa: você já está com o processo mais adiantado (tipo, já tem aprovação de crédito) ou ainda no início, só pesquisando por enquanto?",
  },
  { de: "lead", texto: "ainda no início, mas quero ver esse apto o quanto antes se der" },
  {
    de: "agente",
    texto:
      "Entendido, Marcos! Vou te passar para um dos nossos corretores agora mesmo, que já vai te dar todos os detalhes desse apartamento e agendar uma visita com você!",
  },
];

// Ritmo da conversa (em milissegundos). Os dois tempos crescem com o tamanho do
// texto: mensagem maior demora mais para ser "digitada" e fica mais tempo na
// tela depois de aparecer, para dar tempo de ler.
const tempoDigitando = (texto: string) => Math.min(700 + texto.length * 18, 2200);
const tempoDeLeitura = (texto: string) => Math.min(700 + texto.length * 20, 2400);
const PAUSA_ANTES_DE_REINICIAR = 6000;

export default function MockupAssistente() {
  const ref = useRef<HTMLDivElement>(null);
  const visivel = useInView(ref, { margin: "-60px" });
  const menosAnimacao = useReducedMotion();

  // Quantas mensagens já apareceram e quem está digitando agora.
  const [mostradas, setMostradas] = useState(0);
  const [digitando, setDigitando] = useState<Autor | null>(null);

  useEffect(() => {
    if (menosAnimacao) {
      // Sem animação: a conversa aparece inteira, de uma vez.
      setMostradas(CONVERSA.length);
      setDigitando(null);
      return;
    }
    if (!visivel) return;

    let cancelado = false;
    let timer: ReturnType<typeof setTimeout>;
    const espera = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms);
      });

    (async () => {
      while (!cancelado) {
        setMostradas(0);
        setDigitando(null);
        await espera(700);

        for (let i = 0; i < CONVERSA.length; i++) {
          if (cancelado) return;
          const mensagem = CONVERSA[i];
          setDigitando(mensagem.de);
          await espera(tempoDigitando(mensagem.texto));
          if (cancelado) return;
          setDigitando(null);
          setMostradas(i + 1);
          await espera(tempoDeLeitura(mensagem.texto));
        }

        await espera(PAUSA_ANTES_DE_REINICIAR);
      }
    })();

    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [visivel, menosAnimacao]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[290px]">
      <div className="rounded-[2.6rem] bg-[#0A0A0A] p-2.5 shadow-2xl shadow-[#101a4a]/40">
        <div className="relative flex aspect-[9/18.5] flex-col overflow-hidden rounded-[2.1rem] bg-[#ECE5DD]">
          {/* Recorte da câmera (dá o formato de celular) */}
          <div className="absolute left-1/2 top-1.5 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-[#0A0A0A]" />

          {/* Topo da conversa */}
          <div className="relative z-10 flex items-center gap-2.5 bg-[#075E54] px-3.5 pb-3 pt-8">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Building2 size={17} className="text-white" />
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 font-body text-[13px] font-semibold leading-tight text-white">
                Imobiliária Horizonte
                <BadgeCheck size={14} className="shrink-0 text-[#7DD3FC]" />
              </p>
              <p className="font-body text-[11px] leading-tight text-white/70">
                {digitando === "agente" ? "digitando…" : "online"}
              </p>
            </div>
          </div>

          {/* Mensagens: ficam ancoradas embaixo, e as mais antigas somem por cima
              conforme a conversa cresce — igual a uma conversa de verdade. */}
          <div className="relative min-h-0 flex-1">
            <div className="absolute inset-x-0 bottom-0 flex max-h-full flex-col justify-end gap-1.5 overflow-hidden p-3">
              <div className="mx-auto mb-1 shrink-0 rounded-full bg-white/70 px-3 py-1 font-body text-[10px] text-[#54656F]">
                hoje
              </div>

              {CONVERSA.slice(0, mostradas).map((mensagem, i) => (
                <motion.div
                  key={i}
                  initial={menosAnimacao ? false : { opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={
                    mensagem.de === "agente"
                      ? "ml-auto max-w-[82%] shrink-0 rounded-lg rounded-tr-none bg-[#D9FDD3] px-3 py-2 font-body text-[12px] leading-snug text-[#111B21] shadow-sm"
                      : "max-w-[82%] shrink-0 rounded-lg rounded-tl-none bg-white px-3 py-2 font-body text-[12px] leading-snug text-[#111B21] shadow-sm"
                  }
                >
                  {mensagem.texto}
                </motion.div>
              ))}

              {digitando && (
                <div
                  className={
                    digitando === "agente"
                      ? "ml-auto flex shrink-0 items-center gap-1 rounded-lg rounded-tr-none bg-[#D9FDD3] px-3 py-2.5 shadow-sm"
                      : "flex w-fit shrink-0 items-center gap-1 rounded-lg rounded-tl-none bg-white px-3 py-2.5 shadow-sm"
                  }
                >
                  <span className="ponto-digitando h-1.5 w-1.5 rounded-full bg-[#8696A0]" />
                  <span
                    className="ponto-digitando h-1.5 w-1.5 rounded-full bg-[#8696A0]"
                    style={{ animationDelay: "0.18s" }}
                  />
                  <span
                    className="ponto-digitando h-1.5 w-1.5 rounded-full bg-[#8696A0]"
                    style={{ animationDelay: "0.36s" }}
                  />
                </div>
              )}
            </div>

            {/* Desbotamento no topo: as mensagens antigas somem em vez de
                aparecerem cortadas na metade. */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#ECE5DD] to-transparent" />
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
    </div>
  );
}
