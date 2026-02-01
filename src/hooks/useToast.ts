"use client";

import { useCallback } from "react";
import { useToastContext, type ToastType, type ToastMessage } from "@/components/Toast";

interface UseToastReturn {
  /**
   * Show a toast notification
   * @param message - The message to display
   * @param type - The type of toast: 'success' | 'error' | 'warning' | 'info'
   * @param duration - How long to show the toast in milliseconds (default: 5000)
   * @returns The toast ID (can be used to dismiss programmatically)
   */
  toast: (message: string, type?: ToastType, duration?: number) => string;

  /**
   * Dismiss a specific toast by ID
   */
  dismiss: (id: string) => void;

  /**
   * Dismiss all toasts
   */
  dismissAll: () => void;

  /**
   * Currently active toasts
   */
  toasts: ToastMessage[];

  /**
   * Convenience methods for each toast type
   */
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
}

/**
 * Hook for showing toast notifications
 *
 * @example
 * ```tsx
 * const { toast, success, error } = useToast();
 *
 * // Basic usage
 * toast("Hello world");
 *
 * // With type
 * toast("Operation complete", "success");
 *
 * // With custom duration (10 seconds)
 * toast("This will stay longer", "info", 10000);
 *
 * // Convenience methods
 * success("Saved successfully!");
 * error("Something went wrong");
 * ```
 */
export function useToast(): UseToastReturn {
  const context = useToastContext();

  const success = useCallback(
    (message: string, duration?: number) => context.toast(message, "success", duration),
    [context]
  );

  const error = useCallback(
    (message: string, duration?: number) => context.toast(message, "error", duration),
    [context]
  );

  const warning = useCallback(
    (message: string, duration?: number) => context.toast(message, "warning", duration),
    [context]
  );

  const info = useCallback(
    (message: string, duration?: number) => context.toast(message, "info", duration),
    [context]
  );

  return {
    toast: context.toast,
    dismiss: context.dismiss,
    dismissAll: context.dismissAll,
    toasts: context.toasts,
    success,
    error,
    warning,
    info,
  };
}
