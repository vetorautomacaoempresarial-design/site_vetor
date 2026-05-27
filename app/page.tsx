import Hero from "@/components/sections/Hero";
import Servicos from "@/components/sections/Servicos";
import ComoFunciona from "@/components/sections/ComoFunciona";
import Diferenciais from "@/components/sections/Diferenciais";
import Faq from "@/components/sections/Faq";
import ContatoForm from "@/components/sections/ContatoForm";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Servicos />
      <ComoFunciona />
      <Diferenciais />
      <Faq />
      <ContatoForm />
      <Footer />
    </main>
  );
}
