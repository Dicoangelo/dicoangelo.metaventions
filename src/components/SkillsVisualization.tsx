"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/hooks/useReducedMotion";
import { useReadingDepth } from "./ReadingDepthProvider";

interface Skill {
  name: string;
  level: number; // Self-assessed familiarity, 0-100
  context?: string;
}

interface SkillCategory {
  category: string;
  icon: string;
  skills: Skill[];
}

interface SkillsVisualizationProps {
  isLight: boolean;
}

const skillCategories: SkillCategory[] = [
    {
      category: "AI & Agentic Systems",
      icon: "🤖",
      skills: [
        { name: "Prompt Engineering", level: 95, context: "Applied AI work" },
        { name: "Multi-Agent Orchestration", level: 85, context: "Independent builds" },
        { name: "Agentic Architectures", level: 85, context: "Independent builds" },
        { name: "LLM Integration & Routing", level: 82, context: "Independent builds" },
        { name: "RAG Systems (pgvector)", level: 78, context: "Independent builds" },
      ],
    },
    {
      category: "Operations & Infrastructure",
      icon: "⚙️",
      skills: [
        { name: "Cloud Marketplace Operations", level: 95, context: "Partner operations" },
        { name: "GTM Automation & Workflow Design", level: 90, context: "Revenue technology" },
        { name: "Process Optimization", level: 92, context: "Operations practice" },
        { name: "Technical Program Management", level: 88, context: "Cross-team delivery" },
        { name: "Data Operations & Reporting", level: 85, context: "Operations reporting" },
      ],
    },
    {
      category: "AI-Assisted Development (Code in English)",
      icon: "💬",
      skills: [
        { name: "Claude Code / Codex / Gemini CLI", level: 92, context: "Independent builds" },
        { name: "Prompt Engineering for Code Generation", level: 90, context: "AI-assisted builds" },
        { name: "MCP (Model Context Protocol)", level: 85, context: "Tool integrations" },
        { name: "LLM Evaluation Frameworks", level: 82, context: "Prototype testing" },
        { name: "Agentic Workflow Automation", level: 85, context: "AI-assisted builds" },
      ],
    },
    {
      category: "Enterprise Tools",
      icon: "🏢",
      skills: [
        { name: "Google Workspace", level: 95, context: "Workplace tools" },
        { name: "Microsoft 365 / Office Suite", level: 95, context: "Workplace tools" },
        { name: "AWS Cloud Marketplace", level: 95, context: "Partner operations" },
        { name: "Salesforce Administration", level: 88, context: "Operations support" },
        { name: "PRM (PartnerStack, Crossbeam, Reveal)", level: 85, context: "Partner systems" },
        { name: "Reporting (Salesforce, Looker Studio)", level: 82, context: "Operations reporting" },
      ],
    },
    {
      category: "Research & Knowledge Systems",
      icon: "🔬",
      skills: [
        { name: "Research Review & Synthesis", level: 95, context: "Independent study" },
        { name: "Self-Directed Learning & Meta-Learning", level: 95, context: "Ongoing practice" },
        { name: "Technical Writing & Documentation", level: 90, context: "Operations & builds" },
        { name: "Rapid Prototyping & Iterative Shipping", level: 88, context: "AI-assisted builds" },
        { name: "Open Source Publishing", level: 82, context: "Independent projects" },
      ],
    },
    {
      category: "Leadership & Community",
      icon: "🌐",
      skills: [
        { name: "Community Building & Networking", level: 92, context: "Community programs" },
        { name: "Youth & Professional Mentorship", level: 90, context: "Youth & professionals" },
        { name: "Cross-Functional Coordination", level: 90, context: "Operations practice" },
        { name: "Systems Thinking & Architecture", level: 92, context: "Systems design" },
        { name: "Workshops & Professional Discussions", level: 85, context: "Community events" },
      ],
    },
  ];

