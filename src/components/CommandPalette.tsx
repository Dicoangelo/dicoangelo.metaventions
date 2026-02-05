"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTheme } from "./ThemeProvider";

interface Command {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ReactNode;
  action: () => void;
  category: "navigation" | "action" | "external" | "easter-egg";
  keywords?: string[];
}

interface CommandPaletteProps {
  className?: string;
}

export default function CommandPalette({ className = "" }: CommandPaletteProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Define commands
  const commands: Command[] = useMemo(() => [
    // Navigation
    {
      id: "home",
      label: "Go to Home",
      icon: <HomeIcon />,
      action: () => scrollToSection(""),
      category: "navigation",
      keywords: ["top", "start", "beginning"],
    },
    {
      id: "about",
      label: "Go to About",
      icon: <UserIcon />,
      action: () => scrollToSection("approach"),
      category: "navigation",
      keywords: ["ai", "augmented", "operator"],
    },
    {
      id: "projects",
      label: "Go to Projects",
      icon: <FolderIcon />,
      action: () => scrollToSection("projects"),
      category: "navigation",
      keywords: ["work", "portfolio", "showcase"],
    },
    {
      id: "skills",
      label: "Go to Skills",
      icon: <ChartIcon />,
      action: () => scrollToSection("skills"),
      category: "navigation",
      keywords: ["technologies", "stack", "expertise"],
    },
    {
      id: "timeline",
      label: "Go to Timeline",
      icon: <ClockIcon />,
      action: () => scrollToSection("timeline"),
      category: "navigation",
      keywords: ["career", "history", "experience"],
    },
    {
      id: "contact",
      label: "Go to Contact",
      icon: <MailIcon />,
      action: () => scrollToSection("contact"),
      category: "navigation",
      keywords: ["email", "reach", "message"],
    },
    {
      id: "testimonials",
      label: "Go to Testimonials",
      icon: <StarIcon />,
      action: () => scrollToSection("testimonials"),
      category: "navigation",
      keywords: ["reviews", "recognition", "proof"],
    },

    // Actions
    {
      id: "theme",
      label: `Switch to ${isLight ? "Dark" : "Light"} Mode`,
      shortcut: "T",
      icon: isLight ? <MoonIcon /> : <SunIcon />,
      action: toggleTheme,
      category: "action",
      keywords: ["dark", "light", "toggle", "mode", "theme"],
    },
    {
      id: "resume",
      label: "Download Resume",
      shortcut: "R",
      icon: <DownloadIcon />,
      action: () => {
        const link = document.createElement("a");
        link.href = "/Dico_Angelo_Resume.pdf";
        link.download = "Dico_Angelo_Resume.pdf";
        link.click();
      },
      category: "action",
      keywords: ["cv", "pdf", "download"],
    },
    {
      id: "copy-email",
      label: "Copy Email Address",
      shortcut: "E",
      icon: <CopyIcon />,
      action: async () => {
        await navigator.clipboard.writeText("hello@dicoangelo.com");
        // Could trigger a toast here
      },
      category: "action",
      keywords: ["email", "copy", "clipboard"],
    },

    // External Links
    {
      id: "github",
      label: "Open GitHub",
      icon: <GithubIcon />,
      action: () => window.open("https://github.com/Dicoangelo", "_blank"),
      category: "external",
      keywords: ["code", "repos", "source"],
    },
    {
      id: "linkedin",
      label: "Open LinkedIn",
      icon: <LinkedInIcon />,
      action: () => window.open("https://linkedin.com/in/dicoangelo", "_blank"),
      category: "external",
      keywords: ["professional", "network", "connect"],
    },
    {
      id: "twitter",
      label: "Open Twitter/X",
      icon: <TwitterIcon />,
      action: () => window.open("https://twitter.com/dicoangelo", "_blank"),
      category: "external",
      keywords: ["social", "tweets", "x"],
    },

    // Easter Eggs
    {
      id: "matrix",
      label: "Enter the Matrix",
      icon: <SparklesIcon />,
      action: () => {
        document.body.style.filter = "hue-rotate(90deg)";
        setTimeout(() => {
          document.body.style.filter = "";
        }, 3000);
      },
      category: "easter-egg",
      keywords: ["fun", "secret", "hidden"],
    },
    {
      id: "hire",
      label: "Hire Me!",
      icon: <RocketIcon />,
      action: () => scrollToSection("contact"),
      category: "easter-egg",
      keywords: ["job", "work", "opportunity"],
    },
  ], [isLight, toggleTheme]);

  // Fuzzy search filter
  const filteredCommands = useMemo(() => {
    if (!search.trim()) return commands;

    const searchLower = search.toLowerCase();
    return commands.filter((cmd) => {
      const matchLabel = cmd.label.toLowerCase().includes(searchLower);
      const matchKeywords = cmd.keywords?.some((k) => k.includes(searchLower));
      return matchLabel || matchKeywords;
    }).sort((a, b) => {
      // Prioritize label matches over keyword matches
      const aLabel = a.label.toLowerCase().includes(searchLower);
      const bLabel = b.label.toLowerCase().includes(searchLower);
      if (aLabel && !bLabel) return -1;
      if (!aLabel && bLabel) return 1;
      return 0;
    });
  }, [commands, search]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {
      navigation: [],
      action: [],
      external: [],
      "easter-egg": [],
    };
    filteredCommands.forEach((cmd) => {
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Close with Escape
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      if (!isOpen) return;

      // Navigate with arrows
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const command = filteredCommands[selectedIndex];
        if (command) {
          command.action();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && filteredCommands.length > 0) {
      const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex, filteredCommands.length]);

  const categoryLabels: Record<string, string> = {
    navigation: "Navigation",
    action: "Actions",
    external: "External Links",
    "easter-egg": "Easter Eggs",
  };

  return (
    <>
      {/* Mobile Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-24 right-6 z-40 md:hidden
          w-12 h-12 rounded-full shadow-lg
          flex items-center justify-center
          transition-all duration-300
          ${isLight
            ? "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            : "bg-[#1a1a1a] border border-white/10 text-white hover:bg-[#252525]"
          }
        `}
        aria-label="Open command palette"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Command Palette */}
      <div
        className={`
          fixed inset-x-4 top-[15vh] md:inset-x-auto md:left-1/2 md:-translate-x-1/2
          z-50 w-auto md:w-full md:max-w-xl
          transition-all duration-200
          ${isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
          }
        `}
      >
        <div
          className={`
            rounded-2xl shadow-2xl overflow-hidden border
            ${isLight
              ? "bg-white border-gray-200"
              : "bg-[#141414] border-white/10"
            }
          `}
        >
          {/* Search Input */}
          <div className={`flex items-center gap-3 px-4 py-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <svg
              className={`w-5 h-5 flex-shrink-0 ${isLight ? "text-gray-400" : "text-gray-500"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type a command or search..."
              className={`
                flex-1 bg-transparent outline-none text-base
                ${isLight ? "text-gray-900 placeholder-gray-400" : "text-white placeholder-gray-500"}
              `}
            />
            <kbd
              className={`
                hidden md:inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono
                ${isLight ? "bg-gray-100 text-gray-500" : "bg-white/10 text-gray-400"}
              `}
            >
              ESC
            </kbd>
          </div>

          {/* Commands List */}
          <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
            {filteredCommands.length === 0 ? (
              <div className={`px-4 py-8 text-center ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                No commands found for &quot;{search}&quot;
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, cmds]) => {
                if (cmds.length === 0) return null;
                return (
                  <div key={category}>
                    <div
                      className={`
                        px-4 py-2 text-xs font-semibold uppercase tracking-wider
                        ${isLight ? "text-gray-400" : "text-gray-500"}
                      `}
                    >
                      {categoryLabels[category]}
                    </div>
                    {cmds.map((cmd) => {
                      const globalIndex = filteredCommands.indexOf(cmd);
                      const isSelected = globalIndex === selectedIndex;
                      return (
                        <button
                          key={cmd.id}
                          data-index={globalIndex}
                          onClick={() => {
                            cmd.action();
                            setIsOpen(false);
                          }}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2.5 text-left
                            transition-colors duration-100
                            ${isSelected
                              ? isLight
                                ? "bg-indigo-50 text-indigo-700"
                                : "bg-indigo-500/20 text-white"
                              : isLight
                              ? "text-gray-700 hover:bg-gray-50"
                              : "text-gray-300 hover:bg-white/5"
                            }
                          `}
                        >
                          <span
                            className={`
                              w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                              ${isSelected
                                ? isLight
                                  ? "bg-indigo-100 text-indigo-600"
                                  : "bg-indigo-500/30 text-indigo-400"
                                : isLight
                                ? "bg-gray-100 text-gray-500"
                                : "bg-white/10 text-gray-400"
                              }
                            `}
                          >
                            {cmd.icon}
                          </span>
                          <span className="flex-1 font-medium">{cmd.label}</span>
                          {cmd.shortcut && (
                            <kbd
                              className={`
                                px-2 py-0.5 rounded text-xs font-mono
                                ${isLight ? "bg-gray-100 text-gray-500" : "bg-white/10 text-gray-400"}
                              `}
                            >
                              {cmd.shortcut}
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div
            className={`
              flex items-center justify-between px-4 py-2 border-t text-xs
              ${isLight ? "border-gray-200 text-gray-400" : "border-white/10 text-gray-500"}
            `}
          >
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className={`px-1.5 py-0.5 rounded ${isLight ? "bg-gray-100" : "bg-white/10"}`}>↑</kbd>
                <kbd className={`px-1.5 py-0.5 rounded ${isLight ? "bg-gray-100" : "bg-white/10"}`}>↓</kbd>
                <span className="ml-1">Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className={`px-1.5 py-0.5 rounded ${isLight ? "bg-gray-100" : "bg-white/10"}`}>↵</kbd>
                <span className="ml-1">Select</span>
              </span>
            </div>
            <span className="hidden md:inline">
              <kbd className={`px-1.5 py-0.5 rounded ${isLight ? "bg-gray-100" : "bg-white/10"}`}>⌘</kbd>
              <kbd className={`px-1.5 py-0.5 rounded ml-0.5 ${isLight ? "bg-gray-100" : "bg-white/10"}`}>K</kbd>
              <span className="ml-1">to open</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// Icon Components
function HomeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  );
}
