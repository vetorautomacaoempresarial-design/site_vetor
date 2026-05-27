import { cn } from "@/lib/cn";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-display font-semibold tracking-widest uppercase text-[#2563EB] border border-[#2563EB]/30 bg-[#2563EB]/8",
        className
      )}
    >
      {children}
    </span>
  );
}
