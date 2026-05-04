"use client";

import Image from "next/image";
import { fieldPhotos, type FieldPhoto } from "@/content/in-the-field";

interface InTheFieldSectionProps {
  isLight: boolean;
}

export function InTheFieldSection({ isLight }: InTheFieldSectionProps) {
  if (fieldPhotos.length === 0) return null;

  // Split into two rows for opposing-direction marquees
  const half = Math.ceil(fieldPhotos.length / 2);
  const rowA = fieldPhotos.slice(0, half);
  const rowB = fieldPhotos.slice(half);

  return (
    <section
      aria-label="In the field"
      className={`py-20 overflow-hidden ${
        isLight
          ? "bg-gradient-to-b from-white via-gray-50 to-white"
          : "bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="text-center">
          <span
            className={`inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 ${
              isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"
            }`}
          >
            In the Field
          </span>
          <h2
            className={`text-4xl md:text-5xl font-bold tracking-tight ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            On stage. At the table. In the room.
          </h2>
          <p
            className={`mt-5 max-w-2xl mx-auto text-[15px] leading-relaxed ${
              isLight ? "text-gray-600" : "text-[#a3a3a3]"
            }`}
          >
            Moments from the rooms where partnership systems get built, mentored, and shipped.
          </p>
        </div>
      </div>

      <div className="relative">
        {/* Left edge fade */}
        <div
          aria-hidden
          className={`absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none ${
            isLight
              ? "bg-gradient-to-r from-white to-transparent"
              : "bg-gradient-to-r from-[#050505] to-transparent"
          }`}
        />
        {/* Right edge fade */}
        <div
          aria-hidden
          className={`absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none ${
            isLight
              ? "bg-gradient-to-l from-white to-transparent"
              : "bg-gradient-to-l from-[#050505] to-transparent"
          }`}
        />

        <MarqueeRow photos={rowA} isLight={isLight} direction="left" duration={70} />
        <div className="h-4" />
        <MarqueeRow photos={rowB} isLight={isLight} direction="right" duration={60} />
      </div>

      <style jsx global>{`
        @keyframes marquee-left {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marquee-right {
          from { transform: translate3d(-50%, 0, 0); }
          to { transform: translate3d(0, 0, 0); }
        }
        .field-marquee-track {
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .field-marquee-row:hover .field-marquee-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .field-marquee-track {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

interface MarqueeRowProps {
  photos: FieldPhoto[];
  isLight: boolean;
  direction: "left" | "right";
  duration: number;
}

function MarqueeRow({ photos, isLight, direction, duration }: MarqueeRowProps) {
  // Duplicate the photos so the marquee loops seamlessly
  const doubled = [...photos, ...photos];
  const animationName = direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div className="field-marquee-row overflow-hidden">
      <div
        className="field-marquee-track flex gap-4 w-max"
        style={{
          animationName,
          animationDuration: `${duration}s`,
        }}
      >
        {doubled.map((photo, idx) => (
          <PhotoCard
            key={`${photo.id}-${idx}`}
            photo={photo}
            isLight={isLight}
            ariaHidden={idx >= photos.length}
          />
        ))}
      </div>
    </div>
  );
}

interface PhotoCardProps {
  photo: FieldPhoto;
  isLight: boolean;
  ariaHidden: boolean;
}

function PhotoCard({ photo, isLight, ariaHidden }: PhotoCardProps) {
  // Fixed height; width derived from aspect for visual rhythm
  // h-72 = 18rem = 288px
  const widthClass =
    photo.aspect === "portrait"
      ? "w-56" // 14rem = 224px (~3:4 of 288)
      : photo.aspect === "square"
      ? "w-72" // 18rem = 288px
      : "w-[28rem]"; // 448px (~16:10 of 288)

  return (
    <figure
      aria-hidden={ariaHidden || undefined}
      className={`relative h-72 ${widthClass} flex-shrink-0 overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:border-[#6366f1]/40 group/card ${
        isLight
          ? "border-gray-200/80 bg-white/70"
          : "border-white/[0.07] bg-white/[0.025]"
      }`}
    >
      <Image
        src={photo.src}
        alt={ariaHidden ? "" : photo.alt}
        fill
        sizes="(max-width: 640px) 60vw, 30vw"
        className="object-cover transition-transform duration-700 group-hover/card:scale-[1.04]"
      />

      {/* gradient mask + caption overlay (shown on hover and on touch devices) */}
      {(photo.caption || photo.location || photo.year) && (
        <>
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover/card:opacity-100 [@media(pointer:coarse)]:opacity-100 transition-opacity duration-300 pointer-events-none"
            aria-hidden
          />
          <figcaption
            className="absolute inset-x-0 bottom-0 px-4 py-3 text-white opacity-0 group-hover/card:opacity-100 [@media(pointer:coarse)]:opacity-100 transition-opacity duration-300 pointer-events-none"
          >
            {photo.caption && (
              <div className="text-sm font-semibold leading-tight truncate">
                {photo.caption}
              </div>
            )}
            {(photo.location || photo.year) && (
              <div className="text-xs font-mono uppercase tracking-wider text-white/70 mt-0.5 truncate">
                {[photo.location, photo.year].filter(Boolean).join(" · ")}
              </div>
            )}
          </figcaption>
        </>
      )}
    </figure>
  );
}
