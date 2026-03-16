"use client";

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
    tech: [
      "Next.js 16",
      "React 19",
      "Supabase",
      "Stripe",
      "Resend",
      "Framer Motion",
      "Lenis",
    ],
    url: "https://bxl.metaventionsai.com",
  },
];

export function ClientShowcase({ isLight }: ClientShowcaseProps) {
  return (
    <section id="clients" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4 ${
              isLight
                ? "bg-white border-amber-200 text-amber-700"
                : "bg-black/30 border-amber-500/30 text-amber-400"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider">
              Client Work
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Client Projects</h2>
          <p className={isLight ? "text-gray-600" : "text-[#737373]"}>
            End-to-end delivery for real clients — from concept to production
          </p>
        </div>

        <div className="space-y-8">
          {clientProjects.map((project, index) => (
            <div
              key={index}
              className={`p-6 md:p-8 rounded-2xl border transition-all hover:border-amber-500/50 ${
                isLight
                  ? "bg-gradient-to-br from-white to-amber-50/30 border-gray-200"
                  : "bg-gradient-to-br from-[#0a0a0a] to-[#0f0d08] border-[#262626]"
              }`}
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{project.name}</h3>
                  <p
                    className={`text-sm mb-1 ${
                      isLight ? "text-amber-700" : "text-amber-400"
                    }`}
                  >
                    {project.client}
                  </p>
                  <p
                    className={`text-sm ${
                      isLight ? "text-gray-500" : "text-[#737373]"
                    }`}
                  >
                    Role: {project.role}
                  </p>
                </div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors"
                >
                  View Live Site
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              {/* Description */}
              <p
                className={`mb-6 leading-relaxed ${
                  isLight ? "text-gray-700" : "text-[#a3a3a3]"
                }`}
              >
                {project.description}
              </p>

              {/* Deliverables */}
              <div className="mb-6">
                <p
                  className={`text-sm font-semibold mb-3 ${
                    isLight ? "text-gray-700" : "text-[#a3a3a3]"
                  }`}
                >
                  Deliverables:
                </p>
                <ul className="grid md:grid-cols-2 gap-2">
                  {project.deliverables.map((item, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-2 text-sm ${
                        isLight ? "text-gray-600" : "text-[#8a8a8a]"
                      }`}
                    >
                      <span className="text-amber-500 mt-0.5 shrink-0">
                        &bull;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isLight
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-amber-950/30 text-amber-400 border border-amber-800/30"
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
