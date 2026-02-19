"use client";

import { useState, useRef, useCallback } from "react";
import { useTheme } from "./ThemeProvider";
import FitScoreGauge from "./FitScoreGauge";
import StrengthCard from "./StrengthCard";
import GapCard from "./GapCard";

/**
 * Clean markdown code blocks from LLM response
 */
function cleanJsonResponse(response: string): string {
  let cleaned = response.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  }
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

interface Assessment {
  summary: string;
  strengths: Array<{
    skill: string;
    evidence: string;
    match_score: number;
  }>;
  gaps: Array<{
    requirement: string;
    reality: string;
    severity: "high" | "medium" | "low";
  }>;
  recommendations: string[];
  fit_score: number;
  fit_tier: "strong" | "moderate" | "weak" | "poor";
}

type AnalysisState = "idle" | "analyzing" | "complete" | "error";

export default function JDAnalyzer() {
  const [jdText, setJdText] = useState("");
  const [state, setState] = useState<AnalysisState>("idle");
  const [streamedText, setStreamedText] = useState("");
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { theme } = useTheme();

  const canSubmit = jdText.trim().length >= 50;

  const analyzeJD = useCallback(async () => {
    if (jdText.trim().length < 50) {
      setErrorMessage("Please paste a complete job description (at least 50 characters)");
      return;
    }

    setState("analyzing");
    setStreamedText("");
    setAssessment(null);
    setErrorMessage("");

    try {
      const response = await fetch("/api/analyze-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jd_text: jdText,
          session_id: `web-${Date.now()}`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Analysis failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        fullText += decoder.decode(value, { stream: true });
        setStreamedText(fullText);
      }

      // Parse the completed response
      const parsed = JSON.parse(cleanJsonResponse(fullText));
      setAssessment(parsed);
      setState("complete");
    } catch (error) {
      console.error("Analysis error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Analysis failed");
      setState("error");
    }
  }, [jdText]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Cmd/Ctrl + Enter to submit
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSubmit && state === "idle") {
        e.preventDefault();
        analyzeJD();
      }
    },
    [canSubmit, state, analyzeJD]
  );

  const reset = () => {
    setJdText("");
    setState("idle");
    setStreamedText("");
    setAssessment(null);
    setErrorMessage("");
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Input Section */}
      {state === "idle" || state === "error" ? (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="jd-input"
              className={`block text-sm font-medium mb-2 ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
            >
              Paste Job Description
            </label>
            <textarea
              ref={textareaRef}
              id="jd-input"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste the full job description here..."
              rows={6}
              aria-describedby="jd-hint"
              className={`
                w-full px-4 py-3 rounded-lg border resize-y md:min-h-[300px]
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                transition-colors duration-200
                ${theme === "light"
                  ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                  : "bg-[#0a0a0a] border-[#262626] text-white placeholder-gray-500"
                }
              `}
            />
            <p id="jd-hint" className={`text-xs mt-1 ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>
              {jdText.length} characters {jdText.length < 50 && jdText.length > 0 && "(minimum 50)"}
              {canSubmit && <span className="ml-2">Press Cmd+Enter to analyze</span>}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
              {errorMessage}
            </div>
          )}

          <button
            onClick={analyzeJD}
            disabled={jdText.trim().length < 50}
            className={`
              w-full py-3 px-6 rounded-lg font-semibold
              transition-all duration-200
              ${jdText.trim().length >= 50
                ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
              }
            `}
          >
            Analyze Fit
          </button>
        </div>
      ) : null}

      {/* Loading/Streaming State */}
      {state === "analyzing" && (
        <div className="space-y-6" role="status" aria-live="polite">
          <div className={`p-8 rounded-xl border text-center ${
            theme === "light" ? "bg-gray-50 border-gray-200" : "bg-[#141414] border-[#262626]"
          }`}>
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-indigo-500 border-t-transparent mx-auto mb-4" aria-hidden="true" />
            <p className={`text-lg font-semibold mb-2 ${theme === "light" ? "text-gray-800" : "text-white"}`}>
              Analyzing Fit
            </p>
            <p className={`text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
              Cross-referencing job requirements against career dossier, deployed systems, and UCW cognitive data...
            </p>
            <div className="flex justify-center gap-6 mt-6">
              {["Scanning JD", "Matching skills", "Scoring fit"].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 300}ms` }}
                  />
                  <span className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {state === "complete" && assessment && (
        <div className="space-y-8">
          {/* Score Section */}
          <div
            className={`
              p-6 rounded-xl border
              ${theme === "light"
                ? "bg-white border-gray-200"
                : "bg-[#141414] border-[#262626]"
              }
            `}
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <FitScoreGauge
                score={assessment.fit_score}
                tier={assessment.fit_tier}
              />
              <div className="flex-1 text-center md:text-left">
                <h2 className={`text-2xl font-bold mb-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                  Fit Assessment
                </h2>
                <p className={`leading-relaxed ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                  {assessment.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Strengths */}
          {assessment.strengths.length > 0 && (
            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Matching Strengths
              </h3>
              <div className="grid gap-3">
                {assessment.strengths.map((strength, i) => (
                  <StrengthCard
                    key={i}
                    skill={strength.skill}
                    evidence={strength.evidence}
                    matchScore={strength.match_score}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Gaps */}
          {assessment.gaps.length > 0 && (
            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                Identified Gaps
              </h3>
              <div className="grid gap-3">
                {assessment.gaps.map((gap, i) => (
                  <GapCard
                    key={i}
                    requirement={gap.requirement}
                    reality={gap.reality}
                    severity={gap.severity}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {assessment.recommendations.length > 0 && (
            <div
              className={`
                p-6 rounded-xl border
                ${theme === "light"
                  ? "bg-indigo-50 border-indigo-200"
                  : "bg-indigo-950/30 border-indigo-500/20"
                }
              `}
            >
              <h3 className={`text-lg font-semibold mb-4 ${theme === "light" ? "text-indigo-900" : "text-indigo-300"}`}>
                Recommendations
              </h3>
              <ul className="space-y-2">
                {assessment.recommendations.map((rec, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 ${theme === "light" ? "text-indigo-800" : "text-indigo-200"}`}
                  >
                    <span className="text-indigo-500 mt-1">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={reset}
              className={`
                flex-1 py-3 px-6 rounded-lg font-semibold
                transition-all duration-200
                ${theme === "light"
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  : "bg-[#262626] hover:bg-[#333333] text-white"
                }
              `}
            >
              Analyze Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
