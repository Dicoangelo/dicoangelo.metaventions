#!/bin/bash
# Scan all services and components from key repos

output_file="scripts/repo-data/services-deep.md"
echo "# Services & Components - Deep Architecture" > "$output_file"
echo "" >> "$output_file"
echo "Generated: $(date)" >> "$output_file"
echo "" >> "$output_file"

# OS-App services directory
echo "## OS-App Services" >> "$output_file"
echo "" >> "$output_file"

# List all services
services=$(gh api "repos/Dicoangelo/OS-App/contents/src/services" 2>/dev/null | jq -r '.[] | select(.type=="file") | .name' 2>/dev/null)
echo "### Service Files" >> "$output_file"
echo '```' >> "$output_file"
echo "$services" >> "$output_file"
echo '```' >> "$output_file"
echo "" >> "$output_file"

# Get key services content (first 100 lines each)
key_services=(
  "geminiService.ts"
  "claudeService.ts"
  "elevenLabsService.ts"
  "persistenceService.ts"
  "toolRegistry.ts"
  "cinematic/storyboardEngine.ts"
  "biometrics/faceDetection.ts"
)

for svc in "${key_services[@]}"; do
  echo "Fetching OS-App/src/services/$svc..."
  content=$(gh api "repos/Dicoangelo/OS-App/contents/src/services/$svc" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
  if [ -n "$content" ]; then
    echo "### $svc" >> "$output_file"
    echo '```typescript' >> "$output_file"
    echo "$content" | head -120 >> "$output_file"
    echo '```' >> "$output_file"
    echo "" >> "$output_file"
  fi
done

# OS-App components
echo "## OS-App Components" >> "$output_file"
components=$(gh api "repos/Dicoangelo/OS-App/contents/src/components" 2>/dev/null | jq -r '.[] | select(.type=="file") | .name' 2>/dev/null)
echo "### Component Files" >> "$output_file"
echo '```' >> "$output_file"
echo "$components" >> "$output_file"
echo '```' >> "$output_file"
echo "" >> "$output_file"

# OS-App hooks
echo "## OS-App Hooks" >> "$output_file"
hooks=$(gh api "repos/Dicoangelo/OS-App/contents/src/hooks" 2>/dev/null | jq -r '.[] | select(.type=="file") | .name' 2>/dev/null)
echo '```' >> "$output_file"
echo "$hooks" >> "$output_file"
echo '```' >> "$output_file"
echo "" >> "$output_file"

# Get key hooks
key_hooks=(
  "useAgentRuntime.ts"
  "useResearchAgent.ts"
  "useVoiceMode.ts"
)

for hook in "${key_hooks[@]}"; do
  content=$(gh api "repos/Dicoangelo/OS-App/contents/src/hooks/$hook" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
  if [ -n "$content" ]; then
    echo "### $hook" >> "$output_file"
    echo '```typescript' >> "$output_file"
    echo "$content" | head -100 >> "$output_file"
    echo '```' >> "$output_file"
    echo "" >> "$output_file"
  fi
done

echo "Done! Output: $output_file"
wc -l "$output_file"
