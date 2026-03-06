"use client";

import { githubRepos } from "./data";

interface GitHubReposProps {
  isLight: boolean;
}

const matchColors: Record<string, { bg: string; text: string; bgLight: string; textLight: string }> = {
  strong: { bg: "bg-indigo-500/20", text: "text-indigo-400", bgLight: "bg-indigo-100", textLight: "text-indigo-700" },
  partial: { bg: "bg-amber-500/20", text: "text-amber-400", bgLight: "bg-amber-100", textLight: "text-amber-700" },
};

export function GitHubRepos({ isLight }: GitHubReposProps) {
  const publicRepos = githubRepos.filter((r) => r.visibility === "public");
  const privateRepos = githubRepos.filter((r) => r.visibility === "private");

  const renderTable = (repos: typeof githubRepos, startIndex: number) => (
    <div className={`rounded-xl border overflow-hidden ${
      isLight ? "border-gray-200" : "border-[#262626]"
    }`}>
      <table className="w-full text-sm">
        <thead>
          <tr className={isLight ? "bg-gray-50" : "bg-[#0a0a0a]"}>
            <th className={`text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider ${
              isLight ? "text-gray-500" : "text-[#737373]"
            }`}>
              Repo
            </th>
            <th className={`text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider hidden md:table-cell ${
              isLight ? "text-gray-500" : "text-[#737373]"
            }`}>
              Description
            </th>
            <th className={`text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider ${
              isLight ? "text-gray-500" : "text-[#737373]"
            }`}>
              Category
            </th>
          </tr>
        </thead>
        <tbody>
          {repos.map((repo, i) => {
            const colors = matchColors[repo.matchLevel] || matchColors.partial;
            const idx = startIndex + i;
            return (
              <tr
                key={repo.name}
                className={`border-t transition-colors ${
                  isLight
                    ? `border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"} hover:bg-gray-50`
                    : `border-[#1a1a1a] ${idx % 2 === 0 ? "bg-[#141414]" : "bg-[#111]"} hover:bg-[#1a1a1a]`
                }`}
              >
                <td className="px-4 py-3">
                  {repo.visibility === "public" ? (
                    <a
                      href={`https://github.com/Dicoangelo/${repo.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-500 hover:text-cyan-400 font-medium transition-colors"
                    >
                      {repo.name}
                    </a>
                  ) : (
                    <span className={`font-medium ${isLight ? "text-gray-800" : "text-white"}`}>
                      {repo.name}
                    </span>
                  )}
                </td>
                <td className={`px-4 py-3 hidden md:table-cell ${
                  isLight ? "text-gray-600" : "text-[#a3a3a3]"
                }`}>
                  {repo.description}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      isLight
                        ? `${colors.bgLight} ${colors.textLight}`
                        : `${colors.bg} ${colors.text}`
                    }`}
                  >
                    {repo.match}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl md:text-3xl font-bold">
            GitHub Repos
            <span className={`ml-3 text-sm font-normal ${isLight ? "text-gray-400" : "text-[#525252]"}`}>
              {githubRepos.length} repos &middot; {publicRepos.length} public &middot; {privateRepos.length} private
            </span>
          </h3>
          <a
            href="https://github.com/Dicoangelo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#4f8fff] font-bold text-sm hover:underline"
          >
            github.com/Dicoangelo &rarr;
          </a>
        </div>

        {/* Public Repos */}
        <div className="mb-4">
          <div className={`text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${
            isLight ? "text-green-600" : "text-green-400"
          }`}>
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Public ({publicRepos.length})
          </div>
          {renderTable(publicRepos, 0)}
        </div>

        {/* Private Repos */}
        <div className="mt-8">
          <div className={`text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${
            isLight ? "text-amber-600" : "text-amber-400"
          }`}>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Private ({privateRepos.length})
          </div>
          {renderTable(privateRepos, publicRepos.length)}
        </div>
      </div>
    </section>
  );
}
