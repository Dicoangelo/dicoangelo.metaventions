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
import HeroProofBar from "@/components/HeroProofBar";
import { AskSection } from "@/components/sections/AskSection";
import { ProofSection } from "@/components/sections/ProofSection";
import { MidCTA } from "@/components/sections/MidCTA";
import { ArenaSection } from "@/components/sections/ArenaSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { UCWInsightsSection } from "@/components/sections/UCWInsightsSection";
import { BridgeSection } from "@/components/sections/BridgeSection";
import { FrontierOpsScore } from "@/components/sections/FrontierOpsScore";
import { GoMotionSection } from "@/components/sections/GoMotionSection";
import { ClientShowcase } from "@/components/sections/ClientShowcase";
import { InTheFieldSection } from "@/components/sections/InTheFieldSection";
import { DeepDivePivot } from "@/components/sections/DeepDivePivot";

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

      {/* 4-tile proof bar — lives directly under hero, above the fold */}
      <HeroProofBar />

      {/* TLDR Banner — one-line positioning + CTA */}
      <TLDRBanner />

      {/* Ask Me Anything — promoted to position 2 (right under the front block) */}
      <AskSection isLight={isLight} />

      {/* Bridge Section - Partner + AI dual language positioning */}
      <BridgeSection isLight={isLight} />

      {/* Frontier Operations Score */}
      <FrontierOpsScore isLight={isLight} />

      {/* GoMotion Case Study */}
      <GoMotionSection isLight={isLight} />

      <ProofSection isLight={isLight} />

      {/* Deep-dive pivot — fills the Proof→MidCTA gap with subpage navigation */}
      <DeepDivePivot isLight={isLight} />

      {/* Mid-page repeat CTA — don't make them wait for the footer */}
      <MidCTA isLight={isLight} />

      {/* UCW Cognitive Insights */}
      <UCWInsightsSection isLight={isLight} />

      {/* Animated Metrics */}
      <AnimatedMetrics />

      {/* Logo Wall */}
      <LogoWall animated={true} />

      {/* Testimonials Section */}
      <Testimonials isLight={isLight} />

      {/* Client Projects */}
      <ClientShowcase isLight={isLight} />

      {/* Project Showcase Section */}
      <ProjectShowcase isLight={isLight} />

      {/* Resume Download Section */}
      <ResumeDownload isLight={isLight} />

      {/* Interactive Career Timeline */}
      <CareerTimeline isLight={isLight} />

      {/* In the Field + In the Arena — paired physical-presence block */}
      <InTheFieldSection isLight={isLight} />
      <ArenaSection isLight={isLight} />

      {/* Skills Visualization */}
      <SkillsVisualization isLight={isLight} />

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
