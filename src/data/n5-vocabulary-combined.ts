import part1Data from './n5-vocabulary-part1.json';
import part2Data from './n5-vocabulary-part2.json';
import part3Data from './n5-vocabulary-part3.json';
import part4Data from './n5-vocabulary-part4.json';
import { toRomaji } from '../utils/japanese';

interface Word {
  id: string;
  kana: string;
  romaji: string;
  kanji?: string;
  type: string;
  meaning: string;
  examples?: any[];
}

interface VocabularyEntry {
  id: number;
  hiragana?: string;
  reading?: string;
  japanese?: string;
  romaji?: string;
  type?: string;
  meaning?: string;
  examples?: any[];
}

// Helper function to convert vocabulary entries
function convertToWordFormat(entry: VocabularyEntry): Word {
  // For katakana words, japanese field contains the katakana
  // For hiragana words, use hiragana or reading field
  const kana = entry.hiragana || entry.reading || entry.japanese || "";
  return {
    id: entry.id.toString(),
    kana: kana,
    romaji: entry.romaji || toRomaji(kana), // Use provided romaji if available
    kanji: entry.japanese !== kana ? entry.japanese : "", // Only use japanese as kanji if it differs from kana
    type: (entry.type || "").split(',')[0].toLowerCase(),
    meaning: entry.meaning || "",
    examples: [] // Examples will be added later
  };
}

// Function to combine all vocabulary parts
function getCombinedVocabulary(): Word[] {
  try {
    const part1 = part1Data.vocabulary || [];
    console.log('Part 1 count:', part1.length);
    
    const part2 = part2Data.vocabulary || [];
    console.log('Part 2 count:', part2.length);
    
    const part3 = part3Data.vocabulary || [];
    console.log('Part 3 count:', part3.length);
    
    const part4 = part4Data.vocabulary || [];
    console.log('Part 4 count:', part4.length);

    const allVocab = [...part1, ...part2, ...part3, ...part4];
    console.log('Total vocabulary count:', allVocab.length);
    
    const converted = allVocab.map(convertToWordFormat);
    console.log('Converted vocabulary count:', converted.length);
    
    return converted;
  } catch (error) {
    console.error('Error loading vocabulary:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    return [];
  }
}

const n5VocabularyCombined = getCombinedVocabulary();

export { n5VocabularyCombined };
