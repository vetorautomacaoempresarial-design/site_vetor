import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Home } from "lucide-react";
import { getCurrentAdmin } from "@/lib/content/admin";

export const metadata: Metadata = {
  title: "Painel de conteúdo",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  // Não-admin (ou deslogado) não acessa o painel.
  if (!admin) redirect("/entrar?redirect=/admin");

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      <header className="border-b border-[#2A2A2A] sticky top-0 bg-[#0A0A0A]/95 backdrop-blur z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/admin" className="font-display font-semibold text-sm tracking-widest uppercase">
            Painel de Conteúdo
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-body text-xs text-[#737373] hidden sm:inline">{admin.email}</span>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 font-body text-xs text-[#A3A3A3] hover:text-white transition-colors"
            >
              <Home size={13} /> Ver site
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
