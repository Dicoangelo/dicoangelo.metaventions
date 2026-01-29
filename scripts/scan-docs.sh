#!/bin/bash
# Scan for documentation and architecture files

output_file="scripts/repo-data/docs-scan.md"
echo "# Documentation & Architecture Files" > "$output_file"
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
  "enterprise-deck"
  "sovereign-deck"
  "metaventions-pitch-deck-2026"
)

doc_files=(
  "ARCHITECTURE.md"
  "CONTRIBUTING.md"
  "DESIGN.md"
  "API.md"
  "ROADMAP.md"
  "docs/README.md"
  "docs/architecture.md"
  "index.html"
)

for repo in "${repos[@]}"; do
  echo "Scanning $repo for docs..."
  found_any=false
  
  for doc in "${doc_files[@]}"; do
    content=$(gh api "repos/Dicoangelo/$repo/contents/$doc" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
    if [ -n "$content" ]; then
      if [ "$found_any" = false ]; then
        echo "## $repo" >> "$output_file"
        echo "" >> "$output_file"
        found_any=true
      fi
      echo "### $doc" >> "$output_file"
      # For HTML files (pitch decks), extract text content
      if [[ "$doc" == *.html ]]; then
        echo "$content" | sed 's/<[^>]*>//g' | head -200 >> "$output_file"
      else
        echo "$content" | head -200 >> "$output_file"
      fi
      echo "" >> "$output_file"
    fi
  done
done

echo "Done! Output: $output_file"
wc -l "$output_file"
