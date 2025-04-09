/**
 * Service for interacting with the Jisho API via our server-side API route
 */

import { Word } from '@/types/word';
import { ALL_JLPT_KANJI, getJlptLevelForKanji } from '@/utils/jlpt-utils';

interface JishoResponse {
  meta: {
    status: number;
  };
  data: Array<{
    slug: string;
    japanese: Array<{
      word?: string;
      reading?: string;
    }>;
    senses: Array<{
      english_definitions: string[];
      parts_of_speech: string[];
    }>;
    jlpt: string[];
  }>;
}

/**
 * Search for a word on Jisho
 */
export async function searchWord(query: string): Promise<JishoResponse> {
  const url = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Jisho API error: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Mock a Jisho response for a given word
 */
export async function mockJishoResponse(word: Word): Promise<JishoResponse> {
  return {
    meta: { status: 200 },
    data: [{
      slug: word.kanji || word.kana,
      japanese: [{ 
        word: word.kanji || word.kana,
        reading: word.kana
      }],
      senses: [{ 
        english_definitions: [word.meaning], 
        parts_of_speech: [word.type] 
      }],
      jlpt: ['jlpt-n5']
    }]
  };
}

/**
 * Get details for a specific kanji
 */
export async function getKanjiDetails(kanji: string): Promise<{
  kanji: string;
  reading: string;
  meaning: string;
  jlpt: string;
}> {
  const url = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(kanji)}%20%23kanji`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Jisho API error: ${response.status}`);
  }
  
  const data: JishoResponse = await response.json();
  
  if (data.data.length === 0) {
    throw new Error(`No data found for kanji: ${kanji}`);
  }
  
  const firstResult = data.data[0];
  
  return {
    kanji: firstResult.japanese[0].word || '',
    reading: firstResult.japanese[0].reading || '',
    meaning: firstResult.senses[0].english_definitions.join('; '),
    jlpt: firstResult.jlpt[0] || ''
  };
}

/**
 * Get JLPT words for a specific level
 */
export async function getJlptWords(level: string, limit: number = 10): Promise<JishoResponse> {
  const levelNumber = level.replace(/[^0-9]/g, '');
  const url = `https://jisho.org/api/v1/search/words?keyword=%23jlpt-n${levelNumber}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Jisho API error: ${response.status}`);
  }
  
  const data: JishoResponse = await response.json();
  return {
    meta: data.meta,
    data: data.data.slice(0, limit)
  };
}

/**
 * Get the JLPT level for a word or kanji
 */
export async function getJlptLevel(word: string): Promise<string | null> {
  // If it's a single kanji, check our local data first
  if (word.length === 1) {
    const level = getJlptLevelForKanji(word);
    if (level) {
      return `jlpt-${level.toLowerCase()}`;
    }
  }

  // For multi-kanji words, try to determine level based on individual kanji
  if (word.length > 1) {
    let highestLevel = 5; // Start with N5 (lowest)
    let allKanjiHaveLevel = true;
    let hasKanji = false;
    
    for (const char of word) {
      // Skip non-kanji characters
      if (!/[\u4e00-\u9faf]/.test(char)) continue;
      
      hasKanji = true;
      const charLevel = getJlptLevelForKanji(char);
      if (!charLevel) {
        allKanjiHaveLevel = false;
        break;
      }
      
      const levelNum = parseInt(charLevel.substring(1));
      if (levelNum < highestLevel) {
        highestLevel = levelNum;
      }
    }
    
    if (hasKanji && allKanjiHaveLevel) {
      return `jlpt-n${highestLevel}`;
    }
  }

  // If we couldn't determine the level from local data, try the API
  try {
    const data = await searchWord(word);
    if (data.data.length > 0 && data.data[0].jlpt.length > 0) {
      return data.data[0].jlpt[0];
    }
  } catch (error) {
    console.error('Error getting JLPT level from API:', error);
  }

  return null;
}
