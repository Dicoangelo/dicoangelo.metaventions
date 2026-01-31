"use client";

import { useState } from "react";

interface ResumeDownloadProps {
  isLight: boolean;
}

export default function ResumeDownload({ isLight }: ResumeDownloadProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (format: 'pdf' | 'docx') => {
    setDownloading(true);

    // Track download (you can add analytics here)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'resume_download', {
        format: format,
        timestamp: new Date().toISOString()
      });
    }

    // Simulate download delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // In production, this would trigger actual file download
    // For now, we'll show the link
    const link = document.createElement('a');
    link.href = `/DICO_ANGELO_MASTER_RESUME_CORRECTED_2026.${format}`;
    link.download = `Dico_Angelo_Resume_2026.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloading(false);
  };

  return (
    <section
      id="resume"
      className={`py-20 px-6 ${isLight ? 'bg-gradient-to-br from-blue-50 to-purple-50' : 'bg-gradient-to-br from-[#0a0a1a] to-[#1a0a1a]'}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className={`p-8 md:p-12 rounded-2xl border-2 ${
          isLight
            ? 'bg-white border-blue-200 shadow-xl'
            : 'bg-[#0f0f1f] border-[#6366f1]/30 shadow-2xl'
        }`}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6366f1]/10 border border-[#6366f1]/30 mb-4">
              <svg className="w-4 h-4 text-[#6366f1]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-semibold text-[#6366f1]">Resume Available</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Download My Resume
            </h2>
            <p className={`text-lg mb-6 ${isLight ? 'text-gray-600' : 'text-[#a3a3a3]'}`}>
              Operations Infrastructure Builder | AI Systems Engineer
            </p>
            <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-[#737373]'}`}>
              Updated January 2026 · Accurate metrics · TN Visa eligible
            </p>
          </div>

          {/* Key Highlights */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className={`p-4 rounded-lg text-center ${
              isLight ? 'bg-gray-50' : 'bg-[#1a1a1a]'
            }`}>
              <p className="text-2xl font-bold text-[#6366f1] mb-1">$800M+</p>
              <p className={`text-xs ${isLight ? 'text-gray-600' : 'text-[#737373]'}`}>
                TCV Processed
              </p>
            </div>
            <div className={`p-4 rounded-lg text-center ${
              isLight ? 'bg-gray-50' : 'bg-[#1a1a1a]'
            }`}>
              <p className="text-2xl font-bold text-[#6366f1] mb-1">297K+</p>
              <p className={`text-xs ${isLight ? 'text-gray-600' : 'text-[#737373]'}`}>
                Lines of Code
              </p>
            </div>
            <div className={`p-4 rounded-lg text-center ${
              isLight ? 'bg-gray-50' : 'bg-[#1a1a1a]'
            }`}>
              <p className="text-2xl font-bold text-[#6366f1] mb-1">97%</p>
              <p className={`text-xs ${isLight ? 'text-gray-600' : 'text-[#737373]'}`}>
                Approval Rate
              </p>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleDownload('pdf')}
              disabled={downloading}
              className="group px-8 py-4 bg-[#6366f1] hover:bg-[#5558e3] disabled:bg-gray-400 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              aria-label="Download resume as PDF"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleDownload('docx')}
              disabled={downloading}
              className={`group px-8 py-4 border-2 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 ${
                isLight
                  ? 'bg-white hover:bg-gray-50 border-gray-300 text-gray-800'
                  : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] border-[#3a3a3a]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Download resume as DOCX"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download DOCX</span>
            </button>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-6 border-t border-[#262626] text-center">
            <p className={`text-sm mb-3 ${isLight ? 'text-gray-600' : 'text-[#737373]'}`}>
              Or view my work directly:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="https://github.com/Dicoangelo"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                  isLight
                    ? 'border-gray-200 hover:bg-gray-50'
                    : 'border-[#262626] hover:bg-[#1a1a1a]'
                }`}
              >
                GitHub →
              </a>
              <a
                href="https://www.linkedin.com/in/dicoangelo"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                  isLight
                    ? 'border-gray-200 hover:bg-gray-50'
                    : 'border-[#262626] hover:bg-[#1a1a1a]'
                }`}
              >
                LinkedIn →
              </a>
              <a
                href="https://www.npmjs.com/org/metaventionsai"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                  isLight
                    ? 'border-gray-200 hover:bg-gray-50'
                    : 'border-[#262626] hover:bg-[#1a1a1a]'
                }`}
              >
                npm Packages →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
