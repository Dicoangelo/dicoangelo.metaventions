"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Script from "next/script";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";
import SkipToContent from "@/components/SkipToContent";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";
import { useTheme } from "@/components/ThemeProvider";
import { useNavigationShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useCountAnimation } from "@/hooks/useCountAnimation";

// Section components
import { AskSection } from "@/components/sections/AskSection";
import { ProofSection } from "@/components/sections/ProofSection";
import { SystemsSection } from "@/components/sections/SystemsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ArenaSection } from "@/components/sections/ArenaSection";
import { ContactSection } from "@/components/sections/ContactSection";

// Loading skeletons
import { ChatSkeleton, JDAnalyzerSkeleton } from "@/components/LoadingSkeletons";

// Lazy load heavy components below the fold
const Chat = dynamic(() => import("@/components/Chat"), {
  loading: () => <ChatSkeleton />,
});

const JDAnalyzer = dynamic(() => import("@/components/JDAnalyzer"), {
  loading: () => <JDAnalyzerSkeleton />,
});

const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  ssr: true, // Keep SSR for SEO
});

const ProjectShowcase = dynamic(() => import("@/components/ProjectShowcase"), {
  ssr: true,
});

const ResumeDownload = dynamic(() => import("@/components/ResumeDownload"), {
  ssr: true,
});

const SkillsVisualization = dynamic(() => import("@/components/SkillsVisualization"), {
  ssr: true,
});

const InteractiveCodeDemo = dynamic(() => import("@/components/InteractiveCodeDemo"), {
  ssr: true,
});

const CareerTimeline = dynamic(() => import("@/components/CareerTimeline"), {
  ssr: true,
});

export default function Home() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Enable keyboard shortcuts
  useNavigationShortcuts();

  return (
    <main className="min-h-screen">
      {/* Skip to content link for keyboard navigation */}
      <SkipToContent />

      {/* Keyboard shortcuts help modal */}
      <KeyboardShortcutsHelp isLight={isLight} />

      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Navigation */}
      <Nav />

      {/* Hero */}
      <Hero />

      {/* Ask Me Anything */}
      <AskSection isLight={isLight} />

      <ProofSection isLight={isLight} />

      {/* Testimonials Section */}
      <Testimonials isLight={isLight} />

      {/* Project Showcase Section */}
      <ProjectShowcase isLight={isLight} />

      {/* Resume Download Section */}
      <ResumeDownload isLight={isLight} />

      <SystemsSection isLight={isLight} />

      <ProjectsSection isLight={isLight} />

      {/* Interactive Career Timeline */}
      <CareerTimeline isLight={isLight} />

      <ArenaSection isLight={isLight} />

      {/* Skills Visualization */}
      <SkillsVisualization isLight={isLight} />

      {/* Interactive Code Examples */}
      <InteractiveCodeDemo isLight={isLight} />

      {/* JD Fit Analyzer */}
      <section id="analyze" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">JD Fit Analyzer</h2>
            <p className={isLight ? 'text-gray-600' : 'text-[#737373]'}>
              Paste a job description to get a brutally honest fit assessment against my career dossier.
            </p>
          </div>

          {/* Intro */}
          <div className={`mb-8 p-4 rounded-lg border ${
            isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#141414] border-[#262626]'
          }`}>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
              This analyzer searches my comprehensive career dossier (700+ indexed chunks covering skills,
              projects, metrics, and experience) and provides evidence-based matching.
              <strong className={isLight ? 'text-gray-900' : 'text-white'}> No flattery, no sugarcoating</strong> —
              just the facts.
            </p>
          </div>

          {/* Analyzer Component */}
          <JDAnalyzer />
        </div>
      </section>

      <ContactSection isLight={isLight} />

      {/* Footer */}
      <Footer isLight={isLight} />

      {/* Floating CTA */}
      <FloatingCTA isLight={isLight} />

      {/* Back to Top */}
      <BackToTop isLight={isLight} />
    </main>
  );
}

// Components

