"use client";

import { useEffect, useCallback, useSyncExternalStore, useRef } from "react";

const STORAGE_KEY = "reduced-motion-preference";

type MotionPreference = "on" | "off" | "system";

interface UseReducedMotionReturn {
  /** Whether reduced motion is currently active (either via system or user preference) */
  isReduced: boolean;
  /** The user's explicit preference: 'on' (reduce), 'off' (allow), or 'system' (follow OS) */
  preference: MotionPreference;
  /** Set the motion preference */
  setPreference: (pref: MotionPreference) => void;
  /** Whether the system prefers reduced motion */
  systemPrefersReduced: boolean;
}

/**
 * Hook to detect and manage prefers-reduced-motion system preference
 * with user override capability stored in localStorage.
 *
 * Priority:
 * 1. User explicit preference ('on' or 'off') from localStorage
 * 2. System preference (prefers-reduced-motion media query)
 *
 * @example
 * ```tsx
 * const { isReduced, preference, setPreference } = useReducedMotion();
 *
 * // Use isReduced to conditionally disable animations
 * const animationClass = isReduced ? '' : 'animate-fade-in';
 *
 * // Toggle button
 * <button onClick={() => setPreference(isReduced ? 'off' : 'on')}>
 *   {isReduced ? 'Enable' : 'Disable'} Animations
 * </button>
 * ```
 */

// Helper to get stored preference (for external store)
function getStoredPreference(): MotionPreference {
  if (typeof window === "undefined") return "system";
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as MotionPreference | null;
    if (stored && ["on", "off", "system"].includes(stored)) {
      return stored;
    }
  } catch {
    // localStorage may not be available
  }
  return "system";
}

// Subscribe to localStorage changes
function subscribeToStorage(callback: () => void) {
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

export function useReducedMotion(): UseReducedMotionReturn {
  // Track if we're mounted (client-side) using ref to avoid lint issues
  const mountedRef = useRef(false);

  // Use useSyncExternalStore for system preference to avoid hydration mismatch
  const systemPrefersReduced = useSyncExternalStore(
    useCallback((callback: () => void) => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    }, []),
    useCallback(() => {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []),
    useCallback(() => false, []) // Server snapshot - assume no preference
  );

  // Use useSyncExternalStore for localStorage preference
  const preference = useSyncExternalStore(
    subscribeToStorage,
    getStoredPreference,
    useCallback(() => "system" as MotionPreference, []) // Server snapshot
  );

  // Update CSS class when preference changes (side effect only, no state changes)
  useEffect(() => {
    // Mark as mounted
    mountedRef.current = true;

    // Determine if motion should be reduced
    const shouldReduce =
      preference === "on" || (preference === "system" && systemPrefersReduced);

    // Apply class to document root for global CSS override
    if (shouldReduce) {
      document.documentElement.classList.add("reduced-motion");
    } else {
      document.documentElement.classList.remove("reduced-motion");
    }

    // Cleanup on unmount
    return () => {
      // Don't remove class on unmount - other components may still need it
    };
  }, [preference, systemPrefersReduced]);

  // Callback to set preference - updates localStorage (triggers external store update)
  const setPreference = useCallback((pref: MotionPreference) => {
    try {
      localStorage.setItem(STORAGE_KEY, pref);
      // Manually dispatch storage event for same-window updates
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue: pref })
      );
    } catch {
      // localStorage may not be available
    }
  }, []);

  // Calculate effective reduced state
  const isReduced =
    preference === "on" || (preference === "system" && systemPrefersReduced);

  return {
    isReduced,
    preference,
    setPreference,
    systemPrefersReduced,
  };
}

/**
 * Simplified hook that just returns whether reduced motion is active.
 * Useful for components that only need to check the state, not control it.
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = usePrefersReducedMotion();
 * if (prefersReducedMotion) {
 *   // Skip animation
 * }
 * ```
 */
export function usePrefersReducedMotion(): boolean {
  const { isReduced } = useReducedMotion();
  return isReduced;
}
