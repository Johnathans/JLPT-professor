const fsPromises = require('fs').promises;
const pathUtils = require('path');
const nodeFetch = require('node-fetch');

interface KanjiDetails {
  kanji: string;
  grade: number;
  jlpt: number | null;
  stroke_count: number;
  meanings: string[];
  kun_readings: string[];
  on_readings: string[];
  name_readings: string[];
  unicode: string;
}

async function main() {
  // Get JLPT level from command line argument
  const level = parseInt(process.argv[2]);
  if (isNaN(level) || level < 1 || level > 5) {
    console.error('Please provide a valid JLPT level (1-5)');
    console.error('Usage: npx ts-node src/scripts/fetch-jlpt-kanji.ts <level>');
    console.error('Example: npx ts-node src/scripts/fetch-jlpt-kanji.ts 5');
    process.exit(1);
  }

  try {
    console.log(`Fetching N${level} kanji...`);
    const response = await nodeFetch(`https://kanjiapi.dev/v1/kanji/jlpt-${level}`);
    const kanjiList = await response.json();
    
    const results: { kanji: string; meanings: string[]; onyomi: string[]; kunyomi: string[]; info: { grade: number; jlpt: number | null; strokeCount: number; unicode: string } }[] = [];

    for (const kanji of kanjiList) {
      const details = await nodeFetch(`https://kanjiapi.dev/v1/kanji/${kanji}`)
        .then((r: any) => r.json()) as KanjiDetails;
      
      results.push({
        kanji: details.kanji,
        meanings: details.meanings,
        onyomi: details.on_readings,
        kunyomi: details.kun_readings,
        info: {
          grade: details.grade,
          jlpt: details.jlpt,
          strokeCount: details.stroke_count,
          unicode: details.unicode
        }
      });
      console.log(`Processed ${results.length} of ${kanjiList.length} kanji...`);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between requests
    }

    const adminKanjiDir = pathUtils.join(process.cwd(), 'src', 'app', 'admin', 'kanji', 'data');
    await fsPromises.mkdir(adminKanjiDir, { recursive: true });

    const filePath = pathUtils.join(adminKanjiDir, `n${level}-kanji.ts`);
    const fileContent = `// JLPT N${level} Kanji List
export const N${level}_KANJI = ${JSON.stringify(results, null, 2)} as const;

export type N${level}Kanji = typeof N${level}_KANJI[number];
`;
    
    await fsPromises.writeFile(filePath, fileContent, 'utf-8');
    console.log(`\nCompleted! Found ${results.length} N${level} kanji`);
    console.log(`Saved to ${filePath}`);

  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

main();
