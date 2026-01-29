/**
 * Export ResearchGravity Data for Portfolio RAG
 *
 * Exports relevant findings, sessions, and research data from the
 * ResearchGravity SQLite database into a markdown file that can be
 * ingested into the portfolio's Supabase vector database.
 *
 * Usage: npx tsx scripts/export-researchgravity.ts
 */

import Database from "better-sqlite3";
import { writeFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const DB_PATH = join(homedir(), ".agent-core", "storage", "antigravity.db");
const OUTPUT_PATH = join(process.cwd(), "scripts", "repo-data", "research-findings.md");

interface Finding {
  id: string;
  content: string;
  type: string;
  session_id: string;
}

interface Session {
  id: string;
  topic: string;
  project: string;
  finding_count: number;
  url_count: number;
}

interface SessionOutcome {
  session_id: string;
  intent: string;
  outcome: string;
  quality: number;
  models_used: string;
}

function main() {
  console.log("📊 Exporting ResearchGravity data for portfolio...\n");

  const db = new Database(DB_PATH, { readonly: true });

  // Get project-related findings
  const findingsQuery = db.prepare(`
    SELECT id, content, type, session_id
    FROM findings
    WHERE
      content LIKE '%OS-App%' OR
      content LIKE '%Metaventions%' OR
      content LIKE '%multi-agent%' OR
      content LIKE '%agentic%' OR
      content LIKE '%CareerCoach%' OR
      content LIKE '%ResearchGravity%' OR
      content LIKE '%Voice Nexus%' OR
      content LIKE '%CPB%' OR
      content LIKE '%ACE%' OR
      content LIKE '%DQ Scoring%' OR
      content LIKE '%consensus%' OR
      content LIKE '%orchestrat%' OR
      content LIKE '%biometric%' OR
      content LIKE '%neural%' OR
      type IN ('thesis', 'innovation')
    ORDER BY type DESC
    LIMIT 150
  `);

  const findings = findingsQuery.all() as Finding[];
  console.log(`Found ${findings.length} relevant findings`);

  // Get session outcomes with high quality
  const outcomesQuery = db.prepare(`
    SELECT session_id, intent, outcome, quality, models_used
    FROM session_outcomes
    WHERE quality >= 4
    ORDER BY quality DESC
    LIMIT 30
  `);

  const outcomes = outcomesQuery.all() as SessionOutcome[];
  console.log(`Found ${outcomes.length} high-quality session outcomes`);

  // Get tool usage patterns from tool_success table
  const toolsQuery = db.prepare(`
    SELECT tool, SUM(total) as usage_count, SUM(success) as success_count
    FROM tool_success
    GROUP BY tool
    ORDER BY usage_count DESC
    LIMIT 20
  `);

  const tools = toolsQuery.all() as { tool: string; usage_count: number; success_count: number }[];
  console.log(`Found ${tools.length} tool patterns`);

  // Get project stats
  const projectStatsQuery = db.prepare(`
    SELECT
      name,
      type,
      status,
      path,
      metadata
    FROM projects
    WHERE name IS NOT NULL
    ORDER BY updated_at DESC
  `);

  let projectStats: { name: string; type: string; status: string; path: string; metadata: string }[] = [];
  try {
    projectStats = projectStatsQuery.all() as typeof projectStats;
    console.log(`Found ${projectStats.length} tracked projects`);
  } catch {
    console.log("Projects table not available");
  }

  // Build markdown output
  let markdown = `# ResearchGravity - Technical Research & Development Data

Generated: ${new Date().toISOString()}

This file contains research findings, innovations, and development patterns from Dico Angelo's ResearchGravity system - a comprehensive research tracking framework.

## About ResearchGravity

ResearchGravity is a custom-built research session tracking framework with:
- **Storage Triad**: SQLite + Qdrant vectors + Supabase sync
- **Cohere Embeddings**: embed-english-v3.0 (1024 dimensions)
- **Semantic Search**: Full-text + vector similarity + reranking
- **Auto-Capture**: Automatic session tracking and lineage

**Current Stats**:
- 114+ research sessions archived
- 2,530+ findings captured
- 8,935+ URLs catalogued and tiered

---

## Research Innovations & Findings

`;

  // Group findings by type
  const thesisFindings = findings.filter(f => f.type === "thesis");
  const innovationFindings = findings.filter(f => f.type === "innovation");
  const otherFindings = findings.filter(f => !["thesis", "innovation"].includes(f.type));

  if (thesisFindings.length > 0) {
    markdown += `### Thesis Statements\n\n`;
    for (const finding of thesisFindings.slice(0, 30)) {
      const content = finding.content.replace(/\n{3,}/g, "\n\n").trim();
      if (content.length > 50) {
        markdown += `${content}\n\n---\n\n`;
      }
    }
  }

  if (innovationFindings.length > 0) {
    markdown += `### Innovation Directions\n\n`;
    for (const finding of innovationFindings.slice(0, 30)) {
      const content = finding.content.replace(/\n{3,}/g, "\n\n").trim();
      if (content.length > 50) {
        markdown += `${content}\n\n---\n\n`;
      }
    }
  }

  markdown += `### Technical Research Findings\n\n`;
  for (const finding of otherFindings.slice(0, 50)) {
    const content = finding.content.replace(/\n{3,}/g, "\n\n").trim();
    if (content.length > 50 && content.length < 2000) {
      markdown += `${content}\n\n---\n\n`;
    }
  }

  // Add session outcomes
  if (outcomes.length > 0) {
    markdown += `## High-Quality Development Sessions\n\n`;
    markdown += `These represent successful research and development sessions rated 4+ quality:\n\n`;

    for (const outcome of outcomes) {
      if (outcome.intent && outcome.intent.length > 20) {
        markdown += `### ${outcome.intent.slice(0, 100)}${outcome.intent.length > 100 ? "..." : ""}\n`;
        markdown += `- **Outcome**: ${outcome.outcome || "Success"}\n`;
        markdown += `- **Quality**: ${outcome.quality}/5\n`;
        if (outcome.models_used) {
          markdown += `- **Models**: ${outcome.models_used}\n`;
        }
        markdown += `\n`;
      }
    }
  }

  // Add tool expertise
  if (tools.length > 0) {
    markdown += `## Development Tool Proficiency\n\n`;
    markdown += `Tool usage patterns from 100+ development sessions:\n\n`;
    markdown += `| Tool | Usage Count | Success Rate |\n`;
    markdown += `|------|-------------|-------------|\n`;

    for (const tool of tools) {
      const successRate = tool.success_count ? Math.round((tool.success_count / tool.usage_count) * 100) : 0;
      markdown += `| ${tool.tool} | ${tool.usage_count} | ${successRate}% |\n`;
    }
    markdown += `\n`;
  }

  // Add project tracking
  if (projectStats.length > 0) {
    markdown += `## Project Development Tracking\n\n`;
    for (const project of projectStats) {
      markdown += `### ${project.name}\n`;
      if (project.type) markdown += `- **Type**: ${project.type}\n`;
      if (project.status) markdown += `- **Status**: ${project.status}\n`;
      if (project.metadata) {
        try {
          const meta = JSON.parse(project.metadata);
          if (meta.stack) markdown += `- **Stack**: ${Array.isArray(meta.stack) ? meta.stack.join(", ") : meta.stack}\n`;
          if (meta.focus) markdown += `- **Focus**: ${Array.isArray(meta.focus) ? meta.focus.join(", ") : meta.focus}\n`;
        } catch { /* ignore parse errors */ }
      }
      markdown += `\n`;
    }
  }

  // Add key research topics
  markdown += `## Key Research Areas

### Multi-Agent Systems
- Adaptive Consensus Engine (ACE) - 6-agent autonomous analysis
- DQ Scoring (Deliberation Quality) - validity + specificity + correctness
- Voting vs debate consensus mechanisms
- Heterogeneous agent specialization

### Cognitive Computing
- Cognitive Precision Bridge (CPB) - precision-aware AI routing
- Recursive Language Modeling (RLM) - infinite context windows
- Energy-aware task routing (Cognitive OS)
- Flow state detection and optimization

### Voice & Multimodal AI
- Voice Nexus - universal multi-provider voice architecture
- Real-time STT/TTS with Deepgram
- Complexity-based provider selection
- Turn-based and continuous modes

### Systems Architecture
- Session optimization and window management
- Error pattern recognition and self-healing
- Context pack selection with semantic embeddings
- Research lineage tracking and provenance

`;

  db.close();

  // Write output
  writeFileSync(OUTPUT_PATH, markdown);
  console.log(`\n✅ Exported to ${OUTPUT_PATH}`);
  console.log(`   ${markdown.length.toLocaleString()} characters`);
}

main();
