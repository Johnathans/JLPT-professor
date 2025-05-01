import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Extract N3 kanji from the JSON file
const n3KanjiFile = await fs.readFile(path.join(__dirname, '..', 'src', 'data', 'n3-kanji-new.json'), 'utf-8');
const n3KanjiData = JSON.parse(n3KanjiFile);
const N3_KANJI = n3KanjiData.n3_kanji.map(k => k.kanji);

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchCommonWords(kanji) {
  try {
    const response = await fetch(`https://jisho.org/api/v1/search/words?keyword=*${kanji}*`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    // Filter and transform the results
    const words = data.data
      .filter(word => 
        word.japanese[0].word && 
        word.japanese[0].word.includes(kanji) &&
        word.japanese[0].word !== kanji) // Exclude single kanji
      .map(word => {
        const mainEntry = word.japanese.find(entry => entry.word && entry.word.includes(kanji)) || word.japanese[0];
        return {
          word: mainEntry.word,
          reading: mainEntry.reading,
          meaning: word.senses[0].english_definitions[0],
          jlpt: word.jlpt?.[0] || null
        };
      })
      .slice(0, 10); // Limit to 10 words per kanji

    return words;
  } catch (error) {
    console.error(`Error fetching words for kanji ${kanji}:`, error);
    return [];
  }
}

async function main() {
  const outputDir = path.join(__dirname, '..', 'src', 'data', 'common-words');
  await fs.mkdir(outputDir, { recursive: true });

  // Process N3 kanji only
  const n3Data = {};
  console.log('\nFetching common words for N3 kanji...');
  
  for (const kanji of N3_KANJI) {
    console.log(`Processing kanji: ${kanji}`);
    const words = await fetchCommonWords(kanji);
    n3Data[kanji] = words;
    // Add delay to avoid rate limiting
    await delay(1000);
  }

  // Save N3 data
  const n3OutputPath = path.join(outputDir, 'n3-common-words.json');
  await fs.writeFile(n3OutputPath, JSON.stringify(n3Data, null, 2));
  console.log(`N3 common words saved to ${n3OutputPath}`);
}

main().catch(console.error);
