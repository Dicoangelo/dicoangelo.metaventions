"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface FilmFrame {
  id: string;
  image: string;
  title: string;
  description?: string;
}

interface FilmStripGalleryProps {
  isLight: boolean;
}

export default function FilmStripGallery({ isLight }: FilmStripGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const frames: FilmFrame[] = [
    {
      id: "1",
      image: "/gallery-01.jpg",
      title: "Professional Profile",
      description: "Operations & infrastructure lead"
    },
    {
      id: "2",
      image: "/gallery-02.jpg",
      title: "Industry Experience",
      description: "Tech & enterprise operations"
    },
    {
      id: "3",
      image: "/gallery-03.jpg",
      title: "Building Systems",
      description: "Infrastructure at scale"
    },
    {
      id: "4",
      image: "/gallery-04.jpg",
      title: "Technical Leadership",
      description: "$800M+ operations processed"
    },
    {
      id: "5",
      image: "/gallery-05.jpg",
      title: "Professional Network",
      description: "Enterprise partnerships"
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        scrollRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <section
      className={`py-16 px-6 overflow-hidden ${
        isLight ? "bg-gradient-to-b from-gray-100 to-gray-200" : "bg-gradient-to-b from-[#0a0a0a] to-[#050505]"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Building in Public</h2>
          <p className={`text-sm ${isLight ? "text-gray-600" : "text-[#737373]"}`}>
            A snapshot of the journey
          </p>
        </div>

        <div className="relative">
          {/* Film Strip Container */}
          <div
            className={`relative rounded-lg overflow-hidden ${
              isLight ? "bg-gray-300" : "bg-[#1a1a1a]"
            }`}
            style={{
              boxShadow: isLight
                ? "0 4px 20px rgba(0,0,0,0.1)"
                : "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            {/* Film Perforations - Top */}
            <div
              className={`absolute top-0 left-0 right-0 h-4 flex justify-around items-center ${
                isLight ? "bg-gray-400" : "bg-[#0f0f0f]"
              }`}
              style={{ zIndex: 10 }}
            >
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={`top-${i}`}
                  className={`w-3 h-2 rounded-sm ${
                    isLight ? "bg-gray-200" : "bg-black"
                  }`}
                />
              ))}
            </div>

            {/* Film Perforations - Bottom */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-4 flex justify-around items-center ${
                isLight ? "bg-gray-400" : "bg-[#0f0f0f]"
              }`}
              style={{ zIndex: 10 }}
            >
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={`bottom-${i}`}
                  className={`w-3 h-2 rounded-sm ${
                    isLight ? "bg-gray-200" : "bg-black"
                  }`}
                />
              ))}
            </div>

            {/* Scrollable Film Frames */}
            <div
              ref={scrollRef}
              onScroll={updateScrollButtons}
              className="flex gap-6 overflow-x-auto py-8 px-8 scrollbar-hide"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {frames.map((frame, index) => (
                <div
                  key={frame.id}
                  className={`flex-shrink-0 w-80 ${
                    isLight ? "bg-white" : "bg-[#0a0a0a]"
                  } rounded-lg overflow-hidden shadow-xl transition-transform hover:scale-105 hover:shadow-2xl`}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`,
                  }}
                >
                  <div className="relative w-full h-64">
                    <Image
                      src={frame.image}
                      alt={frame.title}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-lg mb-1">{frame.title}</h3>
                      {frame.description && (
                        <p className="text-sm text-gray-300">{frame.description}</p>
                      )}
                    </div>
                  </div>
                  <div
                    className={`p-3 text-center text-xs font-mono ${
                      isLight ? "text-gray-600" : "text-[#737373]"
                    }`}
                  >
                    Frame {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className={`absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 ${
                isLight
                  ? "bg-white shadow-lg hover:bg-gray-100"
                  : "bg-[#1f1f1f] shadow-2xl hover:bg-[#2a2a2a]"
              }`}
              aria-label="Scroll left"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 ${
                isLight
                  ? "bg-white shadow-lg hover:bg-gray-100"
                  : "bg-[#1f1f1f] shadow-2xl hover:bg-[#2a2a2a]"
              }`}
              aria-label="Scroll right"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
