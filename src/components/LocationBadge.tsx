"use client";

interface LocationBadgeProps {
  city: string;
  count: string;
  role: string;
  isLight: boolean;
}

export function LocationBadge({ city, count, role, isLight }: LocationBadgeProps) {
  return (
    <div
      className={`px-3.5 py-2.5 rounded-xl border text-center backdrop-blur-sm transition-all hover:-translate-y-0.5 ${
        isLight
          ? "bg-white/70 border-gray-200/80 hover:border-[#6366f1]/40"
          : "bg-white/[0.025] border-white/[0.07] hover:border-[#6366f1]/40 hover:bg-white/[0.04]"
      }`}
    >
      <div className={`font-bold text-[13px] tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
        {city}
      </div>
      <div
        className="text-[11px] font-bold text-[#6366f1] tabular-nums mt-0.5"
        style={{ fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', ui-monospace, monospace)" }}
      >
        {count} events
      </div>
      <div className={`text-[10px] mt-0.5 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>{role}</div>
    </div>
  );
}
