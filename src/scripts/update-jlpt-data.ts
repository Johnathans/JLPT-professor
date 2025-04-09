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

import * as fs from 'fs/promises';
import * as path from 'path';
import fetch from 'node-fetch';

interface JishoResponse {
  meta: {
    status: number;
  };
  data: Array<{
    slug: string;
    jlpt: string[];
    japanese: Array<{
      word: string;
      reading: string;
    }>;
    senses: Array<{
      english_definitions: string[];
      parts_of_speech: string[];
    }>;
  }>;
}

interface KanjiData {
  kanji: string;
  reading: string;
  meaning: string;
  level: string;
}

interface WordData {
  word: string;
  reading: string;
  meaning: string;
  level: string;
}

// Define the JLPT levels we want to fetch
const JLPT_LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];

// Define the output file
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'jlpt-kanji.ts');

/**
 * Fetches data from Jisho API with rate limiting
 * @param {string} url - The URL to fetch from
 * @returns {Promise<JishoResponse>} - The response from the Jisho API
 */
async function fetchFromJisho(url: string): Promise<JishoResponse> {
  return new Promise((resolve, reject) => {
    // Add a delay to avoid rate limiting
    setTimeout(() => {
      fetch(url)
        .then(response => response.json())
        .then(data => resolve(data as JishoResponse))
        .catch(error => reject(error));
    }, 1000); // 1 second delay between requests
  });
}

/**
 * Fetch JLPT words from Jisho API
 * @param {string} level - The JLPT level to fetch
 * @param {number} limit - The maximum number of words to fetch
 * @returns {Promise<WordData[]>} - Array of word data
 */
async function fetchJlptWords(level: string, limit: number = 20): Promise<WordData[]> {
  const words: WordData[] = [];
  let page = 1;
  
  try {
    while (words.length < limit) {
      const url = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(`jlpt-${level}`)}&page=${page}`;
      const response = await fetchFromJisho(url);
      
      if (!response.data || response.data.length === 0) {
        break;
      }
      
      for (const item of response.data) {
        if (words.length >= limit) break;
        
        const word: WordData = {
          word: item.japanese[0].word || '',
          reading: item.japanese[0].reading || '',
          meaning: item.senses[0].english_definitions.join('; '),
          level: level.toUpperCase()
        };
        
        words.push(word);
      }
      
      page++;
    }
  } catch (error) {
    console.error(`Error fetching ${level} words:`, error);
  }
  
  return words;
}

/**
 * Fetch JLPT kanji from Jisho API
 * @param {string} level - The JLPT level to fetch
 * @param {number} limit - The maximum number of kanji to fetch
 * @returns {Promise<KanjiData[]>} - Array of kanji data
 */
async function fetchJlptKanji(level: string, limit: number = 50): Promise<KanjiData[]> {
  const kanji: KanjiData[] = [];
  let page = 1;
  
  try {
    while (kanji.length < limit) {
      const url = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(`jlpt-${level} #kanji`)}&page=${page}`;
      const response = await fetchFromJisho(url);
      
      if (!response.data || response.data.length === 0) {
        break;
      }
      
      for (const item of response.data) {
        if (kanji.length >= limit) break;
        
        const kanjiData: KanjiData = {
          kanji: item.japanese[0].word || '',
          reading: item.japanese[0].reading || '',
          meaning: item.senses[0].english_definitions.join('; '),
          level: level.toUpperCase()
        };
        
        kanji.push(kanjiData);
      }
      
      page++;
    }
  } catch (error) {
    console.error(`Error fetching ${level} kanji:`, error);
  }
  
  return kanji;
}

/**
 * Generate the content for the jlpt-kanji.ts file
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
  n5Kanji: KanjiData[], 
  n4Kanji: KanjiData[], 
  n3Kanji: KanjiData[],
  n2Kanji: KanjiData[],
  n1Kanji: KanjiData[],
  n5Words: WordData[],
  n4Words: WordData[]
): string {
  return `/**
 * JLPT Kanji Data
 * This file contains kanji categorized by JLPT level
 * Data sourced from Jisho.org
 */

// JLPT N5 Kanji
export const N5_KANJI = ${JSON.stringify(n5Kanji, null, 2)};

// JLPT N4 Kanji
export const N4_KANJI = ${JSON.stringify(n4Kanji, null, 2)};

// JLPT N3 Kanji
export const N3_KANJI = ${JSON.stringify(n3Kanji, null, 2)};

// JLPT N2 Kanji
export const N2_KANJI = ${JSON.stringify(n2Kanji, null, 2)};

// JLPT N1 Kanji
export const N1_KANJI = ${JSON.stringify(n1Kanji, null, 2)};

// Common JLPT N5 words
export const N5_WORDS = ${JSON.stringify(n5Words, null, 2)};

// Common JLPT N4 words
export const N4_WORDS = ${JSON.stringify(n4Words, null, 2)};
`;
}

/**
 * Main function to fetch and update JLPT data
 */
async function updateJlptData() {
  try {
    console.log('Fetching JLPT data...');
    
    const [n5Kanji, n4Kanji, n3Kanji, n2Kanji, n1Kanji] = await Promise.all([
      fetchJlptKanji('n5'),
      fetchJlptKanji('n4'),
      fetchJlptKanji('n3'),
      fetchJlptKanji('n2'),
      fetchJlptKanji('n1')
    ]);
    
    const [n5Words, n4Words] = await Promise.all([
      fetchJlptWords('n5'),
      fetchJlptWords('n4')
    ]);
    
    const fileContent = generateJlptKanjiFile(
      n5Kanji,
      n4Kanji,
      n3Kanji,
      n2Kanji,
      n1Kanji,
      n5Words,
      n4Words
    );
    
    // Write the file
    await fs.writeFile(OUTPUT_FILE, fileContent);
    
    console.log('\nJLPT data updated successfully!');
    console.log(`- N5 Kanji: ${n5Kanji.length}`);
    console.log(`- N4 Kanji: ${n4Kanji.length}`);
    console.log(`- N3 Kanji: ${n3Kanji.length}`);
    console.log(`- N2 Kanji: ${n2Kanji.length}`);
    console.log(`- N1 Kanji: ${n1Kanji.length}`);
    console.log(`- N5 Words: ${n5Words.length}`);
    console.log(`- N4 Words: ${n4Words.length}`);
  } catch (error) {
    console.error('Error updating JLPT data:', error);
  }
}

updateJlptData();
