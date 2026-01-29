#!/bin/bash
# Fetch README content from all repos

repos=(
  "OS-App"
  "meta-vengine"
  "ResearchGravity"
  "agent-core"
  "CareerCoachAntigravity"
  "career-coach-mvp"
  "dicoangelo.com"
  "cpb-core"
  "voice-nexus"
  "FlowDesk"
  "chrome-history-export"
  "Dicoangelo"
  "The-Decosystem"
  "Metaventions-AI-Landing"
  "enterprise-deck"
  "sovereign-deck"
)

output_file="scripts/repo-data/all-repos.md"
echo "# GitHub Repositories - Full Content" > "$output_file"
echo "" >> "$output_file"
echo "Generated: $(date)" >> "$output_file"
echo "" >> "$output_file"

for repo in "${repos[@]}"; do
  echo "Fetching $repo..."
  echo "---" >> "$output_file"
  echo "" >> "$output_file"
  echo "## $repo" >> "$output_file"
  echo "" >> "$output_file"
  
  # Get repo info
  info=$(gh repo view "Dicoangelo/$repo" --json description,primaryLanguage,url 2>/dev/null)
  if [ -n "$info" ]; then
    desc=$(echo "$info" | jq -r '.description // "No description"')
    lang=$(echo "$info" | jq -r '.primaryLanguage.name // "N/A"')
    url=$(echo "$info" | jq -r '.url')
    echo "**URL:** $url" >> "$output_file"
    echo "**Language:** $lang" >> "$output_file"
    echo "**Description:** $desc" >> "$output_file"
    echo "" >> "$output_file"
  fi
  
  # Get README
  readme=$(gh api "repos/Dicoangelo/$repo/readme" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
  if [ -n "$readme" ]; then
    echo "### README Content" >> "$output_file"
    echo "" >> "$output_file"
    echo "$readme" >> "$output_file"
  else
    echo "*No README available*" >> "$output_file"
  fi
  echo "" >> "$output_file"
done

echo "Done! Output: $output_file"
wc -l "$output_file"
