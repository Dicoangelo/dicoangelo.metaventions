import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

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
  authors: [{ name: "Dico Angelo", url: "https://dicoangelo.vercel.app" }],
  creator: "Dico Angelo",
  openGraph: {
    title: "Dico Angelo — Operations Infrastructure Builder & AI Systems Engineer",
    description: "Processed $800M+ in cloud marketplace deals (97% approval). Built 297K+ LOC implementing 8+ arXiv papers. Published npm packages. Operations infrastructure meets AI engineering.",
    type: "website",
    url: "https://dicoangelo.vercel.app",
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

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dico Angelo",
  jobTitle: "Operations Infrastructure Builder & AI Systems Engineer",
  description: "Operations infrastructure builder who processed $800M+ in cloud marketplace deal registrations while shipping 297K+ lines of production AI systems",
  url: "https://dicoangelo.vercel.app",
  sameAs: [
    "https://github.com/Dicoangelo",
    "https://www.linkedin.com/in/dicoangelo",
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
    "Machine Learning",
    "arXiv Implementation",
    "Partner Operations"
  ],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "University of Windsor",
    sameAs: "https://www.uwindsor.ca"
  },
  worksFor: [
    {
      "@type": "Organization",
      name: "Metaventions AI",
      description: "Founder & Systems Architect"
    }
  ],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certificate",
      name: "AWS Partner: Business Accreditation"
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certificate",
      name: "AWS Partner: Generative AI on AWS Essentials"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
