import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("/see-more", "Technical Infrastructure", "Explore independent AI system architecture and illustrative code examples from Dico Angelo's portfolio.");

export default function TechnicalLayout({ children }: { children: ReactNode }) {
  return children;
}
