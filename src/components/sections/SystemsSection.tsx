"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import { StaggeredGrid } from "@/components/StaggeredGrid";
import { SystemCard } from "@/components/SystemCard";

interface SystemsSectionProps {
  isLight: boolean;
}

export function SystemsSection({ isLight }: SystemsSectionProps) {
  return (
    <AnimatedSection id="systems" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">META-VENGINE</h2>
          <p className={isLight ? "text-gray-600" : "text-[#737373]"}>
            9-system self-improving AI infrastructure. The system that improves itself.
          </p>
        </div>

        <StaggeredGrid className="grid md:grid-cols-3 gap-4">
          <SystemCard
            name="Cognitive OS"
            description="Energy-aware task routing based on 34K+ activity events"
            metric="Circadian-adaptive"
            isLight={isLight}
          />
          <SystemCard
            name="DQ Routing"
            description="Decision Quality scoring: Validity (40%) + Specificity (30%) + Correctness (30%)"
            metric="0.889 avg score"
            isLight={isLight}
          />
          <SystemCard
            name="Recovery Engine"
            description="Autonomous error detection and self-healing"
            metric="70% auto-fix rate"
            isLight={isLight}
          />
          <SystemCard
            name="Supermemory"
            description="Cross-session learning with spaced repetition"
            metric="700+ patterns"
            isLight={isLight}
          />
          <SystemCard
            name="Multi-Agent Coordinator"
            description="Parallel agent orchestration with file locking"
            metric="3+ concurrent"
            isLight={isLight}
          />
          <SystemCard
            name="ACE Consensus"
            description="Adaptive Consensus Engine with DQ-weighted voting"
            metric="50% faster consensus"
            isLight={isLight}
          />
          <SystemCard
            name="Observatory"
            description="Unified analytics across all systems"
            metric="Real-time metrics"
            isLight={isLight}
          />
          <SystemCard
            name="Context Packs V2"
            description="7-layer semantic context selection"
            metric="Smart prefetch"
            isLight={isLight}
          />
          <SystemCard
            name="Learning Hub"
            description="Cross-domain correlation and improvement suggestions"
            metric="Weekly sync"
            isLight={isLight}
          />
        </StaggeredGrid>

        <div className="mt-8 text-center">
          <p className={`text-sm ${isLight ? "text-gray-500" : "text-[#525252]"}`}>
            428K routing decisions logged · 94% error pattern coverage · Production since Nov 2025
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}
