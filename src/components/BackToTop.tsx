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
      className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
        isLight
          ? "bg-white shadow-lg hover:shadow-xl border border-gray-200"
          : "bg-[#1f1f1f] shadow-2xl hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-[#2a2a2a]"
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
