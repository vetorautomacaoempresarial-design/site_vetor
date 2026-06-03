import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSection, getDefaultSection, isSectionKey } from "@/lib/content";
import { SECTION_LABELS } from "@/lib/content/defaults";
import ContentEditor from "@/components/admin/ContentEditor";

export default async function EditSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!isSectionKey(section)) notFound();

  const meta = SECTION_LABELS[section];
  const current = await getSection(section);
  const defaults = getDefaultSection(section);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 font-body text-xs text-[#A3A3A3] hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={13} /> Todas as seções
        </Link>
        <p className="font-display text-xs font-semibold uppercase tracking-wider text-[#737373] mb-1">
          {meta.group}
        </p>
        <h1 className="font-display font-bold text-3xl tracking-tight">{meta.label}</h1>
      </div>

      <ContentEditor
        sectionKey={section}
        initial={current as never}
        defaults={defaults as never}
      />
    </div>
  );
}
