import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/auth/SignOutButton";
import ContaNav from "@/components/conta/ContaNav";

export default async function ContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/entrar?redirect=/conta");

  return (
    <main className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="font-display text-xs tracking-widest uppercase text-[#2563EB] mb-2">
              Área do cliente
            </p>
            <h1 className="font-display font-bold text-3xl text-[#F5F5F5] tracking-tight">
              Minha conta
            </h1>
            <p className="font-body text-sm text-[#737373] mt-1">{user.email}</p>
          </div>
          <SignOutButton />
        </div>

        <ContaNav />

        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
