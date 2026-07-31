import { cn } from "@/lib/cn";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-display font-semibold tracking-widest uppercase text-[#4A6CF7] border border-[#4A6CF7]/30 bg-[#4A6CF7]/8",
        className
      )}
    >
      {children}
    </span>
  );
}
