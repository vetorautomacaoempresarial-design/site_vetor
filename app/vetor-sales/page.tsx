import type { Metadata } from "next";
import Footer from "@/components/sections/Footer";
import ProdutoHero from "@/components/sections/ProdutoHero";
import ProdutoComoFunciona from "@/components/sections/ProdutoComoFunciona";
import AssistenteBeneficios from "@/components/sections/AssistenteBeneficios";
import ProcessoDeCompra from "@/components/sections/ProcessoDeCompra";
import Planos from "@/components/sections/Planos";
import ProdutoFaq from "@/components/sections/ProdutoFaq";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Vetor Sales: agente de IA que atende e qualifica seus leads",
  description:
    "Um agente de IA que faz o primeiro contato com seus leads, entende a demanda e entrega um resumo completo para o seu time de vendas. Planos mensal, trimestral e anual.",
};

export default async function VetorSalesPage() {
  const content = await getSiteContent();

  return (
    <>
      <main>
        <ProdutoHero
          content={content.assistente.hero}
          whatsappMessage="Olá! Tenho interesse no Vetor Sales."
        />
        {/* Cores: preto → azul → branco → azul → branco → azul → branco. */}
        <AssistenteBeneficios content={content.assistente.beneficios} theme="azul" />
        <ProdutoComoFunciona
          content={content.assistente.comoFunciona}
          theme="branco"
          layout="timeline"
        />
        <ProcessoDeCompra content={content.assistente.processo} theme="azul" />
        <Planos content={content.assistente.planos} product="assistente" theme="branco" />
        <ProdutoFaq content={content.assistente.faq} theme="azul" />
      </main>
      <Footer theme="branco" tone="preto" />
    </>
  );
}
