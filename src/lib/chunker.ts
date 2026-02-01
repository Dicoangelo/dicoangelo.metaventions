/**
 * Semantic Markdown Chunker
 *
 * Splits markdown content into semantically meaningful chunks with metadata extraction.
 * Preserves heading context and detects chunk types for optimal RAG performance.
 */

export interface ChunkOptions {
  maxTokens?: number; // default: 350
  minTokens?: number; // default: 50
  preserveHeading?: boolean; // default: true
  extractMetadata?: boolean; // default: true
}

export interface ChunkMetadata {
  technologies: string[];
  companies: string[];
  papers: string[]; // arXiv IDs
  skills: string[];
}

export interface Chunk {
  content: string;
  heading?: string;
  chunkIndex: number;
  tokenCount: number;
  chunkType: "narrative" | "code" | "metrics" | "list";
  metadata: ChunkMetadata;
}

/**
 * Estimate token count using ~4 characters per token approximation
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Known technologies for metadata extraction
 */
const TECHNOLOGIES = [
  // Languages
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C++",
  "SQL",
  "HTML",
  "CSS",
  // Frameworks & Libraries
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "Svelte",
  "Node.js",
  "Express",
  "FastAPI",
  "Django",
  "Flask",
  // Databases & Storage
  "Supabase",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "SQLite",
  "pgvector",
  // Cloud & Infrastructure
  "AWS",
  "GCP",
  "Azure",
  "Vercel",
  "Docker",
  "Kubernetes",
  "Terraform",
  // AI & ML
  "OpenAI",
  "Anthropic",
  "Cohere",
  "Claude",
  "GPT",
  "LangChain",
  "LlamaIndex",
  "Hugging Face",
  "TensorFlow",
  "PyTorch",
  // State & Data
  "Zustand",
  "Redux",
  "GraphQL",
  "REST",
  "WebSocket",
  // Testing & Tools
  "Vitest",
  "Jest",
  "Playwright",
  "ESLint",
  "Prettier",
  "Git",
  "GitHub",
];

/**
 * Known companies for metadata extraction
 */
const COMPANIES = [
  "Metaventions",
  "Contentsquare",
  "Rocket Mortgage",
  "Google",
  "Apple",
  "Microsoft",
  "Amazon",
  "Meta",
  "Facebook",
  "DeepMind",
  "Anthropic",
  "OpenAI",
  "Cohere",
  "Vercel",
];

/**
 * Known skills for metadata extraction
 */
const SKILLS = [
  "multi-agent",
  "RAG",
  "embeddings",
  "streaming",
  "real-time",
  "semantic search",
  "vector search",
  "prompt engineering",
  "agent orchestration",
  "microservices",
  "serverless",
  "event-driven",
  "CQRS",
  "DDD",
  "TDD",
  "CI/CD",
  "DevOps",
  "full-stack",
  "backend",
  "frontend",
  "UI/UX",
  "data visualization",
  "3D graphics",
  "WebGL",
  "Three.js",
  "performance optimization",
  "caching",
  "authentication",
  "authorization",
  "security",
];

/**
 * Extract metadata from text content
 */
function extractMetadata(text: string): ChunkMetadata {
  const metadata: ChunkMetadata = {
    technologies: [],
    companies: [],
    papers: [],
    skills: [],
  };

  // Extract technologies (case-insensitive match)
  const lowerText = text.toLowerCase();
  for (const tech of TECHNOLOGIES) {
    if (lowerText.includes(tech.toLowerCase())) {
      if (!metadata.technologies.includes(tech)) {
        metadata.technologies.push(tech);
      }
    }
  }

  // Extract companies
  for (const company of COMPANIES) {
    if (text.includes(company)) {
      if (!metadata.companies.includes(company)) {
        metadata.companies.push(company);
      }
    }
  }

  // Extract arXiv paper IDs (format: 2501.12345 or arXiv:2501.12345)
  const arxivPattern = /(?:arXiv:)?(\d{4}\.\d{5})/g;
  const arxivMatches = text.matchAll(arxivPattern);
  for (const match of arxivMatches) {
    const paperId = match[1];
    if (!metadata.papers.includes(paperId)) {
      metadata.papers.push(paperId);
    }
  }

  // Extract skills (case-insensitive match)
  for (const skill of SKILLS) {
    if (lowerText.includes(skill.toLowerCase())) {
      if (!metadata.skills.includes(skill)) {
        metadata.skills.push(skill);
      }
    }
  }

  return metadata;
}

/**
 * Detect chunk type based on content patterns
 */
