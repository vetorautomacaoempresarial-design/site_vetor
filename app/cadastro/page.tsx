"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";
import { Field, Input, PasswordInput, SubmitButton, FormError } from "@/components/ui/Form";
import { signupSchema, type SignupData } from "@/lib/validation";
import { createClient } from "@/lib/supabase/client";

export default function CadastroPage() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupData>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupData) => {
    setError(null);
    const supabase = createClient();
    const { data: result, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name, phone: data.phone },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(
        error.message.includes("already")
          ? "Já existe uma conta com este e-mail."
          : "Não foi possível criar a conta. Tente novamente."
      );
      return;
    }
    // Se a confirmação de e-mail estiver ativa, não há sessão imediata.
    if (result.session) {
      window.location.href = "/conta";
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <AuthCard title="Confirme seu e-mail">
        <div className="flex flex-col items-center text-center gap-3 py-4">
          <CheckCircle size={40} className="text-[#2563EB]" />
          <p className="font-body text-sm text-[#A3A3A3] leading-relaxed">
            Enviamos um link de confirmação para o seu e-mail. Clique nele para ativar sua conta e
            depois faça login.
          </p>
          <Link href="/entrar" className="mt-2 font-display text-sm text-[#2563EB] hover:text-[#3B82F6] transition-colors">
            Ir para o login
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Criar conta"
      subtitle="Crie sua conta para acompanhar e gerenciar sua assinatura."
      footer={
        <>
          Já tem conta?{" "}
          <Link href="/entrar" className="text-[#2563EB] hover:text-[#3B82F6] transition-colors">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormError message={error} />
        <Field label="Nome" error={errors.name?.message}>
          <Input {...register("name")} placeholder="Seu nome" error={!!errors.name} autoComplete="name" />
        </Field>
        <Field label="E-mail" error={errors.email?.message}>
          <Input {...register("email")} type="email" placeholder="seu@email.com" error={!!errors.email} autoComplete="email" />
        </Field>
        <Field label="Telefone" error={errors.phone?.message}>
          <Input {...register("phone")} type="tel" placeholder="(11) 99999-9999" error={!!errors.phone} autoComplete="tel" />
        </Field>
        <Field label="Senha" error={errors.password?.message} hint="Mínimo de 8 caracteres.">
          <PasswordInput {...register("password")} placeholder="••••••••" error={!!errors.password} autoComplete="new-password" />
        </Field>
        <Field label="Confirmar senha" error={errors.confirm?.message}>
          <PasswordInput {...register("confirm")} placeholder="••••••••" error={!!errors.confirm} autoComplete="new-password" />
        </Field>
        <SubmitButton loading={isSubmitting}>Criar conta</SubmitButton>
      </form>
    </AuthCard>
  );
}
