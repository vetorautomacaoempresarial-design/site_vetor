"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Send, MessageCircle, CheckCircle, AlertCircle } from "lucide-react";
import { FadeInUp } from "@/components/motion";
import { contactSchema, ContactFormData } from "@/lib/validation";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { cn } from "@/lib/cn";
import Wave from "@/components/ui/Wave";
import {
  THEMES,
  badgeClasses,
  type SectionTheme,
  type ThemeTokens,
} from "@/lib/section-theme";
import type { SiteContent } from "@/lib/content/types";

export default function ContatoForm({
  content,
  theme = "branco",
}: {
  content: SiteContent["home"]["contato"];
  theme?: SectionTheme;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5554991776175";
  const t = THEMES[theme];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        reset();
        // Conversão: lead enviado pelo formulário de contato.
        trackMetaEvent("Lead");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contato"
      className="relative pt-28 pb-40"
      style={{ backgroundColor: t.bg }}
    >
      <Wave fill={t.bg} position="top" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <FadeInUp>
            <span className={cn(badgeClasses(t), "mb-4")}>{content.badge}</span>
            <h2
              className={cn(
                "font-display font-bold text-4xl lg:text-5xl leading-tight tracking-tight mb-6 whitespace-pre-line",
                t.title
              )}
            >
              {content.title}
            </h2>
            <p className={cn("font-body font-light text-sm leading-relaxed mb-10", t.body)}>
              {content.intro}
            </p>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá! Vim pelo site e gostaria de saber mais sobre automação com IA.")}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackMetaEvent("Contact")}
              className="inline-flex items-center gap-3 px-6 py-4 bg-[#25D366] text-white font-display font-semibold text-sm tracking-wide hover:bg-[#22C35E] transition-colors"
            >
              <MessageCircle size={22} />
              {content.whatsappLabel}
            </a>

            <p className={cn("font-body text-xs mt-4", t.muted)}>{content.whatsappNote}</p>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            {status === "success" ? (
              <div
                className={cn(
                  "h-full flex flex-col items-center justify-center text-center py-16",
                  t.box
                )}
              >
                <CheckCircle size={44} className={cn("mb-4", t.title)} />
                <h3 className={cn("font-display font-semibold text-xl mb-2", t.title)}>
                  Mensagem enviada!
                </h3>
                <p className={cn("font-body text-sm", t.body)}>Entraremos em contato em até 24h.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className={cn(
                    "mt-6 font-display text-sm underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity",
                    t.title
                  )}
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* Honeypot */}
                <input {...register("honeypot")} type="text" className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Nome *" error={errors.name?.message} t={t}>
                    <Input {...register("name")} placeholder="Seu nome" error={!!errors.name} t={t} />
                  </Field>
                  <Field label="E-mail *" error={errors.email?.message} t={t}>
                    <Input {...register("email")} type="email" placeholder="seu@email.com" error={!!errors.email} t={t} />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Empresa *" error={errors.company?.message} t={t}>
                    <Input {...register("company")} placeholder="Nome da empresa" error={!!errors.company} t={t} />
                  </Field>
                  <Field label="Telefone" error={errors.phone?.message} t={t}>
                    <Input {...register("phone")} placeholder="(11) 99999-9999" error={!!errors.phone} t={t} />
                  </Field>
                </div>

                <Field label="Como podemos ajudar? *" error={errors.message?.message} t={t}>
                  <textarea
                    {...register("message")}
                    placeholder="Descreva o processo que você quer automatizar..."
                    rows={5}
                    className={cn(
                      campoBase(t),
                      "resize-none",
                      errors.message ? "border-red-500" : t.border
                    )}
                  />
                </Field>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-500 text-xs font-body">
                    <AlertCircle size={18} />
                    Erro ao enviar. Tente pelo WhatsApp ou e-mail diretamente.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 font-display text-sm font-semibold tracking-wide px-7 py-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    t.button
                  )}
                >
                  {status === "loading" ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar mensagem
                      <Send size={17} />
                    </>
                  )}
                </button>
              </form>
            )}
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}

/** Classes comuns dos campos do formulário no tema da seção. */
function campoBase(t: ThemeTokens): string {
  return cn(
    "w-full border px-4 py-3 font-body text-sm bg-transparent focus:outline-none transition-colors",
    t.title,
    t.placeholder
  );
}

function Field({
  label,
  error,
  t,
  children,
}: {
  label: string;
  error?: string;
  t: ThemeTokens;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={cn("font-display text-xs tracking-wide", t.body)}>{label}</label>
      {children}
      {error && <span className="font-body text-xs text-red-500">{error}</span>}
    </div>
  );
}

function Input({
  error,
  className,
  t,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean; t: ThemeTokens }) {
  return (
    <input
      className={cn(campoBase(t), error ? "border-red-500" : t.border, className)}
      {...props}
    />
  );
}
