import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
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
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1337549041158743');
fbq('track', 'PageView');`,
          }}
        />
        {/* End Meta Pixel Code */}
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable}`}>
        {/* Meta Pixel Code (noscript) */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1337549041158743&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
        <Header content={content.header} />
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
