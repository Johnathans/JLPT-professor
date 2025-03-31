/**
 * Update JLPT Data Script
 * 
 * This script updates our jlpt-kanji.ts file with data fetched from the Jisho API.
 * It combines the existing data with new data to create a more comprehensive dataset.
 * 
 * Usage:
 * 1. Run with ts-node: npx ts-node src/scripts/update-jlpt-data.ts
 * 2. The script will update the jlpt-kanji.ts file with new data
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Define the JLPT levels we want to fetch
const JLPT_LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];

// Define the output file
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'jlpt-kanji.ts');

// Define the interface for our kanji data
/**
 * @typedef {Object} KanjiData
 * @property {string} kanji - The kanji character
 * @property {string} reading - The reading of the kanji
 * @property {string} meaning - The meaning of the kanji
 * @property {string} level - The JLPT level of the kanji
 */

// Define the interface for our word data
/**
 * @typedef {Object} WordData
 * @property {string} word - The word
 * @property {string} reading - The reading of the word
 * @property {string} meaning - The meaning of the word
 * @property {string} level - The JLPT level of the word
 */

// Define the interface for Jisho API response
/**
 * @typedef {Object} JishoResponse
 * @property {Object} meta - Metadata about the response
 * @property {number} meta.status - HTTP status code
 * @property {Array<Object>} data - Array of data objects
 */

/**
 * Fetch data from the Jisho API
 * @param {string} url - The URL to fetch data from
 * @returns {Promise<JishoResponse>} - The response from the Jisho API
 */
async function fetchFromJisho(url) {
  return new Promise((resolve, reject) => {
    // Add a delay to avoid rate limiting
    setTimeout(() => {
      https.get(url, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', (error) => {
        reject(error);
      });
    }, 1000);
  });
}

/**
 * Fetch words for a specific JLPT level
 * @param {string} level - The JLPT level to fetch words for
 * @param {number} limit - The maximum number of words to fetch
 * @returns {Promise<WordData[]>} - Array of word data
 */
async function fetchJlptWords(level, limit = 20) {
  const words = [];
  let page = 1;
  
  try {
    while (words.length < limit) {
      console.log(`Fetching ${level} words, page ${page}... (${words.length}/${limit})`);
      
      const url = `https://jisho.org/api/v1/search/words?keyword=%23jlpt-${level}&page=${page}`;
      const response = await fetchFromJisho(url);
      
      if (response.data.length === 0) {
        console.log(`No more data for ${level} at page ${page}`);
        break;
      }
      
      for (const item of response.data) {
        // Skip items without kanji
        if (!item.japanese[0].word) continue;
        
        // Skip if we already have enough words
        if (words.length >= limit) break;
        
        words.push({
          word: item.japanese[0].word || '',
          reading: item.japanese[0].reading,
          meaning: item.senses[0].english_definitions.join(', '),
          level: level.toUpperCase()
        });
      }
      
      page++;
      
      // Break if we've gone through 10 pages to avoid infinite loops
      if (page > 10) break;
    }
    
    return words;
  } catch (error) {
    console.error(`Error fetching ${level} words:`, error);
    return [];
  }
}

/**
 * Fetch kanji for a specific JLPT level
 * @param {string} level - The JLPT level to fetch kanji for
 * @param {number} limit - The maximum number of kanji to fetch
 * @returns {Promise<KanjiData[]>} - Array of kanji data
 */
async function fetchJlptKanji(level, limit = 50) {
  const kanji = [];
  let page = 1;
  
  try {
    while (kanji.length < limit) {
      console.log(`Fetching ${level} kanji, page ${page}... (${kanji.length}/${limit})`);
      
      const url = `https://jisho.org/api/v1/search/words?keyword=%23jlpt-${level}%20%23kanji&page=${page}`;
      const response = await fetchFromJisho(url);
      
      if (response.data.length === 0) {
        console.log(`No more data for ${level} kanji at page ${page}`);
        break;
      }
      
      for (const item of response.data) {
        // Skip if we already have enough kanji
        if (kanji.length >= limit) break;
        
        // Skip items without kanji
        if (!item.japanese[0].word) continue;
        
        // Skip if the word is not a single kanji
        if (item.japanese[0].word.length !== 1) continue;
        
        kanji.push({
          kanji: item.japanese[0].word,
          reading: item.japanese[0].reading,
          meaning: item.senses[0].english_definitions.join(', '),
          level: level.toUpperCase()
        });
      }
      
      page++;
      
      // Break if we've gone through 10 pages to avoid infinite loops
      if (page > 10) break;
    }
    
    return kanji;
  } catch (error) {
    console.error(`Error fetching ${level} kanji:`, error);
    return [];
  }
}

