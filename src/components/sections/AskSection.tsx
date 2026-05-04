"use client";

import dynamic from "next/dynamic";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ChatSkeleton } from "@/components/LoadingSkeletons";
import { useReadingDepth } from "@/components/ReadingDepthProvider";

const Chat = dynamic(() => import("@/components/Chat"), {
  loading: () => <ChatSkeleton />,
});

interface AskSectionProps {
  isLight: boolean;
}

export function AskSection({ isLight }: AskSectionProps) {
  const { depth } = useReadingDepth();
  const showSummary = depth !== "skim";

  return (
    <AnimatedSection id="ask" className="py-20 px-6">
      <div id="main-content" className="sr-only" aria-hidden="true"></div>
      <div className="max-w-6xl mx-auto">
        <div className={`text-center ${showSummary ? "mb-12" : "mb-6"}`}>
          <h2 className="text-3xl font-bold mb-4">Ask Me Anything</h2>
          {showSummary && (
            <p className={isLight ? 'text-gray-600' : 'text-[#737373]'}>
              AI-powered chat grounded in my full portfolio. Ask anything — voice or text.
            </p>
          )}
        </div>
        <Chat />
      </div>
    </AnimatedSection>
  );
}
