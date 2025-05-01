import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import N5 kanji data
const n5KanjiPath = path.join(__dirname, '../src/data/n5-kanji.json');

const readJsonFile = async (filePath) => {
  try {
    const content = await fs.readFile(path.resolve(filePath), 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error);
    return null;
  }
};

const CACHE_FILE = path.join(__dirname, '../src/data/examples/n5/examples.json');
const EXAMPLES_PER_KANJI = 3;
const DELAY_BETWEEN_REQUESTS = 1000; // 1 second delay between requests

async function fetchExamples(kanji) {
  const url = `https://tatoeba.org/en/api_v0/search?query=${encodeURIComponent(kanji)}&from=jpn&to=eng&trans_filter=limit&trans_to=eng&sort=random`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Filter and map the results
    const examples = (data.results || [])
      .filter(sentence => 
        sentence?.text && 
        sentence?.translations?.[0]?.[0]?.text &&
        sentence.text.includes(kanji) &&
        // Filter out very long sentences
        sentence.text.length <= 50 &&
        // Filter out sentences with special characters
        !/[♪♫★☆♡♥]/.test(sentence.text)
      )
      .map(sentence => ({
        japanese: sentence.text,
        english: sentence.translations[0][0].text
      }))
      .slice(0, EXAMPLES_PER_KANJI);

    return examples;
  } catch (error) {
    console.error(`Error fetching examples for ${kanji}:`, error);
    return [];
  }
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  try {
    // Load N5 kanji data
    const n5Data = await readJsonFile(n5KanjiPath);

    if (!n5Data || !Array.isArray(n5Data)) {
      console.error('Error loading N5 kanji data');
      return;
    }

    console.log(`Total N5 kanji to process: ${n5Data.length}`);

    // Load existing cache if it exists
    let cache = { examples: {} };
    try {
      const cacheContent = await fs.readFile(path.resolve(CACHE_FILE), 'utf-8');
      cache = JSON.parse(cacheContent);
    } catch (error) {
      console.log('No existing cache found, creating new cache file');
    }

    // Process each kanji
    for (let i = 0; i < n5Data.length; i++) {
      const kanji = n5Data[i].kanji;
      
      // Skip if we already have examples for this kanji
      if (cache.examples[kanji] && cache.examples[kanji].length > 0) {
        console.log(`[${i + 1}/${n5Data.length}] Skipping ${kanji} - already has examples`);
        continue;
      }

      console.log(`[${i + 1}/${n5Data.length}] Fetching examples for ${kanji}...`);
      
      const examples = await fetchExamples(kanji);
      if (examples.length > 0) {
        cache.examples[kanji] = examples;
        console.log(`Found ${examples.length} examples for ${kanji}`);
        
        // Save after each successful fetch
        await fs.writeFile(
          path.resolve(CACHE_FILE),
          JSON.stringify(cache, null, 2),
          'utf-8'
        );
      } else {
        console.log(`No examples found for ${kanji}`);
      }

      // Add delay between requests
      if (i < n5Data.length - 1) {
        await delay(DELAY_BETWEEN_REQUESTS);
      }
    }

    console.log('Done! All N5 kanji examples have been fetched and saved.');
  } catch (error) {
    console.error('Error in main:', error);
  }
}

main();
