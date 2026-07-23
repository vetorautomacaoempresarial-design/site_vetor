"use client";
import { useEffect, useRef, useState } from "react";
import { CheckCircle, AlertCircle, Loader2, MessageCircle } from "lucide-react";

// Config pública do app da Meta (não são segredos — App ID e Config ID
// aparecem no navegador por definição do Embedded Signup).
const APP_ID = process.env.NEXT_PUBLIC_META_APP_ID;
const CONFIG_ID = process.env.NEXT_PUBLIC_META_CONFIG_ID;
const GRAPH_VERSION = process.env.NEXT_PUBLIC_META_GRAPH_VERSION ?? "v25.0";

type ConexaoWhatsApp = {
  waba_id: string;
  phone_number_id: string | null;
  display_phone_number: string | null;
  verified_name: string | null;
  status: string | null;
  onboarded_at: string | null;
};

// Dados que o Embedded Signup entrega via postMessage no evento FINISH.
type SignupData = {
  phone_number_id?: string;
  waba_id?: string;
  business_id?: string;
};

type FBLoginResponse = {
  authResponse?: { code?: string } | null;
  status?: string;
};

declare global {
  interface Window {
    FB?: {
      init: (params: Record<string, unknown>) => void;
      login: (
        cb: (response: FBLoginResponse) => void,
        opts: Record<string, unknown>
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}

type Status = "idle" | "aguardando" | "enviando" | "ok" | "erro";

export default function ConectarWhatsApp({
  conexao,
}: {
  conexao: ConexaoWhatsApp | null;
}) {
  const [sdkReady, setSdkReady] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [erro, setErro] = useState<string | null>(null);
  // Guarda os ids que chegam pelo postMessage até o callback do FB.login juntar
  // tudo (code + ids) e mandar pro backend.
  const signupData = useRef<SignupData | null>(null);

  const configOk = Boolean(APP_ID && CONFIG_ID);

  // Ouve o postMessage do Embedded Signup (traz waba_id / phone_number_id).
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (typeof event.data !== "string") return;
      if (!event.origin.endsWith("facebook.com")) return;
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type !== "WA_EMBEDDED_SIGNUP") return;
        // Loga o objeto cru: os campos exatos podem mudar entre versões da Meta.
        console.log("[EmbeddedSignup] evento cru:", parsed);
        if (parsed.event === "FINISH" || parsed.event === "FINISH_ONLY_WABA") {
          signupData.current = (parsed.data as SignupData) ?? null;
        }
      } catch {
        // O Facebook manda outras mensagens não-JSON nesse canal — ignorar.
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Carrega o JS SDK do Facebook e inicializa com o App ID.
  useEffect(() => {
    if (!configOk) return;
    if (window.FB) {
      setSdkReady(true);
      return;
    }
    window.fbAsyncInit = function () {
      window.FB!.init({
        appId: APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: GRAPH_VERSION,
      });
      setSdkReady(true);
    };
    if (document.getElementById("facebook-jssdk")) return;
    const js = document.createElement("script");
    js.id = "facebook-jssdk";
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    js.async = true;
    js.defer = true;
    js.crossOrigin = "anonymous";
    document.body.appendChild(js);
  }, [configOk]);

  function abrirSignup() {
    if (!window.FB || !CONFIG_ID) return;
    setErro(null);
    setStatus("aguardando");
    signupData.current = null;

    window.FB.login(
      async (response: FBLoginResponse) => {
        const code = response?.authResponse?.code;
        if (!code) {
          // Cliente fechou/cancelou sem concluir.
          setStatus("idle");
          return;
        }
        const dados = signupData.current;
        setStatus("enviando");
        try {
          const res = await fetch("/api/conta/whatsapp/conectar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              code,
              waba_id: dados?.waba_id ?? null,
              phone_number_id: dados?.phone_number_id ?? null,
              business_id: dados?.business_id ?? null,
            }),
          });
          const json = await res.json().catch(() => ({}));
          if (!res.ok) {
            setErro(json.error ?? "Não foi possível concluir a conexão. Tente novamente.");
            setStatus("erro");
            return;
          }
          setStatus("ok");
        } catch {
          setErro("Falha de conexão ao enviar os dados. Tente novamente.");
          setStatus("erro");
        }
      },
      {
        config_id: CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        extras: { setup: {} },
      }
    );
  }

  // Já conectado (linha em meta_clientes) e sem uma nova conexão em andamento.
  if (conexao && status !== "ok") {
    return (
      <section className="border border-[#22C35E]/30 bg-[#22C35E]/5 p-8">
        <div className="flex items-start gap-3">
          <CheckCircle size={22} className="text-[#22C35E] mt-0.5 shrink-0" />
          <div>
            <h3 className="font-display font-semibold text-base text-[#F5F5F5] mb-1">
              WhatsApp conectado
            </h3>
            <p className="font-body text-sm text-[#A3A3A3] leading-relaxed">
              {conexao.verified_name ? `${conexao.verified_name} · ` : ""}
              {conexao.display_phone_number ?? "número conectado"}. Seu Assistente já
              pode atender por este número.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border border-[#2A2A2A] bg-[#141414] p-8">
      {status === "ok" ? (
        <div className="flex flex-col items-center text-center gap-3 py-4">
          <CheckCircle size={36} className="text-[#22C35E]" />
          <p className="font-body text-sm text-[#F5F5F5] leading-relaxed max-w-md">
            Conexão concluída! Estamos preparando seu número — em instantes o Assistente
            começa a atender. Você pode fechar esta página.
          </p>
        </div>
      ) : (
        <>
          <h3 className="font-display font-semibold text-lg text-[#F5F5F5] tracking-tight mb-2">
            Conectar meu WhatsApp
          </h3>
          <p className="font-body font-light text-sm text-[#A3A3A3] leading-relaxed mb-6 max-w-2xl">
            Clique no botão abaixo para abrir o cadastro seguro da Meta. Tenha em mãos o
            acesso ao Facebook da sua empresa e o número de WhatsApp que vai usar.
          </p>

          {!configOk && (
            <div className="flex items-start gap-2 text-[#F59E0B] text-sm font-body border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-3 py-2.5 mb-5">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>
                Integração ainda não configurada (App ID / Config ID). Avise o suporte.
              </span>
            </div>
          )}

          {erro && (
            <div className="flex items-start gap-2 text-red-400 text-sm font-body border border-red-500/30 bg-red-500/5 px-3 py-2.5 mb-5">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <button
            onClick={abrirSignup}
            disabled={!configOk || !sdkReady || status === "aguardando" || status === "enviando"}
            className="inline-flex items-center justify-center gap-2 font-display text-sm font-semibold tracking-wide px-7 py-3.5 bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "enviando" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Concluindo conexão...
              </>
            ) : status === "aguardando" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Aguardando a janela da Meta...
              </>
            ) : !sdkReady && configOk ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Carregando...
              </>
            ) : (
              <>
                <MessageCircle size={16} /> Conectar meu WhatsApp
              </>
            )}
          </button>
        </>
      )}
    </section>
  );
}
