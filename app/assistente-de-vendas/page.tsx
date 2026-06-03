import type { Metadata } from "next";
import Footer from "@/components/sections/Footer";
import AssistenteHero from "@/components/sections/AssistenteHero";
import AssistenteComoFunciona from "@/components/sections/AssistenteComoFunciona";
import AssistenteBeneficios from "@/components/sections/AssistenteBeneficios";
import ProcessoDeCompra from "@/components/sections/ProcessoDeCompra";
import Planos from "@/components/sections/Planos";
import AssistenteFaq from "@/components/sections/AssistenteFaq";

export const metadata: Metadata = {
  title: "Assistente de Vendas",
  description:
    "Um agente de IA que faz o primeiro contato com seus leads, entende a demanda e entrega um resumo completo para o seu time de vendas. Planos mensal, trimestral e anual.",
};

export default function AssistenteDeVendasPage() {
  return (
    <>
      <main>
        <AssistenteHero />
        <AssistenteComoFunciona />
        <AssistenteBeneficios />
        <ProcessoDeCompra />
        <Planos />
        <AssistenteFaq />
      </main>
      <Footer />
    </>
  );
}
