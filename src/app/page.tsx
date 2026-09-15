import GtmHome from "@/components/GtmHome";
import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return <GtmHome />;
}
