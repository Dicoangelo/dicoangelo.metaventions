"use client";

import { useState, useEffect, useRef } from "react";
import { useCountAnimation } from "@/hooks/useCountAnimation";

interface MetricCardProps {
  value: string;
  label: string;
  context: string;
  proof: string;
  isLight: boolean;
}

export function MetricCard({
  value,
  label,
  context,
  proof,
  isLight,
}: MetricCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Parse value to extract number and formatting
  const parseValue = (
    val: string
  ): { number: number; prefix: string; suffix: string; hasDecimal: boolean } => {
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
  // Pass decimal places to hook for proper decimal animation
  const decimals = hasDecimal ? 1 : 0;
  const animatedValue = useCountAnimation(targetNumber, 2000, 0, isVisible, decimals);

  // Format the animated number
  const formatNumber = (num: number): string => {
    if (hasDecimal) {
      return num.toFixed(1);
    }
    // Add commas for thousands
    if (num >= 1000) {
      return num.toLocaleString("en-US");
    }
    return num.toString();
  };

  // Intersection observer for animation trigger
  // Triggers when element is 50% visible (US-005 requirement)
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

  const displayValue = isVisible
    ? `${prefix}${formatNumber(animatedValue)}${suffix}`
    : value;

  return (
    <div ref={cardRef} className="metric-card p-6 rounded-xl">
      <div className="text-3xl font-bold gradient-text mb-1">{displayValue}</div>
      <div className="font-medium mb-2">{label}</div>
      <div className={`text-sm mb-2 ${isLight ? "text-gray-600" : "text-[#737373]"}`}>
        {context}
      </div>
      <div className={`text-xs italic ${isLight ? "text-gray-500" : "text-[#525252]"}`}>
        Proof: {proof}
      </div>
    </div>
  );
}
