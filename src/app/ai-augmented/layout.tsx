import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("/ai-augmented", "Working with AI", "How Dico Angelo applies AI tools to research, knowledge retrieval, workflow design, and independent software projects.");

export default function AiAugmentedLayout({ children }: { children: ReactNode }) {
  return children;
}
