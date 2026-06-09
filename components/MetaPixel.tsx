"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { trackMetaEvent } from "@/lib/meta-pixel";

// ID do Meta Pixel da Vetor Automação.
const PIXEL_ID = "1337549041158743";

/**
 * Dispara um PageView a cada navegação de rota.
 *
 * Observação (App Router): este projeto usa o App Router, então não existe o
 * `routeChangeComplete` do `next/router` (Pages Router). O equivalente é
 * observar `usePathname()` + `useSearchParams()` e disparar o PageView quando
 * mudam. O `useSearchParams` exige um limite de Suspense — ver o wrapper abaixo.
 */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // O PageView inicial já é disparado pelo script base; pulamos a 1ª execução
  // do efeito para não contar a primeira visualização duas vezes.
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackMetaEvent("PageView");
  }, [pathname, searchParams]);

  return null;
}

export default function MetaPixel() {
  return (
    <>
      {/* Script base do fbq — injetado após a página ficar interativa.
          Já dispara `init` + o PageView inicial no carregamento. */}
      <Script id="meta-pixel-base" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView', {}, { eventID: (self.crypto && self.crypto.randomUUID) ? self.crypto.randomUUID() : (Date.now() + '-' + Math.random().toString(16).slice(2)) });`}
      </Script>

      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>

      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
