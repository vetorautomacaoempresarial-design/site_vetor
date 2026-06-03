import Hero from "@/components/sections/Hero";
import Servicos from "@/components/sections/Servicos";
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
      <Servicos content={content.home.servicos} />
      <ComoFunciona content={content.home.comoFunciona} />
      <Diferenciais content={content.home.diferenciais} />
      <Faq content={content.home.faq} />
      <ContatoForm content={content.home.contato} />
      <Footer />
    </main>
  );
}
