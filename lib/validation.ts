import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  company: z.string().min(2, "Empresa deve ter ao menos 2 caracteres"),
  phone: z.string().optional(),
  message: z.string().min(20, "Descreva brevemente sua necessidade (mín. 20 caracteres)"),
  honeypot: z.string().max(0).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ---------- Área do Cliente ----------

const emailField = z.string().email("E-mail inválido");
const passwordField = z.string().min(8, "A senha deve ter ao menos 8 caracteres");

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Informe sua senha"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: emailField,
  password: passwordField,
});

export const recoverSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirm: z.string().min(1, "Confirme a senha"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "As senhas não conferem",
    path: ["confirm"],
  });

export const updateEmailSchema = z.object({
  email: emailField,
});

const planField = z.enum(["mensal", "trimestral", "anual"]);

// Aceita CPF (11) ou CNPJ (14) dígitos — validação leve (só comprimento).
const cpfCnpjField = z
  .string()
  .transform((s) => s.replace(/\D/g, ""))
  .refine((s) => s.length === 11 || s.length === 14, {
    message: "CPF/CNPJ inválido",
  });

export const subscribeSchema = z.object({
  plan: planField,
  name: z.string().min(2, "Informe o nome do titular"),
  cpfCnpj: cpfCnpjField,
  // Aceite obrigatório dos termos (contrato, termos de uso, privacidade, cookies, DPA).
  acceptedTerms: z.literal(true, {
    message: "É necessário aceitar os termos para assinar.",
  }),
});

export const changePlanSchema = z.object({
  plan: planField,
});

export const cancelSchema = z.object({
  message: z.string().max(500).optional(),
});

export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type SubscribeData = z.infer<typeof subscribeSchema>;
