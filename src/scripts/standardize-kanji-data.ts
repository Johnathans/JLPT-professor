import * as fs from 'fs/promises';
import * as path from 'path';
import * as wanakana from 'wanakana';

interface KanjiDataN5 {
  id: number;
  kanji: string;
  onyomi: string[];
  onyomi_katakana: string[];
  kunyomi: string[];
  kunyomi_hiragana: string[];
  meaning: string[];
}

interface KanjiDataN2 {
  id?: number;
  kanji: string;
  onyomi: string | string[];
  kunyomi: string | string[];
  meaning: string;
}

interface RawKanjiData {
  kanji_data?: KanjiDataN2[];
  n4_kanji?: KanjiDataN5[];
  n3_kanji?: KanjiDataN5[];
}

async function convertToStandardFormat(inputFiles: string[], outputFile: string, level: string): Promise<void> {
  console.log(`Converting ${level} kanji data...`);
  
  // Read and combine input files
  let kanjiList: (KanjiDataN2 | KanjiDataN5)[] = [];
  for (const inputFile of inputFiles) {
    const data: RawKanjiData = JSON.parse(await fs.readFile(inputFile, 'utf8'));
    // For N2, data is in kanji_data array
    if (level === 'n2' && data.kanji_data) {
      kanjiList = [...kanjiList, ...data.kanji_data];
    } else {
      // For other levels, data is in level_kanji array
      const levelKanji = data[`${level}_kanji` as keyof RawKanjiData];
      if (levelKanji) {
        kanjiList = [...kanjiList, ...levelKanji];
      }
    }
  }
  
  // Convert each kanji entry to the standard format
  const standardizedKanji = kanjiList.map((kanji: KanjiDataN2 | KanjiDataN5, index: number): KanjiDataN5 => {
    // For N4 and N5, data is already in correct format
    if ('onyomi_katakana' in kanji && 'kunyomi_hiragana' in kanji) {
      return kanji as KanjiDataN5;
    }

    // For N3 and N2, we need to convert readings
    const standardized: KanjiDataN5 = {
      id: kanji.id || index + 1,
      kanji: kanji.kanji,
      onyomi: [],
      onyomi_katakana: [],
      kunyomi: [],
      kunyomi_hiragana: [],
      meaning: typeof kanji.meaning === 'string' ? kanji.meaning.split(', ') : [kanji.meaning]
    };

    // Process onyomi readings
    if (typeof kanji.onyomi === 'string') {
      // For N2 format where onyomi is like "ryou (リョウ)"
      const match = kanji.onyomi.match(/([^(]+)\s*\(([^)]+)\)/);
      if (match) {
        const [_, romaji, katakana] = match;
        const readings = romaji.split(',').map((r: string) => r.trim());
        const katakanas = katakana.split(',').map((k: string) => k.trim());
        standardized.onyomi = readings;
        standardized.onyomi_katakana = katakanas;
      }
    } else if (Array.isArray(kanji.onyomi)) {
      kanji.onyomi.forEach((reading: string) => {
        if (wanakana.isKatakana(reading)) {
          // If already in katakana
          standardized.onyomi.push(wanakana.toRomaji(reading));
          standardized.onyomi_katakana.push(reading);
        } else {
          // If in romaji
          standardized.onyomi.push(reading);
          standardized.onyomi_katakana.push(wanakana.toKatakana(reading));
        }
      });
    }

    // Process kunyomi readings
    if (typeof kanji.kunyomi === 'string' && kanji.kunyomi) {
      // For N2 format where kunyomi is like "take (たけ)"
      const match = kanji.kunyomi.match(/([^(]+)\s*\(([^)]+)\)/);
      if (match) {
        const [_, romaji, hiragana] = match;
        const readings = romaji.split(',').map((r: string) => r.trim());
        const hiraganas = hiragana.split(',').map((h: string) => h.trim());
        standardized.kunyomi = readings;
        standardized.kunyomi_hiragana = hiraganas;
      }
    } else if (Array.isArray(kanji.kunyomi)) {
      kanji.kunyomi.forEach((reading: string) => {
        if (wanakana.isHiragana(reading)) {
          // If already in hiragana
          standardized.kunyomi.push(wanakana.toRomaji(reading));
          standardized.kunyomi_hiragana.push(reading);
        } else if (reading) {
          // If in romaji or other format
          // Handle special cases like "a(u)" -> "あ(う)"
          const processed = reading.replace(/\(([^)]+)\)/g, '($1)');
          const hiragana = processed.split(/[()]/g).map((part: string) => 
            part ? wanakana.toHiragana(part) : ''
          ).join('');
          
          standardized.kunyomi.push(reading);
          standardized.kunyomi_hiragana.push(hiragana);
        }
      });
    }

    return standardized;
  });

  // Write the standardized data
  const outputData = {
    [`${level}_kanji`]: standardizedKanji
  };
  
  await fs.writeFile(outputFile, JSON.stringify(outputData, null, 2), 'utf8');
  console.log(`✓ ${level} kanji data standardized and saved to ${outputFile}`);
}

async function main(): Promise<void> {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  
  // Process each JLPT level
  const levels = ['n4', 'n3', 'n2'];
  
  for (const level of levels) {
    let inputFiles: string[];
    if (level === 'n2') {
      // For N2, use both part1 and part2 files
      inputFiles = [
        path.join(dataDir, `${level}-kanji-new-part1.json`),
        path.join(dataDir, `${level}-kanji-new-part2.json`)
      ];
    } else {
      // For other levels, use single file
      inputFiles = [path.join(dataDir, `${level}-kanji-new.json`)];
    }
    
    const outputFile = path.join(dataDir, `${level}-kanji-standardized.json`);
    await convertToStandardFormat(inputFiles, outputFile, level);
  }
  
  console.log('\n🎉 All kanji data has been standardized!');
}

main().catch(console.error);
