"use client";

import dynamic from "next/dynamic";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ChatSkeleton } from "@/components/LoadingSkeletons";

const Chat = dynamic(() => import("@/components/Chat"), {
  loading: () => <ChatSkeleton />,
});

interface AskSectionProps {
  isLight: boolean;
}

export function AskSection({ isLight }: AskSectionProps) {
  return (
    <AnimatedSection id="ask" className="py-20 px-6">
      <div id="main-content" className="sr-only" aria-hidden="true"></div>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ask Me Anything</h2>
          <p className={isLight ? 'text-gray-600' : 'text-[#737373]'}>
            AI-powered chat that knows my entire portfolio. Go ahead, interrogate.
          </p>
        </div>
        <Chat />
      </div>
    </AnimatedSection>
  );
}
