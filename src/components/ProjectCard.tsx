"use client";

interface ProjectCardProps {
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  stats: Record<string, string | number>;
  github: string;
  demo?: string;
  isLight: boolean;
}

export function ProjectCard({
  name,
  tagline,
  description,
  tech,
  stats,
  github,
  demo,
  isLight,
}: ProjectCardProps) {
  return (
    <div className="card p-6 glow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-[#6366f1]">{tagline}</p>
        </div>
        <div className="flex gap-2">
          <a
            href={github}
            target="_blank"
            className={`px-3 py-1 text-sm border rounded transition-colors ${
              isLight
                ? "border-gray-200 hover:bg-gray-100"
                : "border-[#262626] hover:bg-[#1f1f1f]"
            }`}
          >
            GitHub
          </a>
          {demo && (
            <a
              href={demo}
              target="_blank"
              className="px-3 py-1 text-sm bg-[#6366f1] rounded hover:bg-[#5558e3] transition-colors text-white"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>

      <p className={`mb-4 ${isLight ? "text-gray-600" : "text-[#a3a3a3]"}`}>
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {tech.map((t) => (
          <span
            key={t}
            className={`px-2 py-1 rounded text-xs ${
              isLight ? "bg-gray-100 text-gray-700" : "bg-[#1f1f1f]"
            }`}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex gap-6 text-sm">
        {Object.entries(stats).map(([key, val]) => (
          <div key={key}>
            <span className={isLight ? "text-gray-500" : "text-[#737373]"}>
              {key}:{" "}
            </span>
            <span className="font-medium">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
