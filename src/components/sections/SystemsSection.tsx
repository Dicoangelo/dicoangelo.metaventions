"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";

const ThreeSystemsNetwork = dynamic(() => import("../ThreeSystemsNetwork"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gradient-to-br from-black/20 to-black/5 rounded-2xl animate-pulse flex items-center justify-center">
      <p className="text-gray-500 text-sm">Loading 3D visualization...</p>
    </div>
  ),
});

interface SystemsSectionProps {
  isLight: boolean;
}

export function SystemsSection({ isLight }: SystemsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing once visible
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef}>
      <AnimatedSection id="systems" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Value Proposition */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
            isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-indigo-950/50 border-indigo-500/30 text-indigo-400'
          }`}>
            <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 7H7v6h6V7z" />
              <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider">Production AI Infrastructure</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Self-Improving AI Systems
          </h2>

          <p className={`text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed ${
            isLight ? 'text-gray-700' : 'text-[#a3a3a3]'
          }`}>
            Built autonomous engineering infrastructure that learns from every interaction,
            self-heals errors, and optimizes performance—reducing development cycles by 50%
            while maintaining enterprise-grade reliability.
          </p>

          {/* Key Metrics Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className={`p-6 rounded-xl border ${
              isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'
            }`}>
              <div className="text-3xl font-bold text-indigo-500 mb-2">428K+</div>
              <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-[#737373]'}`}>
                Autonomous Decisions
              </div>
              <div className={`text-xs mt-1 ${isLight ? 'text-gray-500' : 'text-[#525252]'}`}>
                Real-time quality scoring
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${
              isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'
            }`}>
              <div className="text-3xl font-bold text-indigo-500 mb-2">94%</div>
              <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-[#737373]'}`}>
                Error Auto-Resolution
              </div>
              <div className={`text-xs mt-1 ${isLight ? 'text-gray-500' : 'text-[#525252]'}`}>
                700+ patterns recognized
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${
              isLight ? 'bg-white border-gray-200' : 'bg-[#141414] border-[#262626]'
            }`}>
              <div className="text-3xl font-bold text-indigo-500 mb-2">24/7</div>
              <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-[#737373]'}`}>
                Production Uptime
              </div>
              <div className={`text-xs mt-1 ${isLight ? 'text-gray-500' : 'text-[#525252]'}`}>
                Since November 2025
              </div>
            </div>
          </div>
        </div>

        {/* 3D Network Visualization */}
        <div className="mb-12">
          <h3 className={`text-xl font-semibold mb-4 text-center ${
            isLight ? 'text-gray-800' : 'text-[#e5e7eb]'
          }`}>
            9 Interconnected AI Systems
          </h3>
          <div className="w-full h-[600px] border border-white/10 rounded-2xl bg-black/5 dark:bg-white/5 backdrop-blur-sm">
            {isVisible && <ThreeSystemsNetwork />}
          </div>
          <p className={`text-xs text-center mt-4 ${isLight ? 'text-gray-500' : 'text-[#525252]'}`}>
            Interactive 3D Architecture — Hover to explore each system
          </p>
        </div>

        {/* Business Value Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          <div className={`p-8 rounded-xl border ${
            isLight ? 'bg-gradient-to-br from-white to-indigo-50 border-indigo-100' : 'bg-gradient-to-br from-[#141414] to-indigo-950/20 border-indigo-500/20'
          }`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-indigo-500/10">
                <svg aria-hidden="true" className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Built for Scale</h4>
                <p className={`text-sm leading-relaxed ${isLight ? 'text-gray-700' : 'text-[#a3a3a3]'}`}>
                  Designed autonomous systems that optimize resource allocation, predict failures before they occur,
                  and continuously improve performance based on historical patterns—similar to how I scaled
                  Contentsquare's marketplace operations from days to minutes.
                </p>
              </div>
            </div>
          </div>

          <div className={`p-8 rounded-xl border ${
            isLight ? 'bg-gradient-to-br from-white to-purple-50 border-purple-100' : 'bg-gradient-to-br from-[#141414] to-purple-950/20 border-purple-500/20'
          }`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <svg aria-hidden="true" className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Data-Driven Innovation</h4>
                <p className={`text-sm leading-relaxed ${isLight ? 'text-gray-700' : 'text-[#a3a3a3]'}`}>
                  Every system decision is measured, analyzed, and optimized. Real-time analytics track
                  performance across quality scores, error patterns, and efficiency metrics—providing
                  actionable insights that drive continuous improvement.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Leadership Highlight */}
        <div className={`mt-12 p-8 rounded-2xl border ${
          isLight ? 'bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-200' : 'bg-gradient-to-r from-indigo-950/30 via-purple-950/30 to-pink-950/30 border-indigo-500/30'
        }`}>
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Why This Matters</h3>
            <p className={`text-base leading-relaxed ${isLight ? 'text-gray-700' : 'text-[#a3a3a3]'}`}>
              These aren't just tools—they represent a systematic approach to building intelligent,
              self-optimizing infrastructure. The same principles I applied at Contentsquare to transform
              marketplace operations (enabling 81% ACV growth) are now embedded into autonomous systems
              that scale engineering productivity while maintaining enterprise reliability standards.
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
    </div>
  );
}
