// Notificação da equipe por e-mail via Resend (reaproveita o já usado em app/api/contact).

export async function notifyTeam(params: {
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.EMAIL_TO ?? "administrativo@vetorautomacao.io";

  if (!apiKey) {
    console.warn("RESEND_API_KEY não definida — pulando notificação por e-mail.");
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Vetor Automação <noreply@contato.vetorautomacao.io>",
      to: [emailTo],
      subject: params.subject,
      html: params.html,
    });
  } catch (err) {
    console.error("Falha ao notificar equipe (Resend):", err);
  }
}
