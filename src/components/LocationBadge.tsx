"use client";

interface LocationBadgeProps {
  city: string;
  count: string;
  role: string;
  isLight: boolean;
}

export function LocationBadge({ city, count, role, isLight }: LocationBadgeProps) {
  return (
    <div className={`px-4 py-2 border rounded-lg text-center ${isLight ? 'bg-gray-100 border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
      <div className="font-bold">{city}</div>
      <div className="text-xs text-[#6366f1]">{count} events</div>
      <div className={`text-xs ${isLight ? 'text-gray-500' : 'text-[#525252]'}`}>{role}</div>
    </div>
  );
}
