"use client";

import Script from "next/script";
import { AnimatedSection } from "@/components/AnimatedSection";

interface ContactSectionProps {
  isLight: boolean;
}

export function ContactSection({ isLight }: ContactSectionProps) {
  return (
    <AnimatedSection id="contact" className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Deployment Ready</h2>
        <div className={`mb-8 max-w-2xl mx-auto ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
          <p className="mb-4 text-lg">
            I am currently open to new opportunities at the intersection of <strong>AI Systems Engineering</strong> and <strong>Enterprise Operations</strong>.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <span className={`px-3 py-1 rounded-full border font-medium ${isLight ? 'bg-green-100 text-green-700 border-green-200' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
              ✅ TN Visa Eligible
            </span>
            <span className={`px-3 py-1 rounded-full border font-medium ${isLight ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
              📍 Open to Relocation (SF, NYC, Austin)
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href="mailto:dico.angelo97@gmail.com"
            className="px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] rounded-lg font-medium transition-colors text-white"
          >
            dico.angelo97@gmail.com
          </a>
          <a
            href="tel:+15199996099"
            className={`px-6 py-3 border rounded-lg font-medium transition-colors ${isLight
                ? 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-800'
                : 'bg-[#141414] hover:bg-[#1f1f1f] border-[#262626]'
              }`}
          >
            519-999-6099
          </a>
        </div>

        {/* Calendly Scheduling */}
        <div className="mb-8">
          <h3 className={`text-xl font-medium mb-4 ${isLight ? 'text-gray-700' : 'text-[#a3a3a3]'}`}>
            Schedule a Call
          </h3>
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/dicoangelo-metaventionsai/30min?primary_color=8314da"
            style={{ minWidth: '320px', height: '700px' }}
          />
          <Script
            src="https://assets.calendly.com/assets/external/widget.js"
            strategy="lazyOnload"
          />
        </div>

        <div className="flex gap-6 justify-center">
          <a href="https://www.linkedin.com/in/dico-angelo/" target="_blank" className={`transition-colors ${isLight ? 'text-gray-500 hover:text-gray-900' : 'text-[#737373] hover:text-white'}`}>
            LinkedIn
          </a>
          <a href="https://github.com/Dicoangelo" target="_blank" className={`transition-colors ${isLight ? 'text-gray-500 hover:text-gray-900' : 'text-[#737373] hover:text-white'}`}>
            GitHub
          </a>
          <a href="https://x.com/dicoangelo" target="_blank" className={`transition-colors ${isLight ? 'text-gray-500 hover:text-gray-900' : 'text-[#737373] hover:text-white'}`}>
            X
          </a>
          <a href="https://metaventionsai.com" target="_blank" className={`transition-colors ${isLight ? 'text-gray-500 hover:text-gray-900' : 'text-[#737373] hover:text-white'}`}>
            Metaventions AI
          </a>
        </div>
      </div>
    </AnimatedSection>
  );
}
