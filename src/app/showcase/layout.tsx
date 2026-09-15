import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("/showcase", "Selected AI Systems", "Architecture, workflow snapshots, and demos from Dico Angelo's independent AI-assisted projects.");

export default function ShowcaseLayout({ children }: { children: ReactNode }) {
  return children;
}
