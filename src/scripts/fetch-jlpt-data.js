/**
 * Fetch JLPT Data Script
 * 
 * This script fetches kanji and words for each JLPT level from the Jisho API
 * and saves them to our local database files.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Jisho API base URL
const JISHO_API_BASE = 'https://jisho.org/api/v1';

// User agent to avoid being blocked
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

// Function to fetch data from Jisho API
function fetchJishoData(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': USER_AGENT
      }
    };

    https.get(url, options, (res) => {
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

// Function to fetch JLPT kanji by level
async function fetchJlptKanji(level, limit = 50) {
  console.log(`Fetching JLPT ${level} kanji...`);
  const url = `${JISHO_API_BASE}/search/words?keyword=%23jlpt-${level.toLowerCase()}%20%23kanji&page=1`;
  
  try {
    const data = await fetchJishoData(url);
    const results = data.data || [];
    
    if (results.length === 0) {
      console.log(`No results found for JLPT ${level} kanji. Using manual data.`);
      return createManualN4KanjiData();
    }
    
    const kanjiList = results.slice(0, limit).map(item => {
      const kanji = item.japanese[0]?.word || '';
      const reading = item.japanese[0]?.reading || '';
      const meanings = item.senses[0]?.english_definitions || [];
      
      return {
        kanji,
        reading,
        meaning: meanings.join(', '),
        level
      };
    });
    
    console.log(`Found ${kanjiList.length} JLPT ${level} kanji.`);
    return kanjiList;
  } catch (error) {
    console.error(`Error fetching JLPT ${level} kanji:`, error);
    return createManualN4KanjiData();
  }
}

// Function to fetch JLPT words by level
async function fetchJlptWords(level, limit = 30) {
  console.log(`Fetching JLPT ${level} words...`);
  // Use a different URL format for words to avoid getting only kanji
  const url = `${JISHO_API_BASE}/search/words?keyword=%23jlpt-${level.toLowerCase()}%20%23words&page=1`;
  
  try {
    const data = await fetchJishoData(url);
    const results = data.data || [];
    
    if (results.length === 0) {
      console.log(`No results found for JLPT ${level} words. Using manual data.`);
      return createManualN4WordData();
    }
    
    const wordList = results.slice(0, limit).map(item => {
      const word = item.japanese[0]?.word || '';
      const reading = item.japanese[0]?.reading || '';
      const meanings = item.senses[0]?.english_definitions || [];
      
      return {
        word,
        reading,
        meaning: meanings.join(', '),
        level
      };
    });
    
    console.log(`Found ${wordList.length} JLPT ${level} words.`);
    return wordList;
  } catch (error) {
    console.error(`Error fetching JLPT ${level} words:`, error);
    return createManualN4WordData();
  }
}

// Function to fetch detailed information for a single kanji
async function fetchKanjiDetail(kanji) {
  console.log(`Fetching detailed information for kanji: ${kanji}`);
  const url = `${JISHO_API_BASE}/search/words?keyword=${encodeURIComponent(kanji)}`;
  
  try {
    const data = await fetchJishoData(url);
    const results = data.data || [];
    
    if (results.length === 0) {
      console.log(`No detailed information found for kanji: ${kanji}`);
      return null;
    }
    
    const mainResult = results[0];
    
    // Extract example sentences if available
    const exampleSentences = [];
    mainResult.senses.forEach(sense => {
      if (sense.examples && sense.examples.length > 0) {
        sense.examples.forEach(example => {
          exampleSentences.push({
            japanese: example.japanese,
            english: example.english
          });
        });
      }
    });
    
    // Extract related words (other words containing this kanji)
    const relatedWords = results.slice(1, 6).map(item => {
      return {
        word: item.japanese[0]?.word || '',
        reading: item.japanese[0]?.reading || '',
        meaning: (item.senses[0]?.english_definitions || []).join(', ')
      };
    });
    
    // Create detailed kanji object
    const kanjiDetail = {
      kanji: mainResult.japanese[0]?.word || '',
      reading: mainResult.japanese[0]?.reading || '',
      meaning: (mainResult.senses[0]?.english_definitions || []).join(', '),
      jlptLevel: mainResult.jlpt[0] || null,
      tags: mainResult.tags || [],
      exampleSentences: exampleSentences,
      relatedWords: relatedWords,
      // We'd need a separate API for stroke order, but we can add a placeholder
      strokeOrder: {
        strokes: [],
        strokeCount: 0
      },
      studyTips: `Practice writing the kanji "${kanji}" multiple times. Try to use it in sentences and recognize it in different contexts.`
    };
    
    return kanjiDetail;
  } catch (error) {
    console.error(`Error fetching details for kanji ${kanji}:`, error);
    return null;
  }
}

// Function to create manual N4 kanji data
function createManualN4KanjiData() {
  return [
    { kanji: '会', reading: 'かい', meaning: 'meeting, association', level: 'N4' },
    { kanji: '同', reading: 'どう', meaning: 'same, similar', level: 'N4' },
    { kanji: '事', reading: 'こと', meaning: 'matter, thing, fact', level: 'N4' },
    { kanji: '社', reading: 'しゃ', meaning: 'company, society', level: 'N4' },
    { kanji: '発', reading: 'はつ', meaning: 'departure, discharge', level: 'N4' },
    { kanji: '者', reading: 'しゃ', meaning: 'person', level: 'N4' },
    { kanji: '地', reading: 'ち', meaning: 'ground, land', level: 'N4' },
    { kanji: '業', reading: 'ぎょう', meaning: 'business, industry', level: 'N4' },
    { kanji: '場', reading: 'ば', meaning: 'place, location', level: 'N4' },
    { kanji: '員', reading: 'いん', meaning: 'member, staff', level: 'N4' },
    { kanji: '立', reading: 'たつ', meaning: 'stand, establish', level: 'N4' },
    { kanji: '開', reading: 'かい', meaning: 'open', level: 'N4' },
    { kanji: '手', reading: 'て', meaning: 'hand', level: 'N4' },
    { kanji: '力', reading: 'ちから', meaning: 'power, strength', level: 'N4' },
    { kanji: '問', reading: 'もん', meaning: 'question, problem', level: 'N4' },
    { kanji: '代', reading: 'だい', meaning: 'substitute, generation', level: 'N4' },
    { kanji: '明', reading: 'めい', meaning: 'bright, clear', level: 'N4' },
    { kanji: '動', reading: 'どう', meaning: 'move, motion', level: 'N4' },
    { kanji: '京', reading: 'きょう', meaning: 'capital', level: 'N4' },
    { kanji: '目', reading: 'め', meaning: 'eye, item', level: 'N4' },
    { kanji: '通', reading: 'つう', meaning: 'pass through, commute', level: 'N4' },
    { kanji: '言', reading: 'げん', meaning: 'say, word', level: 'N4' },
    { kanji: '理', reading: 'り', meaning: 'reason, logic', level: 'N4' },
    { kanji: '体', reading: 'たい', meaning: 'body', level: 'N4' },
    { kanji: '田', reading: 'た', meaning: 'rice field', level: 'N4' },
    { kanji: '主', reading: 'しゅ', meaning: 'main, lord', level: 'N4' },
    { kanji: '題', reading: 'だい', meaning: 'topic, subject', level: 'N4' },
    { kanji: '意', reading: 'い', meaning: 'idea, mind', level: 'N4' },
    { kanji: '不', reading: 'ふ', meaning: 'not, un-', level: 'N4' },
    { kanji: '作', reading: 'さく', meaning: 'make, production', level: 'N4' },
    { kanji: '用', reading: 'よう', meaning: 'use, employ', level: 'N4' },
    { kanji: '度', reading: 'ど', meaning: 'degree, time', level: 'N4' },
    { kanji: '強', reading: 'きょう', meaning: 'strong, strength', level: 'N4' },
    { kanji: '公', reading: 'こう', meaning: 'public, official', level: 'N4' },
    { kanji: '持', reading: 'じ', meaning: 'hold, have', level: 'N4' },
    { kanji: '野', reading: 'の', meaning: 'field, plain', level: 'N4' },
    { kanji: '以', reading: 'い', meaning: 'by means of, because', level: 'N4' },
    { kanji: '思', reading: 'し', meaning: 'think', level: 'N4' },
    { kanji: '家', reading: 'か', meaning: 'house, home', level: 'N4' },
    { kanji: '世', reading: 'せ', meaning: 'world, generation', level: 'N4' },
    { kanji: '多', reading: 'た', meaning: 'many, much', level: 'N4' },
    { kanji: '正', reading: 'せい', meaning: 'correct, justice', level: 'N4' },
    { kanji: '安', reading: 'あん', meaning: 'peaceful, cheap', level: 'N4' },
    { kanji: '院', reading: 'いん', meaning: 'institution, temple', level: 'N4' },
    { kanji: '心', reading: 'しん', meaning: 'heart, mind', level: 'N4' },
    { kanji: '界', reading: 'かい', meaning: 'world', level: 'N4' },
    { kanji: '教', reading: 'きょう', meaning: 'teach, religion', level: 'N4' },
    { kanji: '文', reading: 'ぶん', meaning: 'sentence, literature', level: 'N4' },
    { kanji: '元', reading: 'げん', meaning: 'origin, base', level: 'N4' }
  ];
}

// Function to create manual N4 word data
function createManualN4WordData() {
  return [
    { word: '会社', reading: 'かいしゃ', meaning: 'company, corporation', level: 'N4' },
    { word: '社会', reading: 'しゃかい', meaning: 'society', level: 'N4' },
    { word: '出発', reading: 'しゅっぱつ', meaning: 'departure', level: 'N4' },
    { word: '発表', reading: 'はっぴょう', meaning: 'announcement, publication', level: 'N4' },
    { word: '地下', reading: 'ちか', meaning: 'underground', level: 'N4' },
    { word: '場所', reading: 'ばしょ', meaning: 'place, location', level: 'N4' },
    { word: '新聞', reading: 'しんぶん', meaning: 'newspaper', level: 'N4' },
    { word: '立場', reading: 'たちば', meaning: 'position, standpoint', level: 'N4' },
    { word: '開始', reading: 'かいし', meaning: 'start, beginning', level: 'N4' },
    { word: '手紙', reading: 'てがみ', meaning: 'letter', level: 'N4' },
    { word: '力強い', reading: 'ちからづよい', meaning: 'powerful, strong', level: 'N4' },
    { word: '問題', reading: 'もんだい', meaning: 'problem, question', level: 'N4' },
    { word: '代わり', reading: 'かわり', meaning: 'substitute, replacement', level: 'N4' },
    { word: '明日', reading: 'あした', meaning: 'tomorrow', level: 'N4' },
    { word: '動物', reading: 'どうぶつ', meaning: 'animal', level: 'N4' },
    { word: '東京', reading: 'とうきょう', meaning: 'Tokyo', level: 'N4' },
    { word: '目的', reading: 'もくてき', meaning: 'purpose, goal', level: 'N4' },
    { word: '通学', reading: 'つうがく', meaning: 'commuting to school', level: 'N4' },
    { word: '言葉', reading: 'ことば', meaning: 'word, language', level: 'N4' },
    { word: '理由', reading: 'りゆう', meaning: 'reason', level: 'N4' },
    { word: '体育', reading: 'たいいく', meaning: 'physical education', level: 'N4' },
    { word: '田舎', reading: 'いなか', meaning: 'countryside', level: 'N4' },
    { word: '主人', reading: 'しゅじん', meaning: 'master, husband', level: 'N4' },
    { word: '題名', reading: 'だいめい', meaning: 'title', level: 'N4' },
    { word: '意味', reading: 'いみ', meaning: 'meaning', level: 'N4' },
    { word: '不便', reading: 'ふべん', meaning: 'inconvenient', level: 'N4' },
    { word: '作文', reading: 'さくぶん', meaning: 'composition, writing', level: 'N4' },
    { word: '用意', reading: 'ようい', meaning: 'preparation', level: 'N4' },
    { word: '強風', reading: 'きょうふう', meaning: 'strong wind', level: 'N4' },
    { word: '公園', reading: 'こうえん', meaning: 'park', level: 'N4' }
  ];
}

// Function to create a TypeScript file with JLPT kanji data
function createJlptKanjiFile(n5Kanji, n4Kanji, n3Kanji, n4Words) {
  const timestamp = new Date().toISOString();
  
  const fileContent = `/**
 * JLPT Kanji Data
 * This file contains kanji categorized by JLPT level
 * Updated on ${timestamp}
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

// N2 Kanji (placeholder)
export const N2_KANJI: KanjiData[] = [];

// N1 Kanji (placeholder)
export const N1_KANJI: KanjiData[] = [];

// Helper function to get JLPT level for a kanji
export function getJlptLevelForKanji(kanji: string): string | null {
  // Check N5 kanji
  if (N5_KANJI.some(k => k.kanji === kanji)) {
    return 'N5';
  }
  
  // Check N4 kanji
  if (N4_KANJI.some(k => k.kanji === kanji)) {
    return 'N4';
  }
  
  // Check N3 kanji
  if (N3_KANJI.some(k => k.kanji === kanji)) {
    return 'N3';
  }
  
  // Check N2 kanji
  if (N2_KANJI.some(k => k.kanji === kanji)) {
    return 'N2';
  }
  
  // Check N1 kanji
  if (N1_KANJI.some(k => k.kanji === kanji)) {
    return 'N1';
  }
  
  return null;
}

// All JLPT kanji combined
export const ALL_JLPT_KANJI = [...N5_KANJI, ...N4_KANJI, ...N3_KANJI, ...N2_KANJI, ...N1_KANJI];

// Common JLPT N5 words
export const N5_WORDS = [
  {
    "word": "日本",
    "reading": "にほん",
    "meaning": "Japan",
    "level": "N5"
  },
  {
    "word": "一日",
    "reading": "いちにち",
    "meaning": "one day",
    "level": "N5"
  },
  {
    "word": "国語",
    "reading": "こくご",
    "meaning": "national language",
    "level": "N5"
  },
  {
    "word": "人口",
    "reading": "じんこう",
    "meaning": "population",
    "level": "N5"
  },
  {
    "word": "今年",
    "reading": "ことし",
    "meaning": "this year",
    "level": "N5"
  }
];

// Common JLPT N4 words
export const N4_WORDS = ${JSON.stringify(n4Words, null, 2)};

// Common JLPT N3 words
export const N3_WORDS = [];

// All JLPT words combined
export const ALL_JLPT_WORDS = [...N5_WORDS, ...N4_WORDS, ...N3_WORDS];
`;

  fs.writeFileSync(path.join(dataDir, 'jlpt-kanji.ts'), fileContent);
  console.log('JLPT kanji data file created successfully.');
}

// Function to create a detailed kanji data file for N4
async function createN4KanjiDetailFile(n4Kanji) {
  console.log('Creating detailed N4 kanji data file...');
  
  const detailedKanjiList = [];
  
  // Process each kanji to get detailed information
  for (const kanjiItem of n4Kanji) {
    const kanji = kanjiItem.kanji;
    const detailedInfo = await fetchKanjiDetail(kanji);
    
    if (detailedInfo) {
      detailedKanjiList.push(detailedInfo);
    } else {
      // Create a basic detail object if API fetch fails
      detailedKanjiList.push({
        kanji: kanjiItem.kanji,
        reading: kanjiItem.reading,
        meaning: kanjiItem.meaning,
        jlptLevel: 'N4',
        tags: [],
        exampleSentences: [
          {
            japanese: `${kanjiItem.kanji}を勉強しましょう。`,
            english: `Let's study the kanji ${kanjiItem.kanji}.`
          }
        ],
        relatedWords: [],
        strokeOrder: {
          strokes: [],
          strokeCount: 0
        },
        studyTips: `Practice writing the kanji "${kanjiItem.kanji}" multiple times. Try to use it in sentences and recognize it in different contexts.`
      });
    }
    
    // Add a small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const timestamp = new Date().toISOString();
  
  const fileContent = `/**
 * Detailed N4 Kanji Data
 * This file contains detailed information for N4 kanji
 * Updated on ${timestamp}
 */

