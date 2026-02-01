"use client";

import { useEffect, useCallback, RefObject } from "react";

interface UseFocusTrapOptions {
  onEscape?: () => void;
  initialFocus?: "first" | "container";
  returnFocus?: boolean;
}

const FOCUSABLE_SELECTORS = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

/**
 * useFocusTrap - Traps keyboard focus within a container element
 *
 * Features:
 * - Tab cycles through focusable elements within container
 * - Shift+Tab cycles backwards
 * - Escape key triggers onEscape callback
 * - Stores previous activeElement and restores on unmount
 * - Moves focus to first focusable element on mount
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  options: UseFocusTrapOptions = {}
) {
  const {
    onEscape,
    initialFocus = "first",
    returnFocus = true,
  } = options;

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    const elements = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    return Array.from(elements).filter((el) => {
      // Additional check: ensure element is visible and not hidden
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }, [containerRef]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!containerRef.current) return;

      // Handle Escape key
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape?.();
        return;
      }

      // Handle Tab key for focus trapping
      if (event.key === "Tab") {
        const focusableElements = getFocusableElements();

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement;

        // Shift+Tab: move backwards
        if (event.shiftKey) {
          if (activeElement === firstElement || !containerRef.current.contains(activeElement)) {
            event.preventDefault();
            lastElement.focus();
          }
        }
        // Tab: move forwards
        else {
          if (activeElement === lastElement || !containerRef.current.contains(activeElement)) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [containerRef, getFocusableElements, onEscape]
  );

  useEffect(() => {
    // Store the previously focused element
    const previousActiveElement = document.activeElement as HTMLElement | null;

    // Set initial focus
    if (containerRef.current) {
      if (initialFocus === "container") {
        // Make container focusable if it isn't already
        if (!containerRef.current.hasAttribute("tabindex")) {
          containerRef.current.setAttribute("tabindex", "-1");
        }
        containerRef.current.focus();
      } else {
        // Focus first focusable element
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        } else if (containerRef.current) {
          // Fallback: focus container if no focusable elements
          if (!containerRef.current.hasAttribute("tabindex")) {
            containerRef.current.setAttribute("tabindex", "-1");
          }
          containerRef.current.focus();
        }
      }
    }

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Restore focus to previously focused element
      if (returnFocus && previousActiveElement && typeof previousActiveElement.focus === "function") {
        // Use setTimeout to ensure the focus restoration happens after any DOM changes
        setTimeout(() => {
          previousActiveElement.focus();
        }, 0);
      }
    };
  }, [containerRef, getFocusableElements, handleKeyDown, initialFocus, returnFocus]);

  return {
    getFocusableElements,
  };
}

export default useFocusTrap;
