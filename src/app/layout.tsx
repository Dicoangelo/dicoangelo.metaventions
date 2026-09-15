import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ReadingDepthProvider } from "@/components/ReadingDepthProvider";
import { CURRENT_ROLE } from "@/lib/current-role";
import { PROFILE_TITLE, PROFILE_DESCRIPTION } from "@/lib/professional-profile";
import { SITE_URL } from "@/lib/site-url";

// Viewport configuration for optimal mobile experience
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: PROFILE_TITLE,
  description: PROFILE_DESCRIPTION,
  keywords: ["Revenue Technology", "GTM Operations", "RevOps", "Platform Adoption", "Workflow Automation", "AI Enablement", "Cloud Marketplace Operations"],
  authors: [{ name: "Dico Angelo", url: SITE_URL }],
  creator: "Dico Angelo",
  openGraph: {
    title: PROFILE_TITLE,
    description: PROFILE_DESCRIPTION,
    type: "website",
    url: SITE_URL,
    siteName: "Dico Angelo",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: PROFILE_TITLE,
    description: PROFILE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dico Angelo",
  jobTitle: CURRENT_ROLE.title,
  description: PROFILE_DESCRIPTION,
  url: SITE_URL,
  email: "dico.angelo97@gmail.com",
  nationality: "Canadian",
  sameAs: [
    "https://github.com/Dicoangelo",
    "https://www.linkedin.com/in/dico-angelo/"
  ],
  knowsAbout: [
    "Multi-Agent Systems",
    "AI Operations",
    "Cloud Marketplace Operations",
    "GTM Infrastructure",
    "Prompt Engineering",
    "AI-Assisted Development",
    "Claude Code",
    "Codex",
    "Gemini CLI",
    "MCP Model Context Protocol",
    "RAG",
    "LLM Evaluation",
    "Agentic Architectures",
    "Salesforce",
    "AWS",
    "Partner Operations"
  ],
  knowsLanguage: ["en-US", "en-CA"],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "University of Windsor - Odette School of Business",
    sameAs: "https://www.uwindsor.ca"
  },
  worksFor: {
    "@type": "Organization",
    name: CURRENT_ROLE.company,
  },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "accreditation",
      name: "AWS Partner: Business Accreditation",
    }
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Dico Angelo - Portfolio",
  url: SITE_URL,
  description: PROFILE_DESCRIPTION,
  author: {
    "@type": "Person",
    name: "Dico Angelo"
  },
  inLanguage: "en-US"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ===== PROGRESSIVE LOADING OPTIMIZATIONS ===== */}

        {/* Preconnect to critical origins for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for third-party services */}
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />

        {/* Preload critical above-fold image */}
        <link
          rel="preload"
          href="/headshot.jpg"
          as="image"
          type="image/jpeg"
          fetchPriority="high"
        />

        {/* Font display swap for system fonts fallback */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical CSS for above-fold content */
              :root {
                --background: #0a0a0a;
                --foreground: #ededed;
                --accent: #6366f1;
              }
              [data-theme="light"] {
                --background: #ffffff;
                --foreground: #171717;
                --accent: #4f46e5;
              }
              body {
                background: var(--background);
                color: var(--foreground);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              }
              /* Prevent layout shift from nav */
              nav { min-height: 64px; }
              /* Prevent FOUC */
              .no-fouc { opacity: 0; }
              .fouc-ready { opacity: 1; transition: opacity 0.1s; }
            `,
          }}
        />

        {/* Structured Data */}
        <Script
          id="structured-data-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Script
          id="structured-data-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <ReadingDepthProvider>
            {children}
          </ReadingDepthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
