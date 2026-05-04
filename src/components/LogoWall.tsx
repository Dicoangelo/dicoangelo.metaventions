"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Logo {
  name: string;
  description: string;
  src: string;
  color: string;
}

interface LogoWallProps {
  className?: string;
  animated?: boolean;
}

const logos: Logo[] = [
  { name: "AWS", description: "Cloud Alliance · Co-sell motion", src: "/logos/aws.svg", color: "#FF9900" },
  { name: "Microsoft", description: "Cloud Partner · Azure marketplace", src: "/logos/microsoft.svg", color: "#00A4EF" },
  { name: "Google Cloud", description: "GCP Marketplace partnership", src: "/logos/googlecloud.svg", color: "#4285F4" },
  { name: "Anthropic", description: "Claude API · 4,035+ sessions", src: "/logos/anthropic.svg", color: "#D4A574" },
  { name: "OpenAI", description: "GPT integration · multi-platform", src: "/logos/openai.svg", color: "#10a37f" },
  { name: "xAI", description: "Grok · Custom Voices TTS", src: "/logos/xai.svg", color: "#ffffff" },
  { name: "Deepgram", description: "nova-3 streaming STT", src: "/logos/deepgram.svg", color: "#13EF93" },
  { name: "ElevenLabs", description: "Voice cloning · production TTS", src: "/logos/elevenlabs.svg", color: "#ffffff" },
  { name: "Vercel", description: "Production deployment infra", src: "/logos/vercel.svg", color: "#ffffff" },
  { name: "Suger", description: "Marketplace operations platform", src: "/logos/suger.svg", color: "#ec4899" },
  { name: "Contentsquare", description: "5 yrs · Sr. Partner Systems & Ops", src: "/logos/contentsquare.svg", color: "#6366f1" },
];

const duplicatedLogos = [...logos, ...logos];

export default function LogoWall({ className = "", animated = true }: LogoWallProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, isVisible } = useScrollReveal({ threshold: 0.1, once: true });
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!animated || !scrollRef.current) return;
    const scrollEl = scrollRef.current;
    const handleMouseEnter = () => setIsPaused(true);
    const handleMouseLeave = () => setIsPaused(false);
    scrollEl.addEventListener("mouseenter", handleMouseEnter);
    scrollEl.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      scrollEl.removeEventListener("mouseenter", handleMouseEnter);
      scrollEl.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [animated]);

  return (
    <section ref={sectionRef} className={`relative py-20 px-6 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span
            className={`inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-3 ${
              isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"
            }`}
          >
            The stack
          </span>
          <h3 className={`text-2xl md:text-[28px] font-bold tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}>
            Trusted by &amp; built with.
          </h3>
          <p className={`mt-3 text-[14px] max-w-xl mx-auto ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
            Enterprise alliances, AI infrastructure, and the tools that ship the work.
          </p>
        </div>
      </div>

      {/* Scrolling logo container — full viewport width with mask fade */}
      <div
        ref={scrollRef}
        className="relative"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div
          className={`flex gap-4 md:gap-5 ${animated && !isPaused ? "animate-scroll" : ""}`}
          style={{
            width: animated ? "max-content" : "auto",
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {(animated ? duplicatedLogos : logos).map((logo, index) => (
            <div key={`${logo.name}-${index}`} className="group relative shrink-0">
              {/* Logo card */}
              <div
                className={`w-[140px] h-[88px] md:w-[168px] md:h-[96px] flex items-center justify-center px-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                  isLight
                    ? "bg-white/70 border-gray-200/80 hover:border-[#6366f1]/40 hover:shadow-[0_8px_24px_-8px_rgba(99,102,241,0.25)] hover:-translate-y-0.5"
                    : "bg-white/[0.025] border-white/[0.07] hover:border-[#6366f1]/40 hover:bg-white/[0.04] hover:-translate-y-0.5"
                }`}
              >
                <div
                  className="relative w-full h-9 md:h-10 transition-all duration-300"
                  style={
                    {
                      filter: "grayscale(100%)",
                      opacity: isLight ? 0.55 : 0.6,
                      ["--logo-color" as string]: logo.color,
                    } as React.CSSProperties
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = "grayscale(0%)";
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.color = logo.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = "grayscale(100%)";
                    e.currentTarget.style.opacity = isLight ? "0.55" : "0.6";
                    e.currentTarget.style.color = "";
                  }}
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    fill
                    sizes="168px"
                    className="object-contain"
                    style={{
                      filter: !isLight && (logo.name === "Vercel" || logo.name === "ElevenLabs" || logo.name === "xAI" || logo.name === "Anthropic") ? "invert(1)" : undefined,
                    }}
                  />
                </div>
              </div>

              {/* Tooltip */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 -bottom-2 translate-y-full px-3 py-2 rounded-lg text-center whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 group-hover:-translate-y-0 z-10 backdrop-blur-md ${
                  isLight ? "bg-gray-900 text-white" : "bg-white text-gray-900"
                }`}
              >
                <p className="font-semibold text-[12px]">{logo.name}</p>
                <p className="text-[10.5px] opacity-80 mt-0.5">{logo.description}</p>
                <div
                  className={`absolute left-1/2 -translate-x-1/2 -top-1 w-2.5 h-2.5 rotate-45 ${
                    isLight ? "bg-gray-900" : "bg-white"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </section>
  );
}
