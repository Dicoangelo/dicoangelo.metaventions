#!/bin/bash
# Scan test files and configs

output_file="scripts/repo-data/tests-configs.md"
echo "# Test Suites & Configurations" > "$output_file"
echo "" >> "$output_file"
echo "Generated: $(date)" >> "$output_file"
echo "" >> "$output_file"

###################
# OS-App Tests & Configs
###################
echo "## OS-App" >> "$output_file"
echo "" >> "$output_file"

# vite.config.ts
echo "### vite.config.ts" >> "$output_file"
content=$(gh api "repos/Dicoangelo/OS-App/contents/vite.config.ts" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
if [ -n "$content" ]; then
  echo '```typescript' >> "$output_file"
  echo "$content" >> "$output_file"
  echo '```' >> "$output_file"
fi
echo "" >> "$output_file"

# vitest.config.ts
echo "### vitest.config.ts" >> "$output_file"
content=$(gh api "repos/Dicoangelo/OS-App/contents/vitest.config.ts" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
if [ -n "$content" ]; then
  echo '```typescript' >> "$output_file"
  echo "$content" >> "$output_file"
  echo '```' >> "$output_file"
fi
echo "" >> "$output_file"

# tsconfig.json
echo "### tsconfig.json" >> "$output_file"
content=$(gh api "repos/Dicoangelo/OS-App/contents/tsconfig.json" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
if [ -n "$content" ]; then
  echo '```json' >> "$output_file"
  echo "$content" >> "$output_file"
  echo '```' >> "$output_file"
fi
echo "" >> "$output_file"

###################
# cpb-core (npm package)
###################
echo "## cpb-core (npm package)" >> "$output_file"
echo "" >> "$output_file"

# Full src/index.ts
echo "### src/index.ts (Full)" >> "$output_file"
content=$(gh api "repos/Dicoangelo/cpb-core/contents/src/index.ts" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
if [ -n "$content" ]; then
  echo '```typescript' >> "$output_file"
  echo "$content" >> "$output_file"
  echo '```' >> "$output_file"
fi
echo "" >> "$output_file"

# tsup.config.ts (build config)
echo "### tsup.config.ts" >> "$output_file"
content=$(gh api "repos/Dicoangelo/cpb-core/contents/tsup.config.ts" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
if [ -n "$content" ]; then
  echo '```typescript' >> "$output_file"
  echo "$content" >> "$output_file"
  echo '```' >> "$output_file"
fi
echo "" >> "$output_file"

###################
# voice-nexus (npm package)
###################
echo "## voice-nexus (npm package)" >> "$output_file"
echo "" >> "$output_file"

# Full src/index.ts
echo "### src/index.ts (Full)" >> "$output_file"
content=$(gh api "repos/Dicoangelo/voice-nexus/contents/src/index.ts" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
if [ -n "$content" ]; then
  echo '```typescript' >> "$output_file"
  echo "$content" >> "$output_file"
  echo '```' >> "$output_file"
fi
echo "" >> "$output_file"

###################
# ResearchGravity
###################
echo "## ResearchGravity" >> "$output_file"
echo "" >> "$output_file"

# requirements.txt
echo "### requirements.txt" >> "$output_file"
content=$(gh api "repos/Dicoangelo/ResearchGravity/contents/requirements.txt" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
if [ -n "$content" ]; then
  echo '```' >> "$output_file"
  echo "$content" >> "$output_file"
  echo '```' >> "$output_file"
fi
echo "" >> "$output_file"

# pyproject.toml
echo "### pyproject.toml" >> "$output_file"
content=$(gh api "repos/Dicoangelo/ResearchGravity/contents/pyproject.toml" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
if [ -n "$content" ]; then
  echo '```toml' >> "$output_file"
  echo "$content" >> "$output_file"
  echo '```' >> "$output_file"
fi
echo "" >> "$output_file"

echo "Done! Output: $output_file"
wc -l "$output_file"
