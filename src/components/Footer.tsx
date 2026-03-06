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
    { value: "410K+", label: "Lines of Code" },
    { value: "8+", label: "Research Papers" },
  ];

  return (
    <footer
      className={`border-t ${isLight ? "border-gray-200 bg-gray-50" : "border-[#262626] bg-[#0a0a0a]"
        }`}
    >
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <p className="text-xl font-bold mb-3">Dico Angelo</p>
            <p
              className={`text-sm mb-4 max-w-md ${isLight ? "text-gray-600" : "text-[#a3a3a3]"
                }`}
            >
              Operations Leader & AI Systems Builder. Combining enterprise-scale
              execution with hands-on technical depth in AI and automation.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors hover:text-[#6366f1] ${isLight ? "text-gray-600" : "text-[#a3a3a3]"
                    }`}
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className={`text-sm font-semibold mb-3 ${isLight ? "text-gray-900" : "text-white"
                }`}
            >
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`text-sm transition-colors hover:text-[#6366f1] ${isLight ? "text-gray-600" : "text-[#a3a3a3]"
                      }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Stats */}
          <div>
            <h3
              className={`text-sm font-semibold mb-3 ${isLight ? "text-gray-900" : "text-white"
                }`}
            >
              At a Glance
            </h3>
            <ul className="space-y-2">
              {stats.map((stat) => (
                <li key={stat.label} className="text-sm">
                  <span className={`font-bold ${isLight ? "text-[#4f46e5]" : "text-[#6366f1]"}`}>{stat.value}</span>
                  <span
                    className={`ml-2 ${isLight ? "text-gray-600" : "text-[#a3a3a3]"
                      }`}
                  >
                    {stat.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm ${isLight
              ? "border-gray-200 text-gray-500"
              : "border-[#262626] text-[#525252]"
            }`}
        >
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
            <span>&copy; {currentYear} Dico Angelo. All rights reserved.</span>
            <span
              className={`hidden md:inline ${isLight ? "text-gray-300" : "text-[#404040]"
                }`}
            >
              •
            </span>
            <span className="text-xs">Canadian Citizen · TN Visa Eligible</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Reduced Motion Toggle for accessibility */}
            <ReducedMotionToggle isLight={isLight} />
            <span
              className={`hidden md:inline ${isLight ? "text-gray-300" : "text-[#404040]"}`}
            >
              •
            </span>
            <span className="text-xs">Built with AI orchestration</span>
            <span
              className={`px-2 py-1 rounded text-xs ${isLight
                  ? "bg-blue-100 text-blue-700"
                  : "bg-[#6366f1]/10 text-[#6366f1]"
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
