import Hero from "@/components/sections/Hero";
import Solucoes from "@/components/sections/Solucoes";
import Diferenciais from "@/components/sections/Diferenciais";
import Faq from "@/components/sections/Faq";
import ContatoForm from "@/components/sections/ContatoForm";
import Footer from "@/components/sections/Footer";
import { getSiteContent } from "@/lib/content";

export default async function HomePage() {
  const content = await getSiteContent();

  // Cores da Home: preto → azul → branco → azul → branco → azul.
  return (
    <main>
      <Hero content={content.home.hero} />
      <Solucoes content={content.home.solucoes} />
      <Diferenciais content={content.home.diferenciais} theme="branco" />
      <Faq content={content.home.faq} theme="azul" />
      <ContatoForm content={content.home.contato} theme="branco" />
      <Footer theme="azul" />
    </main>
  );
}