function subscribeToDesktop(callback: () => void) {
  const media = window.matchMedia("(min-width: 768px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

const getDesktopSnapshot = () => window.matchMedia("(min-width: 768px)").matches;
const getServerDesktopSnapshot = () => false;

export default function SkillsVisualization({ isLight }: SkillsVisualizationProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isDesktop = useSyncExternalStore(subscribeToDesktop, getDesktopSnapshot, getServerDesktopSnapshot);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { depth } = useReadingDepth();
  const showBars = depth !== "skim";
  const showExtras = depth === "deep";
  const isSkim = depth === "skim";
  const cardsPerView = isDesktop ? 2 : 1;
  const firstVisibleIndex = Math.floor(activeIndex / cardsPerView) * cardsPerView;
  const pageCount = Math.ceil(skillCategories.length / cardsPerView);
  const currentPage = Math.floor(firstVisibleIndex / cardsPerView);
  const isRotating = isInView && isPageVisible && !isPaused && !isHovered && !hasFocus && !prefersReducedMotion;
  const controlClass = `inline-flex h-11 min-w-11 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6366f1] ${
    isLight
      ? "border-gray-200 bg-white text-gray-700 hover:border-[#6366f1]"
      : "border-[#6366f1]/20 bg-[#0f0f1f] text-[#ededed] hover:border-[#6366f1]"
  }`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    const section = sectionRef.current;
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setIsPageVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (!isRotating) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (Math.floor(index / cardsPerView) * cardsPerView + cardsPerView) % skillCategories.length);
    }, 10000);
    return () => window.clearInterval(timer);
  }, [cardsPerView, isRotating]);

  const showPage = (page: number) => {
    const wrappedPage = (page + pageCount) % pageCount;
    setActiveIndex(wrappedPage * cardsPerView);
    setIsPaused(true);
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={`${isSkim ? 'py-10' : 'py-16'} px-6 ${isLight ? 'bg-gradient-to-br from-gray-50 to-blue-50' : 'bg-gradient-to-br from-[#0a0a0a] to-[#0f0a1a]'}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className={`text-center ${isSkim ? 'mb-4' : 'mb-8'}`}>
          {!isSkim && (
            <span
              className={`inline-block text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 ${
                isLight ? "text-[#6366f1]/80" : "text-[#818cf8]"
              }`}
            >
              Technical Expertise
            </span>
          )}

          <h2
            className={`text-3xl md:text-4xl font-bold tracking-tight ${isSkim ? '' : 'mb-3'} ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Operations + AI infrastructure.
          </h2>
          {showBars && (
            <p
              className={`mt-3 max-w-2xl mx-auto text-[15px] leading-relaxed ${
                isLight ? "text-gray-600" : "text-[#a3a3a3]"
              }`}
            >
              Areas of practice across operations and AI-assisted work. Bars show self-assessed familiarity.
            </p>
          )}
        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Areas of practice"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocusCapture={() => setHasFocus(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHasFocus(false);
          }}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className={`text-sm ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
              <span className="font-medium tabular-nums">
                {firstVisibleIndex + 1}{cardsPerView > 1 ? `–${firstVisibleIndex + cardsPerView}` : ""}
              </span> of {skillCategories.length} practice areas
            </p>
            <div className="flex items-center gap-2">
              {!prefersReducedMotion && (
                <button
                  type="button"
                  onClick={() => setIsPaused((paused) => !paused)}
                  className={`${controlClass} gap-2 px-4 text-xs font-medium`}
                  aria-label={isPaused ? "Resume practice area rotation" : "Pause practice area rotation"}
                >
                  <span aria-hidden="true">{isPaused ? "▶" : "Ⅱ"}</span>
                  {isPaused ? "Resume" : "Pause"}
                </button>
              )}
              <button type="button" className={controlClass} onClick={() => showPage(currentPage - 1)} aria-label="Previous practice areas">
                <span aria-hidden="true">←</span>
              </button>
              <button type="button" className={controlClass} onClick={() => showPage(currentPage + 1)} aria-label="Next practice areas">
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2" aria-live={isRotating ? "off" : "polite"} aria-atomic="false">
            {skillCategories.map((category, catIndex) => {
              const isActive = catIndex >= firstVisibleIndex && catIndex < firstVisibleIndex + cardsPerView;
              return (
                <article
                  key={category.category}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${category.category}, ${catIndex + 1} of ${skillCategories.length}`}
                  aria-hidden={!isActive}
                  inert={!isActive}
                  className={`${isSkim ? "p-4" : "p-5 md:p-6"} min-w-0 rounded-xl border-2 ${prefersReducedMotion ? "" : "transition-opacity duration-500"} ${
                    isLight ? "bg-white border-gray-200 shadow-lg" : "bg-[#0f0f1f] border-[#6366f1]/20 shadow-2xl"
                  } ${isActive ? "visible opacity-100" : "invisible pointer-events-none opacity-0"}`}
                  style={{ gridRow: 1, gridColumn: (catIndex % cardsPerView) + 1 }}
                >
                  <div className={`flex items-center gap-3 ${showBars ? "mb-5 min-h-12" : ""}`}>
                    <span className={isSkim ? "text-xl" : "text-2xl"} aria-hidden="true">{category.icon}</span>
                    <h3 className={`${isSkim ? "text-base" : "text-lg"} font-bold leading-snug ${isLight ? "text-gray-900" : "text-white"}`}>
                      {category.category}
                    </h3>
                  </div>
                  {showBars && (
                    <div className="space-y-3">
                      {category.skills.map((skill) => (
                        <div key={skill.name}>
                          <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                            <span className={`text-sm font-medium ${isLight ? "text-gray-700" : "text-[#ededed]"}`}>{skill.name}</span>
                            <span className={`text-xs ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>{skill.context}</span>
                          </div>
                          <div
                            role="progressbar"
                            aria-label={`${skill.name}: self-assessed familiarity`}
                            aria-valuenow={skill.level}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            className={`h-1.5 overflow-hidden rounded-full ${isLight ? "bg-gray-200" : "bg-[#1a1a1a]"}`}
                          >
                            <div className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6]" style={{ width: `${skill.level}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="mt-4 flex justify-center sm:gap-1" role="group" aria-label="Choose practice areas">
            {Array.from({ length: pageCount }, (_, page) => {
              const names = skillCategories.slice(page * cardsPerView, (page + 1) * cardsPerView).map((category) => category.category).join(" and ");
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => showPage(page)}
                  aria-label={`Show ${names}`}
                  aria-current={page === currentPage ? "true" : undefined}
                  className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366f1]"
                >
                  <span className={`h-2 rounded-full ${prefersReducedMotion ? "" : "transition-all duration-300"} ${page === currentPage ? "w-6 bg-[#6366f1]" : `w-2 ${isLight ? "bg-gray-600" : "bg-[#a3a3a3]"}`}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Certifications */}
        {showExtras && (
        <div className="mt-12 text-center">
          <h3 className={`text-lg font-semibold mb-4 ${isLight ? 'text-gray-700' : 'text-[#ededed]'}`}>
            Training & Accreditations
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">☁️ AWS Partner: Business Accreditation</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">🤖 AWS Partner: GenAI on AWS Essentials</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">☁️ AWS Knowledge: Cloud Essentials</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">🔒 Microsoft Copilot for Security</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">🔷 Microsoft Azure AI Cloud Week</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">🛒 Microsoft Marketplace Private Offer Best Practices</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">📈 Mastering Cloud Marketplaces: Partner Insight</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">🧠 AI-First Product Leader (LinkedIn Learning)</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">📋 Project Management (Coursera)</span>
            </div>
          </div>
        </div>
        )}

        {/* Achievements & Recognition */}
        {showExtras && (
        <div className="mt-8 text-center">
          <h3 className={`text-lg font-semibold mb-4 ${isLight ? 'text-gray-700' : 'text-[#ededed]'}`}>
            Achievements & Recognition
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://openreview.net/forum?id=1E20ig92Zi"
              target="_blank"
              rel="noopener noreferrer"
              title="Burstiness Was Measured Wrong, and Prompting Cannot Aim It — coauthored with Vittoria Lanzo"
              className={`px-4 py-2 rounded-lg border text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6366f1] ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}
            >
              🧠 NeurIPS 2026 · LP4FM Workshop · Accepted Poster · Co-author
            </a>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">🏆 Microsoft Partner Awards (2024, 2025) · Team Contributor</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">🤝 Catalyst 2026 Participant</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">📰 Contentsquare / Suger Case Study</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">🧠 NeurIPS 2025 Attendee</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">🚀 SpaceX Hyperloop 2019 Finalist</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">📦 Open-Source Tools</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">📚 Research-Informed Prototypes</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">🎓 BBA Marketing, University of Windsor</span>
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
