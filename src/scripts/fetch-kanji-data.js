/**
 * Fetch Kanji Data Script
 * 
 * This script fetches kanji data from davidluzgouveia/kanji-data repository
 * and transforms it into a simplified format for our application.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Source URL for kanji data
const KANJI_DATA_URL = 'https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji.json';

// Function to fetch data from URL
function fetchData(url) {
  return new Promise((resolve, reject) => {
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
  });
}

// Function to transform kanji data
function transformKanjiData(data) {
  const jlptLevels = {
    N5: [],
    N4: [],
    N3: [],
    N2: [],
    N1: []
  };

  // Process each kanji
  for (const [kanji, info] of Object.entries(data)) {
    // Skip if no JLPT level
    if (!info.jlpt_new) continue;
    
    // Create simplified kanji object
    const simplifiedKanji = {
      kanji,
      strokes: info.strokes,
      meanings: info.meanings,
      readings_on: info.readings_on,
      readings_kun: info.readings_kun
    };

    // Add to appropriate JLPT level
    const level = `N${info.jlpt_new}`;
    jlptLevels[level].push(simplifiedKanji);
  }

  return jlptLevels;
}

// Function to save data to JSON file
function saveToJsonFile(data, filename) {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Data saved to ${filePath}`);
}

// Main function
async function main() {
  try {
    console.log('Fetching kanji data...');
    const kanjiData = await fetchData(KANJI_DATA_URL);
    console.log(`Fetched data for ${Object.keys(kanjiData).length} kanji`);

    console.log('Transforming data...');
    const transformedData = transformKanjiData(kanjiData);
    
    // Log counts for each level
    for (const [level, kanji] of Object.entries(transformedData)) {
      console.log(`${level}: ${kanji.length} kanji`);
    }

    // Save all levels to a single file
    saveToJsonFile(transformedData, 'jlpt-kanji.json');
    
    // Also save individual files for each level
    for (const [level, kanji] of Object.entries(transformedData)) {
      saveToJsonFile(kanji, `${level.toLowerCase()}-kanji.json`);
    }

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main();
