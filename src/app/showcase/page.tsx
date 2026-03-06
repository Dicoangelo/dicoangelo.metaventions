"use client";

import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import ShowcaseGallery from "./ShowcaseGallery";
import Lightbox from "./Lightbox";
import PresentationMode from "./PresentationMode";
import { TechStackRibbon } from "./TechStackRibbon";
import { AnomalyStats } from "./AnomalyStats";
import { LiveSites } from "./LiveSites";
import { GitHubRepos } from "./GitHubRepos";
import { Certifications } from "./Certifications";
import { DockerEvidence } from "./DockerEvidence";

export default function ShowcasePage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showPresentation, setShowPresentation] = useState(false);
  const [presStartIndex, setPresStartIndex] = useState(0);

  return (
    <main className="min-h-screen relative">
      {/* Animated Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: isLight
            ? "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)"
            : "linear-gradient(rgba(79,143,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,143,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 70%)",
        }}
      />
      {/* Radial glow */}
      <div
        className="fixed top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none z-0"
        style={{
          background: isLight
            ? "radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, transparent 70%)"
            : "radial-gradient(ellipse at center, rgba(79,143,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Navigation */}
      <Nav />

      {/* Hero Header */}
      <section className="relative z-10 pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div
            className={`inline-block px-3 py-1 rounded-md text-xs font-bold tracking-widest uppercase mb-6 ${
              isLight
                ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                : "bg-[#4f8fff]/15 text-[#4f8fff] border border-[#4f8fff]/30"
            }`}
          >
            PRODUCTION AI SYSTEMS
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4"
            style={{
              background:
                "linear-gradient(135deg, #4f8fff, #a855f7, #06b6d4, #4f8fff)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradientShift 6s ease infinite",
            }}
          >
            Production AI Showcase
          </h1>
          <p
            className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 ${
              isLight ? "text-gray-600" : "text-[#a3a3a3]"
            }`}
          >
            20 architecture screenshots across 5 production AI systems.
            Built, deployed, and measured.
          </p>

          {/* Quick Stats Row */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {[
              { value: "20", label: "Screenshots" },
              { value: "5", label: "Systems" },
              { value: "174K+", label: "Events Captured" },
              { value: "178", label: "MCP Tools" },
              { value: "93.1%", label: "Routing Accuracy" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className={`text-2xl sm:text-3xl font-extrabold ${
                    isLight ? "text-indigo-600" : "text-[#4f8fff]"
                  }`}
                >
                  {stat.value}
                </div>
                <div
                  className={`text-xs uppercase tracking-widest mt-1 ${
                    isLight ? "text-gray-500" : "text-[#6b6b80]"
                  }`}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Ribbon */}
      <section className="relative z-10 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <TechStackRibbon isLight={isLight} />
        </div>
      </section>

      {/* Present Button */}
      <section className="relative z-10 px-6 pb-8">
        <div className="max-w-6xl mx-auto flex justify-center">
          <button
            onClick={() => { setPresStartIndex(0); setShowPresentation(true); }}
            className="px-5 py-2.5 rounded-lg text-sm font-bold tracking-wider uppercase transition-all hover:scale-105 bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
          >
            PRESENT — Full Walkthrough
          </button>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="relative z-10 px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <ShowcaseGallery isLight={isLight} onSelect={(idx) => setLightboxIndex(idx)} />
        </div>
      </section>

      {/* Anomaly Stats */}
      <section id="stats" className="relative z-10 px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <AnomalyStats isLight={isLight} />
        </div>
      </section>

      {/* Live Sites */}
      <section id="sites" className="relative z-10 px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <LiveSites isLight={isLight} />
        </div>
      </section>

      {/* GitHub Repos */}
      <section id="repos" className="relative z-10 px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <GitHubRepos isLight={isLight} />
        </div>
      </section>

      {/* Certifications */}
      <section id="certs" className="relative z-10 px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <Certifications isLight={isLight} />
        </div>
      </section>

      {/* Docker Evidence */}
      <section id="docker" className="relative z-10 px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <DockerEvidence isLight={isLight} />
        </div>
      </section>

      {/* Lightbox Overlay */}
      {lightboxIndex !== null && (
        <Lightbox
          isLight={isLight}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(idx) => setLightboxIndex(idx)}
        />
      )}

      {/* Presentation Mode Overlay */}
      {showPresentation && (
        <PresentationMode
          isLight={isLight}
          startIndex={presStartIndex}
          onClose={() => setShowPresentation(false)}
        />
      )}

      {/* Back to Top */}
      <BackToTop isLight={isLight} />

      {/* Footer */}
      <Footer isLight={isLight} />

      {/* Gradient animation keyframes */}
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </main>
  );
}
