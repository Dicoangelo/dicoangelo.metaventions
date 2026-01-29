import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dico Angelo — Builder-Operator Hybrid | AI Systems & GTM Infrastructure",
  description: "Architect-Operator Hybrid with $800M+ in cloud partnerships and 85K+ lines of production AI systems. Building the infrastructure layer for agentic AI.",
  keywords: ["AI Systems", "Agentic Infrastructure", "Cloud Partnerships", "GTM Operations", "Multi-Agent Systems"],
  authors: [{ name: "Dico Angelo" }],
  openGraph: {
    title: "Dico Angelo — Builder-Operator Hybrid",
    description: "Architect-Operator Hybrid with $800M+ in cloud partnerships and 85K+ lines of production AI systems.",
    type: "website",
    url: "https://dicoangelo.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dico Angelo — Builder-Operator Hybrid",
    description: "Architect-Operator Hybrid with $800M+ in cloud partnerships and 85K+ lines of production AI systems.",
    creator: "@dicoangelo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
