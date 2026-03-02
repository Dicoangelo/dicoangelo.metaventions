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
        <div className="grid md:grid-cols-3 gap-4 md:gap-8">
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
              Ran the cloud alliance operations engine at Contentsquare — <span className="text-indigo-600 font-bold">$0 to $30M+</span> across AWS and Microsoft, $800M+ in registered deals, 2x MSFT Partner of the Year. At the same time: built 58 MCP tools, production multi-agent systems, and AI infrastructure processing 163K+ events on Claude. Not sequentially — <em>simultaneously</em>.
            </p>
            <p className={`text-lg leading-relaxed font-medium mt-2 ${
              isLight ? 'text-gray-900' : 'text-white'
            }`}>
              I&rsquo;m the operations expert who is also literally at the frontier, building. Partner SA is exactly where those two things collide.
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
