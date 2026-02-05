import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

// Site URL configuration - can be overridden via NEXT_PUBLIC_SITE_URL env var
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dicoangelo.vercel.app";

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
  title: "Dico Angelo — Operations Infrastructure Builder | AI Systems Engineer",
  description: "Operations infrastructure builder who processed $800M+ in cloud marketplace deal registrations (97% approval) while shipping 297K+ lines of production AI systems. Implemented 8+ arXiv papers. Published 2 npm packages. Building agentic infrastructure at scale.",
  keywords: [
    "AI Engineer",
    "Data Operations Manager",
    "Technical Program Manager",
    "Multi-Agent Systems",
    "Agentic Infrastructure",
    "Cloud Marketplace Operations",
    "GTM Infrastructure",
    "Partner Operations",
    "AI Operations",
    "arXiv Implementation",
    "TypeScript",
    "Python",
    "React 19",
    "Claude API",
    "GPT-4",
    "Gemini",
    "Anthropic",
    "OpenAI",
    "DeepMind"
  ],
  authors: [{ name: "Dico Angelo", url: SITE_URL }],
  creator: "Dico Angelo",
  openGraph: {
    title: "Dico Angelo — Operations Infrastructure Builder & AI Systems Engineer",
    description: "Processed $800M+ in cloud marketplace deals (97% approval). Built 297K+ LOC implementing 8+ arXiv papers. Published npm packages. Operations infrastructure meets AI engineering.",
    type: "website",
    url: SITE_URL,
    siteName: "Dico Angelo Portfolio",
    locale: "en_US",
    images: [
      {
        url: "/headshot.jpg",
        width: 400,
        height: 400,
        alt: "Dico Angelo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dico Angelo — Operations Infrastructure Builder",
    description: "Processed $800M+ cloud marketplace deals. Built 297K+ LOC. Implemented 8+ arXiv papers. Published 2 npm packages.",
    creator: "@dicoangelo",
    images: ["/headshot.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add when available
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dico Angelo",
  jobTitle: "Operations Infrastructure Builder & AI Systems Engineer",
  description: "Operations infrastructure builder who processed $800M+ in cloud marketplace deal registrations while shipping 297K+ lines of production AI systems",
  url: SITE_URL,
  email: "hello@dicoangelo.com",
  nationality: "Canadian",
  sameAs: [
    "https://github.com/Dicoangelo",
    "https://www.linkedin.com/in/dico-angelo/",
    "https://twitter.com/dicoangelo",
    "https://www.npmjs.com/org/metaventionsai"
  ],
  knowsAbout: [
    "Multi-Agent Systems",
    "AI Operations",
    "Cloud Marketplace Operations",
    "GTM Infrastructure",
    "TypeScript",
    "Python",
    "React",
    "Next.js",
    "Agentic Architectures",
    "Machine Learning",
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
    name: "Metaventions AI",
    url: SITE_URL
  },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certificate",
      name: "AWS Partner: Business Accreditation",
      dateCreated: "2024"
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certificate",
      name: "AWS Partner: Generative AI on AWS Essentials",
      dateCreated: "2023"
    }
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Dico Angelo - Portfolio",
  url: SITE_URL,
  description: "Professional portfolio of Dico Angelo, Operations Infrastructure Builder and AI Systems Engineer",
  author: {
    "@type": "Person",
    name: "Dico Angelo"
  },
  inLanguage: "en-US"
};

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Dico Angelo - AI & Operations Consulting",
  description: "Operations infrastructure and AI systems engineering services",
  areaServed: ["US", "CA"],
  availableLanguage: "English"
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
        <Script
          id="structured-data-service"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
