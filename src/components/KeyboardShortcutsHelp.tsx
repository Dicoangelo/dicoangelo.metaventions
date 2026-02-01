"use client";

import { useState, useEffect, useRef } from "react";

interface KeyboardShortcutsHelpProps {
  isLight: boolean;
}

export default function KeyboardShortcutsHelp({ isLight }: KeyboardShortcutsHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show shortcuts with '?' key
      if (event.key === "?" && !isOpen) {
        event.preventDefault();
        previousFocusRef.current = document.activeElement as HTMLElement;
        setIsOpen(true);
      }
      // Close with Escape
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus management - trap focus in modal and restore when closed
  useEffect(() => {
    if (isOpen) {
      // Focus close button when modal opens
      closeButtonRef.current?.focus();
    } else if (previousFocusRef.current) {
      // Restore focus when modal closes
      previousFocusRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: "?", description: "Show keyboard shortcuts" },
    { key: "h", description: "Go to top" },
    { key: "1", description: "Jump to Ask Me Anything" },
    { key: "2", description: "Jump to Proof Section" },
    { key: "3", description: "Jump to Projects" },
    { key: "4", description: "Jump to Timeline" },
    { key: "Esc", description: "Close dialog" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 rounded-2xl shadow-2xl animate-scale-in ${
          isLight
            ? "bg-white border border-gray-200"
            : "bg-[#1f1f1f] border border-[#262626]"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 id="shortcuts-title" className="text-xl font-bold">Keyboard Shortcuts</h3>
          <button
            ref={closeButtonRef}
            onClick={() => setIsOpen(false)}
            className={`p-2 rounded-lg transition-colors ${
              isLight
                ? "hover:bg-gray-100 text-gray-600"
                : "hover:bg-[#2a2a2a] text-[#a3a3a3]"
            }`}
            aria-label="Close keyboard shortcuts dialog"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={shortcut.key}
              className={`flex items-center justify-between p-3 rounded-lg ${
                isLight ? "bg-gray-50" : "bg-[#141414]"
              }`}
              style={{
                animation: `fadeInUp 0.3s ease-out ${index * 0.05}s backwards`,
              }}
            >
              <span className={isLight ? "text-gray-700" : "text-[#a3a3a3]"}>
                {shortcut.description}
              </span>
              <kbd
                className={`px-3 py-1.5 rounded-md font-mono text-sm font-medium ${
                  isLight
                    ? "bg-white border border-gray-300 text-gray-800 shadow-sm"
                    : "bg-[#2a2a2a] border border-[#3a3a3a] text-white shadow-lg"
                }`}
              >
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <p
          className={`mt-6 text-sm text-center ${
            isLight ? "text-gray-500" : "text-[#525252]"
          }`}
        >
          Press <kbd className="px-2 py-1 rounded bg-[#6366f1] text-white text-xs">?</kbd> anytime
          to open this dialog
        </p>
      </div>
    </>
  );
}
