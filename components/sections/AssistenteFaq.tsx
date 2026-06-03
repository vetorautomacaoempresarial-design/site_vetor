"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { FadeInUp } from "@/components/motion";
import { cn } from "@/lib/cn";
import type { SiteContent } from "@/lib/content/types";

export default function AssistenteFaq({
  content,
}: {
  content: SiteContent["assistente"]["faq"];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-28 bg-[#0A0A0A] border-t border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <FadeInUp>
            <Badge className="mb-4">{content.badge}</Badge>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-[#F5F5F5] leading-tight tracking-tight whitespace-pre-line">
              {content.title}
            </h2>
          </FadeInUp>

          <div className="flex flex-col divide-y divide-[#2A2A2A]">
            {content.items.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-start justify-between gap-4 py-6 text-left group"
                >
                  <span
                    className={cn(
                      "font-display font-medium text-sm leading-snug tracking-tight transition-colors",
                      open === i ? "text-white" : "text-[#A3A3A3] group-hover:text-[#F5F5F5]"
                    )}
                  >
                    {faq.question}
                  </span>
                  <span className="shrink-0 mt-0.5 text-[#737373] group-hover:text-[#A3A3A3] transition-colors">
                    {open === i ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
                {open === i && (
                  <div className="pb-6">
                    <p className="font-body font-light text-sm text-[#A3A3A3] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
