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

      <AskSection isLight={isLight} />

      {/* Simple ProofSection test - no animations */}
      <section className={`py-20 px-6 bg-gradient-to-b ${
        isLight ? "from-transparent to-gray-50" : "from-transparent to-[#0f0f0f]"
      }`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Verifiable Proof</h2>
            <p className={isLight ? "text-gray-600" : "text-[#737373]"}>
              Every metric below has documentation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-800">
              <div className="text-3xl font-bold mb-1">$800M+</div>
              <div className="font-medium mb-2">TCV Processed</div>
              <div className={`text-sm ${isLight ? "text-gray-600" : "text-[#737373]"}`}>
                Registered through cloud marketplace infrastructure
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-800">
              <div className="text-3xl font-bold mb-1">297K+</div>
              <div className="font-medium mb-2">Lines of Code</div>
              <div className={`text-sm ${isLight ? "text-gray-600" : "text-[#737373]"}`}>
                Production systems in TypeScript, Python, React
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-800">
              <div className="text-3xl font-bold mb-1">97%</div>
              <div className="font-medium mb-2">Approval Rate</div>
              <div className={`text-sm ${isLight ? "text-gray-600" : "text-[#737373]"}`}>
                Cloud marketplace operations (team of 3)
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer isLight={isLight} />
      <BackToTop isLight={isLight} />
    </main>
  );
}
