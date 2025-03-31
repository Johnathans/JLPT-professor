const fs = require('fs');
const path = require('path');

// Import vocabulary data
const vocabData = require('../data/n5-vocabulary-combined.ts');

interface Word {
  id: string;
  romaji: string;
  kana: string;
  kanji?: string;
  meaning: string;
  type: string;
  examples?: any[];
}

// Helper function to extract words by type
function extractWordsByType(words: Word[], targetType: string): Word[] {
  return words.filter(word => {
    const type = word.type.toLowerCase();
    if (targetType === 'noun') {
      return type.includes('noun') || type === 'n';
    }
    if (targetType === 'verb') {
      return type.includes('verb') || type === 'v' || type.includes('-v');
    }
    if (targetType === 'adjective') {
      return type.includes('adj') || type.includes('adjective');
    }
    return false;
  });
}

// Helper function to format words with examples
function formatWords(words: Word[], startId: string): Word[] {
  return words.map((word, index) => ({
    id: `${startId}${index + 1}`,
    kana: word.kana,
    kanji: word.kanji || "",
    romaji: word.romaji,
    type: word.type,
    meaning: word.meaning,
    examples: [] // Examples will be added manually for better quality
  }));
}

// Extract and save words
function extractAndSaveWords() {
  // Extract words by type
  const nouns = extractWordsByType(vocabData.n5VocabularyCombined, 'noun');
  const verbs = extractWordsByType(vocabData.n5VocabularyCombined, 'verb');
  const adjectives = extractWordsByType(vocabData.n5VocabularyCombined, 'adjective');

  // Format words with proper IDs
  const formattedNouns = formatWords(nouns, 'n');
  const formattedVerbs = formatWords(verbs, 'v');
  const formattedAdjectives = formatWords(adjectives, 'adj');

  // Create TypeScript content
  const createFileContent = (name: string, words: Word[]): string => `\
import { Word } from '@/types/word';

export const ${name}: Word[] = ${JSON.stringify(words, null, 2)};

export default ${name};
`;

  // Save files
  const dataDir = path.join(process.cwd(), 'src', 'data');
  
  fs.writeFileSync(
    path.join(dataDir, 'n5-nouns.ts'),
    createFileContent('n5Nouns', formattedNouns)
  );
  
  fs.writeFileSync(
    path.join(dataDir, 'n5-verbs.ts'),
    createFileContent('n5Verbs', formattedVerbs)
  );
  
  fs.writeFileSync(
    path.join(dataDir, 'n5-adjectives.ts'),
    createFileContent('n5Adjectives', formattedAdjectives)
  );

  // Log results
  console.log(`Extracted ${formattedNouns.length} nouns`);
  console.log(`Extracted ${formattedVerbs.length} verbs`);
  console.log(`Extracted ${formattedAdjectives.length} adjectives`);
}

// Run the extraction
extractAndSaveWords();
