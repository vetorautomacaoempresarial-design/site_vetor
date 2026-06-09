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

/**
 * Gera um identificador único para um evento, usado na deduplicação
 * navegador ↔ servidor (Conversions API). O Meta casa o `eventID` do pixel
 * com o `event_id` da carga do servidor para contar o evento uma única vez.
 */
export function newMetaEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Dispara um evento padrão do Meta Pixel (no-op se o fbq não estiver disponível).
 *
 * Sempre envia um `eventID` para permitir a deduplicação com a Conversions API.
 * Retorna o `eventID` usado — encaminhe-o como `event_id` ao disparar o mesmo
 * evento pelo servidor para que o Meta conte apenas uma vez.
 */
export function trackMetaEvent(
  event: MetaStandardEvent,
  params?: Record<string, unknown>,
  eventId: string = newMetaEventId(),
): string {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return eventId;
  }
  window.fbq("track", event, params ?? {}, { eventID: eventId });
  return eventId;
}
