import type { MetadataRoute } from "next";
import { SECTIONS } from "@/lib/sections";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://msg-coral.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["/", "/court", ...SECTIONS.map((s) => s.href), "/privacy"];
  // De-dupe in case a section overlaps a top-level route.
  const unique = Array.from(new Set(routes));
  return unique.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
