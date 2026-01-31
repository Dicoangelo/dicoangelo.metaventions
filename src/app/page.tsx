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

// Inline components (not extracted)

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
