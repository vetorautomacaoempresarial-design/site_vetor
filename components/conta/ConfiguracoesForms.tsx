"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { Field, Input, PasswordInput, FormError } from "@/components/ui/Form";
import { updateEmailSchema, updateNameSchema, resetPasswordSchema } from "@/lib/validation";
import { createClient } from "@/lib/supabase/client";

type EmailData = z.infer<typeof updateEmailSchema>;
type NameData = z.infer<typeof updateNameSchema>;
type PasswordData = z.infer<typeof resetPasswordSchema>;

export default function ConfiguracoesForms({
  currentEmail,
  currentName,
}: {
  currentEmail: string;
  currentName: string;
}) {
  return (
    <div className="flex flex-col gap-8">
      <NameForm currentName={currentName} />
      <EmailForm currentEmail={currentEmail} />
      <PasswordForm />
    </div>
  );
}

function NameForm({ currentName }: { currentName: string }) {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NameData>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name: currentName },
  });

  const onSubmit = async (data: NameData) => {
    setError(null);
    setDone(false);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { name: data.name } });
    if (error) {
      setError("Não foi possível atualizar o nome. Tente novamente.");
      return;
    }
    setDone(true);
  };

  return (
    <section className="border border-[#2A2A2A] bg-[#141414] p-8">
      <h2 className="font-display font-semibold text-lg text-[#F5F5F5] tracking-tight mb-6">
        Nome completo
      </h2>

      {done && (
        <div className="flex items-center gap-2 text-[#2563EB] font-body text-sm mb-4">
          <CheckCircle size={18} />
          Nome atualizado com sucesso.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md">
        <FormError message={error} />
        <Field label="Nome completo" error={errors.name?.message}>
          <Input {...register("name")} error={!!errors.name} autoComplete="name" />
        </Field>
        <button
          type="submit"
          disabled={isSubmitting}
          className="self-start font-display text-sm font-semibold tracking-wide px-6 py-3 bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Salvando..." : "Salvar nome"}
        </button>
      </form>
    </section>
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
    const res = await fetch("/api/conta/atualizar-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, password: data.password }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(result?.error ?? "Não foi possível alterar o e-mail. Tente novamente.");
      return;
    }
    // Atualiza a sessão local para refletir o novo e-mail sem novo login.
    const supabase = createClient();
    await supabase.auth.refreshSession();
    setDone(true);
  };

  return (
    <section className="border border-[#2A2A2A] bg-[#141414] p-8">
      <h2 className="font-display font-semibold text-lg text-[#F5F5F5] tracking-tight mb-1">
        Alterar e-mail
      </h2>
      <p className="font-body text-sm text-[#737373] mb-6">
        Por segurança, confirme sua senha atual. A troca é aplicada na hora — você passará a
        entrar com o novo e-mail.
      </p>

      {done ? (
        <div className="flex items-center gap-2 text-[#2563EB] font-body text-sm">
          <CheckCircle size={18} />
          E-mail atualizado com sucesso.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-md">
          <FormError message={error} />
          <Field label="Novo e-mail" error={errors.email?.message}>
            <Input {...register("email")} type="email" error={!!errors.email} autoComplete="email" />
          </Field>
          <Field label="Senha atual" error={errors.password?.message}>
            <PasswordInput {...register("password")} error={!!errors.password} autoComplete="current-password" />
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
          <PasswordInput {...register("password")} error={!!errors.password} autoComplete="new-password" />
        </Field>
        <Field label="Confirmar nova senha" error={errors.confirm?.message}>
          <PasswordInput {...register("confirm")} error={!!errors.confirm} autoComplete="new-password" />
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
