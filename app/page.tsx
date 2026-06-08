import Hero from "@/components/sections/Hero";
import Solucoes from "@/components/sections/Solucoes";
import ComoFunciona from "@/components/sections/ComoFunciona";
import Diferenciais from "@/components/sections/Diferenciais";
import Faq from "@/components/sections/Faq";
import ContatoForm from "@/components/sections/ContatoForm";
import Footer from "@/components/sections/Footer";
import { getSiteContent } from "@/lib/content";

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <main>
      <Hero content={content.home.hero} />
      <Solucoes content={content.home.solucoes} />
      <ComoFunciona content={content.home.comoFunciona} />
      <Diferenciais content={content.home.diferenciais} />
      <Faq content={content.home.faq} />
      <ContatoForm content={content.home.contato} />
      <Footer />
    </main>
  );
}
