/**
 * Convert Kanji JSON to TypeScript
 * 
 * This script converts the JSON kanji data files to a TypeScript file
 * with the format expected by our application.
 */

const fs = require('fs');
const path = require('path');

// Paths
const dataDir = path.join(__dirname, '..', 'data');
const outputFile = path.join(dataDir, 'jlpt-kanji-complete.ts');

// Function to read JSON file
function readJsonFile(filename) {
  const filePath = path.join(dataDir, filename);
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

// Function to convert kanji data to our format
function convertKanjiData(kanjiList) {
  return kanjiList.map(item => {
    return {
      kanji: item.kanji,
      reading: item.readings_on[0] || item.readings_kun[0] || '',
      meaning: item.meanings.join(', ').toLowerCase(),
      level: `N${item.level || ''}`
    };
  });
}

// Function to generate TypeScript file
function generateTypeScriptFile() {
  // Read JSON files
  const n5Kanji = readJsonFile('n5-kanji.json');
  const n4Kanji = readJsonFile('n4-kanji.json');
  const n3Kanji = readJsonFile('n3-kanji.json');
  const n2Kanji = readJsonFile('n2-kanji.json');
  const n1Kanji = readJsonFile('n1-kanji.json');

  // Convert to our format
  const n5KanjiFormatted = n5Kanji.map(item => ({
    kanji: item.kanji,
    reading: item.readings_on[0] || item.readings_kun[0] || '',
    meaning: item.meanings.join(', ').toLowerCase(),
    level: 'N5'
  }));

  const n4KanjiFormatted = n4Kanji.map(item => ({
    kanji: item.kanji,
    reading: item.readings_on[0] || item.readings_kun[0] || '',
    meaning: item.meanings.join(', ').toLowerCase(),
    level: 'N4'
  }));

  const n3KanjiFormatted = n3Kanji.map(item => ({
    kanji: item.kanji,
    reading: item.readings_on[0] || item.readings_kun[0] || '',
    meaning: item.meanings.join(', ').toLowerCase(),
    level: 'N3'
  }));

  const n2KanjiFormatted = n2Kanji.map(item => ({
    kanji: item.kanji,
    reading: item.readings_on[0] || item.readings_kun[0] || '',
    meaning: item.meanings.join(', ').toLowerCase(),
    level: 'N2'
  }));

  const n1KanjiFormatted = n1Kanji.map(item => ({
    kanji: item.kanji,
    reading: item.readings_on[0] || item.readings_kun[0] || '',
    meaning: item.meanings.join(', ').toLowerCase(),
    level: 'N1'
  }));

  // Generate TypeScript content
  const content = `/**
 * JLPT Kanji Data (Complete)
 * This file contains kanji categorized by JLPT level
 * Updated on ${new Date().toISOString()}
 */

export interface KanjiData {
  kanji: string;
  reading: string;
  meaning: string;
  level: string;
}

// N5 Kanji (${n5KanjiFormatted.length} kanji)
export const N5_KANJI: KanjiData[] = ${JSON.stringify(n5KanjiFormatted, null, 2)};

// N4 Kanji (${n4KanjiFormatted.length} kanji)
export const N4_KANJI: KanjiData[] = ${JSON.stringify(n4KanjiFormatted, null, 2)};

// N3 Kanji (${n3KanjiFormatted.length} kanji)
export const N3_KANJI: KanjiData[] = ${JSON.stringify(n3KanjiFormatted, null, 2)};

// N2 Kanji (${n2KanjiFormatted.length} kanji)
export const N2_KANJI: KanjiData[] = ${JSON.stringify(n2KanjiFormatted, null, 2)};

// N1 Kanji (${n1KanjiFormatted.length} kanji)
export const N1_KANJI: KanjiData[] = ${JSON.stringify(n1KanjiFormatted, null, 2)};

/**
 * Helper function to get JLPT level for a kanji
 * @param kanji The kanji character to look up
 * @returns The JLPT level (N5, N4, etc.) or null if not found
 */
export function getJlptLevelForKanji(kanji: string): string | null {
  if (N5_KANJI.some(k => k.kanji === kanji)) return 'N5';
  if (N4_KANJI.some(k => k.kanji === kanji)) return 'N4';
  if (N3_KANJI.some(k => k.kanji === kanji)) return 'N3';
  if (N2_KANJI.some(k => k.kanji === kanji)) return 'N2';
  if (N1_KANJI.some(k => k.kanji === kanji)) return 'N1';
  return null;
}

// All JLPT kanji combined
export const ALL_JLPT_KANJI = [...N5_KANJI, ...N4_KANJI, ...N3_KANJI, ...N2_KANJI, ...N1_KANJI];
`;

  // Write to file
  fs.writeFileSync(outputFile, content, 'utf8');
  console.log(`TypeScript file created: ${outputFile}`);
}

// Run the script
try {
  generateTypeScriptFile();
} catch (error) {
  console.error('Error:', error);
}
