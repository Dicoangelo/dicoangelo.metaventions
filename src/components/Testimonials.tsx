"use client";

import { useState, useRef, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Testimonial {
  quote: string;
  highlightPhrase?: string;
  author: string;
  role: string;
  company: string;
  source: string;
  sourceUrl: string;
  linkedIn?: string;
  avatar?: string;
}

interface TestimonialsProps {
  isLight: boolean;
}

const testimonials: Testimonial[] = [
  {
    quote: "Catalyst gave us the opportunity to connect meaningfully with partner leaders through deep, topic-driven discussions. It was an incredible experience.",
    highlightPhrase: "connect meaningfully",
    author: "Dico Angelo",
    role: "Speaker",
    company: "Catalyst 2026",
    source: "Partner Ecosystem Conference",
    sourceUrl: "https://www.joincatalyst.com/catalyst26",
    avatar: "/headshot.jpg",
  },
  {
    quote: "Suger has been a game-changer for us, their platform has not only streamlined our marketplace management but also allowed us to grow our cloud partnerships with AWS and Azure in ways we never thought possible. It's more than just a tool—it's become an extension of our team.",
    highlightPhrase: "game-changer",
    author: "Dico Angelo",
    role: "Cloud Alliance Operations Lead",
    company: "Contentsquare",
    source: "Suger.io Case Study",
    sourceUrl: "https://www.suger.io/blog/how-suger-help-contentsquare-grow-partnerships-without-limits",
    linkedIn: "https://linkedin.com/in/dicoangelo",
    avatar: "/headshot.jpg",
  },
  {
    quote: "This workshop highlighted the importance of rapid prototyping and the benefits of working in a creative environment... The iterative process we followed enabled us to test and refine our ideas rapidly, collaboratively engaging with previous iterations to find the best solution.",
    highlightPhrase: "rapid prototyping",
    author: "Dico Angelo",
    role: "Participant",
    company: "1159.ai Innovation Workshop",
    source: "Rapid Prototyping & Iterative Design",
    sourceUrl: "https://blog.1159.ai/the-art-and-science-of-innovation",
    avatar: "/headshot.jpg",
  },
  {
    quote: "While most companies think about marketplace ops last, Contentsquare invested in marketplace operations from early on in the journey. Their operations lead, Dico Angelo, transformed processes that took days into minutes.",
    highlightPhrase: "transformed processes that took days into minutes",
    author: "Partner Insight Newsletter",
    role: "Feature Article",
    company: "0 to $30M in 30 Months Case Study",
    source: "Operations Before Everything",
    sourceUrl: "https://newsletter.partnerinsight.io/p/0-to-30m-in-30-months-how-a-marketing",
  }
];

function TestimonialCard({
  testimonial,
  isLight,
  index,
  isVisible,
}: {
  testimonial: Testimonial;
  isLight: boolean;
  index: number;
  isVisible: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  // Parallax effect on hover
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  // Highlight phrase in quote
  const renderQuote = () => {
    if (!testimonial.highlightPhrase) return testimonial.quote;

    const parts = testimonial.quote.split(testimonial.highlightPhrase);
    if (parts.length < 2) return testimonial.quote;

    return (
      <>
        {parts[0]}
        <span
          className={`
            relative inline
            ${isHovered ? "text-indigo-500" : ""}
          `}
        >
          <span
            className={`
              absolute inset-0 -inset-x-1 rounded transition-all duration-500
              ${isHovered
                ? isLight
                  ? "bg-indigo-100"
                  : "bg-indigo-500/20"
                : "bg-transparent"
              }
            `}
            style={{ zIndex: -1 }}
          />
          {testimonial.highlightPhrase}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative p-6 rounded-2xl border transition-all duration-500
        ${isLight
          ? "bg-white border-gray-200 hover:border-indigo-300"
          : "bg-white/5 border-white/10 hover:border-indigo-500/50"
        }
        ${isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
        }
      `}
      style={{
        transitionDelay: `${index * 100}ms`,
        transform: isHovered
          ? `perspective(1000px) rotateX(${(mousePos.y - 0.5) * -5}deg) rotateY(${(mousePos.x - 0.5) * 5}deg) translateY(0)`
          : isVisible
          ? "translateY(0)"
          : "translateY(32px)",
        boxShadow: isHovered
          ? isLight
            ? "0 20px 40px -20px rgba(99, 102, 241, 0.3)"
            : "0 20px 40px -20px rgba(99, 102, 241, 0.4)"
          : undefined,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${
            isLight ? "rgba(99, 102, 241, 0.1)" : "rgba(99, 102, 241, 0.15)"
          }, transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Quote Icon */}
      <div className="mb-4">
        <svg
          aria-hidden="true"
          className={`
            w-8 h-8 transition-colors duration-300
            ${isHovered ? "text-indigo-500" : "text-indigo-500/50"}
          `}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* Quote */}
      <blockquote
        className={`
          text-sm leading-relaxed mb-6 relative z-10
          ${isLight ? "text-gray-700" : "text-gray-300"}
        `}
      >
        &ldquo;{renderQuote()}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar */}
        {testimonial.avatar && (
          <div
            className={`
              relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0
              border-2 transition-all duration-300
              ${isHovered
                ? "border-indigo-500 scale-105"
                : isLight
                ? "border-gray-200"
                : "border-white/20"
              }
            `}
          >
            <img
              src={testimonial.avatar}
              alt={testimonial.author}
              className="w-full h-full object-cover"
              style={{
                transform: isHovered
                  ? `scale(1.1) translate(${(mousePos.x - 0.5) * 5}px, ${(mousePos.y - 0.5) * 5}px)`
                  : "scale(1)",
                transition: "transform 0.3s ease-out",
              }}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold truncate">{testimonial.author}</p>
            {testimonial.linkedIn && (
              <a
                href={testimonial.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex-shrink-0 p-1 rounded transition-colors
                  ${isLight
                    ? "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    : "text-gray-500 hover:text-blue-400 hover:bg-blue-500/10"
                  }
                `}
                aria-label={`${testimonial.author}'s LinkedIn`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
          </div>
          <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
            {testimonial.role}
          </p>
          <p className={`text-sm font-medium ${isLight ? "text-gray-700" : "text-gray-300"}`}>
            {testimonial.company}
          </p>
        </div>
      </div>

      {/* Source Link */}
      <a
        href={testimonial.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full
          transition-all duration-200
          ${isLight
            ? "bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600"
            : "bg-white/5 text-gray-400 hover:bg-indigo-500/20 hover:text-indigo-400"
          }
        `}
      >
        <span>{testimonial.source}</span>
        <svg aria-hidden="true" className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}

export default function Testimonials({ isLight }: TestimonialsProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1, once: true });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position for mobile navigation
  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollButtons);
    updateScrollButtons();

    return () => container.removeEventListener("scroll", updateScrollButtons);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 320;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={ref}
      id="testimonials"
      className={`py-20 px-6 ${isLight ? "bg-gray-50/50" : "bg-black/20"}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className={`
            text-center mb-12 transition-all duration-700
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <div
            className={`
              inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4
              ${isLight
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : "bg-amber-500/10 border-amber-500/30 text-amber-400"
              }
            `}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider">Recognition</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Testimonials & Features</h2>
          <p className={`max-w-2xl mx-auto ${isLight ? "text-gray-600" : "text-gray-400"}`}>
            Featured in industry case studies and partner ecosystem conferences
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              isLight={isLight}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Mobile Swipeable Cards */}
        <div className="md:hidden relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[85vw] max-w-sm snap-center"
              >
                <TestimonialCard
                  testimonial={testimonial}
                  isLight={isLight}
                  index={index}
                  isVisible={isVisible}
                />
              </div>
            ))}
          </div>

          {/* Mobile Navigation Arrows */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`
                p-3 rounded-full transition-all
                ${canScrollLeft
                  ? isLight
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    : "bg-white/10 hover:bg-white/20 text-white"
                  : "opacity-30 cursor-not-allowed"
                }
              `}
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`
                p-3 rounded-full transition-all
                ${canScrollRight
                  ? isLight
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    : "bg-white/10 hover:bg-white/20 text-white"
                  : "opacity-30 cursor-not-allowed"
                }
              `}
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Additional Recognition Badge */}
        <div
          className={`
            mt-12 text-center transition-all duration-700 delay-500
            ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
          `}
        >
          <div
            className={`
              inline-flex items-center gap-3 px-6 py-3 rounded-full border
              ${isLight
                ? "bg-white border-gray-200"
                : "bg-white/5 border-white/10"
              }
            `}
          >
            <div className="flex -space-x-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <span className={`text-sm font-medium ${isLight ? "text-gray-700" : "text-gray-300"}`}>
              2× Microsoft Partner of the Year Contributor
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
