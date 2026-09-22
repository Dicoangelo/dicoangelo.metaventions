import type { Metadata } from "next";
import OriginalHome from "@/components/OriginalHome";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return <OriginalHome />;
}
