"use client";

import ReducedMotionToggle from "./ReducedMotionToggle";

interface FooterProps {
  isLight: boolean;
}

export default function Footer({ isLight }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Resume", href: "/#resume" },
    { label: "Skills", href: "/#skills" },
    { label: "Timeline", href: "/#timeline" },
    { label: "Projects", href: "/#projects" },
    { label: "Contact", href: "/#contact" },
  ];

  const socialLinks = [
    {
      label: "GitHub",
      href: "https://github.com/Dicoangelo",
      icon: (
        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/dico-angelo/",
      icon: (
        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      label: "Metaventions AI",
      href: "https://www.metaventionsai.com",
      icon: (
        <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: "npm",
      href: "https://www.npmjs.com/org/metaventionsai",
      icon: (
        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z" />
        </svg>
      ),
    },
  ];

  const stats = [
    { value: "$800M+", label: "TCV Processed" },
    { value: "900K+", label: "Lines of Code" },
    { value: "8+", label: "Research Papers" },
  ];

  return (
    <footer
      className={`relative border-t ${
        isLight ? "border-gray-200/80 bg-white/40" : "border-white/[0.07] bg-[#070707]"
      }`}
    >
      {/* Hairline accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.4) 50%, transparent 100%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-12 gap-8 md:gap-10 mb-10">
          {/* Brand Column */}
          <div className="md:col-span-6">
            <div className="flex items-center gap-2.5 mb-3">
              <span
                aria-hidden="true"
                className="inline-block w-2 h-2 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  boxShadow: "0 0 12px rgba(99,102,241,0.6)",
                }}
              />
              <p className={`text-[18px] font-bold tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
                Dico Angelo
              </p>
            </div>
            <p className={`text-[13.5px] leading-relaxed mb-5 max-w-md ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
              Operations leader and AI systems builder. Enterprise-scale execution + hands-on technical depth in AI and automation.
            </p>
            <a
              href="mailto:dicoangelo@metaventionsai.com"
              className={`inline-block text-[13.5px] mb-5 transition-colors ${
                isLight ? "text-gray-600 hover:text-[#6366f1]" : "text-[#a3a3a3] hover:text-white"
              }`}
            >
              dicoangelo@metaventionsai.com
            </a>
            <div className="flex gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border backdrop-blur-sm transition-all duration-200 active:scale-[0.96] ${
                    isLight
                      ? "bg-white/70 border-gray-200/80 text-gray-600 hover:border-[#6366f1]/40 hover:text-[#6366f1] hover:bg-white"
                      : "bg-white/[0.04] border-white/[0.08] text-[#a3a3a3] hover:border-[#6366f1]/40 hover:text-white hover:bg-white/[0.07]"
                  }`}
                >
                  <span className="block w-[18px] h-[18px]">{link.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <p
              className={`text-[10.5px] font-semibold uppercase tracking-[0.16em] mb-4 ${
                isLight ? "text-[#6366f1]/70" : "text-[#818cf8]/80"
              }`}
            >
              Navigate
            </p>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`text-[13px] transition-colors ${
                      isLight ? "text-gray-600 hover:text-[#6366f1]" : "text-[#a3a3a3] hover:text-white"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="md:col-span-3">
            <p
              className={`text-[10.5px] font-semibold uppercase tracking-[0.16em] mb-4 ${
                isLight ? "text-[#6366f1]/70" : "text-[#818cf8]/80"
              }`}
            >
              At a glance
            </p>
            <ul className="space-y-2.5">
              {stats.map((stat) => (
                <li key={stat.label} className="flex items-baseline gap-2">
                  <span
                    className="font-bold tabular-nums text-[14px]"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', ui-monospace, monospace)",
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span className={`text-[12.5px] ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>{stat.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`pt-6 border-t flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[12px] ${
            isLight ? "border-gray-200/80 text-gray-500" : "border-white/[0.06] text-[#737373]"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 md:items-center">
            <span>&copy; {currentYear} Dico Angelo. All rights reserved.</span>
            <span aria-hidden="true" className={`hidden md:inline ${isLight ? "text-gray-300" : "text-[#404040]"}`}>
              ·
            </span>
            <span>Canadian Citizen · TN Visa Eligible</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <ReducedMotionToggle isLight={isLight} />
            <span aria-hidden="true" className={`hidden md:inline ${isLight ? "text-gray-300" : "text-[#404040]"}`}>
              ·
            </span>
            <span>Built with AI orchestration</span>
            <span
              className={`px-2 py-1 rounded-md text-[10.5px] font-semibold tracking-tight backdrop-blur-sm ${
                isLight
                  ? "bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20"
                  : "bg-[#6366f1]/15 text-[#818cf8] border border-[#6366f1]/25"
              }`}
            >
              0 lines manually written
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
