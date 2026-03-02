"use client";

import { useRef, useState, useEffect } from "react";
import { useCountAnimation } from "@/hooks/useCountAnimation";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTheme } from "./ThemeProvider";

interface Metric {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  subLabel?: string;
  decimals?: number;
  icon?: React.ReactNode;
  accentColor?: string;
}

interface AnimatedMetricCardProps {
  metric: Metric;
  isVisible: boolean;
  delay: number;
  isLight: boolean;
}

function AnimatedMetricCard({ metric, isVisible, delay, isLight }: AnimatedMetricCardProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  // Only animate once
  useEffect(() => {
    if (isVisible && !hasAnimated) {
      const timer = setTimeout(() => setHasAnimated(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hasAnimated, delay]);

  // Trigger completion effect after animation
  useEffect(() => {
    if (hasAnimated) {
      const timer = setTimeout(() => setShowComplete(true), 2200); // After count animation
      return () => clearTimeout(timer);
    }
  }, [hasAnimated]);

  const count = useCountAnimation(
    metric.value,
    2000,
    0,
    hasAnimated,
    metric.decimals || 0
  );

  const accentColor = metric.accentColor || "#6366f1";

  return (
    <div
      className={`
        relative p-6 rounded-2xl border transition-all duration-500
        ${isLight
          ? "bg-white/80 border-gray-200 hover:border-indigo-300"
          : "bg-white/5 border-white/10 hover:border-indigo-500/50"
        }
        ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
      style={{
        transitionDelay: `${delay}ms`,
        boxShadow: showComplete
          ? `0 0 40px ${accentColor}20, 0 4px 20px ${isLight ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.2)"}`
          : isLight
          ? "0 4px 20px rgba(0,0,0,0.05)"
          : "0 4px 20px rgba(0,0,0,0.2)",
      }}
    >
      {/* Completion pulse ring */}
      <div
        className={`
          absolute inset-0 rounded-2xl transition-opacity duration-500
          ${showComplete ? "opacity-100" : "opacity-0"}
        `}
        style={{
          background: `radial-gradient(circle at center, ${accentColor}10 0%, transparent 70%)`,
        }}
      />

      {/* Icon */}
      {metric.icon && (
        <div
          className={`
            mb-4 w-12 h-12 rounded-xl flex items-center justify-center
            ${isLight ? "bg-indigo-50" : "bg-indigo-500/10"}
          `}
          style={{ color: accentColor }}
        >
          {metric.icon}
        </div>
      )}

      {/* Value with animation */}
      <div className="relative">
        <div
          className={`
            text-4xl md:text-5xl font-bold tabular-nums tracking-tight
            transition-all duration-300
            ${showComplete ? "scale-100" : "scale-95"}
          `}
          style={{
            background: `linear-gradient(135deg, ${accentColor} 0%, ${isLight ? "#8b5cf6" : "#a855f7"} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {metric.prefix}
          {count.toLocaleString()}
          {metric.suffix}
        </div>

        {/* Completion sparkle */}
        {showComplete && (
          <div
            className="absolute -right-2 -top-2 w-4 h-4"
            style={{
              background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* Label */}
      <p
        className={`
          mt-2 text-sm font-medium
          ${isLight ? "text-gray-900" : "text-white"}
        `}
      >
        {metric.label}
      </p>

      {/* Sub-label */}
      {metric.subLabel && (
        <p
          className={`
            mt-1 text-xs
            ${isLight ? "text-gray-500" : "text-gray-400"}
          `}
        >
          {metric.subLabel}
        </p>
      )}
    </div>
  );
}

interface AnimatedMetricsProps {
  className?: string;
}

export default function AnimatedMetrics({ className = "" }: AnimatedMetricsProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2, once: true });

  const metrics: Metric[] = [
    {
      value: 30,
      prefix: "$",
      suffix: "M+",
      label: "Revenue Influenced",
      subLabel: "Cloud marketplace operations",
      accentColor: "#10b981",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      value: 85,
      suffix: "%",
      label: "Process Automation",
      subLabel: "Manual tasks eliminated",
      accentColor: "#6366f1",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      value: 600,
      suffix: "+",
      label: "Partner Deals Processed",
      subLabel: "Per quarter at peak, 97% approval rate",
      accentColor: "#8b5cf6",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      value: 2,
      suffix: "x",
      label: "Microsoft Partner of the Year",
      subLabel: "AWS + Microsoft ecosystems",
      accentColor: "#ec4899",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={ref}
      className={`py-16 px-6 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className={`
              inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4
              ${isLight
                ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
              }
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider">Impact</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Measurable Results
          </h2>
          <p className={`max-w-2xl mx-auto ${isLight ? "text-gray-600" : "text-gray-400"}`}>
            Quantified impact from orchestrating AI-augmented systems and operations
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {metrics.map((metric, index) => (
            <AnimatedMetricCard
              key={metric.label}
              metric={metric}
              isVisible={isVisible}
              delay={index * 150}
              isLight={isLight}
            />
          ))}
        </div>

        {/* Trust indicator */}
        <div className="mt-10 text-center">
          <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-500"}`}>
            <span className="inline-flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified through published case studies and partner recognition
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
