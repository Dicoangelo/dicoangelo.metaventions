# Artifact Management CLI

A command-line tool for creating and managing portfolio artifacts from markdown files.

## Overview

This CLI script (`create-artifact.ts`) provides a simple interface for:
- Creating artifacts from markdown files
- Auto-extracting titles, summaries, and metadata
- Publishing artifacts to make them searchable
- Managing existing artifacts (list, get, delete)

Artifacts are automatically:
- Chunked into semantically meaningful pieces
- Embedded using Cohere's embed-english-v3.0 model
- Indexed for fast semantic search via pgvector

## Setup

1. **Set Admin Password**: Export your admin password as an environment variable:
   ```bash
   export ADMIN_PASSWORD=your_admin_password
   ```

2. **Ensure API Server is Running**: The script requires the Next.js API server to be running:
   ```bash
   npm run dev  # Development server at localhost:3000
   ```

## Commands

### Create Artifact

Create an artifact from a markdown file:

```bash
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts \
  --file ./content/my-project.md \
  --category project \
  --tags "react,typescript,ai" \
  --summary "Optional custom summary" \
  --publish
```

**Options:**
- `--file <path>` - Path to markdown file (required)
- `--category <cat>` - One of: `project`, `skill`, `experience`, `faq`, `deep-dive` (required)
- `--title <title>` - Override auto-extracted title (optional)
- `--slug <slug>` - Custom URL slug (optional, auto-generated from title)
- `--tags <tags>` - Comma-separated tags (optional)
- `--summary <text>` - Custom summary (optional, auto-extracted from first paragraph)
- `--publish` - Publish immediately after creation (optional)

**Auto-Extraction:**
- **Title**: Extracted from first `# Heading` in markdown
- **Slug**: Auto-generated from title (lowercase, hyphenated, no special chars)
- **Summary**: First paragraph or first 200 characters

### List Artifacts

List all artifacts with their metadata:

```bash
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --list
```

**Output:**
```
Found 3 artifact(s):

✅ ACE: Adaptive Consensus Engine
   ID: abc123-def4-5678-90ab-cdef12345678
   Slug: ace-adaptive-consensus-engine
   Category: project
   Status: published
   Tags: multi-agent, consensus, typescript
   Created: 2/1/2026

📝 My Draft Project
   ID: def456-abc1-2345-6789-0abcdef12345
   Slug: my-draft-project
   Category: project
   Status: draft
   Tags: react, nextjs
   Created: 2/1/2026
```

### Get Artifact

View detailed information for a specific artifact:

```bash
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --get abc123-def4-5678-90ab-cdef12345678
```

**Output:**
- Full metadata (ID, slug, category, status, tags)
- Timestamps (created, updated, published)
- Summary
- Content preview (first 500 characters)

### Publish Artifact

Publish an existing draft artifact by ID:

```bash
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --publish-id abc123-def4-5678-90ab-cdef12345678
```

Publishing triggers:
1. Status change: `draft` → `published`
2. Semantic chunking of content
3. Embedding generation via Cohere
4. Vector index update for search

### Delete Artifact

Delete an artifact and all its chunks:

```bash
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --delete abc123-def4-5678-90ab-cdef12345678
```

**Note:** This action is irreversible. Cascading delete removes all associated chunks.

## Markdown Format

Artifacts expect standard markdown with the following structure:

```markdown
# My Awesome Project

This is the summary paragraph that gets auto-extracted if you don't provide --summary.

## Overview

Detailed content goes here...

## Features

- Feature 1
- Feature 2

## Tech Stack

Technologies mentioned here (React, TypeScript, etc.) are auto-extracted for metadata.

Companies like Metaventions or arXiv papers (arXiv:2512.05470) are also extracted.
```

**Auto-Extracted Metadata:**
- **Technologies**: React, TypeScript, Python, etc. (from predefined list)
- **Companies**: Metaventions, Anthropic, OpenAI, etc.
- **Papers**: arXiv IDs (e.g., arXiv:2512.05470)
- **Skills**: Technical skills mentioned in content

## Categories

Choose the appropriate category for your artifact:

- **`project`**: Portfolio projects, applications, systems
- **`skill`**: Technical skills, tools, frameworks
- **`experience`**: Work experience, case studies
- **`faq`**: Frequently asked questions
- **`deep-dive`**: In-depth technical articles, research notes

## Production Usage

For production deployments, set the API URL:

```bash
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts \
  --file ./content/my-project.md \
  --category project \
  --api-url https://dicoangelo.com \
  --publish
```

## API Endpoints

The script interacts with these API routes:

- `POST /api/artifacts` - Create artifact
- `GET /api/artifacts` - List all artifacts
- `GET /api/artifacts/:id` - Get artifact by ID
- `DELETE /api/artifacts/:id` - Delete artifact
- `POST /api/artifacts/:id/publish` - Publish artifact

All endpoints require `Authorization: Bearer <ADMIN_PASSWORD>` header.

## Examples

### Example 1: Create and Publish

```bash
# Create content/ace.md
cat > content/ace.md << 'EOF'
# ACE: Adaptive Consensus Engine

A multi-agent consensus system for autonomous decision-making.

## Overview

ACE uses 6 specialized agents to analyze sessions and reach consensus on quality scores...
EOF

# Create and publish
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts \
  --file content/ace.md \
  --category project \
  --tags "multi-agent,consensus,typescript,ai" \
  --publish
```

### Example 2: Create Draft, Review, Then Publish

```bash
# Create as draft
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts \
  --file content/my-project.md \
  --category project \
  --tags "react,typescript"

# Output includes artifact ID: abc123...

# Review the artifact
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --get abc123...

# Publish when ready
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --publish-id abc123...
```

### Example 3: Bulk Management

```bash
# List all artifacts
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --list > artifacts.txt

# Review the list
cat artifacts.txt

# Delete old drafts
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --delete old-draft-id-1
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --delete old-draft-id-2
```

## Troubleshooting

### "ADMIN_PASSWORD environment variable not set"
Export the password before running:
```bash
export ADMIN_PASSWORD=your_password
npx tsx scripts/create-artifact.ts --list
```

### "Could not extract title from markdown"
Your markdown file doesn't have a `# Heading`. Either add one or provide `--title`:
```bash
npx tsx scripts/create-artifact.ts --file content/file.md --title "My Title" --category project
```

### "Failed to create artifact: 401"
Authentication failed. Check your `ADMIN_PASSWORD` matches the server's `ADMIN_PASSWORD` in `.env.local`.

### "Failed to create artifact: 500"
Server error. Check:
1. Next.js dev server is running (`npm run dev`)
2. Database migrations are applied
3. Environment variables are set (Supabase, Cohere API keys)

## Integration with RAG Pipeline

Published artifacts are automatically integrated into the RAG pipeline:

1. **Chunking**: Content is split into semantic chunks (narrative, code, metrics, list)
2. **Embedding**: Each chunk gets a 1024-dim vector embedding via Cohere
3. **Indexing**: Chunks are stored in `artifact_chunks` table with pgvector IVFFlat index
4. **Search**: The `match_artifact_chunks()` function enables semantic search with category/tag filtering
5. **Retrieval**: Chat API can retrieve relevant artifact chunks based on user queries

This enables the portfolio chat to answer questions about your projects, skills, and experience using semantically relevant context.
