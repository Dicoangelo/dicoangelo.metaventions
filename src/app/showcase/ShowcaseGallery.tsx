"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import { showcaseItems, systemColors, categories } from "./data";

interface ShowcaseGalleryProps {
  isLight: boolean;
  onSelect: (index: number) => void;
}

export default function ShowcaseGallery({ isLight, onSelect }: ShowcaseGalleryProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(value.toLowerCase());
    }, 300);
  }, []);

  const filtered = useMemo(() => {
    return showcaseItems.filter((d) => {
      const matchesCategory = activeCategory === "all" || d.category === activeCategory;
      if (!matchesCategory) return false;
      if (!debouncedSearch) return true;
      const haystack = `${d.title} ${d.subtitle} ${d.description} ${d.tags.map((t) => t.label).join(" ")}`.toLowerCase();
      return haystack.includes(debouncedSearch);
    });
  }, [activeCategory, debouncedSearch]);

  const grouped = useMemo(() => {
    const groups: Map<string, typeof filtered> = new Map();
    filtered.forEach((d) => {
      const existing = groups.get(d.system) || [];
      existing.push(d);
      groups.set(d.system, existing);
    });
    return groups;
  }, [filtered]);

  const systems = useMemo(() => {
    const seen = new Set<string>();
    showcaseItems.forEach((d) => seen.add(d.system));
    return Array.from(seen);
  }, []);

  const jumpToSection = useCallback((system: string) => {
    const el = sectionRefs.current.get(system);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  }, []);

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index));
  }, []);

  return (
    <div>
      {/* Search */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <svg
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isLight ? "text-gray-400" : "text-[#737373]"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search screenshots... (RAG, monitoring, agents, etc.)"
            className={`w-full pl-11 pr-20 py-3 rounded-xl border text-sm transition-colors ${
              isLight
                ? "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-400"
                : "bg-[#0a0a0a] border-[#262626] text-white placeholder-[#737373] focus:border-[#6366f1]"
            } outline-none`}
          />
          <span
            className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium ${
              isLight ? "text-gray-400" : "text-[#737373]"
            }`}
          >
            {filtered.length} / {showcaseItems.length}
          </span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeCategory === cat.id
                ? "bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30"
                : isLight
                ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent"
                : "text-[#737373] hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Section Quick-Jump */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {systems.map((system) => {
          const count = showcaseItems.filter((d) => d.system === system).length;
          const color = systemColors[system] || "#6366f1";
          return (
            <button
              key={system}
              onClick={() => jumpToSection(system)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                isLight ? "text-gray-500 hover:text-gray-800" : "text-[#737373] hover:text-white"
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              {system} ({count})
            </button>
          );
        })}
      </div>

      {/* Grouped Cards */}
      {Array.from(grouped.entries()).map(([system, items]) => {
        const color = systemColors[system] || "#6366f1";
        return (
          <div
            key={system}
            ref={(el) => {
              if (el) sectionRefs.current.set(system, el);
            }}
            className="mb-12"
          >
            {/* Section Divider */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <h3
                className="text-sm font-bold uppercase tracking-widest"
                style={{ color }}
              >
                {system}
              </h3>
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: `${color}33` }}
              />
              <span
                className={`text-xs font-medium ${isLight ? "text-gray-400" : "text-[#737373]"}`}
              >
                {items.length} {items.length === 1 ? "screenshot" : "screenshots"}
              </span>
            </div>

            {/* Card Grid */}
            <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
              {items.map((item, idx) => {
                const globalIndex = showcaseItems.indexOf(item);
                return (
                  <button
                    key={item.num}
                    onClick={() => onSelect(globalIndex)}
                    className={`group relative text-left rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                      isLight
                        ? "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-lg"
                        : "bg-[#0a0a0a] border-[#262626] hover:border-[#6366f1]/50"
                    }`}
                    style={{
                      animationDelay: `${idx * 60}ms`,
                      animation: "showcaseFadeSlideUp 0.5s ease-out backwards",
                    }}
                  >
                    {/* Gradient border glow on hover */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        boxShadow: `0 0 20px ${color}20, inset 0 0 20px ${color}08`,
                      }}
                    />

                    {/* Image */}
                    <div className={`relative w-full h-[200px] overflow-hidden ${isLight ? "bg-gray-100" : "bg-[#141414]"}`}>
                      {!loadedImages.has(globalIndex) && (
                        <div className={`absolute inset-0 ${isLight ? "bg-gray-100" : "bg-[#141414]"} animate-pulse`} />
                      )}
                      <Image
                        src={item.file}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`object-cover object-top transition-all duration-500 group-hover:scale-105 ${
                          loadedImages.has(globalIndex) ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => handleImageLoad(globalIndex)}
                        loading="lazy"
                        unoptimized={item.file.endsWith(".gif")}
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            color,
                            backgroundColor: `${color}15`,
                            border: `1px solid ${color}30`,
                          }}
                        >
                          {item.system}
                        </span>
                        <span className={`text-xs font-medium ${isLight ? "text-gray-400" : "text-[#737373]"}`}>
                          #{item.num}
                        </span>
                      </div>

                      <h4 className={`text-sm font-bold mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>
                        {item.title}
                      </h4>
                      <p className={`text-xs mb-3 ${isLight ? "text-gray-500" : "text-[#a3a3a3]"}`}>
                        {item.subtitle}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
                              isLight
                                ? "bg-gray-100 text-gray-600"
                                : "bg-[#1a1a1a] text-[#a3a3a3]"
                            }`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className={`text-lg font-medium mb-2 ${isLight ? "text-gray-500" : "text-[#737373]"}`}>
            No screenshots match your search
          </p>
          <button
            onClick={() => {
              setSearch("");
              setDebouncedSearch("");
              setActiveCategory("all");
            }}
            className="text-sm text-[#6366f1] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes showcaseFadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
