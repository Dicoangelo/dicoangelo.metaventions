"use client";

import { useEffect, useRef, useState } from "react";
import { useCountAnimation } from "@/hooks/useCountAnimation";
import { anomalyStats } from "./data";

interface AnomalyStatsProps {
  isLight: boolean;
}

function StatCard({
  value,
  label,
  isLight,
  shouldAnimate,
}: {
  value: string;
  label: string;
  isLight: boolean;
  shouldAnimate: boolean;
}) {
  const numericMatch = value.match(/^([\d,.]+)/);
  const numericValue = numericMatch
    ? parseFloat(numericMatch[1].replace(/,/g, ""))
    : null;
  const suffix = numericMatch ? value.slice(numericMatch[0].length) : "";
  const isInteger =
    numericValue !== null && Number.isInteger(numericValue) && numericValue > 1;

  const animatedCount = useCountAnimation(
    isInteger ? numericValue : 0,
    2000,
    0,
    shouldAnimate && isInteger
  );

  const displayValue =
    isInteger && shouldAnimate
      ? animatedCount.toLocaleString() + suffix
      : value;

  return (
    <div
      className={`p-4 rounded-xl border text-center transition-colors ${
        isLight
          ? "bg-white border-gray-200 hover:border-indigo-300"
          : "bg-[#141414] border-[#262626] hover:border-indigo-500/40"
      }`}
    >
      <div
        className="text-2xl font-bold font-mono bg-gradient-to-r from-[#4f8fff] to-[#06b6d4] bg-clip-text text-transparent mb-1"
      >
        {displayValue}
      </div>
      <div
        className={`text-xs font-medium ${
          isLight ? "text-gray-500" : "text-[#737373]"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

export function AnomalyStats({ isLight }: AnomalyStatsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef}>
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            className={`rounded-2xl border p-8 ${
              isLight
                ? "bg-gradient-to-br from-indigo-50/50 to-cyan-50/50 border-indigo-200"
                : "bg-gradient-to-br from-[#4f8fff]/5 to-[#06b6d4]/5 border-[#4f8fff]/20"
            }`}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#4f8fff] to-[#06b6d4] bg-clip-text text-transparent">
              The Anomaly Stats
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
              {anomalyStats.map((stat) => (
                <StatCard
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                  isLight={isLight}
                  shouldAnimate={isVisible}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
