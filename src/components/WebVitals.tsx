"use client";

import { useEffect } from "react";

export function WebVitals() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only load web-vitals in production
    if (process.env.NODE_ENV === "production") {
      import("web-vitals").then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
        onCLS(sendToAnalytics);
        onFCP(sendToAnalytics);
        onLCP(sendToAnalytics);
        onTTFB(sendToAnalytics);
        onINP(sendToAnalytics);
      });
    }
  }, []);

  return null;
}

function sendToAnalytics(metric: any) {
  // Log to console in development
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Web Vital] ${metric.name}:`, metric.value);
    return;
  }

  // Send to analytics service (Google Analytics, etc.)
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", metric.name, {
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      event_category: "Web Vitals",
      event_label: metric.id,
      non_interaction: true,
    });
  }

  // Log for debugging
  console.log(`[Web Vital] ${metric.name}:`, {
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
  });
}
