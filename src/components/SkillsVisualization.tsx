"use client";

import { useState, useEffect, useRef } from "react";

interface Skill {
  name: string;
  level: number; // 0-100
  years?: string;
}

interface SkillCategory {
  category: string;
  icon: string;
  skills: Skill[];
}

interface SkillsVisualizationProps {
  isLight: boolean;
}

export default function SkillsVisualization({ isLight }: SkillsVisualizationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const skillCategories: SkillCategory[] = [
    {
      category: "AI & Agentic Systems",
      icon: "🤖",
      skills: [
        { name: "Prompt Engineering", level: 95, years: "5+ years" },
        { name: "Multi-Agent Orchestration", level: 85, years: "<1 year" },
        { name: "Agentic Architectures", level: 85, years: "<1 year" },
        { name: "LLM Integration & Routing", level: 82, years: "<1 year" },
        { name: "RAG Systems (pgvector)", level: 78, years: "<1 year" },
      ],
    },
    {
      category: "Operations & Infrastructure",
      icon: "⚙️",
      skills: [
        { name: "Cloud Marketplace Operations", level: 95, years: "3 years" },
        { name: "GTM Automation & Workflow Design", level: 90, years: "3 years" },
        { name: "Process Optimization", level: 92, years: "5+ years" },
        { name: "Technical Program Management", level: 88, years: "5+ years" },
        { name: "Data Operations & Reporting", level: 85, years: "5+ years" },
      ],
    },
    {
      category: "Technical Stack",
      icon: "💻",
      skills: [
        { name: "TypeScript", level: 82, years: "<1 year" },
        { name: "React/Next.js", level: 80, years: "<1 year" },
        { name: "Python", level: 78, years: "<1 year" },
        { name: "Node.js", level: 75, years: "<1 year" },
        { name: "Supabase/PostgreSQL", level: 72, years: "<1 year" },
      ],
    },
    {
      category: "Enterprise Tools",
      icon: "🏢",
      skills: [
        { name: "Google Workspace", level: 95, years: "10+ years" },
        { name: "Microsoft 365 / Office Suite", level: 95, years: "10+ years" },
        { name: "AWS Cloud Marketplace", level: 95, years: "3 years" },
        { name: "Salesforce Administration", level: 88, years: "3 years" },
        { name: "PRM (PartnerStack, Crossbeam, Reveal)", level: 85, years: "3 years" },
        { name: "Snowflake, Tableau, Miro, Figma", level: 82, years: "3 years" },
      ],
    },
    {
      category: "Research & Knowledge Systems",
      icon: "🔬",
      skills: [
        { name: "Research Synthesis & Methodology", level: 95, years: "5+ years" },
        { name: "Self-Directed Learning & Meta-Learning", level: 95, years: "5+ years" },
        { name: "Technical Writing & Documentation", level: 90, years: "3+ years" },
        { name: "Rapid Prototyping & Iterative Shipping", level: 88, years: "<1 year" },
        { name: "Open Source Publishing", level: 82, years: "<1 year" },
      ],
    },
    {
      category: "Leadership & Community",
      icon: "🌐",
      skills: [
        { name: "Community Building & Networking", level: 92, years: "7+ years" },
        { name: "Youth & Professional Mentorship", level: 90, years: "7+ years" },
        { name: "Cross-Functional Coordination", level: 90, years: "3 years" },
        { name: "Systems Thinking & Architecture", level: 92, years: "5+ years" },
        { name: "Thought Leadership & Public Speaking", level: 85, years: "3+ years" },
      ],
    },
  ];

  // Intersection observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={`py-20 px-6 ${isLight ? 'bg-gradient-to-br from-gray-50 to-blue-50' : 'bg-gradient-to-br from-[#0a0a0a] to-[#0f0a1a]'}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/30 mb-4">
            <svg aria-hidden="true" className="w-4 h-4 text-[#6366f1]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
            </svg>
            <span className="text-sm font-semibold text-[#6366f1]">Technical Expertise</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Skills & Proficiencies
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
            Bridging operational excellence with technical implementation. From infrastructure to AI systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          {skillCategories.map((category, catIndex) => (
            <div
              key={category.category}
              className={`p-6 rounded-xl border-2 transition-opacity duration-600 ${
                isLight
                  ? 'bg-white border-gray-200 shadow-lg'
                  : 'bg-[#0f0f1f] border-[#6366f1]/20 shadow-2xl'
              } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{
                animationDelay: isVisible ? `${catIndex * 0.1}s` : '0s',
                animation: isVisible ? 'fadeInUp 0.6s ease-out forwards' : 'none',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{category.icon}</span>
                <h3 className="text-xl font-bold">{category.category}</h3>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className={`text-sm font-medium ${isLight ? 'text-gray-700' : 'text-[#ededed]'}`}>
                        {skill.name}
                      </span>
                      <span className={`text-xs ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>
                        {skill.years}
                      </span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isLight ? 'bg-gray-200' : 'bg-[#1a1a1a]'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: isVisible ? `${skill.level}%` : '0%',
                          transitionDelay: `${(catIndex * 0.1) + (skillIndex * 0.05)}s`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-12 text-center">
          <h3 className={`text-lg font-semibold mb-4 ${isLight ? 'text-gray-700' : 'text-[#ededed]'}`}>
            Certifications
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
              <span className="text-sm">🔷 Azure Development Certifications</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">📋 Project Management (Coursera)</span>
            </div>
          </div>
        </div>

        {/* Achievements & Recognition */}
        <div className="mt-8 text-center">
          <h3 className={`text-lg font-semibold mb-4 ${isLight ? 'text-gray-700' : 'text-[#ededed]'}`}>
            Achievements & Recognition
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">🏆 2x Microsoft Partner of the Year (2024, 2025)</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">🎤 Catalyst 2026 Fellowship & Speaker</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">📰 Suger.io Case Study Feature</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">🧠 NeurIPS 2025 Attendee</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">🚀 SpaceX Hyperloop 2019 Finalist</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">📦 2 Published npm Packages</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">📚 8+ arXiv Papers Implemented</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'}`}>
              <span className="text-sm">🎓 BBA Marketing, University of Windsor</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
