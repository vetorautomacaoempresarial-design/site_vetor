import Image from "next/image";
import Link from "next/link";

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 py-28">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-3 mb-10">
          <Image
            src="/brand/logo.png"
            alt="Vetor Automação"
            width={32}
            height={32}
            className="object-contain brightness-0 invert"
          />
          <span className="font-display font-bold text-sm tracking-widest uppercase text-[#F5F5F5]">
            VETOR AUTOMAÇÃO
          </span>
        </Link>

        <div className="border border-[#2A2A2A] bg-[#141414] p-8">
          <h1 className="font-display font-bold text-2xl text-[#F5F5F5] tracking-tight mb-1.5">
            {title}
          </h1>
          {subtitle && (
            <p className="font-body font-light text-sm text-[#A3A3A3] leading-relaxed mb-7">
              {subtitle}
            </p>
          )}
          <div className={subtitle ? "" : "mt-7"}>{children}</div>
        </div>

        {footer && (
          <div className="mt-6 text-center font-body text-sm text-[#A3A3A3]">{footer}</div>
        )}
      </div>
    </main>
  );
}
