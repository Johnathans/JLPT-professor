/**
 * Fetch JLPT Data Script
 * 
 * This script fetches kanji and words for each JLPT level from the Jisho API
 * and saves them to our local database files.
 * 
 * Usage:
 * 1. Run with ts-node: npx ts-node src/scripts/fetch-jlpt-data.ts
 * 2. The script will fetch data for all JLPT levels and save it to the data directory
 */

import fs from 'fs';
import path from 'path';

// Define the JLPT levels we want to fetch
const JLPT_LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];

// Define the number of pages to fetch for each level
const PAGES_PER_LEVEL = 5; // This will get approximately 100 words per level (20 per page)

// Define the output directory
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'data');

// Define the interface for our kanji data
interface KanjiData {
  kanji: string;
  reading: string;
  meaning: string;
  level: string;
}

// Define the interface for our word data
interface WordData {
  word: string;
  reading: string;
  meaning: string;
  level: string;
}

// Define the interface for Jisho API response
interface JishoResponse {
  meta: {
    status: number;
  };
  data: Array<{
    slug: string;
    is_common: boolean;
    jlpt: string[];
    japanese: Array<{
      word?: string;
      reading: string;
    }>;
    senses: Array<{
      english_definitions: string[];
      parts_of_speech: string[];
    }>;
  }>;
}

/**
 * Fetch data from the Jisho API
 */
async function fetchFromJisho(url: string): Promise<JishoResponse> {
  try {
    // Add a delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Jisho API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching from Jisho API:', error);
    throw error;
  }
}

/**
 * Fetch words for a specific JLPT level
 */
async function fetchJlptWords(level: string, pages: number = 1): Promise<WordData[]> {
  const words: WordData[] = [];
  
  try {
    for (let page = 1; page <= pages; page++) {
      console.log(`Fetching ${level} words, page ${page}/${pages}...`);
      
      const url = `https://jisho.org/api/v1/search/words?keyword=%23jlpt-${level}&page=${page}`;
      const response = await fetchFromJisho(url);
      
      if (response.data.length === 0) {
        console.log(`No more data for ${level} at page ${page}`);
        break;
      }
      
      for (const item of response.data) {
        // Skip items without kanji
        if (!item.japanese[0].word) continue;
        
        words.push({
          word: item.japanese[0].word || '',
          reading: item.japanese[0].reading,
          meaning: item.senses[0].english_definitions.join(', '),
          level: level.toUpperCase()
        });
      }
    }
    
    return words;
  } catch (error) {
    console.error(`Error fetching ${level} words:`, error);
    return [];
  }
}

/**
 * Extract kanji characters from words
 */
function extractKanji(words: WordData[]): KanjiData[] {
  const kanjiMap = new Map<string, KanjiData>();
  const kanjiRegex = /[\u4e00-\u9faf]/g;
  
  for (const word of words) {
    if (!word.word) continue;
    
    const kanjiChars = word.word.match(kanjiRegex);
    if (!kanjiChars) continue;
    
    for (const kanji of kanjiChars) {
      if (!kanjiMap.has(kanji)) {
        // Try to extract the reading and meaning for this kanji
        // This is a simplified approach - for better accuracy, we should fetch each kanji individually
        kanjiMap.set(kanji, {
          kanji,
          reading: '', // We'll need to fetch this separately
          meaning: '', // We'll need to fetch this separately
          level: word.level
        });
      }
    }
  }
  
  return Array.from(kanjiMap.values());
}

/**
 * Fetch details for a specific kanji
 */
async function fetchKanjiDetails(kanji: string): Promise<{ reading: string; meaning: string } | null> {
  try {
    console.log(`Fetching details for kanji: ${kanji}`);
    
    const url = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(kanji)}%20%23kanji`;
    const response = await fetchFromJisho(url);
    
    if (response.data.length === 0) {
      return null;
    }
    
    // Find the entry that is exactly this kanji
    const kanjiEntry = response.data.find(entry => 
      entry.japanese.some(item => item.word === kanji)
    );
    
    if (!kanjiEntry) {
      return null;
    }
    
    return {
      reading: kanjiEntry.japanese[0].reading,
      meaning: kanjiEntry.senses[0].english_definitions.join(', ')
    };
  } catch (error) {
    console.error(`Error fetching details for kanji ${kanji}:`, error);
    return null;
  }
}

/**
 * Enrich kanji data with readings and meanings
 */
async function enrichKanjiData(kanjiList: KanjiData[]): Promise<KanjiData[]> {
  const enrichedList: KanjiData[] = [];
  
  for (const kanjiData of kanjiList) {
    const details = await fetchKanjiDetails(kanjiData.kanji);
    
    if (details) {
      enrichedList.push({
        ...kanjiData,
        reading: details.reading,
        meaning: details.meaning
      });
    } else {
      enrichedList.push(kanjiData);
    }
  }
  
  return enrichedList;
}

/**
 * Save data to file
 */
function saveToFile(data: any, filename: string): void {
  const filePath = path.join(OUTPUT_DIR, filename);
  
  // Create the directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Format the data as a TypeScript export
  const fileContent = `/**
 * JLPT ${filename.replace('.ts', '')} Data
 * Generated on ${new Date().toISOString()}
 */

export default ${JSON.stringify(data, null, 2)};
`;
  
  fs.writeFileSync(filePath, fileContent);
  console.log(`Saved ${data.length} items to ${filePath}`);
}

/**
 * Main function to fetch and save data for all JLPT levels
 */
async function main() {
  try {
    for (const level of JLPT_LEVELS) {
      console.log(`\nProcessing JLPT ${level.toUpperCase()}...`);
      
      // Fetch words for this level
      const words = await fetchJlptWords(level, PAGES_PER_LEVEL);
      console.log(`Fetched ${words.length} words for ${level}`);
      
      // Save words to file
      saveToFile(words, `${level}-words.ts`);
      
      // Extract and enrich kanji data
      const kanjiList = extractKanji(words);
      console.log(`Extracted ${kanjiList.length} kanji characters from ${level} words`);
      
      // Enrich kanji data with readings and meanings
      const enrichedKanjiList = await enrichKanjiData(kanjiList);
      
      // Save kanji to file
      saveToFile(enrichedKanjiList, `${level}-kanji.ts`);
    }
    
    console.log('\nAll data fetched and saved successfully!');
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

// Run the main function
main();
