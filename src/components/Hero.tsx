"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { useParallax } from "@/hooks/useParallax";
import { useTheme } from "@/components/ThemeProvider";
import { useVisitorContext, getWelcomeMessage } from "@/hooks/useVisitorContext";

// Lazy load 3D background with fallback gradient
const ThreeBackground = dynamic(() => import("./ThreeHeroBackground"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0f0a1a] to-[#1a0a1a]" />
  ),
});

const roles = [
  "Operations Infrastructure Builder",
  "AI Systems Builder",
  "Cloud Alliance Strategist",
  "Data Operations Leader"
];

export default function Hero() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const typedRole = useTypingAnimation(roles, 80, 40, 2000);
  const visitorContext = useVisitorContext();
  const welcomeMessage = getWelcomeMessage(visitorContext);

  // Parallax for background elements (10-20% speed differential)
  const backgroundParallax = useParallax({ speed: 0.1 });
  const overlayParallax = useParallax({ speed: 0.15 });

  return (
    <section id="hero" className="pt-32 pb-20 px-6 relative overflow-hidden min-h-[90vh] flex flex-col justify-center">
      {/* Hero Background Image */}
      <div
        className="absolute inset-0 -z-30"
        style={{
          backgroundImage: 'url(/hero-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isLight ? 0.15 : 0.4,
        }}
      />

      {/* Animated 3D Background - slowest parallax layer */}
      <div
        className="absolute inset-0 -z-10 parallax-layer"
        style={backgroundParallax.style}
      >
        <ThreeBackground />
      </div>

      {/* Animated Background Gradient (Fallback/Overlay) - medium parallax layer */}
      <div
        className="absolute inset-0 -z-20 parallax-layer"
        style={overlayParallax.style}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${isLight
            ? 'from-blue-50 via-purple-50 to-pink-50'
            : 'from-[#0a0a1a] via-[#0f0a1a] to-[#1a0a1a]'
          } opacity-50`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.1),transparent_50%)]" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative">
        {/* Headshot with enhanced styling */}
        <div className="mb-8 animate-fade-in">
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#6366f1] glow shadow-2xl">
            <Image
              src="/headshot.jpg"
              alt="Dico Angelo - Operations Leader & AI Systems Builder"
              fill
              className="object-cover"
              priority
              sizes="128px"
              quality={95}
            />
          </div>
        </div>

        {/* Personalized Greeting */}
        <p
          className={`mb-4 text-sm font-medium animate-fade-in ${
            isLight ? 'text-gray-500' : 'text-gray-400'
          }`}
        >
          {welcomeMessage}
        </p>

        {/* Status Badge */}
        <div
          className={`mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm animate-fade-in animate-delay-100 ${isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-[#141414] border-[#262626]'
            }`}
          role="status"
          aria-live="polite"
        >
          <span
            className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
            aria-label="Available for work"
          />
          <span className={isLight ? 'text-gray-700 font-medium' : 'text-[#a3a3a3] font-medium'}>
            Canadian Citizen · TN Visa Eligible
          </span>
        </div>

        {/* Main Heading with Typing Animation */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in animate-delay-200">
          <span className="block mb-2">Builder-Operator</span>
          <span className="gradient-text block min-h-[1.2em]">
            {typedRole}
            <span className="animate-pulse">|</span>
          </span>
        </h1>

        {/* Value Proposition */}
        <p
          className={`text-xl mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in animate-delay-300 ${isLight ? 'text-gray-700' : 'text-[#a3a3a3]'
            }`}
        >
          Built operational infrastructure that processed{" "}
          <strong className="text-[#6366f1] font-bold">$800M+</strong> in cloud marketplace deal registrations
          (<strong>97% approval</strong>, 600+ deals/quarter).
          Shipped <strong className="text-[#6366f1] font-bold">410K+ lines</strong> of production AI systems.
          Combines enterprise-scale execution with hands-on technical depth in AI and automation.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-3 md:gap-4 justify-center mb-8 flex-wrap animate-fade-in animate-delay-400">
          <a
            href="https://app.metaventionsai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-lg group"
            aria-label="View live demo of OS-App"
          >
            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <span>Live Demo: OS-App</span>
          </a>
          <a
            href="https://github.com/Dicoangelo"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-lg group"
            aria-label="View GitHub profile with 20 repositories"
          >
            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>GitHub (20 repos)</span>
          </a>
          <a
            href="#resume"
            className="btn-secondary btn-lg group"
            aria-label="Download resume"
          >
            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Resume</span>
          </a>
        </div>

        {/* Quote */}
        <p
          className={`text-sm italic animate-fade-in animate-delay-500 ${isLight ? 'text-gray-500' : 'text-[#525252]'
            }`}
        >
          &quot;I orchestrate AI to write code. English is my programming language.&quot;
        </p>
      </div>
    </section>
  );
}
