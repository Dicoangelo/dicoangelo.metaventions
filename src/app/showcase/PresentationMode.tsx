"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { showcaseItems, systemColors, highlightIndices } from "./data";

interface PresentationModeProps {
  isLight: boolean;
  startIndex?: number;
  onClose: () => void;
}

export default function PresentationMode({ isLight, startIndex = 0, onClose }: PresentationModeProps) {
  const [mode, setMode] = useState<"all" | "highlights">("all");
  const [playlistPos, setPlaylistPos] = useState(() => {
    const pos = showcaseItems.map((_, i) => i).indexOf(startIndex);
    return pos >= 0 ? pos : 0;
  });
  const [transitioning, setTransitioning] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playlist = mode === "highlights" ? highlightIndices : showcaseItems.map((_, i) => i);
  const currentIndex = playlist[playlistPos] ?? 0;
  const item = showcaseItems[currentIndex];
  const color = systemColors[item.system] || "#6366f1";
  const points = item.talkingPoints;

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const stopAuto = useCallback(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
    setAutoPlay(false);
  }, []);

  const navigate = useCallback(
    (dir: number) => {
      setTransitioning(true);
      stopAuto();
      setTimeout(() => {
        setPlaylistPos((prev) => (prev + dir + playlist.length) % playlist.length);
        setTransitioning(false);
      }, 150);
    },
    [playlist.length, stopAuto]
  );

  const jumpToSlide = useCallback(
    (pos: number) => {
      setTransitioning(true);
      stopAuto();
      setTimeout(() => {
        setPlaylistPos(pos);
        setTransitioning(false);
      }, 150);
    },
    [stopAuto]
  );

  const toggleAutoAdvance = useCallback(() => {
    if (autoPlay) {
      stopAuto();
    } else {
      setAutoPlay(true);
      autoTimerRef.current = setInterval(() => {
        setTransitioning(true);
        setTimeout(() => {
          setPlaylistPos((prev) => (prev + 1) % playlist.length);
          setTransitioning(false);
        }, 200);
      }, 12000);
    }
  }, [autoPlay, playlist.length, stopAuto]);

  const toggleHighlights = useCallback(() => {
    const newMode = mode === "highlights" ? "all" : "highlights";
    setMode(newMode);
    setPlaylistPos(0);
    stopAuto();
  }, [mode, stopAuto]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        stopAuto();
        onClose();
      }
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "a" || e.key === "A") toggleAutoAdvance();
      if (e.key === "h" || e.key === "H") toggleHighlights();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, navigate, toggleAutoAdvance, toggleHighlights, stopAuto]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-[2000] flex flex-col ${isLight ? "bg-[#1a1a2e]" : "bg-black"}`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/[0.03] border-b border-white/[0.06] flex-shrink-0">
        <div className="text-sm font-bold text-[#737373]">
          <span className="text-[#6366f1]">{playlistPos + 1}</span> / {playlist.length}
        </div>

        <div className="text-sm font-bold text-white truncate mx-4">{item.title}</div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[#737373] hover:text-white text-xs font-bold transition-all"
          >
            &larr;
          </button>
          <button
            onClick={() => navigate(1)}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[#737373] hover:text-white text-xs font-bold transition-all"
          >
            &rarr;
          </button>

          <span className="w-px h-5 bg-white/[0.08]" />

          <button
            onClick={() => {
              setMode("all");
              setPlaylistPos(0);
              stopAuto();
            }}
            className={`px-3 py-1.5 bg-white/5 border rounded-lg text-xs font-bold transition-all ${
              mode === "all"
                ? "text-[#6366f1] border-[#6366f1]/30"
                : "text-[#737373] border-white/10 hover:text-white"
            }`}
          >
            ALL {showcaseItems.length}
          </button>
          <button
            onClick={toggleHighlights}
            className={`px-3 py-1.5 bg-white/5 border rounded-lg text-xs font-bold transition-all ${
              mode === "highlights"
                ? "text-amber-400 border-amber-400/30"
                : "text-[#737373] border-white/10 hover:text-white"
            }`}
          >
            TOP {highlightIndices.length}
          </button>

          <span className="w-px h-5 bg-white/[0.08]" />

          <button
            onClick={toggleAutoAdvance}
            className={`px-3 py-1.5 bg-white/5 border rounded-lg text-xs font-bold transition-all ${
              autoPlay
                ? "text-green-400 border-green-400/30"
                : "text-[#737373] border-white/10 hover:text-white"
            }`}
          >
            {autoPlay ? "AUTO ON" : "AUTO"}
          </button>
          <button
            onClick={() => {
              stopAuto();
              onClose();
            }}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[#737373] hover:text-white text-xs font-bold transition-all"
          >
            EXIT
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Image Area (~65%) */}
        <div className="flex-1 relative flex items-center justify-center p-4 min-w-0">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#737373] hover:text-white hover:bg-white/10 transition-all text-xl"
            aria-label="Previous slide"
          >
            &#8249;
          </button>
          <button
            onClick={() => navigate(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#737373] hover:text-white hover:bg-white/10 transition-all text-xl"
            aria-label="Next slide"
          >
            &#8250;
          </button>

          <div
            className={`relative max-w-full max-h-full transition-opacity duration-300 ${
              transitioning ? "opacity-20" : "opacity-100"
            }`}
          >
            {item.file.endsWith(".gif") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.file}
                alt={item.title}
                className="rounded-xl shadow-[0_4px_40px_rgba(0,0,0,0.5)] max-h-[calc(100vh-120px)] w-auto"
              />
            ) : (
              <Image
                src={item.file}
                alt={item.title}
                width={1200}
                height={800}
                className="rounded-xl shadow-[0_4px_40px_rgba(0,0,0,0.5)] object-contain max-h-[calc(100vh-120px)] w-auto"
                priority
              />
            )}
          </div>
        </div>

        {/* Sidebar (~35%) */}
        <div className="w-[360px] flex-shrink-0 bg-white/[0.02] border-l border-white/[0.06] p-5 overflow-y-auto flex flex-col gap-4 max-md:w-[280px] max-md:p-4">
          {/* System Badge + Mode */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider"
              style={{
                color,
                backgroundColor: `${color}12`,
                border: `1px solid ${color}33`,
              }}
            >
              {item.system}
            </span>
            {mode === "highlights" && (
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/[0.08] border border-amber-400/[0.15]">
                HIGHLIGHTS
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <h2 className="text-lg font-extrabold text-white leading-tight">{item.title}</h2>
            <p className="text-sm font-semibold mt-1" style={{ color }}>
              {item.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-[#737373] leading-relaxed">{item.description}</p>

          {/* Talking Points */}
          {points.length > 0 && (
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 mb-2">
                Talking Points
              </div>
              <ul className="flex flex-col gap-2">
                {points.map((point, i) => (
                  <li key={i} className="text-sm text-white leading-relaxed pl-4 relative">
                    <span className="absolute left-0 top-[7px] w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-bold text-[#a3a3a3] bg-white/[0.05] border border-white/[0.08]"
                >
                  {tag.label}
                </span>
              ))}
            </div>
          )}

          {/* Progress Dots */}
          <div className="flex flex-wrap gap-1 items-center justify-center py-2">
            {playlist.map((_, i) => (
              <button
                key={i}
                onClick={() => jumpToSlide(i)}
                className="transition-all duration-300 border-0 p-0"
                style={{
                  width: i === playlistPos ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i === playlistPos ? "#6366f1" : "rgba(255,255,255,0.12)",
                  cursor: "pointer",
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Keyboard Hints */}
          <div className="mt-auto pt-3 border-t border-white/[0.06] text-center text-xs text-[#737373] opacity-50">
            &larr; &rarr; Navigate &bull; A Auto &bull; H Highlights &bull; ESC Exit
          </div>
        </div>
      </div>
    </div>
  );
}
