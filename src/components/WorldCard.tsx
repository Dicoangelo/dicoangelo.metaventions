"use client";

interface WorldCardProps {
  title: string;
  events: string;
  insight: string;
  highlights: string[];
  isLight: boolean;
}

export function WorldCard({
  title,
  events,
  insight,
  highlights,
  isLight
}: WorldCardProps) {
  return (
    <div className="card p-5 h-full">
      <h4 className="font-bold text-[#6366f1] mb-1">{title}</h4>
      <p className={`text-xs mb-3 ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>{events}</p>
      <p className={`text-sm mb-3 ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>{insight}</p>
      <div className="flex flex-wrap gap-1">
        {highlights.map(h => (
          <span key={h} className={`text-xs px-2 py-1 rounded ${isLight ? 'bg-gray-100 text-gray-700' : 'bg-[#1f1f1f]'}`}>{h}</span>
        ))}
      </div>
    </div>
  );
}
