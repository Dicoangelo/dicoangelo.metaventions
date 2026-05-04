"use client";

interface WorldCardProps {
  title: string;
  events: string;
  insight: string;
  highlights: string[];
  isLight: boolean;
}

export function WorldCard({ title, events, insight, highlights, isLight }: WorldCardProps) {
  return (
    <div
      className={`group relative h-full p-5 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 ${
        isLight
          ? "bg-white/70 border-gray-200/80 hover:border-[#6366f1]/40 hover:shadow-[0_8px_24px_-8px_rgba(99,102,241,0.20)]"
          : "bg-white/[0.025] border-white/[0.07] hover:border-[#6366f1]/40 hover:bg-white/[0.04]"
      }`}
    >
      <p className={`text-[10.5px] font-semibold uppercase tracking-[0.16em] mb-2 ${isLight ? "text-[#6366f1]/70" : "text-[#818cf8]/80"}`}>
        {events}
      </p>
      <h4 className={`text-[15px] font-bold tracking-tight mb-2.5 ${isLight ? "text-gray-900" : "text-white"}`}>
        {title}
      </h4>
      <p className={`text-[12.5px] leading-snug mb-4 ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
        {insight}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {highlights.map((h) => (
          <span
            key={h}
            className={`text-[10.5px] px-2 py-1 rounded-md font-medium ${
              isLight ? "bg-gray-100/80 text-gray-700" : "bg-white/[0.04] text-[#a3a3a3]"
            }`}
          >
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}
