"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { showcaseItems, systemColors } from "./data";

interface LightboxProps {
  isLight: boolean;
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ isLight, index, onClose, onNavigate }: LightboxProps) {
  const [transitioning, setTransitioning] = useState(false);
  const item = showcaseItems[index];
  const color = systemColors[item.system] || "#6366f1";

  const navigate = useCallback(
    (dir: number) => {
      setTransitioning(true);
      setTimeout(() => {
        const next = (index + dir + showcaseItems.length) % showcaseItems.length;
        onNavigate(next);
        setTransitioning(false);
      }, 150);
    },
    [index, onNavigate]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, navigate]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      {/* Backdrop */}
      <div className={`absolute inset-0 backdrop-blur-sm ${isLight ? "bg-black/80" : "bg-black/90"}`} />

      {/* Counter */}
      <div className="absolute top-5 left-6 z-10 text-sm font-medium text-[#737373]">
        <span className="text-white">{index + 1}</span> / {showcaseItems.length}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-5 z-10 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#737373] hover:text-white hover:bg-white/10 transition-all text-xl"
        aria-label="Close lightbox"
      >
        &times;
      </button>

      {/* Prev Arrow */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#737373] hover:text-white hover:bg-white/10 transition-all text-2xl"
        aria-label="Previous image"
      >
        &#8249;
      </button>

      {/* Next Arrow */}
      <button
        onClick={() => navigate(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#737373] hover:text-white hover:bg-white/10 transition-all text-2xl"
        aria-label="Next image"
      >
        &#8250;
      </button>

      {/* Image */}
      <div
        className={`relative z-10 max-w-[90vw] max-h-[70vh] transition-opacity duration-300 ${
          transitioning ? "opacity-20" : "opacity-100"
        }`}
      >
        {item.file.endsWith(".gif") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.file}
            alt={item.title}
            className="rounded-xl shadow-2xl max-h-[70vh] w-auto"
          />
        ) : (
          <Image
            src={item.file}
            alt={item.title}
            width={1200}
            height={800}
            className="rounded-xl shadow-2xl object-contain max-h-[70vh] w-auto"
            priority
          />
        )}
      </div>

      {/* Info Below Image */}
      <div className="relative z-10 mt-6 max-w-2xl text-center px-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span
            className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
            style={{
              color,
              backgroundColor: `${color}15`,
              border: `1px solid ${color}30`,
            }}
          >
            {item.system}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          {item.num}. {item.title}
        </h3>
        <p className="text-sm text-[#a3a3a3] mb-1">{item.subtitle}</p>
        <p className="text-xs text-[#737373] leading-relaxed">{item.description}</p>
      </div>

      {/* Keyboard Hints */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center gap-3 text-[#737373] text-xs">
        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 font-mono">
          &larr; &rarr;
        </span>
        <span>Navigate</span>
        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 font-mono">
          ESC
        </span>
        <span>Close</span>
      </div>
    </div>
  );
}
