import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/showcase", "/ai-augmented", "/see-more", "/frontier-ops"].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}
