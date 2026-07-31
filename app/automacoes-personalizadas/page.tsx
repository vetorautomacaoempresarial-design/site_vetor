import type { Metadata } from "next";
import Footer from "@/components/sections/Footer";
import ProdutoHero from "@/components/sections/ProdutoHero";
import ProdutoComoFunciona from "@/components/sections/ProdutoComoFunciona";
import ContatoForm from "@/components/sections/ContatoForm";
import { getSiteContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Automações personalizadas",
  description:
    "Projetos de automação sob medida, construídos a partir do diagnóstico do seu processo. Do mapeamento à operação contínua, com agentes de inteligência artificial e integrações entre os seus sistemas.",
};

export default async function AutomacoesPersonalizadasPage() {
  const content = await getSiteContent();

  return (
    <>
      <main>
        <ProdutoHero
          content={content.personalizadas.hero}
          whatsappMessage="Olá! Tenho interesse em uma automação personalizada com a Vetor."
          primaryHref="#contato"
        />
        {/* Cores: preto → azul → branco → azul. */}
        <ProdutoComoFunciona
          content={content.personalizadas.comoFunciona}
          theme="azul"
          layout="timeline"
        />
        <ContatoForm content={content.home.contato} theme="branco" />
      </main>
      <Footer theme="azul" />
    </>
  );
}
