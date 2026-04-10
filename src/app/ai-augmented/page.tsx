"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import AIAugmentedSection from "@/components/AIAugmentedSection";

export default function AIAugmentedPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <main className="min-h-screen">
      <Nav />

      <section className="pt-32 pb-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
            isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-indigo-950/50 border-indigo-500/30 text-indigo-400'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider">Positioning</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI-Augmented Operator
          </h1>

          <p className={`text-lg max-w-2xl mx-auto ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
            How human judgment and AI capability amplify each other in the systems I build.
          </p>
        </div>
      </section>

      <AIAugmentedSection />

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold transition-all hover:scale-105 ${
              isLight
                ? 'bg-white border-gray-200 text-gray-900 hover:border-indigo-300'
                : 'bg-[#141414] border-[#262626] text-white hover:border-indigo-500/50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to home</span>
          </Link>
        </div>
      </section>

      <Footer isLight={isLight} />
      <BackToTop isLight={isLight} />
    </main>
  );
}
