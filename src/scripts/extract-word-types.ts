import * as fs from 'fs';
import * as path from 'path';

// Import vocabulary data
const vocabPath = path.resolve(__dirname, '../data/n5-vocabulary-combined.ts');
const vocabData = require(vocabPath).default;

interface VocabWord {
  id: string;
  romaji: string;
  kana: string;
  kanji: string;
  type: string;
  meaning: string;
  examples: Array<{
    japanese: string;
    romaji: string;
    english: string;
  }>;
}

// Helper function to extract words by type
function extractWordsByType(words: VocabWord[], targetType: string): VocabWord[] {
  return words.filter(word => {
    const type = word.type.toLowerCase();
    if (targetType === 'noun') {
      return type.includes('noun');
    }
    if (targetType === 'verb') {
      return type.includes('verb');
    }
    if (targetType === 'adjective') {
      return type.includes('adjective');
    }
    return false;
  });
}

// Helper function to format words with examples
function formatWords(words: VocabWord[], startId: string): VocabWord[] {
  return words.map((word, index) => ({
    id: `${startId}${index + 1}`,
    kana: word.kana,
    kanji: word.kanji,
    type: word.type,
    meaning: word.meaning,
    romaji: word.romaji,
    examples: word.examples || []
  }));
}

// Main function to extract and save words
async function extractAndSaveWords() {
  const nouns = extractWordsByType(vocabData.n5VocabularyCombined, 'noun');
  const verbs = extractWordsByType(vocabData.n5VocabularyCombined, 'verb');
  const adjectives = extractWordsByType(vocabData.n5VocabularyCombined, 'adjective');

  // Format words with proper IDs
  const formattedNouns = formatWords(nouns, 'n');
  const formattedVerbs = formatWords(verbs, 'v');
  const formattedAdjectives = formatWords(adjectives, 'adj');

  // Create TypeScript content
  const createFileContent = (name: string, words: VocabWord[]): string => `\
export interface VocabWord {
  id: string;
  romaji: string;
  kana: string;
  kanji: string;
  type: string;
  meaning: string;
  examples: Array<{
    japanese: string;
    romaji: string;
    english: string;
  }>;
}

export const ${name}: VocabWord[] = ${JSON.stringify(words, null, 2)};

export default ${name};
`;

  // Write files
  fs.writeFileSync(
    path.resolve(__dirname, '../data/n5-nouns.ts'),
    createFileContent('n5Nouns', formattedNouns)
  );

  fs.writeFileSync(
    path.resolve(__dirname, '../data/n5-verbs.ts'),
    createFileContent('n5Verbs', formattedVerbs)
  );

  fs.writeFileSync(
    path.resolve(__dirname, '../data/n5-adjectives.ts'),
    createFileContent('n5Adjectives', formattedAdjectives)
  );

  console.log(`Extracted ${formattedNouns.length} nouns`);
  console.log(`Extracted ${formattedVerbs.length} verbs`);
  console.log(`Extracted ${formattedAdjectives.length} adjectives`);
}

// Extract unique word types
const wordTypes = new Set<string>();
vocabData.n5VocabularyCombined.forEach((word: VocabWord) => {
  if (word.type) {
    wordTypes.add(word.type);
  }
});

// Convert to array and sort
const sortedTypes = Array.from(wordTypes).sort();

// Write to file
const outputPath = path.resolve(__dirname, '../data/word-types.json');
fs.writeFileSync(outputPath, JSON.stringify(sortedTypes, null, 2));

// Run the extraction
extractAndSaveWords();
