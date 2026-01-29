#!/bin/bash
# Deep scan repos for additional relevant files

repos=(
  "OS-App"
  "meta-vengine"
  "ResearchGravity"
  "agent-core"
  "CareerCoachAntigravity"
  "cpb-core"
  "voice-nexus"
  "FlowDesk"
  "chrome-history-export"
)

output_file="scripts/repo-data/deep-scan.md"
echo "# Deep Repository Scan - Technical Details" > "$output_file"
echo "" >> "$output_file"
echo "Generated: $(date)" >> "$output_file"
echo "" >> "$output_file"

for repo in "${repos[@]}"; do
  echo "Scanning $repo..."
  echo "---" >> "$output_file"
  echo "## $repo" >> "$output_file"
  echo "" >> "$output_file"
  
  # Get package.json for tech stack
  pkg=$(gh api "repos/Dicoangelo/$repo/contents/package.json" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
  if [ -n "$pkg" ]; then
    echo "### package.json (Tech Stack)" >> "$output_file"
    echo '```json' >> "$output_file"
    echo "$pkg" | jq '{name, version, description, dependencies, devDependencies, scripts}' 2>/dev/null >> "$output_file"
    echo '```' >> "$output_file"
    echo "" >> "$output_file"
  fi
  
  # Get CHANGELOG if exists
  changelog=$(gh api "repos/Dicoangelo/$repo/contents/CHANGELOG.md" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
  if [ -n "$changelog" ]; then
    echo "### CHANGELOG" >> "$output_file"
    echo "$changelog" | head -100 >> "$output_file"
    echo "" >> "$output_file"
  fi
  
  # Get any docs folder
  docs=$(gh api "repos/Dicoangelo/$repo/contents/docs" 2>/dev/null | jq -r '.[].name' 2>/dev/null)
  if [ -n "$docs" ]; then
    echo "### Documentation Files" >> "$output_file"
    echo "$docs" >> "$output_file"
    echo "" >> "$output_file"
  fi
  
  # List key directories structure
  echo "### Repository Structure" >> "$output_file"
  tree_output=$(gh api "repos/Dicoangelo/$repo/contents" 2>/dev/null | jq -r '.[] | "\(.type) \(.name)"' 2>/dev/null)
  if [ -n "$tree_output" ]; then
    echo '```' >> "$output_file"
    echo "$tree_output" >> "$output_file"
    echo '```' >> "$output_file"
  fi
  echo "" >> "$output_file"
done

echo "Done! Output: $output_file"
wc -l "$output_file"
