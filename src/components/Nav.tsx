"use client";

import { useState } from "react";
import { ThemeToggle, useTheme } from "./ThemeProvider";

export default function Nav() {
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#ask", label: "Ask AI" },
    { href: "#resume", label: "Resume" },
    { href: "#timeline", label: "Timeline" },
    { href: "#skills", label: "Skills" },
    { href: "#systems", label: "Systems" },
    { href: "#projects", label: "Projects" },
    { href: "#analyze", label: "Analyze" },
    { href: "#contact", label: "Contact" },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-lg ${
        theme === "light"
          ? "bg-white/90 border-gray-200"
          : "bg-[#0a0a0a]/80 border-[#262626]"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a
            href="#"
            className="font-bold text-lg hover:text-[#6366f1] transition-colors"
            onClick={handleLinkClick}
          >
            Dico Angelo
          </a>

          {/* Desktop Navigation */}
          <div
            className={`hidden md:flex items-center gap-6 text-sm ${
              theme === "light" ? "text-gray-600" : "text-[#a3a3a3]"
            }`}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`hover:${
                  theme === "light" ? "text-gray-900" : "text-white"
                } transition-colors`}
              >
                {link.label}
              </a>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                theme === "light"
                  ? "hover:bg-gray-100 text-gray-600"
                  : "hover:bg-[#1a1a1a] text-[#a3a3a3]"
              }`}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                // Close icon
                <svg
                  aria-hidden="true"
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  aria-hidden="true"
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden mt-4 pt-4 border-t ${
              theme === "light" ? "border-gray-200" : "border-[#262626]"
            }`}
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    theme === "light"
                      ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      : "text-[#a3a3a3] hover:bg-[#1a1a1a] hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
