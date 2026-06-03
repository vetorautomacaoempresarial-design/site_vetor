"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { Field, Input, FormError } from "@/components/ui/Form";
import { updateEmailSchema, resetPasswordSchema } from "@/lib/validation";
import { createClient } from "@/lib/supabase/client";

type EmailData = z.infer<typeof updateEmailSchema>;
type PasswordData = z.infer<typeof resetPasswordSchema>;

export default function ConfiguracoesForms({ currentEmail }: { currentEmail: string }) {
  return (
    <div className="flex flex-col gap-8">
      <EmailForm currentEmail={currentEmail} />
      <PasswordForm />
    </div>
  );
}

function EmailForm({ currentEmail }: { currentEmail: string }) {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailData>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: { email: currentEmail },
  });

  const onSubmit = async (data: EmailData) => {
    setError(null);
    setDone(false);
    if (data.email === currentEmail) {
      setError("Informe um e-mail diferente do atual.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser(
      { email: data.email },
      { emailRedirectTo: `${window.location.origin}/auth/callback?next=/conta/configuracoes` }
    );
    if (error) {
      setError("Não foi possível alterar o e-mail. Tente novamente.");
      return;
    }
    setDone(true);
  };

  return (
    <section className="border border-[#2A2A2A] bg-[#141414] p-8">
      <h2 className="font-display font-semibold text-lg text-[#F5F5F5] tracking-tight mb-1">
        Alterar e-mail
      </h2>
      <p className="font-body text-sm text-[#737373] mb-6">
        Por segurança, a mudança só é efetivada após você confirmar pelo link enviado ao novo
        e-mail.
      </p>

      {done ? (
        <div className="flex items-center gap-2 text-[#2563EB] font-body text-sm">
          <CheckCircle size={18} />
          Enviamos um link de confirmação para o novo e-mail.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md">
          <FormError message={error} />
          <Field label="Novo e-mail" error={errors.email?.message}>
            <Input {...register("email")} type="email" error={!!errors.email} autoComplete="email" />
          </Field>
          <button
            type="submit"
            disabled={isSubmitting}
            className="self-start font-display text-sm font-semibold tracking-wide px-6 py-3 bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Enviando..." : "Salvar e-mail"}
          </button>
        </form>
      )}
    </section>
  );
}

function PasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordData>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data: PasswordData) => {
    setError(null);
    setDone(false);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) {
      setError("Não foi possível alterar a senha. Tente novamente.");
      return;
    }
    setDone(true);
    reset();
  };

  return (
    <section className="border border-[#2A2A2A] bg-[#141414] p-8">
      <h2 className="font-display font-semibold text-lg text-[#F5F5F5] tracking-tight mb-6">
        Trocar senha
      </h2>

      {done && (
        <div className="flex items-center gap-2 text-[#2563EB] font-body text-sm mb-4">
          <CheckCircle size={18} />
          Senha atualizada com sucesso.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md">
        <FormError message={error} />
        <Field label="Nova senha" error={errors.password?.message} hint="Mínimo de 8 caracteres.">
          <Input {...register("password")} type="password" error={!!errors.password} autoComplete="new-password" />
        </Field>
        <Field label="Confirmar nova senha" error={errors.confirm?.message}>
          <Input {...register("confirm")} type="password" error={!!errors.confirm} autoComplete="new-password" />
        </Field>
        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start font-display text-sm font-semibold tracking-wide px-6 py-3 bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Salvando..." : "Salvar senha"}
        </button>
      </form>
    </section>
  );
}
