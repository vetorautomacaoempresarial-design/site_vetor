import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import MetaPixel from "@/components/MetaPixel";
import { getSiteContent } from "@/lib/content";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vetorautomacao.io";

// Verificação de domínio do Meta (Gerenciador de Negócios). Inerte até a env existir.
const fbDomainVerification = process.env.NEXT_PUBLIC_FB_DOMAIN_VERIFICATION;

export const metadata: Metadata = {
  title: {
    default: "Vetor Automação · Automação de Processos com IA",
    template: "%s | Vetor Automação",
  },
  description:
    "Automatizamos processos complexos com agentes de IA. Diagnóstico, projeto, implantação e operação de ponta a ponta. Seu processo tem magnitude. Nós damos direção.",
  keywords: ["automação de processos", "agentes de IA", "RPA", "inteligência artificial", "automação empresarial"],
  authors: [{ name: "Vetor Automação" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Vetor Automação",
    title: "Vetor Automação · Automação de Processos com IA",
    description: "Automatizamos processos complexos com agentes de IA. Do diagnóstico à operação.",
    images: [{ url: "/og/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vetor Automação · Automação de Processos com IA",
    description: "Automatizamos processos complexos com agentes de IA.",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(siteUrl),
  ...(fbDomainVerification
    ? { verification: { other: { "facebook-domain-verification": fbDomainVerification } } }
    : {}),
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getSiteContent();
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/brand/logo.png" type="image/png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Vetor Automação",
              description: "Automação de processos com agentes de IA",
              url: siteUrl,
            }),
          }}
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable}`}>
        <MetaPixel />
        <Header content={content.header} />
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
