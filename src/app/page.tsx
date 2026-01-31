"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useNavigationShortcuts } from "@/hooks/useKeyboardShortcuts";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import SkipToContent from "@/components/SkipToContent";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import KeyboardShortcutsHelp from "@/components/KeyboardShortcutsHelp";

// Add sections one by one
import { AskSection } from "@/components/sections/AskSection";
import { ProofSection } from "@/components/sections/ProofSection";
import { SystemsSection } from "@/components/sections/SystemsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ArenaSection } from "@/components/sections/ArenaSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  useNavigationShortcuts();

  return (
    <main className="min-h-screen">
      <SkipToContent />
      <KeyboardShortcutsHelp isLight={isLight} />
      <ScrollProgress />
      <Nav />
      <Hero />

      {/* Testing all section components */}
      <AskSection isLight={isLight} />
      <ProofSection isLight={isLight} />
      <SystemsSection isLight={isLight} />
      <ProjectsSection isLight={isLight} />
      <ArenaSection isLight={isLight} />
      <ContactSection isLight={isLight} />

      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Testing All Section Components</h2>
        <p className={isLight ? 'text-gray-600' : 'text-gray-400'}>
          Currently testing: All section components (no dynamic imports yet)
        </p>
      </section>

      <Footer isLight={isLight} />
      <BackToTop isLight={isLight} />
    </main>
  );
}
