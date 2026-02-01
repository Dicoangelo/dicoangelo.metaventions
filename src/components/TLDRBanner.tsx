"use client";

import { useTheme } from "@/components/ThemeProvider";

export default function TLDRBanner() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section className={`py-8 px-6 border-t border-b ${
      isLight
        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'
        : 'bg-gradient-to-r from-indigo-950/30 to-purple-950/30 border-indigo-500/20'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Main TLDR */}
          <div className="md:col-span-2">
            <h2 className={`text-sm font-bold uppercase tracking-widest mb-3 ${
              isLight ? 'text-indigo-600' : 'text-indigo-400'
            }`}>
              TLDR
            </h2>
            <p className={`text-lg leading-relaxed font-medium ${
              isLight ? 'text-gray-900' : 'text-white'
            }`}>
              Built <span className="text-indigo-600 font-bold">$800M+</span> cloud marketplace infrastructure at Contentsquare.
              Now shipping <span className="text-indigo-600 font-bold">autonomous AI systems</span> and building production frameworks for agentic development.
              <span className="block mt-2">Open to founding technical roles, CTO positions, or deep technical partnerships.</span>
            </p>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col justify-center gap-3">
            <a
              href="#contact"
              className={`px-6 py-3 rounded-lg font-semibold transition-all text-center whitespace-nowrap ${
                isLight
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
              }`}
            >
              Schedule Call
            </a>
            <p className={`text-xs text-center ${
              isLight ? 'text-gray-600' : 'text-[#a3a3a3]'
            }`}>
              ~30 min technical conversation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
