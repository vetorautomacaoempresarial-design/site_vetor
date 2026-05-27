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
