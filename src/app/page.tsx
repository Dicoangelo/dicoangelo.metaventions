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

      {/* Testing AskSection */}
      <AskSection isLight={isLight} />

      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Testing Component by Component</h2>
        <p className={isLight ? 'text-gray-600' : 'text-gray-400'}>
          Currently testing: AskSection
        </p>
      </section>

      <Footer isLight={isLight} />
      <BackToTop isLight={isLight} />
    </main>
  );
}
