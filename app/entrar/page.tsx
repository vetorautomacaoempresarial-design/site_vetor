"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthCard from "@/components/auth/AuthCard";
import { Field, Input, SubmitButton, FormError } from "@/components/ui/Form";
import { loginSchema, type LoginData } from "@/lib/validation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/conta";
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginData) => {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setError("E-mail ou senha incorretos.");
      return;
    }
    router.push(redirect);
    router.refresh();
  };

  return (
    <AuthCard
      title="Entrar"
      subtitle="Acesse a área do cliente para gerenciar sua assinatura."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="text-[#2563EB] hover:text-[#3B82F6] transition-colors">
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormError message={error} />
        <Field label="E-mail" error={errors.email?.message}>
          <Input {...register("email")} type="email" placeholder="seu@email.com" error={!!errors.email} autoComplete="email" />
        </Field>
        <Field label="Senha" error={errors.password?.message}>
          <Input {...register("password")} type="password" placeholder="••••••••" error={!!errors.password} autoComplete="current-password" />
        </Field>
        <div className="flex justify-end -mt-1">
          <Link href="/recuperar-senha" className="font-body text-xs text-[#A3A3A3] hover:text-white transition-colors">
            Esqueci minha senha
          </Link>
        </div>
        <SubmitButton loading={isSubmitting}>Entrar</SubmitButton>
      </form>
    </AuthCard>
  );
}

export default function EntrarPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
