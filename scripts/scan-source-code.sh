#!/bin/bash
# Scan actual source code files

output_file="scripts/repo-data/source-code.md"
echo "# Source Code - Key Implementations" > "$output_file"
echo "" >> "$output_file"
echo "Generated: $(date)" >> "$output_file"
echo "" >> "$output_file"

###################
# OS-App key services
###################
echo "## OS-App Services (Full Implementations)" >> "$output_file"
echo "" >> "$output_file"

# Get services directory listing first
services_list=$(gh api "repos/Dicoangelo/OS-App/contents/services" 2>/dev/null | jq -r '.[] | select(.type=="file" and (.name | endswith(".ts") or endswith(".tsx"))) | .name' 2>/dev/null)

# Fetch top 15 services
count=0
for svc in $services_list; do
  if [ $count -ge 15 ]; then break; fi
  echo "Fetching services/$svc..."
  content=$(gh api "repos/Dicoangelo/OS-App/contents/services/$svc" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
  if [ -n "$content" ]; then
    echo "### services/$svc" >> "$output_file"
    echo '```typescript' >> "$output_file"
    echo "$content" | head -150 >> "$output_file"
    echo '```' >> "$output_file"
    echo "" >> "$output_file"
    ((count++))
  fi
done

# Get subdirectories in services
subdirs=$(gh api "repos/Dicoangelo/OS-App/contents/services" 2>/dev/null | jq -r '.[] | select(.type=="dir") | .name' 2>/dev/null)
for subdir in $subdirs; do
  echo "### services/$subdir/" >> "$output_file"
  files=$(gh api "repos/Dicoangelo/OS-App/contents/services/$subdir" 2>/dev/null | jq -r '.[] | select(.type=="file") | .name' 2>/dev/null)
  echo '```' >> "$output_file"
  echo "$files" >> "$output_file"
  echo '```' >> "$output_file"
  
  # Get first file from each subdir
  first_file=$(echo "$files" | head -1)
  if [ -n "$first_file" ]; then
    content=$(gh api "repos/Dicoangelo/OS-App/contents/services/$subdir/$first_file" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
    if [ -n "$content" ]; then
      echo "#### $first_file" >> "$output_file"
      echo '```typescript' >> "$output_file"
      echo "$content" | head -100 >> "$output_file"
      echo '```' >> "$output_file"
    fi
  fi
  echo "" >> "$output_file"
done

###################
# OS-App key components
###################
echo "## OS-App Components" >> "$output_file"
echo "" >> "$output_file"

components_list=$(gh api "repos/Dicoangelo/OS-App/contents/components" 2>/dev/null | jq -r '.[] | select(.type=="file" and (.name | endswith(".tsx"))) | .name' 2>/dev/null)

# Fetch top 10 components
count=0
for comp in $components_list; do
  if [ $count -ge 10 ]; then break; fi
  echo "Fetching components/$comp..."
  content=$(gh api "repos/Dicoangelo/OS-App/contents/components/$comp" --jq '.content' 2>/dev/null | base64 -d 2>/dev/null)
  if [ -n "$content" ]; then
    echo "### components/$comp" >> "$output_file"
    echo '```typescript' >> "$output_file"
    echo "$content" | head -100 >> "$output_file"
    echo '```' >> "$output_file"
    echo "" >> "$output_file"
    ((count++))
  fi
done

echo "Done! Output: $output_file"
wc -l "$output_file"
