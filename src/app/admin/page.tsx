"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";

interface Analysis {
  id: string;
  jd_title: string | null;
  company_name: string | null;
  fit_score: number | null;
  fit_tier: "strong" | "moderate" | "weak" | "poor" | null;
  created_at: string;
  is_starred: boolean;
  assessment: {
    summary?: string;
    strengths?: Array<{ skill: string }>;
    gaps?: Array<{ requirement: string }>;
  };
}

interface Analytics {
  skillGaps: Array<{
    skill_name: string;
    gap_count: number;
    last_seen: string;
  }>;
  summary: {
    totalAnalyses: number;
    avgScore: number;
    tierCounts: {
      strong: number;
      moderate: number;
      weak: number;
      poor: number;
    };
  };
}

const tierColors = {
  strong: "bg-green-500/10 text-green-500 border-green-500/30",
  moderate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  weak: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  poor: "bg-red-500/10 text-red-500 border-red-500/30",
};

export default function AdminPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analysesRes, analyticsRes] = await Promise.all([
        fetch(`/api/admin/analyses?${filter !== "all" ? `tier=${filter}` : ""}`),
        fetch("/api/admin/analytics"),
      ]);

      if (analysesRes.ok) {
        const data = await analysesRes.json();
        setAnalyses(data.analyses);
      }

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStar = async (id: string, currentValue: boolean) => {
    try {
      const res = await fetch(`/api/admin/analyses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_starred: !currentValue }),
      });

      if (res.ok) {
        setAnalyses((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, is_starred: !currentValue } : a
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle star:", error);
    }
  };

  const deleteAnalysis = async (id: string) => {
    if (!confirm("Delete this analysis?")) return;

    try {
      const res = await fetch(`/api/admin/analyses/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAnalyses((prev) => prev.filter((a) => a.id !== id));
        setSelectedAnalysis(null);
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Analyses"
            value={analytics.summary.totalAnalyses}
            theme={theme}
          />
          <StatCard
            label="Avg Score"
            value={analytics.summary.avgScore}
            suffix="/100"
            theme={theme}
          />
          <StatCard
            label="Strong Fits"
            value={analytics.summary.tierCounts.strong}
            color="green"
            theme={theme}
          />
          <StatCard
            label="Poor Fits"
            value={analytics.summary.tierCounts.poor}
            color="red"
            theme={theme}
          />
        </div>
      )}

      {/* Top Skill Gaps */}
      {analytics && analytics.skillGaps.length > 0 && (
        <div
          className={`
            p-6 rounded-xl border
            ${theme === "light"
              ? "bg-white border-gray-200"
              : "bg-[#141414] border-[#262626]"
            }
          `}
        >
          <h2 className={`text-lg font-semibold mb-4 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
            Top Skill Gaps (Recurring)
          </h2>
          <div className="flex flex-wrap gap-2">
            {analytics.skillGaps.slice(0, 10).map((gap) => (
              <span
                key={gap.skill_name}
                className={`
                  px-3 py-1 rounded-full text-sm
                  ${theme === "light"
                    ? "bg-red-100 text-red-700"
                    : "bg-red-500/10 text-red-400"
                  }
                `}
              >
                {gap.skill_name} ({gap.gap_count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "strong", "moderate", "weak", "poor"].map((tier) => (
          <button
            key={tier}
            onClick={() => setFilter(tier)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              transition-colors duration-200 whitespace-nowrap
              ${filter === tier
                ? "bg-indigo-600 text-white"
                : theme === "light"
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-[#262626] text-gray-300 hover:bg-[#333333]"
              }
            `}
          >
            {tier === "all" ? "All" : tier.charAt(0).toUpperCase() + tier.slice(1)}
          </button>
        ))}
      </div>

      {/* Analysis List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
          </div>
        ) : analyses.length === 0 ? (
          <div className={`text-center py-8 ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>
            No analyses found
          </div>
        ) : (
          analyses.map((analysis) => (
            <div
              key={analysis.id}
              className={`
                p-4 rounded-xl border cursor-pointer
                transition-all duration-200
                ${theme === "light"
                  ? "bg-white border-gray-200 hover:border-gray-300"
                  : "bg-[#141414] border-[#262626] hover:border-[#333333]"
                }
                ${selectedAnalysis?.id === analysis.id ? "ring-2 ring-indigo-500" : ""}
              `}
              onClick={() => setSelectedAnalysis(
                selectedAnalysis?.id === analysis.id ? null : analysis
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(analysis.id, analysis.is_starred);
                      }}
                      className="text-lg"
                    >
                      {analysis.is_starred ? "⭐" : "☆"}
                    </button>
                    <h3 className={`font-semibold truncate ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                      {analysis.jd_title || "Untitled"}
                    </h3>
                  </div>
                  <p className={`text-sm ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>
                    {analysis.company_name || "Unknown Company"} • {formatDate(analysis.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {analysis.fit_tier && (
                    <span
                      className={`
                        px-3 py-1 rounded-full text-sm font-medium border
                        ${tierColors[analysis.fit_tier]}
                      `}
                    >
                      {analysis.fit_score ?? "-"}
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {selectedAnalysis?.id === analysis.id && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  {analysis.assessment?.summary && (
                    <p className={`text-sm mb-4 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                      {analysis.assessment.summary}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {analysis.assessment?.strengths?.slice(0, 3).map((s, i) => (
                      <span
                        key={i}
                        className={`
                          px-2 py-1 rounded text-xs
                          ${theme === "light"
                            ? "bg-green-100 text-green-700"
                            : "bg-green-500/10 text-green-400"
                          }
                        `}
                      >
                        ✓ {s.skill}
                      </span>
                    ))}
                    {analysis.assessment?.gaps?.slice(0, 3).map((g, i) => (
                      <span
                        key={i}
                        className={`
                          px-2 py-1 rounded text-xs
                          ${theme === "light"
                            ? "bg-red-100 text-red-700"
                            : "bg-red-500/10 text-red-400"
                          }
                        `}
                      >
                        ✗ {g.requirement}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAnalysis(analysis.id);
                    }}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  color,
  theme,
}: {
  label: string;
  value: number;
  suffix?: string;
  color?: "green" | "red";
  theme: string;
}) {
  const colorClass = color === "green"
    ? "text-green-500"
    : color === "red"
      ? "text-red-500"
      : theme === "light"
        ? "text-gray-900"
        : "text-white";

  return (
    <div
      className={`
        p-4 rounded-xl border
        ${theme === "light"
          ? "bg-white border-gray-200"
          : "bg-[#141414] border-[#262626]"
        }
      `}
    >
      <p className={`text-sm ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>
        {label}
      </p>
      <p className={`text-2xl font-bold ${colorClass}`}>
        {value}
        {suffix && <span className="text-base font-normal text-gray-500">{suffix}</span>}
      </p>
    </div>
  );
}
