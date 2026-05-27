"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Send, MessageCircle, CheckCircle, AlertCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { FadeInUp } from "@/components/motion";
import { contactSchema, ContactFormData } from "@/lib/validation";
import { cn } from "@/lib/cn";

export default function ContatoForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5554991776175";

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
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contato" className="py-28 bg-[#141414] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <FadeInUp>
            <Badge className="mb-4">Contato</Badge>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#F5F5F5] leading-tight tracking-tight mb-6">
              Vamos conversar
              <br />
              sobre o seu processo?
            </h2>
            <p className="font-body font-light text-[#A3A3A3] text-sm leading-relaxed mb-10">
              Conte o que você precisa automatizar. Respondemos em até 24h com uma
              proposta de diagnóstico inicial — sem compromisso.
            </p>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Olá! Vim pelo site e gostaria de saber mais sobre automação com IA.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 bg-[#25D366] text-white font-display font-semibold text-sm tracking-wide hover:bg-[#22C35E] transition-colors"
            >
              <MessageCircle size={18} />
              Falar pelo WhatsApp
            </a>

            <p className="font-body text-xs text-[#737373] mt-4">
              Ou preencha o formulário ao lado e entraremos em contato.
            </p>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            {status === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 border border-[#2563EB]/30 bg-[#2563EB]/5">
                <CheckCircle size={40} className="text-[#2563EB] mb-4" />
                <h3 className="font-display font-semibold text-xl text-white mb-2">Mensagem enviada!</h3>
                <p className="font-body text-sm text-[#A3A3A3]">
                  Entraremos em contato em até 24h.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 font-display text-sm text-[#2563EB] hover:text-[#3B82F6] transition-colors"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* Honeypot */}
                <input {...register("honeypot")} type="text" className="hidden" tabIndex={-1} autoComplete="off" />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Nome *" error={errors.name?.message}>
                    <Input {...register("name")} placeholder="Seu nome" error={!!errors.name} />
                  </Field>
                  <Field label="E-mail *" error={errors.email?.message}>
                    <Input {...register("email")} type="email" placeholder="seu@email.com" error={!!errors.email} />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Empresa *" error={errors.company?.message}>
                    <Input {...register("company")} placeholder="Nome da empresa" error={!!errors.company} />
                  </Field>
                  <Field label="Telefone" error={errors.phone?.message}>
                    <Input {...register("phone")} placeholder="(11) 99999-9999" error={!!errors.phone} />
                  </Field>
                </div>

                <Field label="Como podemos ajudar? *" error={errors.message?.message}>
                  <textarea
                    {...register("message")}
                    placeholder="Descreva o processo que você quer automatizar..."
                    rows={5}
                    className={cn(
                      "w-full bg-[#0A0A0A] border px-4 py-3 font-body text-sm text-[#F5F5F5] placeholder:text-[#6B7280] focus:outline-none focus:border-[#2563EB] transition-colors resize-none",
                      errors.message ? "border-red-500" : "border-[#2A2A2A]"
                    )}
                  />
                </Field>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-400 text-xs font-body">
                    <AlertCircle size={14} />
                    Erro ao enviar. Tente pelo WhatsApp ou e-mail diretamente.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 font-display text-sm font-semibold tracking-wide px-7 py-4 bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar mensagem
                      <Send size={14} />
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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-display text-xs text-[#A3A3A3] tracking-wide">{label}</label>
      {children}
      {error && <span className="font-body text-xs text-red-400">{error}</span>}
    </div>
  );
}

function Input({ error, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      className={cn(
        "w-full bg-[#0A0A0A] border px-4 py-3 font-body text-sm text-[#F5F5F5] placeholder:text-[#6B7280] focus:outline-none focus:border-[#2563EB] transition-colors",
        error ? "border-red-500" : "border-[#2A2A2A]",
        className
      )}
      {...props}
    />
  );
}