function detectChunkType(
  text: string
): "narrative" | "code" | "metrics" | "list" {
  // Code blocks
  if (text.includes("```")) {
    return "code";
  }

  // Metrics (numbers with $, %, units)
  const metricsPattern = /\$\d+[MKB]?|\d+%|\d+\s?(ms|KB|MB|GB|req\/s|users)/;
  if (metricsPattern.test(text)) {
    return "metrics";
  }

  // Lists (count bullet points)
  const lines = text.split("\n");
  const bulletLines = lines.filter((line) =>
    /^\s*[-*]\s+/.test(line)
  ).length;
  const totalLines = lines.filter((line) => line.trim().length > 0).length;

  if (totalLines > 0 && bulletLines / totalLines > 0.5) {
    return "list";
  }

  return "narrative";
}

/**
 * Merge small chunks with previous chunk if below minTokens
 */
function mergeSmallChunks(chunks: Chunk[], minTokens: number): Chunk[] {
  const merged: Chunk[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    if (chunk.tokenCount < minTokens && merged.length > 0) {
      // Merge with previous chunk
      const prev = merged[merged.length - 1];
      prev.content = prev.content + "\n\n" + chunk.content;
      prev.tokenCount = estimateTokens(prev.content);

      // Merge metadata
      prev.metadata.technologies = [
        ...new Set([
          ...prev.metadata.technologies,
          ...chunk.metadata.technologies,
        ]),
      ];
      prev.metadata.companies = [
        ...new Set([...prev.metadata.companies, ...chunk.metadata.companies]),
      ];
      prev.metadata.papers = [
        ...new Set([...prev.metadata.papers, ...chunk.metadata.papers]),
      ];
      prev.metadata.skills = [
        ...new Set([...prev.metadata.skills, ...chunk.metadata.skills]),
      ];

      // Re-detect chunk type after merge
      prev.chunkType = detectChunkType(prev.content);
    } else {
      merged.push(chunk);
    }
  }

  // Re-index after merging
  merged.forEach((chunk, i) => {
    chunk.chunkIndex = i;
  });

  return merged;
}

/**
 * Main chunking function - splits markdown content into semantic chunks
 */
export function chunkMarkdown(
  content: string,
  options: ChunkOptions = {}
): Chunk[] {
  const {
    maxTokens = 350,
    minTokens = 50,
    preserveHeading = true,
    extractMetadata: shouldExtractMetadata = true,
  } = options;

  // Handle empty content
  if (!content || content.trim().length === 0) {
    return [];
  }

  const chunks: Chunk[] = [];
  const lines = content.split("\n");

  let currentHeading: string | undefined;
  let currentContent: string[] = [];
  let inCodeBlock = false;

  const flushChunk = () => {
    if (currentContent.length === 0) return;

    const chunkContent = currentContent.join("\n").trim();

    // Skip empty chunks
    if (chunkContent.length === 0) return;

    // Estimate tokens
    const tokenCount = estimateTokens(chunkContent);

    // Skip chunks that are too small (will merge later)
    if (tokenCount < 10) return;

    // Build final content with optional heading
    let finalContent = chunkContent;
    if (preserveHeading && currentHeading) {
      finalContent = `# ${currentHeading}\n\n${chunkContent}`;
    }

    const chunk: Chunk = {
      content: finalContent,
      heading: currentHeading,
      chunkIndex: chunks.length,
      tokenCount: estimateTokens(finalContent),
      chunkType: detectChunkType(chunkContent),
      metadata: shouldExtractMetadata
        ? extractMetadata(chunkContent)
        : { technologies: [], companies: [], papers: [], skills: [] },
    };

    chunks.push(chunk);
    currentContent = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track code blocks
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      currentContent.push(line);
      continue;
    }

    // Don't split on headings inside code blocks
    if (!inCodeBlock) {
      // Detect headings (# ## ###)
      const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
      if (headingMatch) {
        // Flush previous chunk
        flushChunk();
        currentHeading = headingMatch[2];
        continue; // Don't include heading in content
      }

      // Check if we should split on paragraph breaks (double newline)
      const nextLine = lines[i + 1];
      if (
        line.trim().length === 0 &&
        nextLine &&
        nextLine.trim().length === 0
      ) {
        // Double newline - consider splitting if chunk is large enough
        const potentialTokens = estimateTokens(currentContent.join("\n"));
        if (potentialTokens > maxTokens) {
          flushChunk();
        }
      }
    }

    currentContent.push(line);

    // Force split if chunk exceeds maxTokens
    const currentTokens = estimateTokens(currentContent.join("\n"));
    if (currentTokens > maxTokens && !inCodeBlock) {
      flushChunk();
    }
  }

  // Flush final chunk
  flushChunk();

  // Merge small chunks
  const mergedChunks = mergeSmallChunks(chunks, minTokens);

  return mergedChunks;
}
