"use client";

import { liveSites } from "./data";

interface LiveSitesProps {
  isLight: boolean;
}

export function LiveSites({ isLight }: LiveSitesProps) {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold mb-8">
          Live Sites
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {liveSites.map((site) => (
            <div
              key={site.name}
              className={`rounded-xl border-l-4 border-l-green-500 p-6 transition-all hover:translate-y-[-2px] ${
                isLight
                  ? "bg-white border border-gray-200 border-l-green-500 shadow-sm hover:shadow-md"
                  : "bg-[#141414] border border-[#262626] border-l-green-500 hover:border-[#333]"
              }`}
            >
              <h4 className="text-lg font-bold mb-1">{site.name}</h4>
              <div
                className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                  isLight ? "text-gray-400" : "text-[#525252]"
                }`}
              >
                {site.tech}
              </div>
              <p
                className={`text-sm mb-3 ${
                  isLight ? "text-gray-600" : "text-[#a3a3a3]"
                }`}
              >
                {site.description}
              </p>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 font-bold text-sm hover:text-green-400 transition-colors"
              >
                {site.url.replace(/^https?:\/\//, "")} &rarr;
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
