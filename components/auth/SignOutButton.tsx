"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/entrar");
    router.refresh();
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={
        className ??
        "inline-flex items-center gap-2 font-display text-sm text-[#A3A3A3] hover:text-white transition-colors disabled:opacity-50"
      }
    >
      <LogOut size={15} />
      {loading ? "Saindo..." : "Sair"}
    </button>
  );
}
