import type { Metadata } from "next";
import LegalDocument from "@/components/legal/LegalDocument";
import { LEGAL_DOCS } from "@/lib/legal";
import { getLegalMarkdown } from "@/lib/legal-content";

const doc = LEGAL_DOCS.find((d) => d.slug === "termos-de-uso")!;

export const metadata: Metadata = {
  title: doc.title,
  description: doc.summary,
};

export default function Page() {
  return <LegalDocument doc={doc} markdown={getLegalMarkdown(doc.slug)} />;
}
