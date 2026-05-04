"use client";

import { useReadingDepth } from "@/components/ReadingDepthProvider";

interface ClientProject {
  name: string;
  client: string;
  role: string;
  description: string;
  deliverables: string[];
  tech: string[];
  url: string;
  image?: string;
}

interface ClientShowcaseProps {
  isLight: boolean;
}

const clientProjects: ClientProject[] = [
  {
    name: "The Signature Event",
    client: "Cooper Swanson Ventures",
    role: "Strategy & Activation",
    description:
      "Luxury event marketing website for an invitation-only networking gathering of 40 curated professionals at a private Miami penthouse. Delivered end-to-end in under 2 weeks — from client meeting to live deployment.",
    deliverables: [
      "Full marketing site with video showcase + 57-photo gallery",
      "Sponsor tier system (title, premium, beverage, production)",
      "Post-event recap mode with next-event funnel",
      "Print flyer generators + QR code tools",
      "Vercel Analytics with custom CTA tracking",
    ],
    tech: ["Next.js 16", "React 19", "Tailwind 4", "Framer Motion", "Vercel Blob"],
    url: "https://thesignatureevent.metaventionsai.com",
  },
  {
    name: "Bxlence Hospitality",
    client: "Bxlence Hospitality (Co-Founded)",
    role: "Co-Founder & Technology Lead",
    description:
      "Complete digital platform for a luxury hospitality brand — hotels, dining, nightlife, yacht charters, private aviation, and membership experiences. Flagship Miami with multi-city expansion framework.",
    deliverables: [
      "15+ page platform with server components + dynamic routing",
      "3-tier membership system ($2.5K / $10K / invitation-only) via Stripe",
      "Event packages ($15K–$35K+) with booking pipeline",
      "30+ custom animation components from scratch",
      "Supabase-backed lead pipeline + Resend email notifications",
      "Multi-city expansion framework with waitlist system",
    ],
    tech: ["Next.js 16", "React 19", "Supabase", "Stripe", "Resend", "Framer Motion", "Lenis"],
    url: "https://bxl.metaventionsai.com",
  },
  {
    name: "FriendlyFace",
    client: "Mohammed Safiia (U of Windsor)",
    role: "Engineering & Productization",
    description:
      "Forensic-friendly facial recognition platform productizing Mohammed's ICDF2C 2024 schema — chain-of-custody evidence sealing (ForensicSeal), AI compliance proxy, and Layer-3 blockchain anchoring. Took the academic framework from paper to deployable product, deployed across 3 Fly.io regions with LiteFS replication.",
    deliverables: [
      "ForensicSeal evidence-sealing primitive (the core invention)",
      "AI compliance proxy as Trojan-horse business model",
      "Multi-region Fly.io deployment with LiteFS replication",
      "Demo-ready UI with live forensic chain-of-custody trace",
      "ICDF2C 2024 schema implementation w/ SOTA 2026 components",
    ],
    tech: ["FastAPI", "Computer Vision", "Blockchain", "Fly.io", "LiteFS", "Docker"],
    url: "https://friendlyface.metaventionsai.com",
  },
];

export function ClientShowcase({ isLight }: ClientShowcaseProps) {
  const { depth } = useReadingDepth();
  const showSummary = depth !== "skim";
  const showDeep = depth === "deep";

  return (
    <section id="clients" className="relative py-24 px-6">
      {/* Ambient brand wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[60%] blur-3xl opacity-40"
        style={{
          background: isLight
            ? "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(99,102,241,0.10), transparent 70%)"
            : "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(99,102,241,0.16), transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span
            className={`inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 ${
              isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"
            }`}
          >
            Client Work
          </span>
          <h2
            className={`text-4xl md:text-5xl font-bold tracking-tight ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Shipped for clients.
          </h2>
          {showSummary && (
            <p
              className={`mt-5 max-w-2xl mx-auto text-[15px] leading-relaxed ${
                isLight ? "text-gray-600" : "text-[#a3a3a3]"
              }`}
            >
              End-to-end delivery — from first conversation to production traffic.
            </p>
          )}
        </div>

        <div className="space-y-5">
          {clientProjects.map((project) => (
            <article
              key={project.name}
              className={`group relative overflow-hidden p-6 md:p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                isLight
                  ? "bg-white/70 border-gray-200/80 hover:border-[#6366f1]/40 hover:shadow-[0_12px_32px_-12px_rgba(99,102,241,0.20)]"
                  : "bg-white/[0.025] border-white/[0.07] hover:border-[#6366f1]/40 hover:bg-white/[0.04]"
              }`}
            >
              {/* Top hairline accent */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 -top-px h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.7) 50%, transparent 100%)",
                }}
              />

              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                <div className="min-w-0">
                  <p
                    className={`text-[10.5px] font-semibold uppercase tracking-[0.16em] mb-1.5 ${
                      isLight ? "text-[#6366f1]/70" : "text-[#818cf8]/80"
                    }`}
                  >
                    {project.role}
                  </p>
                  <h3
                    className={`text-[22px] md:text-2xl font-bold tracking-tight mb-1.5 ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {project.name}
                  </h3>
                  <p
                    className={`text-[13px] ${
                      isLight ? "text-gray-500" : "text-[#737373]"
                    }`}
                  >
                    {project.client}
                  </p>
                </div>

                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/cta shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white transition-all duration-200 active:scale-[0.98] hover:shadow-[0_8px_20px_-8px_rgba(99,102,241,0.5)]"
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  }}
                >
                  View live site
                  <svg
                    aria-hidden="true"
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover/cta:translate-x-0.5"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>

              {/* Description */}
              {showSummary && (
                <p
                  className={`text-[14px] leading-relaxed mb-5 ${
                    isLight ? "text-gray-700" : "text-[#a3a3a3]"
                  }`}
                >
                  {project.description}
                </p>
              )}

              {/* Deliverables */}
              {showDeep && (
                <div className="mb-5">
                  <p
                    className={`text-[10.5px] font-semibold uppercase tracking-[0.14em] mb-3 ${
                      isLight ? "text-[#6366f1]/70" : "text-[#818cf8]/80"
                    }`}
                  >
                    Delivered
                  </p>
                  <ul className="grid md:grid-cols-2 gap-x-6 gap-y-2">
                    {project.deliverables.map((item) => (
                      <li
                        key={item}
                        className={`flex items-start gap-2 text-[13px] leading-snug ${
                          isLight ? "text-gray-600" : "text-[#a3a3a3]"
                        }`}
                      >
                        <span
                          className={`mt-[7px] shrink-0 inline-block w-1 h-1 rounded-full ${
                            isLight ? "bg-[#6366f1]/60" : "bg-[#818cf8]/70"
                          }`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack */}
              {showSummary && (
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className={`text-[10.5px] px-2 py-1 rounded-md font-medium tracking-tight ${
                        isLight
                          ? "bg-gray-100/80 text-gray-700"
                          : "bg-white/[0.04] text-[#a3a3a3]"
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
