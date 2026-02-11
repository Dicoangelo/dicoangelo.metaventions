"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ThemeToggle, useTheme } from "./ThemeProvider";

export default function Nav() {
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Adaptive navigation state
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [isAtTop, setIsAtTop] = useState(true);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const navLinks = [
    { href: "#ask", label: "Ask AI", id: "ask" },
    { href: "#resume", label: "Resume", id: "resume" },
    { href: "#timeline", label: "Timeline", id: "timeline" },
    { href: "#skills", label: "Skills", id: "skills" },
    { href: "#systems", label: "Systems", id: "systems" },
    { href: "#projects", label: "Projects", id: "projects" },
    { href: "#analyze", label: "Analyze", id: "analyze" },
    { href: "#contact", label: "Contact", id: "contact" },
  ];

  // Handle scroll behavior
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const heroHeight = window.innerHeight * 0.8; // 80% of viewport

    // Determine if at top
    setIsAtTop(currentScrollY < 50);

    // Determine compact mode (after scrolling past hero)
    setIsCompact(currentScrollY > heroHeight);

    // Determine visibility (hide on scroll down, show on scroll up)
    if (currentScrollY < 100) {
      // Always show near top
      setIsVisible(true);
    } else if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
      // Scrolling down - hide
      setIsVisible(false);
      setIsMobileMenuOpen(false); // Close mobile menu when hiding
    } else if (currentScrollY < lastScrollY.current) {
      // Scrolling up - show
      setIsVisible(true);
    }

    lastScrollY.current = currentScrollY;
    ticking.current = false;
  }, []);

  // Throttled scroll handler using RAF
  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          handleScroll();
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  // Track active section using IntersectionObserver
  useEffect(() => {
    const sections = navLinks.map((link) => document.getElementById(link.id)).filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.3],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(targetId);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveSection("");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{
        // Add subtle shadow when not at top
        boxShadow: isAtTop ? "none" : "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Background with blur and transparency */}
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          theme === "light"
            ? "bg-white/90 border-b border-gray-200/80"
            : "bg-[#0a0a0a]/85 border-b border-[#262626]/80"
        }`}
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      />

      {/* Content */}
      <div
        className={`relative max-w-6xl mx-auto px-6 transition-all duration-300 ${
          isCompact ? "py-2.5" : "py-4"
        }`}
      >
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a
            href="#"
            onClick={handleLogoClick}
            className={`font-bold transition-all duration-300 hover:text-[var(--accent)] ${
              isCompact ? "text-base" : "text-lg"
            }`}
          >
            <span className="hidden sm:inline">Dico Angelo</span>
            <span className="sm:hidden">DA</span>
          </a>

          {/* Desktop Navigation */}
          <div
            className={`hidden md:flex items-center gap-1 text-sm ${
              theme === "light" ? "text-gray-600" : "text-[#a3a3a3]"
            }`}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`relative px-3 py-1.5 rounded-lg transition-all duration-200 ${
                  activeSection === link.id
                    ? theme === "light"
                      ? "text-[var(--accent)] bg-[var(--accent)]/10"
                      : "text-white bg-[var(--accent)]/20"
                    : theme === "light"
                    ? "hover:text-gray-900 hover:bg-gray-100"
                    : "hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
                {/* Active indicator dot */}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent)]" />
                )}
              </a>
            ))}
            <div className="ml-2 pl-2 border-l border-[var(--border)]">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                theme === "light"
                  ? "hover:bg-gray-100 text-gray-600"
                  : "hover:bg-white/10 text-[#a3a3a3]"
              } ${isMobileMenuOpen ? "bg-[var(--accent)]/10 text-[var(--accent)]" : ""}`}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-5 h-5 relative">
                {/* Animated hamburger to X */}
                <span
                  className={`absolute left-0 w-5 h-0.5 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? "top-2 rotate-45" : "top-1"
                  }`}
                />
                <span
                  className={`absolute left-0 top-2 w-5 h-0.5 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                  }`}
                />
                <span
                  className={`absolute left-0 w-5 h-0.5 bg-current transition-all duration-300 ${
                    isMobileMenuOpen ? "top-2 -rotate-45" : "top-3"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            isMobileMenuOpen ? "max-h-[400px] opacity-100 mt-3 pt-3" : "max-h-0 opacity-0"
          } ${theme === "light" ? "border-gray-200" : "border-[#262626]"} ${
            isMobileMenuOpen ? "border-t" : ""
          }`}
        >
          <div className="flex flex-col gap-1 pb-2">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  activeSection === link.id
                    ? theme === "light"
                      ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                      : "bg-[var(--accent)]/20 text-white font-medium"
                    : theme === "light"
                    ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    : "text-[#a3a3a3] hover:bg-white/5 hover:text-white"
                }`}
                style={{
                  // Staggered animation
                  transitionDelay: isMobileMenuOpen ? `${index * 30}ms` : "0ms",
                  transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-10px)",
                  opacity: isMobileMenuOpen ? 1 : 0,
                }}
              >
                <span className="flex items-center gap-2">
                  {activeSection === link.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  )}
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
