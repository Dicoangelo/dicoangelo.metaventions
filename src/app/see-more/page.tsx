"use client";

import { useTheme } from "@/components/ThemeProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { SystemsSection } from "@/components/sections/SystemsSection";
import dynamic from "next/dynamic";

const InteractiveCodeDemo = dynamic(() => import("@/components/InteractiveCodeDemo"), {
  ssr: true,
});

export default function SeeMorePage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <main className="min-h-screen">
      <Nav />

      {/* Hero Banner */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
            isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-indigo-950/50 border-indigo-500/30 text-indigo-400'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider">Deep Dive</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Technical Infrastructure
          </h1>

          <p className={`text-lg max-w-2xl mx-auto ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
            Explore the self-improving AI systems and interactive code examples that power the Antigravity ecosystem.
          </p>
        </div>
      </section>

      {/* 9-System Neural Architecture */}
      <SystemsSection isLight={isLight} />

      {/* Interactive Code Examples */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Interactive Code Examples</h2>
            <p className={`text-lg max-w-2xl mx-auto ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
              Live demonstrations of multi-agent orchestration, quality scoring, and autonomous systems.
            </p>
          </div>
          <InteractiveCodeDemo isLight={isLight} />
        </div>
      </section>

      {/* Back to Home CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <a
            href="/"
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 ${
              isLight
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>
      </section>

      <Footer isLight={isLight} />
      <BackToTop isLight={isLight} />
    </main>
  );
}
