const fs = require('fs');
const path = require('path');
const { n5KanjiComplete } = require('../src/data/n5-kanji-complete');

const TATOEBA_API = 'https://tatoeba.org/en/api_v0/search';
const EXAMPLES_PER_KANJI = 3;

interface TatoebaResponse {
  results: {
    text: string;
    translations: Array<Array<{ text: string }>>;
  }[];
}

async function fetchExamples(kanji: string): Promise<Array<{ japanese: string; english: string }>> {
  try {
    const params = new URLSearchParams({
      query: kanji,
      from: 'jpn',
      to: 'eng',
      trans_filter: 'limit',
      trans_to: 'eng',
      sort: 'random'
    });

    const response = await fetch(`${TATOEBA_API}?${params.toString()}`);
    const data: TatoebaResponse = await response.json();

    return data.results
      .filter(result => 
        // Ensure there's an English translation
        result.translations?.[0]?.[0]?.text &&
        // Filter out very long sentences
        result.text.length <= 50 &&
        // Filter out sentences with special characters
        !/[♪♫★☆♡♥]/.test(result.text)
      )
      .slice(0, EXAMPLES_PER_KANJI)
      .map(result => ({
        japanese: result.text,
        english: result.translations[0][0].text
      }));
  } catch (error) {
    console.error(`Error fetching examples for ${kanji}:`, error);
    return [];
  }
}

async function main() {
  const updatedKanji = [...n5KanjiComplete];
  
  for (const [index, kanji] of n5KanjiComplete.entries()) {
    console.log(`Fetching examples for ${kanji.kanji} (${index + 1}/${n5KanjiComplete.length})`);
    
    // Add a delay between requests to avoid rate limiting
    if (index > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const examples = await fetchExamples(kanji.kanji);
    updatedKanji[index] = {
      ...kanji,
      examples
    };
  }

  // Write the updated kanji data back to the file
  const outputPath = path.join(__dirname, '../src/data/n5-kanji-with-examples.ts');
  const fileContent = `/**
 * JLPT N5 Kanji Data with Example Sentences
 * Auto-generated on ${new Date().toISOString()}
 */

const KanjiData = require('@/types/word').KanjiData;

export = {
  n5KanjiWithExamples: ${JSON.stringify(updatedKanji, null, 2)}
};
`;

  fs.writeFileSync(outputPath, fileContent);
  console.log('Done! Updated kanji data written to n5-kanji-with-examples.ts');
}

main().catch(console.error);
