"use client";

import { useState, useEffect, useCallback } from "react";

interface VisitorContext {
  /** Time-based greeting */
  greeting: string;
  /** Time period of day */
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  /** Is this a return visitor? */
  isReturning: boolean;
  /** Number of visits */
  visitCount: number;
  /** Last visit timestamp */
  lastVisit: Date | null;
  /** Days since last visit */
  daysSinceLastVisit: number | null;
  /** Referrer category */
  referrerCategory: "github" | "linkedin" | "search" | "direct" | "other";
  /** Original referrer */
  referrer: string | null;
  /** Device type */
  deviceType: "mobile" | "tablet" | "desktop";
  /** Has the visitor seen the intro before? */
  hasSeenIntro: boolean;
  /** Mark intro as seen */
  markIntroSeen: () => void;
  /** Clear all visitor data */
  clearData: () => void;
}

const STORAGE_KEY = "dicoangelo_visitor";

interface StoredData {
  visitCount: number;
  lastVisit: string;
  hasSeenIntro: boolean;
  firstVisit: string;
}

function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

function getGreeting(timeOfDay: string, isReturning: boolean): string {
  const greetings = {
    morning: isReturning ? "Good morning again" : "Good morning",
    afternoon: isReturning ? "Good afternoon again" : "Good afternoon",
    evening: isReturning ? "Good evening again" : "Good evening",
    night: isReturning ? "Welcome back" : "Hello there",
  };
  return greetings[timeOfDay as keyof typeof greetings] || "Hello";
}

function getReferrerCategory(referrer: string): "github" | "linkedin" | "search" | "direct" | "other" {
  if (!referrer) return "direct";
  const r = referrer.toLowerCase();
  if (r.includes("github")) return "github";
  if (r.includes("linkedin")) return "linkedin";
  if (r.includes("google") || r.includes("bing") || r.includes("duckduckgo") || r.includes("yahoo")) return "search";
  return "other";
}

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function getDaysSince(date: Date): number {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function useVisitorContext(): VisitorContext {
  const [context, setContext] = useState<VisitorContext>(() => ({
    greeting: "Hello",
    timeOfDay: "morning",
    isReturning: false,
    visitCount: 1,
    lastVisit: null,
    daysSinceLastVisit: null,
    referrerCategory: "direct",
    referrer: null,
    deviceType: "desktop",
    hasSeenIntro: false,
    markIntroSeen: () => {},
    clearData: () => {},
  }));

  const markIntroSeen = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data: StoredData = stored ? JSON.parse(stored) : {
        visitCount: 1,
        lastVisit: new Date().toISOString(),
        hasSeenIntro: true,
        firstVisit: new Date().toISOString(),
      };
      data.hasSeenIntro = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setContext((prev) => ({ ...prev, hasSeenIntro: true }));
    } catch (e) {
      console.warn("Could not save visitor data:", e);
    }
  }, []);

  const clearData = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      setContext((prev) => ({
        ...prev,
        isReturning: false,
        visitCount: 1,
        lastVisit: null,
        daysSinceLastVisit: null,
        hasSeenIntro: false,
      }));
    } catch (e) {
      console.warn("Could not clear visitor data:", e);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const timeOfDay = getTimeOfDay();
    const deviceType = getDeviceType();
    const referrer = document.referrer || null;
    const referrerCategory = getReferrerCategory(referrer || "");

    // Load stored data
    let storedData: StoredData | null = null;
    let isReturning = false;
    let visitCount = 1;
    let lastVisit: Date | null = null;
    let daysSinceLastVisit: number | null = null;
    let hasSeenIntro = false;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        storedData = JSON.parse(stored);
        if (storedData) {
          isReturning = true;
          visitCount = storedData.visitCount + 1;
          lastVisit = new Date(storedData.lastVisit);
          daysSinceLastVisit = getDaysSince(lastVisit);
          hasSeenIntro = storedData.hasSeenIntro;
        }
      }
    } catch (e) {
      console.warn("Could not read visitor data:", e);
    }

    // Update stored data
    try {
      const newData: StoredData = {
        visitCount,
        lastVisit: new Date().toISOString(),
        hasSeenIntro,
        firstVisit: storedData?.firstVisit || new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.warn("Could not save visitor data:", e);
    }

    const greeting = getGreeting(timeOfDay, isReturning);

    setContext({
      greeting,
      timeOfDay,
      isReturning,
      visitCount,
      lastVisit,
      daysSinceLastVisit,
      referrerCategory,
      referrer,
      deviceType,
      hasSeenIntro,
      markIntroSeen,
      clearData,
    });
  }, [markIntroSeen, clearData]);

  return context;
}

/**
 * Get a contextual welcome message based on visitor state
 */
export function getWelcomeMessage(context: VisitorContext): string {
  if (context.isReturning && context.daysSinceLastVisit !== null) {
    if (context.daysSinceLastVisit === 0) {
      return `${context.greeting}! Nice to see you again today.`;
    } else if (context.daysSinceLastVisit === 1) {
      return `${context.greeting}! Good to see you again.`;
    } else if (context.daysSinceLastVisit <= 7) {
      return `${context.greeting}! Welcome back.`;
    } else {
      return `${context.greeting}! It's been a while.`;
    }
  }
  return `${context.greeting}!`;
}

/**
 * Get content suggestions based on referrer
 */
export function getSuggestedSection(context: VisitorContext): string | null {
  switch (context.referrerCategory) {
    case "github":
      return "projects"; // Show projects to GitHub visitors
    case "linkedin":
      return "resume"; // Show resume to LinkedIn visitors
    case "search":
      return null; // Let them explore
    default:
      return null;
  }
}
