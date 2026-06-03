"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";
import { Field, Input, SubmitButton, FormError } from "@/components/ui/Form";
import { recoverSchema } from "@/lib/validation";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";

type RecoverData = z.infer<typeof recoverSchema>;

export default function RecuperarSenhaPage() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecoverData>({ resolver: zodResolver(recoverSchema) });

  const onSubmit = async (data: RecoverData) => {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/redefinir-senha`,
    });
    if (error) {
      setError("Não foi possível enviar o e-mail. Tente novamente.");
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <AuthCard title="Verifique seu e-mail">
        <div className="flex flex-col items-center text-center gap-3 py-4">
          <CheckCircle size={40} className="text-[#2563EB]" />
          <p className="font-body text-sm text-[#A3A3A3] leading-relaxed">
            Se existir uma conta com este e-mail, enviamos um link para redefinir a senha.
          </p>
          <Link href="/entrar" className="mt-2 font-display text-sm text-[#2563EB] hover:text-[#3B82F6] transition-colors">
            Voltar ao login
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Recuperar senha"
      subtitle="Informe seu e-mail e enviaremos um link para criar uma nova senha."
      footer={
        <Link href="/entrar" className="text-[#2563EB] hover:text-[#3B82F6] transition-colors">
          Voltar ao login
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormError message={error} />
        <Field label="E-mail" error={errors.email?.message}>
          <Input {...register("email")} type="email" placeholder="seu@email.com" error={!!errors.email} autoComplete="email" />
        </Field>
        <SubmitButton loading={isSubmitting}>Enviar link</SubmitButton>
      </form>
    </AuthCard>
  );
}
