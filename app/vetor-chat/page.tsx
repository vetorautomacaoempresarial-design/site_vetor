import type { Metadata } from "next";
import Footer from "@/components/sections/Footer";
import ProdutoHero from "@/components/sections/ProdutoHero";
import BlindadoProblema from "@/components/sections/BlindadoProblema";
import ProdutoComoFunciona from "@/components/sections/ProdutoComoFunciona";
import BlindadoBeneficios from "@/components/sections/BlindadoBeneficios";
import Planos from "@/components/sections/Planos";
import ProdutoFaq from "@/components/sections/ProdutoFaq";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Vetor Chat: WhatsApp na infraestrutura oficial da Meta",
  description:
    "Conecte o WhatsApp da sua empresa à infraestrutura oficial da Meta e opere dentro das regras da plataforma. Sem trocar de número e sem perder o histórico. Planos mensal, trimestral e anual.",
};

export default async function VetorChatPage() {
  const content = await getSiteContent();

  return (
    <>
      <main>
        <ProdutoHero
          content={content.blindado.hero}
          whatsappMessage="Olá! Tenho interesse no Vetor Chat."
        />
        {/* Cores: preto → azul → branco → azul → branco → azul → branco. */}
        <BlindadoProblema content={content.blindado.problema} theme="azul" />
        <ProdutoComoFunciona
          content={content.blindado.comoFunciona}
          theme="branco"
          layout="timeline"
        />
        <BlindadoBeneficios content={content.blindado.beneficios} theme="azul" />
        <Planos content={content.blindado.planos} product="blindado" theme="branco" />
        <ProdutoFaq content={content.blindado.faq} theme="azul" />
      </main>
      <Footer theme="branco" tone="preto" />
    </>
  );
}
