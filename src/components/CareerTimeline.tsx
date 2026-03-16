"use client";

import { useState, useEffect, useRef } from "react";

interface TimelineEvent {
  date: string;
  title: string;
  company: string;
  location: string;
  type: "work" | "achievement" | "education";
  description: string;
  highlights: string[];
  metrics?: string[];
}

interface CareerTimelineProps {
  isLight: boolean;
}

export default function CareerTimeline({ isLight }: CareerTimelineProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const events: TimelineEvent[] = [
    {
      date: "Jan - Apr 2026",
      title: "Volunteer Mentor",
      company: "Mass Fintech Hub",
      location: "Massachusetts",
      type: "achievement",
      description: "Volunteer leadership role mentoring 3 students from New England universities through the Mass Fintech Hub Mentoring Program.",
      highlights: [
        "Mentoring 3 students in fintech, AI, and operations infrastructure careers",
        "Bi-monthly 1:1 sessions sharing real-world experience and professional guidance",
        "Supporting Massachusetts' mission to become the fintech capital of the world",
        "Contributing to the talent pipeline across 20+ New England universities",
      ],
      metrics: ["3 Mentees", "Volunteer Leadership"],
    },
    {
      date: "Nov 2025 - Present",
      title: "Founder & AI Systems Architect",
      company: "Metaventions AI",
      location: "Remote",
      type: "work",
      description: "Shipped 410,000+ lines of production code across 4 deployed AI systems: Structura, CareerCoach, ResearchGravity, and Claude Infrastructure.",
      highlights: [
        "Built Structura: 85,500+ line voice-native OS with multi-agent orchestration",
        "Created CareerCoach: 26,600+ line career intelligence platform",
        "Developed ResearchGravity: 35,200+ line research-to-production pipeline",
        "Built Claude Infrastructure: 262,400+ lines of custom developer tooling",
      ],
      metrics: ["900K+ LOC", "20+ Systems", "Deployed"],
    },
    {
      date: "2022 - 2025",
      title: "Cloud Alliance Operations & Partner Systems",
      company: "Contentsquare",
      location: "Paris / Remote",
      type: "work",
      description: "Operations leader enabling $30M+ cloud marketplace revenue growth in 30 months (0 to scale). Managed strategic vendor relationships with AWS & Microsoft.",
      highlights: [
        "Scaled cloud marketplace from $0 to $30M+ in 30 months",
        "Managed $800M+ TCV with 40% cloud attachment rate",
        "Automated 90% of deal registrations, reducing manual inputs by 60%",
        "Contributed to 2x Microsoft Partner of the Year (2024, 2025)",
        "14x AWS YoY growth, 81% larger ACV, 26-day shorter sales cycles",
      ],
      metrics: ["$30M+ Revenue", "$800M+ TCV", "2x MSFT POTY"],
    },
    {
      date: "2020 - 2023",
      title: "Product Operations Manager",
      company: "Rocket Mortgage Canada",
      location: "Windsor, ON",
      type: "work",
      description: "Led data operations for team of 45 agents with quality control systems. Built evaluation frameworks delivering $222K annual savings.",
      highlights: [
        "Led team of 45 agents with 90% satisfaction score",
        "Built evaluation frameworks: $222,750 annual cost savings, 7,425 hours/year",
        "Improved onboarding pipeline efficiency by 91.67%",
        "Achieved 20% increase in customer satisfaction through product improvements",
      ],
      metrics: ["$222K Savings", "45 Agents", "91% Efficiency"],
    },
    {
      date: "2026",
      title: "Multi-Agent Systems Research",
      company: "Independent Research",
      location: "Remote",
      type: "achievement",
      description: "Published research on consensus mechanisms, DQ scoring, and agentic architectures.",
      highlights: [
        "arXiv:2511.15755 - DQ Scoring Framework",
        "arXiv:2508.17536 - Voting mechanisms in multi-agent systems",
        "arXiv:2512.05470 - Agentic File System (AFS)",
        "Weekly arXiv monitoring and synthesis",
      ],
      metrics: ["8+ Papers", "4 Core Systems"],
    },
    {
      date: "2026",
      title: "Roundtable Lead Speaker, AI & Partnerships",
      company: "Catalyst 2026 — NYC & Toronto",
      location: "NYC & Toronto",
      type: "achievement",
      description: "Selected as Roundtable Lead Speaker for AI & Partnerships at Catalyst 2026, connecting founders, operators, and investors across NYC and Toronto.",
      highlights: [
        "Led roundtable discussions on AI partnerships and enterprise adoption",
        "Networked with 200+ AI founders and builders",
        "Contributed insights on multi-agent orchestration and sovereign AI systems",
        "Presented work on autonomous AI systems and cognitive infrastructure",
      ],
      metrics: ["Lead Speaker", "NYC & Toronto"],
    },
  ];

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }

    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
    };
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "work":
        return "💼";
      case "achievement":
        return "🏆";
      case "education":
        return "🎓";
      default:
        return "📍";
    }
  };

  return (
    <section
      ref={timelineRef}
      id="timeline"
      className={`py-20 px-6 ${isLight ? 'bg-white' : 'bg-[#0a0a0a]'}`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/30 mb-4">
            <svg aria-hidden="true" className="w-4 h-4 text-[#6366f1]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm font-semibold text-[#6366f1]">Career Journey</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Professional Timeline
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
            From operational infrastructure to autonomous AI systems. A journey of building at scale.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div
            className={`absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 ${
              isLight ? 'bg-gradient-to-b from-blue-200 to-purple-200' : 'bg-gradient-to-b from-[#6366f1] to-[#8b5cf6]'
            }`}
            style={{
              height: isVisible ? '100%' : '0%',
              transition: 'height 1.5s ease-out',
            }}
          />

          {/* Events */}
          <div className="space-y-6 md:space-y-12">
            {events.map((event, index) => {
              const isExpanded = selectedEvent === index;
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`relative ${isLeft ? 'md:pr-1/2' : 'md:pl-1/2'}`}
                  style={{
                    animation: isVisible ? `fadeInUp 0.6s ease-out ${index * 0.15}s forwards` : 'none',
                    opacity: isVisible ? 1 : 0,
                  }}
                >
                  <div className={`md:flex ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                    <div
                      className={`ml-16 md:ml-0 md:w-5/12 cursor-pointer transition-all ${
                        isExpanded ? 'scale-[1.02]' : ''
                      }`}
                      onClick={() => setSelectedEvent(isExpanded ? null : index)}
                    >
                      <div
                        className={`p-6 rounded-xl border-2 transition-all ${
                          isLight
                            ? `bg-white border-gray-200 shadow-md ${isExpanded ? 'shadow-xl border-[#6366f1]' : 'hover:shadow-lg'}`
                            : `bg-[#0f0f1f] border-[#262626] shadow-lg ${isExpanded ? 'shadow-2xl border-[#6366f1]' : 'hover:border-[#6366f1]/50'}`
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getEventIcon(event.type)}</span>
                            <div>
                              <h3 className="text-lg font-bold leading-tight">{event.title}</h3>
                              <p className="text-sm text-[#6366f1] font-semibold">{event.company}</p>
                            </div>
                          </div>
                        </div>

                        <div className={`text-sm mb-2 ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
                          {event.date} • {event.location}
                        </div>

                        <p className={`text-sm mb-3 ${isLight ? 'text-gray-700' : 'text-[#ededed]'}`}>
                          {event.description}
                        </p>

                        {/* Metrics badges */}
                        {event.metrics && event.metrics.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {event.metrics.map((metric, i) => (
                              <span
                                key={i}
                                className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                  isLight
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-[#6366f1]/10 text-[#6366f1]'
                                }`}
                              >
                                {metric}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Expandable highlights */}
                        {isExpanded && (
                          <div className={`mt-4 pt-4 border-t ${isLight ? 'border-gray-200' : 'border-[#262626]'}`}>
                            <h4 className={`text-sm font-semibold mb-2 ${isLight ? 'text-gray-700' : 'text-[#ededed]'}`}>
                              Key Highlights:
                            </h4>
                            <ul className={`space-y-1 text-sm ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
                              {event.highlights.map((highlight, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-[#6366f1] mt-1">•</span>
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Expand indicator */}
                        <button
                          className={`mt-2 text-xs font-semibold ${isLight ? 'text-gray-500' : 'text-[#737373]'} hover:text-[#6366f1] transition-colors`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(isExpanded ? null : index);
                          }}
                        >
                          {isExpanded ? '▲ Show less' : '▼ Show more'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div
                    className={`absolute left-8 md:left-1/2 top-6 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 ${
                      isLight ? 'bg-white border-[#6366f1]' : 'bg-[#0a0a0a] border-[#6366f1]'
                    } ${isExpanded ? 'scale-150' : ''} transition-transform`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