function MetricCard({ value, label, context, proof, isLight }: { value: string; label: string; context: string; proof: string; isLight: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Parse value to extract number and formatting
  const parseValue = (val: string): { number: number; prefix: string; suffix: string; hasDecimal: boolean } => {
    const match = val.match(/^([^\d]*)(\d+(?:,\d{3})*(?:\.\d+)?)(.*)$/);
    if (!match) return { number: 0, prefix: '', suffix: val, hasDecimal: false };

    const numberStr = match[2].replace(/,/g, '');
    const hasDecimal = numberStr.includes('.');
    return {
      number: parseFloat(numberStr),
      prefix: match[1],
      suffix: match[3],
      hasDecimal
    };
  };

  const { number: targetNumber, prefix, suffix, hasDecimal } = parseValue(value);
  const animatedValue = useCountAnimation(targetNumber, 2000, 0, isVisible);

  // Format the animated number
  const formatNumber = (num: number): string => {
    if (hasDecimal) {
      return num.toFixed(1);
    }
    // Add commas for thousands
    if (num >= 1000) {
      return num.toLocaleString('en-US');
    }
    return num.toString();
  };

  // Intersection observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const displayValue = isVisible ? `${prefix}${formatNumber(animatedValue)}${suffix}` : value;

  return (
    <div ref={cardRef} className="metric-card p-6 rounded-xl">
      <div className="text-3xl font-bold gradient-text mb-1">{displayValue}</div>
      <div className="font-medium mb-2">{label}</div>
      <div className={`text-sm mb-2 ${isLight ? 'text-gray-600' : 'text-[#737373]'}`}>{context}</div>
      <div className={`text-xs italic ${isLight ? 'text-gray-500' : 'text-[#525252]'}`}>Proof: {proof}</div>
    </div>
  );
}

function SystemCard({ name, description, metric, isLight }: { name: string; description: string; metric: string; isLight: boolean }) {
  return (
    <div className="card p-5 hover:border-[#6366f1]/30 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold">{name}</h4>
        <span className={`text-xs px-2 py-1 rounded ${isLight ? 'bg-indigo-100 text-indigo-600' : 'bg-[#6366f1]/10 text-[#6366f1]'}`}>{metric}</span>
      </div>
      <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-[#737373]'}`}>{description}</p>
    </div>
  );
}

function ProjectCard({
  name,
  tagline,
  description,
  tech,
  stats,
  github,
  demo,
  isLight
}: {
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  stats: Record<string, string | number>;
  github: string;
  demo?: string;
  isLight: boolean;
}) {
  return (
    <div className="card p-6 glow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-[#6366f1]">{tagline}</p>
        </div>
        <div className="flex gap-2">
          <a href={github} target="_blank" className={`px-3 py-1 text-sm border rounded transition-colors ${
            isLight ? 'border-gray-200 hover:bg-gray-100' : 'border-[#262626] hover:bg-[#1f1f1f]'
          }`}>
            GitHub
          </a>
          {demo && (
            <a href={demo} target="_blank" className="px-3 py-1 text-sm bg-[#6366f1] rounded hover:bg-[#5558e3] transition-colors text-white">
              Live Demo
            </a>
          )}
        </div>
      </div>

      <p className={`mb-4 ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>{description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {tech.map(t => (
          <span key={t} className={`px-2 py-1 rounded text-xs ${isLight ? 'bg-gray-100 text-gray-700' : 'bg-[#1f1f1f]'}`}>{t}</span>
        ))}
      </div>

      <div className="flex gap-6 text-sm">
        {Object.entries(stats).map(([key, val]) => (
          <div key={key}>
            <span className={isLight ? 'text-gray-500' : 'text-[#737373]'}>{key}: </span>
            <span className="font-medium">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimelineItem({
  period,
  title,
  company,
  location,
  highlights,
  isLight
}: {
  period: string;
  title: string;
  company: string;
  location: string;
  highlights: string[];
  isLight: boolean;
}) {
  return (
    <div className={`relative pl-6 border-l-2 ${isLight ? 'border-gray-200' : 'border-[#262626]'}`}>
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#6366f1]"></div>
      <div className="text-sm text-[#6366f1] mb-1">{period}</div>
      <h4 className="text-lg font-bold">{title}</h4>
      <div className={`mb-3 ${isLight ? 'text-gray-600' : 'text-[#737373]'}`}>{company} · {location}</div>
      <ul className="space-y-1">
        {highlights.map((h, i) => (
          <li key={i} className={`text-sm flex gap-2 ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
            <span className="text-[#6366f1]">→</span> {h}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CertBadge({ name, year, isLight }: { name: string; year: string; isLight: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${isLight ? 'bg-gray-100' : 'bg-[#141414]'}`}>
      <span className="text-lg">🏆</span>
      <div className="flex-1">
        <div className="text-sm font-medium">{name}</div>
      </div>
      <span className={`text-xs ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>{year}</span>
    </div>
  );
}

function WorldCard({
  title,
  events,
  insight,
  highlights,
  isLight
}: {
  title: string;
  events: string;
  insight: string;
  highlights: string[];
  isLight: boolean;
}) {
  return (
    <div className="card p-5 h-full">
      <h4 className="font-bold text-[#6366f1] mb-1">{title}</h4>
      <p className={`text-xs mb-3 ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>{events}</p>
      <p className={`text-sm mb-3 ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>{insight}</p>
      <div className="flex flex-wrap gap-1">
        {highlights.map(h => (
          <span key={h} className={`text-xs px-2 py-1 rounded ${isLight ? 'bg-gray-100 text-gray-700' : 'bg-[#1f1f1f]'}`}>{h}</span>
        ))}
      </div>
    </div>
  );
}

function LocationBadge({ city, count, role, isLight }: { city: string; count: string; role: string; isLight: boolean }) {
  return (
    <div className={`px-4 py-2 border rounded-lg text-center ${isLight ? 'bg-gray-100 border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
      <div className="font-bold">{city}</div>
      <div className="text-xs text-[#6366f1]">{count} events</div>
      <div className={`text-xs ${isLight ? 'text-gray-500' : 'text-[#525252]'}`}>{role}</div>
    </div>
  );
}
