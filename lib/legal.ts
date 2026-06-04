// Documentos legais que o cliente deve aceitar antes de assinar.
// Fonte única de verdade: usada no aceite (ContaActions) e nas páginas /<slug>.

export interface LegalDoc {
  slug: string;
  title: string;
  href: string;
  /** Resumo curto exibido no topo da página do documento. */
  summary: string;
}

/**
 * Versão do conjunto de documentos legais aceitos na contratação.
 * Incremente (formato data ISO `AAAA-MM-DD`) sempre que qualquer documento em
 * `content/legal/` for alterado de forma material. É gravada no log de aceite
 * (`terms_acceptances`) como prova da formação contratual, conforme a
 * Cláusula 18.2 do Contrato de Adesão.
 */
export const LEGAL_VERSION = "2026-06-04";

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "contrato-de-adesao",
    title: "Contrato de Adesão",
    href: "/contrato-de-adesao",
    summary:
      "Condições da contratação do Assistente de Vendas: escopo do serviço, prazo de configuração, valores, renovação e cancelamento.",
  },
  {
    slug: "termos-de-uso",
    title: "Termos de Uso",
    href: "/termos-de-uso",
    summary:
      "Regras de uso da plataforma e do Assistente de Vendas, responsabilidades das partes e condições gerais do serviço.",
  },
  {
    slug: "politica-de-privacidade",
    title: "Política de Privacidade",
    href: "/politica-de-privacidade",
    summary:
      "Como coletamos, usamos, armazenamos e protegemos os dados pessoais, em conformidade com a LGPD.",
  },
  {
    slug: "politica-de-cookies",
    title: "Política de Cookies",
    href: "/politica-de-cookies",
    summary:
      "Quais cookies e tecnologias semelhantes utilizamos no site e como você pode gerenciá-los.",
  },
  {
    slug: "dpa",
    title: "DPA — Acordo de Tratamento de Dados",
    href: "/dpa",
    summary:
      "Termos de tratamento de dados pessoais entre a Vetor (operadora) e o cliente (controlador), conforme a LGPD.",
  },
];

/**
 * Snapshot dos documentos aceitos no momento da contratação, gravado no log de
 * aceite (`terms_acceptances`) para provar exatamente o que o cliente aceitou.
 */
export function legalAcceptanceSnapshot() {
  return LEGAL_DOCS.map((doc) => ({
    slug: doc.slug,
    title: doc.title,
    version: LEGAL_VERSION,
  }));
}