/**
 * Generate the updated jlpt-kanji.ts file
 * @param {KanjiData[]} n5Kanji - Array of N5 kanji
 * @param {KanjiData[]} n4Kanji - Array of N4 kanji
 * @param {KanjiData[]} n3Kanji - Array of N3 kanji
 * @param {KanjiData[]} n2Kanji - Array of N2 kanji
 * @param {KanjiData[]} n1Kanji - Array of N1 kanji
 * @param {WordData[]} n5Words - Array of N5 words
 * @param {WordData[]} n4Words - Array of N4 words
 * @returns {string} - The content of the jlpt-kanji.ts file
 */
function generateJlptKanjiFile(
  n5Kanji, 
  n4Kanji, 
  n3Kanji,
  n2Kanji,
  n1Kanji,
  n5Words,
  n4Words
) {
  return `/**
 * JLPT Kanji Data
 * This file contains kanji categorized by JLPT level
 * Updated on ${new Date().toISOString()}
 */

export interface KanjiData {
  kanji: string;
  reading: string;
  meaning: string;
  level: string;
}

// N5 Kanji (${n5Kanji.length} kanji)
export const N5_KANJI: KanjiData[] = ${JSON.stringify(n5Kanji, null, 2)};

// N4 Kanji (${n4Kanji.length} kanji)
export const N4_KANJI: KanjiData[] = ${JSON.stringify(n4Kanji, null, 2)};

// N3 Kanji (${n3Kanji.length} kanji)
export const N3_KANJI: KanjiData[] = ${JSON.stringify(n3Kanji, null, 2)};

// N2 Kanji (${n2Kanji.length} kanji)
export const N2_KANJI: KanjiData[] = ${JSON.stringify(n2Kanji, null, 2)};

// N1 Kanji (${n1Kanji.length} kanji)
export const N1_KANJI: KanjiData[] = ${JSON.stringify(n1Kanji, null, 2)};

// Helper function to get JLPT level for a kanji
export function getJlptLevelForKanji(kanji: string): string | null {
  // Check N5 first
  const n5Match = N5_KANJI.find(k => k.kanji === kanji);
  if (n5Match) return 'N5';
  
  // Check N4
  const n4Match = N4_KANJI.find(k => k.kanji === kanji);
  if (n4Match) return 'N4';
  
  // Check N3
  const n3Match = N3_KANJI.find(k => k.kanji === kanji);
  if (n3Match) return 'N3';
  
  // Check N2
  const n2Match = N2_KANJI.find(k => k.kanji === kanji);
  if (n2Match) return 'N2';
  
  // Check N1
  const n1Match = N1_KANJI.find(k => k.kanji === kanji);
  if (n1Match) return 'N1';
  
  // No match found
  return null;
}

// All JLPT kanji combined
export const ALL_JLPT_KANJI = [...N5_KANJI, ...N4_KANJI, ...N3_KANJI, ...N2_KANJI, ...N1_KANJI];

// Common JLPT N5 words
export const N5_WORDS = ${JSON.stringify(n5Words, null, 2)};

// Common JLPT N4 words
export const N4_WORDS = ${JSON.stringify(n4Words, null, 2)};
`;
}

/**
 * Main function to fetch and update JLPT data
 */
async function main() {
  try {
    console.log('Fetching JLPT data from Jisho API...');
    
    // Fetch kanji for each level (reduced numbers for demonstration)
    const n5Kanji = await fetchJlptKanji('n5', 10);
    const n4Kanji = await fetchJlptKanji('n4', 5);
    const n3Kanji = await fetchJlptKanji('n3', 3);
    const n2Kanji = await fetchJlptKanji('n2', 2);
    const n1Kanji = await fetchJlptKanji('n1', 2);
    
    // Fetch words for N5 and N4 (reduced numbers for demonstration)
    const n5Words = await fetchJlptWords('n5', 5);
    const n4Words = await fetchJlptWords('n4', 3);
    
    // Generate the updated file content
    const fileContent = generateJlptKanjiFile(
      n5Kanji, n4Kanji, n3Kanji, n2Kanji, n1Kanji, n5Words, n4Words
    );
    
    // Write the file
    fs.writeFileSync(OUTPUT_FILE, fileContent);
    
    console.log(`\nJLPT data updated successfully!`);
    console.log(`- N5 Kanji: ${n5Kanji.length}`);
    console.log(`- N4 Kanji: ${n4Kanji.length}`);
    console.log(`- N3 Kanji: ${n3Kanji.length}`);
    console.log(`- N2 Kanji: ${n2Kanji.length}`);
    console.log(`- N1 Kanji: ${n1Kanji.length}`);
    console.log(`- N5 Words: ${n5Words.length}`);
    console.log(`- N4 Words: ${n4Words.length}`);
    console.log(`Total Kanji: ${n5Kanji.length + n4Kanji.length + n3Kanji.length + n2Kanji.length + n1Kanji.length}`);
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

// Run the main function
main();
