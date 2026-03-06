"use client";

import { techStackChips } from "./data";

interface TechStackRibbonProps {
  isLight: boolean;
}

export function TechStackRibbon({ isLight }: TechStackRibbonProps) {
  return (
    <section className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center gap-3">
          {techStackChips.map((tech) => (
            <span
              key={tech}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-default ${
                isLight
                  ? "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 border border-gray-200 hover:border-indigo-300"
                  : "bg-[#1a1a1a] text-[#d4d4d4] hover:bg-indigo-500/15 hover:text-indigo-400 border border-[#262626] hover:border-indigo-500/30"
              }`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
