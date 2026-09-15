import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("/frontier-ops", "AI Workflow Self-Assessment", "An informal reflection tool for exploring how AI supports your work. Results are self-reported and are not an independent certification.");

export default function FrontierOpsLayout({ children }: { children: ReactNode }) {
  return children;
}
