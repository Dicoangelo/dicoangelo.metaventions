#!/bin/bash
# Scan GitHub stats - commits, contributors, languages

output_file="scripts/repo-data/github-stats.md"
echo "# GitHub Activity & Statistics" > "$output_file"
echo "" >> "$output_file"
echo "Generated: $(date)" >> "$output_file"
echo "" >> "$output_file"

repos=(
  "OS-App"
  "meta-vengine"
  "ResearchGravity"
  "agent-core"
  "CareerCoachAntigravity"
  "cpb-core"
  "voice-nexus"
  "dicoangelo.com"
  "FlowDesk"
  "chrome-history-export"
)

for repo in "${repos[@]}"; do
  echo "Fetching stats for $repo..."
  echo "## $repo" >> "$output_file"
  echo "" >> "$output_file"
  
  # Get repo info
  info=$(gh api "repos/Dicoangelo/$repo" 2>/dev/null)
  if [ -n "$info" ]; then
    stars=$(echo "$info" | jq -r '.stargazers_count')
    forks=$(echo "$info" | jq -r '.forks_count')
    size=$(echo "$info" | jq -r '.size')
    created=$(echo "$info" | jq -r '.created_at')
    updated=$(echo "$info" | jq -r '.updated_at')
    lang=$(echo "$info" | jq -r '.language')
    
    echo "| Metric | Value |" >> "$output_file"
    echo "|--------|-------|" >> "$output_file"
    echo "| Language | $lang |" >> "$output_file"
    echo "| Stars | $stars |" >> "$output_file"
    echo "| Forks | $forks |" >> "$output_file"
    echo "| Size | ${size}KB |" >> "$output_file"
    echo "| Created | $created |" >> "$output_file"
    echo "| Last Updated | $updated |" >> "$output_file"
    echo "" >> "$output_file"
  fi
  
  # Get languages breakdown
  langs=$(gh api "repos/Dicoangelo/$repo/languages" 2>/dev/null)
  if [ -n "$langs" ] && [ "$langs" != "{}" ]; then
    echo "### Languages" >> "$output_file"
    echo '```' >> "$output_file"
    echo "$langs" | jq -r 'to_entries | .[] | "\(.key): \(.value) bytes"' 2>/dev/null >> "$output_file"
    echo '```' >> "$output_file"
    echo "" >> "$output_file"
  fi
  
  # Get recent commits (last 10)
  commits=$(gh api "repos/Dicoangelo/$repo/commits?per_page=10" 2>/dev/null | jq -r '.[] | "- \(.commit.message | split("\n")[0]) (\(.commit.author.date | split("T")[0]))"' 2>/dev/null)
  if [ -n "$commits" ]; then
    echo "### Recent Commits" >> "$output_file"
    echo "$commits" >> "$output_file"
    echo "" >> "$output_file"
  fi
  
  # Get commit count
  commit_count=$(gh api "repos/Dicoangelo/$repo/commits?per_page=1" -i 2>/dev/null | grep -i "link:" | sed -n 's/.*page=\([0-9]*\)>; rel="last".*/\1/p')
  if [ -n "$commit_count" ]; then
    echo "**Total Commits:** ~$commit_count" >> "$output_file"
    echo "" >> "$output_file"
  fi
  
  echo "---" >> "$output_file"
  echo "" >> "$output_file"
done

echo "Done! Output: $output_file"
wc -l "$output_file"
