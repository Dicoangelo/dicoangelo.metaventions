"use client";

import { useEffect } from "react";

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  callback: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchesCtrl = shortcut.ctrlKey ? event.ctrlKey : true;
        const matchesMeta = shortcut.metaKey ? event.metaKey : true;
        const matchesShift = shortcut.shiftKey ? event.shiftKey : true;

        if (matchesKey && matchesCtrl && matchesMeta && matchesShift) {
          // Don't trigger if user is typing in an input
          const target = event.target as HTMLElement;
          if (
            target instanceof HTMLInputElement ||
            target instanceof HTMLTextAreaElement ||
            target.isContentEditable
          ) {
            return;
          }

          event.preventDefault();
          shortcut.callback();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

export function useNavigationShortcuts() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const shortcuts: ShortcutConfig[] = [
    {
      key: "1",
      callback: () => scrollToSection("ask"),
      description: "Jump to Ask Me Anything",
    },
    {
      key: "2",
      callback: () => scrollToSection("proof"),
      description: "Jump to Proof Section",
    },
    {
      key: "3",
      callback: () => scrollToSection("projects"),
      description: "Jump to Projects",
    },
    {
      key: "4",
      callback: () => scrollToSection("timeline"),
      description: "Jump to Timeline",
    },
    {
      key: "h",
      callback: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      description: "Go to top",
    },
  ];

  useKeyboardShortcuts(shortcuts);
}
