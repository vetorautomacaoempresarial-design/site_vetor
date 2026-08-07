"use client";
import { useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  AlertCircle,
  Info,
  Loader2,
  MessageCircle,
  Unplug,
} from "lucide-react";

// Config pública do app da Meta (não são segredos — App ID e Config ID
// aparecem no navegador por definição do Embedded Signup).
const APP_ID = process.env.NEXT_PUBLIC_META_APP_ID;
const CONFIG_ID = process.env.NEXT_PUBLIC_META_CONFIG_ID;
const GRAPH_VERSION = process.env.NEXT_PUBLIC_META_GRAPH_VERSION ?? "v25.0";

const WHATSAPP_SUPORTE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5554991776175";
const EMAIL_SUPORTE = "administrativo@vetorautomacao.io";

// Pré-requisito que NÃO temos como verificar do lado do site — é estado dentro
// da Meta. Por isso fica como aviso ANTES do botão (quem já clicou não volta
// para ler) e nunca como bloqueio ou promessa de validação automática.

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

// "incompleto" = o cliente desistiu no meio do fluxo da Meta (fechou a janela,
// ou a WABA não chegou a ser criada). Não é erro nosso e precisa de uma
// mensagem própria, não do texto genérico de falha.
type Status = "idle" | "aguardando" | "enviando" | "ok" | "erro" | "incompleto";

// Eventos finais do Embedded Signup. Na rota de coexistência
// (whatsapp_business_app_onboarding) o evento final é o
// FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING — é nele que os ids chegam.
const EVENTOS_FINAIS = [
  "FINISH",
  "FINISH_ONLY_WABA",
  "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING",
];

