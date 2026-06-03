"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthCard from "@/components/auth/AuthCard";
import { Field, Input, SubmitButton, FormError } from "@/components/ui/Form";
import { resetPasswordSchema } from "@/lib/validation";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";

type ResetData = z.infer<typeof resetPasswordSchema>;

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetData>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (data: ResetData) => {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) {
      setError(
        "Não foi possível redefinir a senha. O link pode ter expirado — solicite um novo."
      );
      return;
    }
    router.push("/conta");
    router.refresh();
  };

  return (
    <AuthCard
      title="Nova senha"
      subtitle="Escolha uma nova senha para sua conta."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormError message={error} />
        <Field label="Nova senha" error={errors.password?.message} hint="Mínimo de 8 caracteres.">
          <Input {...register("password")} type="password" placeholder="••••••••" error={!!errors.password} autoComplete="new-password" />
        </Field>
        <Field label="Confirmar senha" error={errors.confirm?.message}>
          <Input {...register("confirm")} type="password" placeholder="••••••••" error={!!errors.confirm} autoComplete="new-password" />
        </Field>
        <SubmitButton loading={isSubmitting}>Salvar nova senha</SubmitButton>
      </form>
    </AuthCard>
  );
}
