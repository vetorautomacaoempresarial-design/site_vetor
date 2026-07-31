import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Os produtos mudaram de nome (WhatsApp Blindado → Vetor Chat, Assistente de
  // Vendas → Vetor Sales) e, com eles, o endereço das páginas. Estes desvios
  // permanentes (301) mandam quem chegar pelo endereço antigo — link salvo,
  // resultado do Google, anúncio antigo — direto para o novo, sem erro 404 e
  // sem perder o histórico de busca já construído.
  async redirects() {
    return [
      {
        source: "/whatsapp-blindado",
        destination: "/vetor-chat",
        permanent: true,
      },
      {
        source: "/assistente-de-vendas",
        destination: "/vetor-sales",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
