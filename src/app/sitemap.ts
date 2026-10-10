import type { MetadataRoute } from "next";
import { bonuses } from "@/bonuses";
import { abs } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: abs("/"), changeFrequency: "weekly", priority: 1 },
    ...bonuses.map((b) => ({ url: abs(`/bonuses/${b.meta.slug}`), lastModified: b.meta.datePublished, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
