#!/bin/bash
# Scan for high-value source files

output_file="scripts/repo-data/key-files.md"
echo "# Key Source Files - Architecture & Services" > "$output_file"
echo "" >> "$output_file"
echo "Generated: $(date)" >> "$output_file"
echo "" >> "$output_file"

# OS-App services
echo "## OS-App Services" >> "$output_file"
echo "" >> "$output_file"

services=(
  "src/services/adaptiveConsensus.ts"
  "src/services/archon/index.ts"
  "src/services/voiceNexus/orchestrator.ts"
  "src/services/dqScoring.ts"
  "src/services/recursiveLangModel.ts"
  "src/services/metaLearningEngine.ts"
  "src/store.ts"
)

for file in "${services[@]}"; do
  echo "Fetching OS-App/$file..."
  content=$(gh api "repos/Dicoangelo/OS-App/contents/$file" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
  if [ -n "$content" ]; then
    echo "### $file" >> "$output_file"
    # Get first 150 lines (the important stuff - interfaces, exports, main logic)
    echo '```typescript' >> "$output_file"
    echo "$content" | head -150 >> "$output_file"
    echo '```' >> "$output_file"
    echo "" >> "$output_file"
  fi
done

# ResearchGravity key files
echo "## ResearchGravity Core" >> "$output_file"
rg_files=(
  "mcp_server.py"
  "research_session.py"
  "status.py"
)

for file in "${rg_files[@]}"; do
  echo "Fetching ResearchGravity/$file..."
  content=$(gh api "repos/Dicoangelo/ResearchGravity/contents/$file" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
  if [ -n "$content" ]; then
    echo "### $file" >> "$output_file"
    echo '```python' >> "$output_file"
    echo "$content" | head -100 >> "$output_file"
    echo '```' >> "$output_file"
    echo "" >> "$output_file"
  fi
done

# meta-vengine key files
echo "## META-VENGINE Systems" >> "$output_file"
mv_files=(
  "cognitive-os.py"
  "supermemory.py"
  "recovery-engine.py"
  "dq-scorer.js"
)

for file in "${mv_files[@]}"; do
  echo "Fetching meta-vengine/$file..."
  # Try different paths
  for path in "$file" "kernel/$file" "scripts/$file"; do
    content=$(gh api "repos/Dicoangelo/meta-vengine/contents/$path" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
    if [ -n "$content" ]; then
      echo "### $path" >> "$output_file"
      echo '```' >> "$output_file"
      echo "$content" | head -100 >> "$output_file"
      echo '```' >> "$output_file"
      echo "" >> "$output_file"
      break
    fi
  done
done

# cpb-core and voice-nexus (npm packages)
echo "## NPM Packages - Core Logic" >> "$output_file"

for pkg in "cpb-core" "voice-nexus"; do
  echo "Fetching $pkg/src/index.ts..."
  content=$(gh api "repos/Dicoangelo/$pkg/contents/src/index.ts" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
  if [ -n "$content" ]; then
    echo "### $pkg/src/index.ts" >> "$output_file"
    echo '```typescript' >> "$output_file"
    echo "$content" | head -150 >> "$output_file"
    echo '```' >> "$output_file"
    echo "" >> "$output_file"
  fi
done

echo "Done! Output: $output_file"
wc -l "$output_file"
