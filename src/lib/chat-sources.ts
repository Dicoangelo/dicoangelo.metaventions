export interface ChatSource {
  slug: string;
  title: string;
  url: string;
  reviewedAt: string;
  reviewAfter: string;
}

/** Treat response metadata and restored browser storage as untrusted input. */
export function parseChatSources(value: unknown): ChatSource[] {
  try {
    const parsed: unknown = typeof value === "string" ? JSON.parse(decodeURIComponent(value)) : value;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((source): source is ChatSource => {
      if (!source || typeof source !== "object") return false;
      const record = source as Record<string, unknown>;
      if (!["slug", "title", "url", "reviewedAt", "reviewAfter"].every((key) => typeof record[key] === "string")) return false;
      try {
        const url = new URL(record.url as string);
        return url.protocol === "https:" && !url.username && !url.password;
      } catch {
        return false;
      }
    }).slice(0, 8);
  } catch {
    return [];
  }
}