export default function ConectarWhatsApp({
  conexao,
}: {
  conexao: ConexaoWhatsApp | null;
}) {
  const [sdkReady, setSdkReady] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [erro, setErro] = useState<string | null>(null);
  // Quando o cliente informa que o número não está mais conectado, soltamos o
  // vínculo no banco e mostramos o fluxo de conexão de novo — sem depender de
  // recarregar a página (o `conexao` recebido por prop fica obsoleto).
  const [desvinculado, setDesvinculado] = useState(false);
  const [confirmandoDesconexao, setConfirmandoDesconexao] = useState(false);
  const [desconectando, setDesconectando] = useState(false);
  // Resposta `already: true` do n8n — o número já estava conectado. É sucesso,
  // só muda a mensagem final.
  const [jaEstavaConectado, setJaEstavaConectado] = useState(false);
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
        if (EVENTOS_FINAIS.includes(parsed.event)) {
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

  // Envia o code + ids capturados ao backend. Fica FORA do callback do FB.login
  // de propósito: o SDK do Facebook rejeita uma função `async` como callback
  // ("Expression is of type asyncfunction, not function"). O callback tem que
  // ser síncrono; a parte assíncrona (fetch) roda aqui.
  async function enviarConexao(code: string) {
    const dados = signupData.current;

    // Contrato com o n8n: os ids dos ativos são a PROVA de que a sessão do
    // Embedded Signup terminou. O `code` sozinho não prova nada — ele existe
    // até em sessão abandonada, e postá-lo assim só queima um código expirado
    // e dispara alerta falso na operação. Ver docs/contrato-embedded-signup-n8n.md.
    if (!dados?.waba_id || !dados?.phone_number_id) {
      console.warn(
        "[EmbeddedSignup] sessão incompleta — POST não enviado. Faltando:",
        [
          !dados?.waba_id ? "waba_id" : null,
          !dados?.phone_number_id ? "phone_number_id" : null,
        ].filter(Boolean)
      );
      setStatus("incompleto");
      return;
    }

    setStatus("enviando");
    try {
      const res = await fetch("/api/conta/whatsapp/conectar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          waba_id: dados.waba_id,
          phone_number_id: dados.phone_number_id,
          business_id: dados.business_id ?? null,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Cadastro abandonado no meio do fluxo da Meta: não é erro do sistema,
        // tem tela própria explicando o que fazer.
        if (json.motivo === "cadastro_incompleto") {
          setStatus("incompleto");
          return;
        }
        setErro(json.error ?? "Não foi possível concluir a conexão. Tente novamente.");
        setStatus("erro");
        return;
      }
      // 200 com `already` / `reconectado` também é sucesso — só muda o texto.
      setJaEstavaConectado(Boolean(json.already));
      setStatus("ok");
    } catch {
      setErro("Falha de conexão ao enviar os dados. Tente novamente.");
      setStatus("erro");
    }
  }

  async function desconectar() {
    setErro(null);
    setDesconectando(true);
    try {
      const res = await fetch("/api/conta/whatsapp/desconectar", { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErro(json.error ?? "Não foi possível concluir. Tente novamente.");
        return;
      }
      setConfirmandoDesconexao(false);
      setDesvinculado(true);
      setStatus("idle");
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setDesconectando(false);
    }
  }

  function abrirSignup() {
    if (!window.FB || !CONFIG_ID) return;
    setErro(null);
    setJaEstavaConectado(false);
    setStatus("aguardando");
    // Sessão nova = código novo. Limpar o estado antigo evita misturar dados de
    // duas sessões (o `code` é de uso único e vida curta).
    signupData.current = null;

    window.FB.login(
      (response: FBLoginResponse) => {
        const code = response?.authResponse?.code;
        if (!code) {
          // Cliente fechou/cancelou sem concluir — hoje isso deixava a tela
          // sem retorno nenhum. Mostra o aviso de cadastro não concluído.
          setStatus("incompleto");
          return;
        }
        void enviarConexao(code);
      },
      {
        config_id: CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        // Coexistência: onboarding de um número que JÁ está no WhatsApp Business
        // App (mantém o app no celular + Cloud API no mesmo número, com histórico).
        // featureType 'whatsapp_business_app_onboarding' — o valor antigo
        // 'coexistence' foi descontinuado pela Meta.
        extras: { setup: {}, featureType: "whatsapp_business_app_onboarding" },
      }
    );
  }

  // Já conectado (linha em meta_clientes), sem nova conexão em andamento e sem
  // o cliente ter informado que o número caiu.
  if (conexao && status !== "ok" && !desvinculado) {
    return (
      <section className="border border-[#22C35E]/30 bg-[#22C35E]/5 p-8">
        <div className="flex items-start gap-3">
          <CheckCircle size={22} className="text-[#22C35E] mt-0.5 shrink-0" />
          <div className="flex-1">
            <h3 className="font-display font-semibold text-base text-[#F5F5F5] mb-1">
              WhatsApp conectado
            </h3>
            <p className="font-body text-sm text-[#A3A3A3] leading-relaxed">
              {conexao.verified_name ? `${conexao.verified_name} · ` : ""}
              {conexao.display_phone_number ?? "número conectado"}. Este número já opera
              pela infraestrutura oficial da Meta.
            </p>

            {erro && (
              <div className="flex items-start gap-2 text-red-400 text-sm font-body border border-red-500/30 bg-red-500/5 px-3 py-2.5 mt-5">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{erro}</span>
              </div>
            )}

            {confirmandoDesconexao ? (
              <div className="mt-6 border-t border-[#22C35E]/20 pt-5">
                <p className="font-body text-sm text-[#D4D4D4] leading-relaxed mb-4">
                  Vamos remover este número da sua conta e avisar nossa equipe. Você
                  poderá conectar novamente em seguida, pelo cadastro da Meta.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={desconectar}
                    disabled={desconectando}
                    className="inline-flex items-center justify-center gap-2 font-display text-sm font-semibold tracking-wide px-6 py-3 border border-[#F59E0B] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-[#0A0A0A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {desconectando ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Removendo...
                      </>
                    ) : (
                      "Confirmar"
                    )}
                  </button>
                  <button
                    onClick={() => setConfirmandoDesconexao(false)}
                    disabled={desconectando}
                    className="font-display text-sm text-[#A3A3A3] hover:text-white transition-colors px-2 disabled:opacity-50"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setErro(null);
                  setConfirmandoDesconexao(true);
                }}
                className="mt-6 inline-flex items-center gap-2 font-display text-sm text-[#737373] hover:text-[#F59E0B] transition-colors"
              >
                <Unplug size={15} />
                Meu WhatsApp não está mais conectado
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (status === "ok") {
    return (
      <section className="border border-[#22C35E]/30 bg-[#22C35E]/5 p-8">
        <div className="flex flex-col items-center text-center gap-3 py-4">
          <CheckCircle size={36} className="text-[#22C35E]" />
          <h3 className="font-display font-semibold text-base text-[#F5F5F5]">
            {jaEstavaConectado
              ? "Este WhatsApp já estava conectado"
              : "Conexão concluída!"}
          </h3>
          <p className="font-body text-sm text-[#A3A3A3] leading-relaxed max-w-md">
            {jaEstavaConectado
              ? "Seu número já está ativo na nossa plataforma. Não precisa fazer mais nada aqui."
              : "Você vai receber um e-mail com seu acesso em poucos minutos. Não precisa fazer mais nada aqui."}
          </p>
          <p className="font-body font-light text-xs text-[#737373] leading-relaxed">
            <LinhaSuporte prefixo="Não recebeu o e-mail ou ficou com dúvida?" />
          </p>
        </div>
      </section>
    );
  }

  if (status === "enviando") {
    return (
      <section className="border border-[#2A2A2A] bg-[#141414] p-8">
        <div className="flex flex-col items-center text-center gap-3 py-4">
          <Loader2 size={34} className="animate-spin text-[#4A6CF7]" />
          <h3 className="font-display font-semibold text-base text-[#F5F5F5]">
            Estamos processando sua conexão
          </h3>
          <p className="font-body text-sm text-[#A3A3A3] leading-relaxed max-w-md">
            Isso leva alguns segundos. Não feche nem atualize esta página. Quando
            terminar, você recebe um e-mail com seu acesso.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border border-[#2A2A2A] bg-[#141414] p-8">
      {desvinculado && (
        <div className="flex items-start gap-2 text-[#A3A3A3] text-sm font-body border border-[#2A2A2A] bg-[#0A0A0A] px-3 py-2.5 mb-6">
          <CheckCircle size={16} className="mt-0.5 shrink-0 text-[#22C35E]" />
          <span>
            Número removido da sua conta e equipe avisada. Você pode conectar de novo
            abaixo quando quiser.
          </span>
        </div>
      )}

      {status === "incompleto" && (
        <div className="flex items-start gap-2.5 border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-3 py-2.5 mb-6">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-[#F59E0B]" />
          <p className="font-body text-sm text-[#D4D4D4] leading-relaxed">
            <strong className="font-medium text-[#F59E0B]">
              O cadastro não foi concluído na Meta.
            </strong>{" "}
            O cadastro precisa ser levado até o fim, com a Conta do WhatsApp Business
            criada. Nada mudou na sua conta — pode tentar de novo.{" "}
            <LinhaSuporte prefixo="Se já tentou mais de uma vez," />
          </p>
        </div>
      )}

      <h2 className="font-display font-semibold text-lg text-[#F5F5F5] tracking-tight">
        Conectar seu número
      </h2>
      <p className="font-body text-sm text-[#737373] mt-1">
        Cadastro oficial da Meta, em menos de dois minutos. Sua senha não passa pela
        Vetor.
      </p>

      {!configOk && (
        <div className="flex items-start gap-2 text-[#F59E0B] text-sm font-body border border-[#F59E0B]/30 bg-[#F59E0B]/5 px-3 py-2.5 mt-6">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>
            Integração ainda não configurada (App ID / Config ID). Avise o suporte.
          </span>
        </div>
      )}

      {erro && (
        <div className="flex items-start gap-2 text-red-400 text-sm font-body border border-red-500/30 bg-red-500/5 px-3 py-2.5 mt-6">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{erro}</span>
        </div>
      )}

      {/* Pré-requisito ANTES do botão: quem já clicou não volta para ler. */}
      <div className="flex items-start gap-2.5 border border-[#2A2A2A] bg-[#0A0A0A] px-4 py-3.5 mt-6 mb-7 max-w-2xl">
        <Info size={16} className="mt-0.5 shrink-0 text-[#4A6CF7]" />
        <p className="font-body font-light text-sm text-[#A3A3A3] leading-relaxed">
          <strong className="font-medium text-[#F5F5F5]">
            Seu número precisa estar no app WhatsApp Business
          </strong>
          , não o WhatsApp comum. Se ainda estiver no comum, migre por lá antes, suas
          conversas são preservadas.
        </p>
      </div>

      <button
        onClick={abrirSignup}
        disabled={!configOk || !sdkReady || status === "aguardando"}
        className="inline-flex items-center justify-center gap-2 font-display text-sm font-semibold tracking-wide px-7 py-3.5 bg-[#4A6CF7] text-white hover:bg-[#6D8AFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "aguardando" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Aguardando a janela da Meta...
          </>
        ) : !sdkReady && configOk ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Carregando...
          </>
        ) : status === "incompleto" || status === "erro" ? (
          <>
            <MessageCircle size={16} /> Tentar novamente
          </>
        ) : (
          <>
            <MessageCircle size={16} /> Conectar meu WhatsApp
          </>
        )}
      </button>

      <p className="font-body font-light text-xs text-[#737373] leading-relaxed mt-3">
        Deu tudo certo? Você recebe um e-mail com seu acesso em poucos minutos.
      </p>
    </section>
  );
}

// Caminho de contato — aparece sempre que o cliente pode ficar sem saber o que
// fazer (cadastro não concluído, e-mail que não chegou).
function LinhaSuporte({ prefixo }: { prefixo: string }) {
  // Sem tamanho de fonte próprio: herda do bloco onde é usada.
  return (
    <>
      {prefixo}{" "}
      <a
        href={`https://wa.me/${WHATSAPP_SUPORTE}?text=${encodeURIComponent(
          "Olá! Preciso de ajuda para conectar meu WhatsApp na área do cliente."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#A3A3A3] underline underline-offset-2 hover:text-white transition-colors"
      >
        fale com a gente no WhatsApp
      </a>{" "}
      ou por{" "}
      <a
        href={`mailto:${EMAIL_SUPORTE}`}
        className="text-[#A3A3A3] underline underline-offset-2 hover:text-white transition-colors"
      >
        {EMAIL_SUPORTE}
      </a>
      .
    </>
  );
}
