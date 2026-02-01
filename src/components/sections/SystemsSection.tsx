"use client";

import dynamic from "next/dynamic";
import { AnimatedSection } from "@/components/AnimatedSection";

const ThreeSystemsNetwork = dynamic(() => import("../ThreeSystemsNetwork"), { ssr: false });

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
            9-system self-improving AI infrastructure. Transported to 3D Neural Architecture.
          </p>
        </div>

        {/* 3D Network Visualization */}
        <div className="w-full h-[600px] mb-8 border border-white/10 rounded-2xl bg-black/5 dark:bg-white/5 backdrop-blur-sm">
          <ThreeSystemsNetwork />
        </div>

        <div className="mt-8 text-center">
          <p className={`text-sm ${isLight ? "text-gray-500" : "text-[#525252]"}`}>
            428K routing decisions logged · 94% error pattern coverage · Production since Nov 2025
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
}
