import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Footer from "@/components/sections/Footer";
import type { LegalDoc } from "@/lib/legal";

/**
 * Layout base de uma página de documento legal.
 * O conteúdo (markdown) vem de `content/legal/<slug>.md`.
 */
export default function LegalDocument({
  doc,
  markdown,
  lastUpdated,
}: {
  doc: LegalDoc;
  markdown?: string;
  lastUpdated?: string;
}) {
  return (
    <>
      <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <Link
            href="/#planos"
            className="inline-flex items-center gap-2 font-display text-sm text-[#A3A3A3] hover:text-white transition-colors mb-10"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>

          <h1 className="font-display font-bold text-3xl lg:text-4xl text-[#F5F5F5] tracking-tight mb-4">
            {doc.title}
          </h1>
          <p className="font-body font-light text-[#A3A3A3] text-sm leading-relaxed mb-2">
            {doc.summary}
          </p>
          {lastUpdated && (
            <p className="font-body text-xs text-[#737373] mb-10">
              Última atualização: {lastUpdated}
            </p>
          )}

          <div
            className="mt-10 font-body font-light text-[#D4D4D4] text-sm leading-relaxed
              [&_p]:mb-4
              [&_h2]:font-display [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:text-[#F5F5F5] [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-3
              [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-base [&_h3]:text-[#F5F5F5] [&_h3]:mt-6 [&_h3]:mb-2
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1.5
              [&_strong]:text-[#F5F5F5] [&_strong]:font-semibold
              [&_a]:text-[#2563EB] [&_a]:underline hover:[&_a]:text-[#3B82F6]
              [&_hr]:border-[#2A2A2A] [&_hr]:my-8
              [&_table]:w-full [&_table]:my-6 [&_table]:border [&_table]:border-[#2A2A2A] [&_table]:text-left
              [&_th]:border [&_th]:border-[#2A2A2A] [&_th]:bg-[#141414] [&_th]:px-3 [&_th]:py-2 [&_th]:font-display [&_th]:font-semibold [&_th]:text-[#F5F5F5] [&_th]:text-xs
              [&_td]:border [&_td]:border-[#2A2A2A] [&_td]:px-3 [&_td]:py-2 [&_td]:align-top
              [&_em]:text-[#A3A3A3]"
          >
            {markdown ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            ) : (
              <div className="border border-dashed border-[#2A2A2A] bg-[#141414] p-6">
                <p className="text-[#A3A3A3]">
                  <strong className="text-[#F5F5F5]">Conteúdo em elaboração.</strong> O texto
                  jurídico deste documento será publicado em breve.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
