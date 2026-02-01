# Artifact CLI Quick Reference

## Setup
```bash
export ADMIN_PASSWORD=your_password
npm run dev  # Start Next.js server
```

## Commands

### Create & Publish
```bash
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts \
  --file ./content/my-project.md \
  --category project \
  --tags "react,typescript,ai" \
  --publish
```

### Create Draft (Review Later)
```bash
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts \
  --file ./content/my-project.md \
  --category project \
  --tags "react,typescript"
# Returns artifact ID
```

### List All
```bash
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --list
```

### Get by ID
```bash
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --get <id>
```

### Publish Draft
```bash
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --publish-id <id>
```

### Delete
```bash
ADMIN_PASSWORD=secret npx tsx scripts/create-artifact.ts --delete <id>
```

## Categories
- `project` - Portfolio projects
- `skill` - Technical skills
- `experience` - Work experience
- `faq` - FAQs
- `deep-dive` - Technical articles

## Auto-Extraction

**Title**: First `# Heading` in markdown
```markdown
# My Project Title  ← Auto-extracted
```

**Slug**: Auto-generated from title
```
My Project Title → my-project-title
```

**Summary**: First paragraph (200 chars max)
```markdown
# Title

This paragraph becomes the summary.  ← Auto-extracted

## Next Section
...
```

**Metadata**: Auto-detected
- Technologies: React, TypeScript, Python, etc.
- Companies: Metaventions, Anthropic, etc.
- Papers: arXiv:2512.05470, etc.
- Skills: Mentioned technical skills

## Files

- `scripts/create-artifact.ts` - Main CLI script
- `scripts/ARTIFACT_CLI_README.md` - Full documentation
- `scripts/test-artifact-sample.md` - Example markdown
- `scripts/verify-artifact-cli.sh` - Verification script

## Tips

**Override defaults:**
```bash
--title "Custom Title" \
--slug "custom-slug" \
--summary "Custom summary text"
```

**Production URL:**
```bash
--api-url https://dicoangelo.com
```

**Help:**
```bash
npx tsx scripts/create-artifact.ts --help
```

## Workflow

1. **Write** markdown in `content/` directory
2. **Create** artifact with `--file`
3. **Review** with `--get <id>`
4. **Publish** with `--publish-id <id>`
5. **Verify** with `--list`

## API Endpoints

All require `Authorization: Bearer $ADMIN_PASSWORD`

- `POST /api/artifacts` - Create
- `GET /api/artifacts` - List
- `GET /api/artifacts/:id` - Get
- `DELETE /api/artifacts/:id` - Delete
- `POST /api/artifacts/:id/publish` - Publish
