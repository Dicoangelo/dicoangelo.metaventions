"use client";

import { useState, useEffect, useRef } from "react";
import { useCountAnimation } from "@/hooks/useCountAnimation";
import { useReadingDepth } from "./ReadingDepthProvider";

interface MetricCardProps {
  value: string;
  label: string;
  context: string;
  proof: string;
  isLight: boolean;
}

const MONO_FONT = "var(--font-jetbrains-mono, 'JetBrains Mono', ui-monospace, monospace)";

export function MetricCard({ value, label, context, proof, isLight }: MetricCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { depth } = useReadingDepth();
  const showContext = depth !== "skim";
  const showProof = depth === "deep";

  const parseValue = (val: string): { number: number; prefix: string; suffix: string; hasDecimal: boolean } => {
    const match = val.match(/^([^\d]*)(\d+(?:,\d{3})*(?:\.\d+)?)(.*)$/);
    if (!match) return { number: 0, prefix: "", suffix: val, hasDecimal: false };

    const numberStr = match[2].replace(/,/g, "");
    const hasDecimal = numberStr.includes(".");
    return {
      number: parseFloat(numberStr),
      prefix: match[1],
      suffix: match[3],
      hasDecimal,
    };
  };

  const { number: targetNumber, prefix, suffix, hasDecimal } = parseValue(value);
  const decimals = hasDecimal ? 1 : 0;
  const animatedValue = useCountAnimation(targetNumber, 2000, 0, isVisible, decimals);

  const formatNumber = (num: number): string => {
    if (hasDecimal) return num.toFixed(1);
    if (num >= 1000) return num.toLocaleString("en-US");
    return num.toString();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const displayValue = isVisible ? `${prefix}${formatNumber(animatedValue)}${suffix}` : value;

  return (
    <div
      ref={cardRef}
      className={`group relative p-4 md:p-5 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 ${
        isLight
          ? "bg-white/70 border-gray-200/80 hover:border-[#6366f1]/40 hover:shadow-[0_8px_24px_-8px_rgba(99,102,241,0.20)]"
          : "bg-white/[0.025] border-white/[0.07] hover:border-[#6366f1]/40 hover:bg-white/[0.04]"
      }`}
    >
      {/* Hover glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(99,102,241,0.12), transparent 70%)" }}
      />

      <div
        className="relative text-[28px] md:text-[34px] font-bold leading-none tracking-tight tabular-nums"
        style={{
          fontFamily: MONO_FONT,
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 2px 14px rgba(99,102,241,0.20))",
        }}
      >
        {displayValue}
      </div>

      <div
        className={`relative font-semibold text-[13px] tracking-tight mt-3 ${showContext ? "mb-2" : ""} ${
          isLight ? "text-gray-900" : "text-white"
        }`}
      >
        {label}
      </div>

      {showContext && (
        <div className={`relative text-[11.5px] leading-snug tracking-[-0.005em] ${showProof ? "mb-2.5" : ""} ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
          {context}
        </div>
      )}

      {showProof && (
        <div className={`relative text-[10.5px] leading-snug pt-2.5 mt-2.5 border-t ${isLight ? "text-gray-500 border-gray-200/70" : "text-[#737373] border-white/[0.06]"}`}>
          {proof}
        </div>
      )}
    </div>
  );
}
