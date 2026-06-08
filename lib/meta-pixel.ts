// Helper de disparo de eventos do Meta Pixel no client.
// Seguro para SSR e para quando o fbq ainda não carregou (vira no-op).
// O script base e o PageView ficam em `components/MetaPixel.tsx`.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Eventos padrão do Meta que o site dispara. */
export type MetaStandardEvent =
  | "PageView"
  | "Lead"
  | "Contact"
  | "CompleteRegistration"
  | "InitiateCheckout"
  | "Subscribe"
  | "Purchase"
  | "ViewContent";

/** Dispara um evento padrão do Meta Pixel (no-op se o fbq não estiver disponível). */
export function trackMetaEvent(
  event: MetaStandardEvent,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}
