import type { MetadataRoute } from "next";
import { getAllProjectSlugs } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL || "http://localhost:3000";
  const projects = getAllProjectSlugs().map((slug) => ({
    url: `${base}/proyectos/${slug}`,
    lastModified: new Date(),
  }));

  return [{ url: base, lastModified: new Date() }, ...projects];
}
