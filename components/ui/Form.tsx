"use client";
import { cn } from "@/lib/cn";

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-display text-xs text-[#A3A3A3] tracking-wide">{label}</label>
      {children}
      {hint && !error && <span className="font-body text-xs text-[#737373]">{hint}</span>}
      {error && <span className="font-body text-xs text-red-400">{error}</span>}
    </div>
  );
}

export function Input({
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      className={cn(
        "w-full bg-[#0A0A0A] border px-4 py-3 font-body text-sm text-[#F5F5F5] placeholder:text-[#6B7280] focus:outline-none focus:border-[#2563EB] transition-colors",
        error ? "border-red-500" : "border-[#2A2A2A]",
        className
      )}
      {...props}
    />
  );
}

export function SubmitButton({
  loading,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading || props.disabled}
      className="inline-flex items-center justify-center gap-2 font-display text-sm font-semibold tracking-wide px-7 py-3.5 bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
      {...props}
    >
      {loading ? "Aguarde..." : children}
    </button>
  );
}

export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 text-red-400 text-xs font-body border border-red-500/30 bg-red-500/5 px-3 py-2.5">
      <span>{message}</span>
    </div>
  );
}
