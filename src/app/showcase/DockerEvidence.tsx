"use client";

import { dockerEvidence } from "./data";

interface DockerEvidenceProps {
  isLight: boolean;
}

export function DockerEvidence({ isLight }: DockerEvidenceProps) {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold mb-8 text-cyan-500">
          Docker + Fly.io + Containerization
        </h3>

        <div
          className={`rounded-xl border overflow-hidden border-l-4 border-l-cyan-500 ${
            isLight ? "border-gray-200" : "border-[#262626]"
          }`}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className={isLight ? "bg-gray-50" : "bg-[#0a0a0a]"}>
                <th
                  className={`text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider ${
                    isLight ? "text-gray-500" : "text-[#737373]"
                  }`}
                >
                  Project
                </th>
                <th
                  className={`text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell ${
                    isLight ? "text-gray-500" : "text-[#737373]"
                  }`}
                >
                  Files
                </th>
                <th
                  className={`text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider ${
                    isLight ? "text-gray-500" : "text-[#737373]"
                  }`}
                >
                  What It Proves
                </th>
              </tr>
            </thead>
            <tbody>
              {dockerEvidence.map((item, i) => (
                <tr
                  key={item.project}
                  className={`border-t transition-colors ${
                    isLight
                      ? `border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-gray-50`
                      : `border-[#1a1a1a] ${i % 2 === 0 ? "bg-[#141414]" : "bg-[#111]"} hover:bg-[#1a1a1a]`
                  }`}
                >
                  <td className="px-4 py-3 font-semibold">{item.project}</td>
                  <td
                    className={`px-4 py-3 hidden sm:table-cell font-mono text-xs ${
                      isLight ? "text-gray-500" : "text-[#737373]"
                    }`}
                  >
                    {item.files}
                  </td>
                  <td
                    className={`px-4 py-3 ${
                      isLight ? "text-gray-600" : "text-[#a3a3a3]"
                    }`}
                  >
                    {item.proof}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
