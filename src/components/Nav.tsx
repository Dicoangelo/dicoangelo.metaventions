"use client";

import { ThemeToggle } from "./ThemeProvider";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="font-bold text-lg">Dico Angelo</span>
        <div className="flex items-center gap-6 text-sm text-[var(--muted)]">
          <a href="#proof" className="hover:text-[var(--foreground)] transition-colors">Proof</a>
          <a href="#systems" className="hover:text-[var(--foreground)] transition-colors">Systems</a>
          <a href="#projects" className="hover:text-[var(--foreground)] transition-colors">Projects</a>
          <a href="#experience" className="hover:text-[var(--foreground)] transition-colors">Experience</a>
          <a href="#arena" className="hover:text-[var(--foreground)] transition-colors">Arena</a>
          <a href="#ask" className="hover:text-[var(--foreground)] transition-colors">Ask</a>
          <a href="#contact" className="hover:text-[var(--foreground)] transition-colors">Contact</a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
