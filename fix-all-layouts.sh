#!/bin/bash

# Find all layout.tsx files in the kanji-list directories with [slug]
find /Users/john/CascadeProjects/jlpt-study/src/app -path "*/[slug]/*" -name "layout.tsx" | while read file; do
  echo "Fixing $file"
  
  # Create a backup
  cp "$file" "${file}.bak"
  
  # Create a simplified layout file
  cat > "$file" << 'EOF'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JLPT Kanji Detail | JLPT Professor',
  description: 'Learn Japanese kanji with detailed information, readings, and examples.',
};

export default function KanjiDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
EOF
  
  echo "Fixed $file"
done

echo "All layout files fixed!"
