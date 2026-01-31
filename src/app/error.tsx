"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a]">
      <div className="max-w-lg text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-white">Something went wrong</h1>

        <p className="text-gray-400 mb-6 leading-relaxed">
          An unexpected error occurred while loading this page. This has been logged and we'll look into it.
        </p>

        {error.digest && (
          <p className="text-sm text-gray-500 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#6366f1] text-white rounded-lg font-semibold hover:bg-[#5558e3] transition-colors shadow-lg"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-[#1f1f1f] text-white rounded-lg font-semibold hover:bg-[#2a2a2a] transition-colors border border-[#262626]"
          >
            Go Home
          </a>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          If this problem persists, please{" "}
          <a
            href="mailto:hello@dicoangelo.com"
            className="text-[#6366f1] hover:underline"
          >
            contact support
          </a>
        </p>
      </div>
    </div>
  );
}
