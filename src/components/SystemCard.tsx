"use client";

interface SystemCardProps {
  name: string;
  description: string;
  metric: string;
  isLight: boolean;
}

export function SystemCard({ name, description, metric, isLight }: SystemCardProps) {
  return (
    <div className="card p-6 hover:border-[#6366f1]/30">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold">{name}</h4>
        <span
          className={`text-xs px-2 py-1 rounded ${
            isLight ? "bg-indigo-100 text-indigo-600" : "bg-[#6366f1]/10 text-[#6366f1]"
          }`}
        >
          {metric}
        </span>
      </div>
      <p className={`text-sm ${isLight ? "text-gray-600" : "text-[#737373]"}`}>
        {description}
      </p>
    </div>
  );
}
