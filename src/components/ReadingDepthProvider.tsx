"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type ReadingDepth = "skim" | "standard" | "deep";

interface ReadingDepthContextType {
  depth: ReadingDepth;
  setDepth: (d: ReadingDepth) => void;
  mounted: boolean;
}

const ReadingDepthContext = createContext<ReadingDepthContextType | undefined>(undefined);

const STORAGE_KEY = "reading-depth";

export function ReadingDepthProvider({ children }: { children: React.ReactNode }) {
  const [depth, setDepthState] = useState<ReadingDepth>("standard");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY) as ReadingDepth | null;
    if (stored === "skim" || stored === "standard" || stored === "deep") {
      setDepthState(stored);
    }
  }, []);

  const setDepth = useCallback((d: ReadingDepth) => {
    setDepthState(d);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, d);
      document.documentElement.setAttribute("data-reading-depth", d);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-reading-depth", depth);
    }
  }, [depth, mounted]);

  return (
    <ReadingDepthContext.Provider value={{ depth, setDepth, mounted }}>
      {children}
    </ReadingDepthContext.Provider>
  );
}

export function useReadingDepth() {
  const ctx = useContext(ReadingDepthContext);
  if (!ctx) {
    return { depth: "standard" as ReadingDepth, setDepth: () => {}, mounted: false };
  }
  return ctx;
}
