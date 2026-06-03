import { MetadataRoute } from "next";
import { cases } from "@/lib/cases";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vetorautomacao.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const casesEntries = cases.map((c) => ({
    url: `${siteUrl}/cases/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/cases`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/assistente-de-vendas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    ...casesEntries,
  ];
}
