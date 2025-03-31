#!/bin/bash

# Find all layout.tsx files in the kanji-list directories
for file in $(find /Users/john/CascadeProjects/jlpt-study/src/app -name "[slug]" -type d | grep "kanji-list" | xargs -I{} find {} -name "layout.tsx"); do
  echo "Fixing $file"
  
  # Replace the async keyword in generateMetadata function
  sed -i '' 's/export async function generateMetadata/export function generateMetadata/g' "$file"
done

echo "All layout files fixed!"
