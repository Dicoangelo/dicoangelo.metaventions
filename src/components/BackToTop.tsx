"use client";

import { useEffect, useState } from "react";

interface BackToTopProps {
  isLight: boolean;
}

export default function BackToTop({ isLight }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 left-6 z-40 btn-icon w-12 h-12 ${
        isLight ? "bg-white text-gray-700 border border-gray-200" : ""
      }`}
      aria-label="Back to top"
      style={{
        animation: "fadeInUp 0.3s ease-out",
      }}
    >
      <svg
        aria-hidden="true"
        className={`w-6 h-6 ${isLight ? "text-gray-700" : "text-white"}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}
