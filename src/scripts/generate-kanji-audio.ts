import { generateSpeech } from '../lib/google-tts';
import fs from 'fs/promises';
import path from 'path';
import n5KanjiData from '../data/n5-kanji-new.json';
import n4KanjiData from '../data/n4-kanji-standardized.json';
import n3KanjiData from '../data/n3-kanji-standardized.json';
import n2KanjiData from '../data/n2-kanji-standardized.json';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

interface KanjiData {
  id: number;
  kanji: string;
  onyomi: string[];
  onyomi_katakana: string[];
  kunyomi: string[];
  kunyomi_hiragana: string[];
  meaning: string[];
}

interface LevelData {
  level: string;
  data: KanjiData[];
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateAudioForKanji(kanji: KanjiData, kanjiDir: string, retries = 3) {
  await fs.mkdir(kanjiDir, { recursive: true });

  // Generate on'yomi readings using katakana
  for (let i = 0; i < kanji.onyomi.length; i++) {
    const reading = kanji.onyomi[i];
    const katakana = kanji.onyomi_katakana[i];
    console.log(`  Generating on'yomi: ${reading} (${katakana})`);
    const audioFileName = `${kanji.kanji}_onyomi_${reading}.mp3`;
    const audioPath = path.join(kanjiDir, audioFileName);

    // Skip if file already exists
    try {
      await fs.access(audioPath);
      console.log(`  File exists: ${audioFileName}`);
      continue;
    } catch {
      // File doesn't exist, proceed with generation
    }

    let lastError = null;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const audioContent = await generateSpeech(katakana.replace(/\s+/g, ''));
        await fs.writeFile(audioPath, audioContent);
        console.log(`  Generated ${audioFileName}`);
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
        console.error(`  Attempt ${attempt}/${retries} failed for ${audioFileName}:`, error);
        if (attempt < retries) {
          const backoff = Math.min(1000 * Math.pow(2, attempt), 8000); // Exponential backoff, max 8 seconds
          await delay(backoff);
        }
      }
    }
    if (lastError) {
      console.error(`  Failed to generate ${audioFileName} after ${retries} attempts`);
    }

    // Add a small delay between successful generations to avoid rate limiting
    await delay(500);
  }

  // Generate kun'yomi readings using hiragana
  for (let i = 0; i < kanji.kunyomi.length; i++) {
    const reading = kanji.kunyomi[i];
    const hiragana = kanji.kunyomi_hiragana[i];
    console.log(`  Generating kun'yomi: ${reading} (${hiragana})`);
    const audioFileName = `${kanji.kanji}_kunyomi_${reading}.mp3`;
    const audioPath = path.join(kanjiDir, audioFileName);

    // Skip if file already exists
    try {
      await fs.access(audioPath);
      console.log(`  File exists: ${audioFileName}`);
      continue;
    } catch {
      // File doesn't exist, proceed with generation
    }

    let lastError = null;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const audioContent = await generateSpeech(hiragana.replace(/\s+/g, ''));
        await fs.writeFile(audioPath, audioContent);
        console.log(`  Generated ${audioFileName}`);
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
        console.error(`  Attempt ${attempt}/${retries} failed for ${audioFileName}:`, error);
        if (attempt < retries) {
          const backoff = Math.min(1000 * Math.pow(2, attempt), 8000); // Exponential backoff, max 8 seconds
          await delay(backoff);
        }
      }
    }
    if (lastError) {
      console.error(`  Failed to generate ${audioFileName} after ${retries} attempts`);
    }

    // Add a small delay between successful generations to avoid rate limiting
    await delay(500);
  }
}

async function generateKanjiAudio() {
  const audioBaseDir = path.join(process.cwd(), 'public', 'audio', 'kanji');
  
  // Define all JLPT levels and their data
  const levels: LevelData[] = [
    { level: 'N5', data: n5KanjiData.n5_kanji },
    { level: 'N4', data: n4KanjiData.n4_kanji },
    { level: 'N3', data: n3KanjiData.n3_kanji },
    { level: 'N2', data: n2KanjiData.n2_kanji }
  ];

  // Process each level
  for (const { level, data } of levels) {
    console.log(`\nProcessing ${level} kanji...`);
    const kanjiList = data as KanjiData[];
    
    for (const kanji of kanjiList) {
      console.log(`\nProcessing kanji: ${kanji.kanji} (${level})`);
      const kanjiDir = path.join(audioBaseDir, kanji.kanji);
      await generateAudioForKanji(kanji, kanjiDir);
    }
    
    console.log(`\nCompleted ${level} kanji generation`);
  }

  console.log('\nAudio generation complete for all levels!');
}

// Start the audio generation
console.log('Starting kanji audio generation...');
generateKanjiAudio().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