export interface KanjiDetail {
  kanji: string;
  reading: string;
  meaning: string;
  jlptLevel: string | null;
  tags: string[];
  exampleSentences: {
    japanese: string;
    english: string;
  }[];
  relatedWords: {
    word: string;
    reading: string;
    meaning: string;
  }[];
  strokeOrder: {
    strokes: string[];
    strokeCount: number;
  };
  studyTips: string;
}

export const N4_KANJI_DETAILS: KanjiDetail[] = ${JSON.stringify(detailedKanjiList, null, 2)};
`;

  fs.writeFileSync(path.join(dataDir, 'n4-kanji-details.ts'), fileContent);
  console.log('Detailed N4 kanji data file created successfully.');
}

// Function to create a complete N4 words file
function createN4WordsCompleteFile(n4Words) {
  const fileContent = `import { Word } from '@/types/word';

export const n4WordsComplete: Word[] = ${JSON.stringify(n4Words.map(word => ({
    kana: word.reading,
    kanji: word.word,
    type: "n", // Default to noun, would need more data for accurate type
    meaning: word.meaning
  })), null, 2)};
`;

  fs.writeFileSync(path.join(dataDir, 'n4-words-complete.ts'), fileContent);
  console.log('N4 words complete file created successfully.');
}

// Main function to run the script
async function main() {
  try {
    // Fetch JLPT N5 kanji
    const n5Kanji = await fetchJlptKanji('N5', 10);
    
    // Fetch JLPT N4 kanji
    const n4Kanji = await fetchJlptKanji('N4', 50);
    
    // Fetch JLPT N3 kanji
    const n3Kanji = await fetchJlptKanji('N3', 3);
    
    // Fetch JLPT N4 words
    const n4Words = await fetchJlptWords('N4', 30);
    
    // Create JLPT kanji data file
    createJlptKanjiFile(n5Kanji, n4Kanji, n3Kanji, n4Words);
    
    // Create detailed N4 kanji data file
    await createN4KanjiDetailFile(n4Kanji);
    
    // Create N4 words complete file
    createN4WordsCompleteFile(n4Words);
    
    console.log('All data files created successfully.');
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Run the script
main();
