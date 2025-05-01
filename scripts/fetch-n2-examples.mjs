import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load N2 kanji data
const n2KanjiPath = path.join(__dirname, '../src/data/n2-kanji.json');
const n2ExamplesPath = path.join(__dirname, '../src/data/examples/n2/examples.json');

async function fetchExamples(kanji) {
  const params = new URLSearchParams({
    query: kanji,
    from: 'jpn',
    to: 'eng',
    trans_filter: 'limit',
    trans_to: 'eng',
    sort: 'random'
  });

  try {
    const response = await fetch(`https://tatoeba.org/en/api_v0/search?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Filter and process the results
    const examples = data.results
      .filter(result => {
        const hasTranslation = result.translations?.[0]?.[0]?.text;
        const isReasonableLength = result.text.length <= 50;
        const hasNoSpecialChars = !/[♪♫★☆♡♥]/.test(result.text);
        return hasTranslation && isReasonableLength && hasNoSpecialChars;
      })
      .slice(0, 3) // Take up to 3 examples
      .map(result => ({
        japanese: result.text,
        english: result.translations[0][0].text
      }));

    return examples;
  } catch (error) {
    console.error(`Error fetching examples for ${kanji}:`, error);
    return [];
  }
}

async function main() {
  try {
    // Create examples directory if it doesn't exist
    const examplesDir = path.dirname(n2ExamplesPath);
    await fs.mkdir(examplesDir, { recursive: true });
    
    // Read the N2 kanji data
    const n2KanjiRaw = await fs.readFile(n2KanjiPath, 'utf-8');
    const n2Kanji = JSON.parse(n2KanjiRaw);
    
    // Read existing examples if they exist
    let existingExamples = { examples: {} };
    try {
      const existingData = await fs.readFile(n2ExamplesPath, 'utf-8');
      existingExamples = JSON.parse(existingData);
    } catch (error) {
      console.log('No existing examples file found, creating new one');
    }

    console.log(`Total N2 kanji to process: ${n2Kanji.length}`);

    // Process each kanji
    for (let i = 0; i < n2Kanji.length; i++) {
      const kanji = n2Kanji[i].kanji;
      
      // Skip if we already have examples for this kanji
      if (existingExamples.examples[kanji]?.length > 0) {
        console.log(`[${i + 1}/${n2Kanji.length}] Skipping ${kanji} - already has examples`);
        continue;
      }

      console.log(`[${i + 1}/${n2Kanji.length}] Fetching examples for ${kanji}...`);
      
      const examples = await fetchExamples(kanji);
      
      if (examples.length > 0) {
        existingExamples.examples[kanji] = examples;
        console.log(`Found ${examples.length} examples for ${kanji}`);
        
        // Save after each successful fetch
        await fs.writeFile(n2ExamplesPath, JSON.stringify(existingExamples, null, 2), 'utf-8');
      } else {
        console.log(`No examples found for ${kanji}`);
      }

      // Add a small delay to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
