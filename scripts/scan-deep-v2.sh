#!/bin/bash
# Deep scan v2 - correct paths

output_file="scripts/repo-data/architecture-deep.md"
echo "# Architecture Deep Dive" > "$output_file"
echo "" >> "$output_file"
echo "Generated: $(date)" >> "$output_file"
echo "" >> "$output_file"

###################
# OS-App
###################
echo "## OS-App Architecture" >> "$output_file"
echo "" >> "$output_file"

# Main App.tsx (first 200 lines - the heart of the app)
echo "### App.tsx (Main Application)" >> "$output_file"
content=$(gh api "repos/Dicoangelo/OS-App/contents/App.tsx" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
if [ -n "$content" ]; then
  echo '```typescript' >> "$output_file"
  echo "$content" | head -200 >> "$output_file"
  echo '```' >> "$output_file"
fi
echo "" >> "$output_file"

# Store.ts
echo "### store.ts (State Management)" >> "$output_file"
content=$(gh api "repos/Dicoangelo/OS-App/contents/store.ts" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
if [ -n "$content" ]; then
  echo '```typescript' >> "$output_file"
  echo "$content" | head -150 >> "$output_file"
  echo '```' >> "$output_file"
fi
echo "" >> "$output_file"

# Types.ts
echo "### types.ts (Type Definitions)" >> "$output_file"
content=$(gh api "repos/Dicoangelo/OS-App/contents/types.ts" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
if [ -n "$content" ]; then
  echo '```typescript' >> "$output_file"
  echo "$content" | head -200 >> "$output_file"
  echo '```' >> "$output_file"
fi
echo "" >> "$output_file"

# CLAUDE.md (project docs)
echo "### CLAUDE.md (Project Documentation)" >> "$output_file"
content=$(gh api "repos/Dicoangelo/OS-App/contents/CLAUDE.md" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
if [ -n "$content" ]; then
  echo "$content" | head -300 >> "$output_file"
fi
echo "" >> "$output_file"

# List services
echo "### Services Directory" >> "$output_file"
echo '```' >> "$output_file"
gh api "repos/Dicoangelo/OS-App/contents/services" 2>/dev/null | jq -r '.[] | "\(.type) \(.name)"' 2>/dev/null >> "$output_file"
echo '```' >> "$output_file"
echo "" >> "$output_file"

# List components
echo "### Components Directory" >> "$output_file"
echo '```' >> "$output_file"
gh api "repos/Dicoangelo/OS-App/contents/components" 2>/dev/null | jq -r '.[] | "\(.type) \(.name)"' 2>/dev/null >> "$output_file"
echo '```' >> "$output_file"
echo "" >> "$output_file"

# List hooks
echo "### Hooks Directory" >> "$output_file"
echo '```' >> "$output_file"
gh api "repos/Dicoangelo/OS-App/contents/hooks" 2>/dev/null | jq -r '.[] | "\(.type) \(.name)"' 2>/dev/null >> "$output_file"
echo '```' >> "$output_file"
echo "" >> "$output_file"

###################
# meta-vengine
###################
echo "## META-VENGINE Architecture" >> "$output_file"
echo "" >> "$output_file"

# List root
echo "### Root Structure" >> "$output_file"
echo '```' >> "$output_file"
gh api "repos/Dicoangelo/meta-vengine/contents" 2>/dev/null | jq -r '.[] | "\(.type) \(.name)"' 2>/dev/null >> "$output_file"
echo '```' >> "$output_file"
echo "" >> "$output_file"

# Key python files
for pyfile in "cognitive-os.py" "supermemory.py" "observatory.py" "recovery-engine.py" "dq-scorer.py" "multi-agent-coordinator.py"; do
  content=$(gh api "repos/Dicoangelo/meta-vengine/contents/$pyfile" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
  if [ -n "$content" ]; then
    echo "### $pyfile" >> "$output_file"
    echo '```python' >> "$output_file"
    echo "$content" | head -150 >> "$output_file"
    echo '```' >> "$output_file"
    echo "" >> "$output_file"
  fi
done

###################
# agent-core
###################
echo "## agent-core Architecture" >> "$output_file"
echo "" >> "$output_file"

echo "### Root Structure" >> "$output_file"
echo '```' >> "$output_file"
gh api "repos/Dicoangelo/agent-core/contents" 2>/dev/null | jq -r '.[] | "\(.type) \(.name)"' 2>/dev/null >> "$output_file"
echo '```' >> "$output_file"
echo "" >> "$output_file"

# Key files
for file in "innovation_scout.py" "context_packs.py" "session_manager.py"; do
  content=$(gh api "repos/Dicoangelo/agent-core/contents/$file" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
  if [ -n "$content" ]; then
    echo "### $file" >> "$output_file"
    echo '```python' >> "$output_file"
    echo "$content" | head -150 >> "$output_file"
    echo '```' >> "$output_file"
    echo "" >> "$output_file"
  fi
done

###################
# CareerCoachAntigravity
###################
echo "## CareerCoachAntigravity Architecture" >> "$output_file"
echo "" >> "$output_file"

# App structure
echo "### App Directory" >> "$output_file"
echo '```' >> "$output_file"
gh api "repos/Dicoangelo/CareerCoachAntigravity/contents/app" 2>/dev/null | jq -r '.[] | "\(.type) \(.name)"' 2>/dev/null >> "$output_file"
echo '```' >> "$output_file"
echo "" >> "$output_file"

# Lib structure  
echo "### Lib Directory" >> "$output_file"
echo '```' >> "$output_file"
gh api "repos/Dicoangelo/CareerCoachAntigravity/contents/lib" 2>/dev/null | jq -r '.[] | "\(.type) \(.name)"' 2>/dev/null >> "$output_file"
echo '```' >> "$output_file"
echo "" >> "$output_file"

echo "Done! Output: $output_file"
wc -l "$output_file"
