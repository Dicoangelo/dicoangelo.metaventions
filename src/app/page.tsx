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
import TLDRBanner from "@/components/TLDRBanner";
import { AskSection } from "@/components/sections/AskSection";
import { ProofSection } from "@/components/sections/ProofSection";
import { ArenaSection } from "@/components/sections/ArenaSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { UCWInsightsSection } from "@/components/sections/UCWInsightsSection";
import Link from "next/link";

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

const CareerTimeline = dynamic(() => import("@/components/CareerTimeline"), {
  ssr: true,
});

const AnimatedMetrics = dynamic(() => import("@/components/AnimatedMetrics"), {
  ssr: true,
});

const LogoWall = dynamic(() => import("@/components/LogoWall"), {
  ssr: true,
});

const AIAugmentedSection = dynamic(() => import("@/components/AIAugmentedSection"), {
  ssr: true,
});

const CommandPalette = dynamic(() => import("@/components/CommandPalette"), {
  ssr: false, // Client-side only for keyboard events
});

const SectionNav = dynamic(() => import("@/components/SectionNav"), {
  ssr: false, // Client-side only
});

// Lazy load ambient particles (heavy animation component)
const AmbientParticles = dynamic(() => import("@/components/AmbientParticles"), {
  ssr: false, // Client-side only
});

// Lazy load intelligent cursor (desktop only)
const IntelligentCursor = dynamic(() => import("@/components/IntelligentCursor"), {
  ssr: false, // Client-side only
});

export default function Home() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Enable keyboard shortcuts
  useNavigationShortcuts();

  return (
    <main id="main-content" role="main" className="min-h-screen">
      {/* Skip to content link for keyboard navigation */}
      <SkipToContent />

      {/* Keyboard shortcuts help modal */}
      <KeyboardShortcutsHelp isLight={isLight} />

      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Intelligent cursor (desktop only) */}
      <IntelligentCursor
        enableTrail={true}
        trailLength={6}
        lerpFactor={0.12}
      />

      {/* Command Palette (⌘K) */}
      <CommandPalette />

      {/* Section Side Navigation */}
      <SectionNav />

      {/* Ambient particle background */}
      <AmbientParticles
        count={60}
        maxSpeed={0.25}
        connectionDistance={100}
        mouseAttraction={0.0001}
        showConnections={true}
        zIndex={-1}
      />

      {/* Navigation */}
      <Nav />

      {/* Hero */}
      <Hero />

      {/* TLDR Banner - Quick summary for recruiters */}
      <TLDRBanner />

      {/* AI-Augmented Operator Positioning */}
      <AIAugmentedSection />

      {/* Ask Me Anything */}
      <AskSection isLight={isLight} />

      <ProofSection isLight={isLight} />

      {/* UCW Cognitive Insights */}
      <UCWInsightsSection isLight={isLight} />

      {/* Animated Metrics */}
      <AnimatedMetrics />

      {/* Logo Wall */}
      <LogoWall animated={true} />

      {/* Testimonials Section */}
      <Testimonials isLight={isLight} />

      {/* Project Showcase Section */}
      <ProjectShowcase isLight={isLight} />

      {/* Resume Download Section */}
      <ResumeDownload isLight={isLight} />

      {/* Interactive Career Timeline */}
      <CareerTimeline isLight={isLight} />

      <ArenaSection isLight={isLight} />

      {/* Skills Visualization */}
      <SkillsVisualization isLight={isLight} />

      {/* See More Banner - Links to Technical Deep Dive */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className={`p-8 rounded-2xl border text-center ${
            isLight
              ? 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200'
              : 'bg-gradient-to-br from-indigo-950/30 via-purple-950/30 to-pink-950/30 border-indigo-500/30'
          }`}>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4 ${
              isLight ? 'bg-white border-indigo-200 text-indigo-600' : 'bg-black/30 border-indigo-500/30 text-indigo-400'
            }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wider">Deep Dive</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">Want to See the Technical Infrastructure?</h3>
            <p className={`mb-6 max-w-xl mx-auto ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
              Explore the 9-system self-improving AI architecture, interactive code examples, and 3D neural network visualizations.
            </p>
            <Link
              href="/see-more"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
            >
              <span>See More</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

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
          <div className={`mb-8 p-4 rounded-lg border ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-[#141414] border-[#262626]'
            }`}>
            <h3 className={`text-sm font-semibold mb-2 ${isLight ? 'text-gray-900' : 'text-white'}`}>
              How It Works
            </h3>
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
