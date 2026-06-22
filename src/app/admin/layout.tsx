"use client";

import { ReactNode } from "react";
import { ThemeToggle } from "@/components/ThemeProvider";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Admin Header */}
      <header className="border-b border-[var(--border)] sticky top-0 bg-[var(--background)]/80 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              JD Analyzer Admin
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Analytics & History
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/analyze"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              → Analyzer
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

