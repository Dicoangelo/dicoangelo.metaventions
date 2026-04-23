"use client";

import { useReadingDepth } from "@/components/ReadingDepthProvider";

interface MidCTAProps {
  isLight: boolean;
}

export function MidCTA({ isLight }: MidCTAProps) {
  const { depth } = useReadingDepth();
  const showSub = depth !== "skim";

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToResume = () => {
    document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section aria-label="Hire me" className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className={`relative overflow-hidden rounded-2xl border p-8 md:p-10 text-center ${
            isLight
              ? "bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-200"
              : "bg-gradient-to-br from-indigo-950/40 via-black/40 to-purple-950/40 border-indigo-500/30"
          }`}
        >
          <div
            aria-hidden
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
            }}
          />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Want this on your team?
          </h2>
          {showSub && (
            <p
              className={`text-base md:text-lg mb-6 max-w-xl mx-auto ${
                isLight ? "text-gray-600" : "text-[#a3a3a3]"
              }`}
            >
              20-min intro call. No deck, no pitch — just answer the questions
              you&rsquo;d ask in a first-round loop.
            </p>
          )}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={scrollToContact}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all hover:scale-105 shadow-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Book a 20-min intro
            </button>
            <button
              type="button"
              onClick={scrollToResume}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg border font-semibold transition-all hover:scale-105 ${
                isLight
                  ? "border-gray-300 text-gray-800 hover:bg-white"
                  : "border-white/20 text-white hover:bg-white/5"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download resume
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
