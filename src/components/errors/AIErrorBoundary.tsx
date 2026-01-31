"use client";

import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface AIErrorBoundaryProps {
  children: React.ReactNode;
  feature: 'chat' | 'jd-analyzer' | 'voice';
}

/**
 * Specialized error boundary for AI features with custom fallback UI
 *
 * Usage:
 * ```tsx
 * <AIErrorBoundary feature="chat">
 *   <ChatComponent />
 * </AIErrorBoundary>
 * ```
 */
export function AIErrorBoundary({ children, feature }: AIErrorBoundaryProps) {
  const featureNames = {
    chat: 'AI Chat Assistant',
    'jd-analyzer': 'Job Description Analyzer',
    voice: 'Voice Assistant',
  };

  const fallback = (
    <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
      <div className="max-w-md w-full bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <svg
            className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3"
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
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
            {featureNames[feature]} Unavailable
          </h3>
        </div>

        <p className="text-yellow-700 dark:text-yellow-300 mb-4">
          We're experiencing technical difficulties with this feature. Please try again in a moment.
        </p>

        <div className="space-y-2 text-sm text-yellow-600 dark:text-yellow-400">
          <p>If the problem persists, you can:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Refresh the page</li>
            <li>Clear your browser cache</li>
            <li>Contact me directly at dico.angelo97@gmail.com</li>
          </ul>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary
      fallback={fallback}
      onError={(error) => {
        // Additional logging for AI feature errors
        console.error(`${featureNames[feature]} error:`, error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
