"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [glitchText, setGlitchText] = useState("404");
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Glitch effect on the 404
  useEffect(() => {
    const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~";
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        const glitched = "404"
          .split("")
          .map((char) =>
            Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
          )
          .join("");
        setGlitchText(glitched);
        setTimeout(() => setGlitchText("404"), 100);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Easter egg after clicking 404 multiple times
  const handleClick = () => {
    setClickCount((prev) => prev + 1);
    if (clickCount >= 4) {
      setShowEasterEgg(true);
    }
  };

  const suggestions = [
    { emoji: "🏠", label: "Home", href: "/" },
    { emoji: "📄", label: "Resume", href: "/#resume" },
    { emoji: "🚀", label: "Projects", href: "/#projects" },
    { emoji: "💬", label: "Contact", href: "/#contact" },
  ];

  const funMessages = [
    "Looks like this page took an unexpected vacation.",
    "This page is playing hide and seek. It's winning.",
    "The page you're looking for is in another castle.",
    "Error 404: Page not found, but you found me instead.",
    "This URL leads to the void. Want to go back?",
  ];

  const [message] = useState(() => funMessages[Math.floor(Math.random() * funMessages.length)]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a] relative overflow-hidden">
      {/* Animated background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          animation: "grid-move 20s linear infinite",
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-indigo-500/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      <div className="max-w-lg text-center relative z-10">
        {/* Glitchy 404 */}
        <div className="mb-6 relative">
          <h1
            onClick={handleClick}
            className="text-[12rem] font-bold leading-none cursor-pointer select-none relative"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 80px rgba(99, 102, 241, 0.5)",
            }}
          >
            {glitchText}
          </h1>

          {/* Glitch layers */}
          <div
            className="absolute inset-0 text-[12rem] font-bold leading-none opacity-30 pointer-events-none"
            style={{
              color: "#ec4899",
              clipPath: "inset(20% 0 30% 0)",
              transform: "translate(-2px, 0)",
            }}
          >
            {glitchText}
          </div>
          <div
            className="absolute inset-0 text-[12rem] font-bold leading-none opacity-30 pointer-events-none"
            style={{
              color: "#06b6d4",
              clipPath: "inset(60% 0 10% 0)",
              transform: "translate(2px, 0)",
            }}
          >
            {glitchText}
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">Lost in the Digital Void</h2>
          <p className="text-gray-400 leading-relaxed">{message}</p>
        </div>

        {/* Easter egg */}
        {showEasterEgg && (
          <div className="mb-8 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 animate-in fade-in zoom-in duration-300">
            <p className="text-indigo-400 text-sm">
              🎉 Achievement unlocked: Persistent Explorer!
              <br />
              <span className="text-gray-500">You clicked the 404 five times. Nice dedication.</span>
            </p>
          </div>
        )}

        {/* Quick navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {suggestions.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-300"
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">
                {item.emoji}
              </span>
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Main CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-all hover:scale-105 shadow-lg shadow-indigo-500/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return Home
        </Link>

        {/* Command palette hint */}
        <p className="mt-8 text-sm text-gray-600">
          Pro tip: Press{" "}
          <kbd className="px-2 py-1 rounded bg-white/10 text-gray-400 font-mono text-xs">⌘K</kbd>{" "}
          anywhere to navigate quickly
        </p>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.5);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
