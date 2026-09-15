import type { Metadata } from "next";
import { SITE_URL } from "./site-url";

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const fullTitle = `${title} | Dico Angelo`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: `${SITE_URL}${path}`,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: ["/twitter-image"] },
  };
}
