/**
 * Service for interacting with the Jisho API via our server-side API route
 */

interface JishoResponse {
  meta: {
    status: number;
  };
  data: JishoEntry[];
}

interface JishoEntry {
  slug: string;
  is_common: boolean;
  tags: string[];
  jlpt: string[];
  japanese: {
    word?: string;
    reading: string;
  }[];
  senses: {
    english_definitions: string[];
    parts_of_speech: string[];
    tags: string[];
    restrictions: string[];
    see_also: string[];
    antonyms: string[];
    source: string[];
    info: string[];
  }[];
  attribution: {
    jmdict: boolean;
    jmnedict: boolean;
    dbpedia: string | boolean;
  };
}

import { getJlptLevelForKanji, ALL_JLPT_KANJI } from '@/data/n5-kanji-complete';
import { n5WordsComplete as N5_WORDS } from '@/data/n5-words-complete';
import { n4WordsComplete as N4_WORDS } from '@/data/n4-words-complete';

// Cache for API responses to reduce API calls
const apiCache: Record<string, any> = {};

/**
 * Fetch data from the Jisho API through our proxy endpoint
 */
export async function fetchJishoData(word: string) {
  // Check cache first
  if (apiCache[word]) {
    return apiCache[word];
  }

  try {
    const response = await fetch(`/api/jisho?keyword=${encodeURIComponent(word)}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the response
    apiCache[word] = data;
    
    return data;
  } catch (error) {
    console.error('Error fetching Jisho data:', error);
    
    // Try to use local data as fallback
    const localData = getLocalFallbackData(word);
    if (localData) {
      return localData;
    }
    
    throw error;
  }
}

/**
 * Get local fallback data for common words and kanji
 */
function getLocalFallbackData(word: string) {
  // Check if it's a common word
  const n5Word = N5_WORDS.find(w => w.kanji === word || w.kana === word);
  if (n5Word) {
    return {
      data: [{
        japanese: [{ word: n5Word.kanji || n5Word.kana, reading: n5Word.kana }],
        senses: [{ english_definitions: [n5Word.meaning], parts_of_speech: [n5Word.type] }],
        jlpt: [`jlpt-n5`]
      }]
    };
  }
  
  const n4Word = N4_WORDS.find(w => w.kanji === word || w.kana === word);
  if (n4Word) {
    return {
      data: [{
        japanese: [{ word: n4Word.kanji || n4Word.kana, reading: n4Word.kana }],
        senses: [{ english_definitions: [n4Word.meaning], parts_of_speech: [n4Word.type] }],
        jlpt: [`jlpt-n4`]
      }]
    };
  }
  
  // If it's a single kanji, check our kanji data
  if (word.length === 1) {
    const kanjiData = ALL_JLPT_KANJI.find(k => k.kanji === word);
    if (kanjiData) {
      return {
        data: [{
          japanese: [{ word: kanjiData.kanji, reading: kanjiData.reading }],
          senses: [{ english_definitions: [kanjiData.meaning], parts_of_speech: ['Kanji'] }],
          jlpt: [`jlpt-${kanjiData.level.toLowerCase()}`]
        }]
      };
    }
  }
  
  return null;
}

/**
 * Get JLPT words for a specific level
 */
export async function getJlptWords(level: string, limit: number = 10) {
  // Check cache first
  const cacheKey = `jlpt-${level}-${limit}`;
  if (apiCache[cacheKey]) {
    return apiCache[cacheKey];
  }

  try {
    const response = await fetch(`/api/jisho?jlpt=${level}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching JLPT words: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the response
    apiCache[cacheKey] = data;
    
    return data;
  } catch (error) {
    console.error('Error fetching JLPT words:', error);
    
    // Try to use local data as fallback
    const localData = getLocalFallbackJlptWords(level, limit);
    if (localData) {
      return localData;
    }
    
    throw error;
  }
}

/**
 * Get local fallback data for JLPT words
 */
function getLocalFallbackJlptWords(level: string, limit: number) {
  const levelNumber = level.replace('n', '').trim();
  
  if (levelNumber === '5') {
    const words = N5_WORDS.slice(0, limit).map(word => ({
      japanese: [{ word: word.kanji || word.kana, reading: word.kana }],
      senses: [{ english_definitions: [word.meaning], parts_of_speech: [word.type] }],
      jlpt: [`jlpt-n5`]
    }));
    
    return { data: words };
  }
  
  if (levelNumber === '4') {
    const words = N4_WORDS.slice(0, limit).map(word => ({
      japanese: [{ word: word.kanji || word.kana, reading: word.kana }],
      senses: [{ english_definitions: [word.meaning], parts_of_speech: [word.type] }],
      jlpt: [`jlpt-n4`]
    }));
    
    return { data: words };
  }
  
  return null;
}

/**
 * Get details for a specific kanji
 */
export async function getKanjiDetails(kanji: string) {
  // Check cache first
  const cacheKey = `kanji-${kanji}`;
  if (apiCache[cacheKey]) {
    return apiCache[cacheKey];
  }

  try {
    const response = await fetch(`/api/jisho?kanji=${encodeURIComponent(kanji)}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching kanji details: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the response
    apiCache[cacheKey] = data;
    
    return data;
  } catch (error) {
    console.error('Error fetching kanji details:', error);
    
    // Try to use local data as fallback
    const localData = getLocalFallbackDataForKanji(kanji);
    if (localData) {
      return localData;
    }
    
    throw error;
  }
}

/**
 * Get local fallback data for a specific kanji
 */
function getLocalFallbackDataForKanji(kanji: string) {
  const kanjiData = ALL_JLPT_KANJI.find(k => k.kanji === kanji);
  
  if (kanjiData) {
    return {
      data: {
        kanji: kanjiData.kanji,
        reading: kanjiData.reading,
        meaning: kanjiData.meaning,
        jlpt: kanjiData.level.toLowerCase()
      }
    };
  }
  
  return null;
}

/**
 * Get the JLPT level for a word
 */
export async function getJlptLevel(word: string): Promise<string | null> {
  try {
    // First check local data
    const localLevel = getLocalFallbackLevel(word);
    if (localLevel) {
      return localLevel;
    }
    
    // If not in local data, try API
    const data = await fetchJishoData(word);
    
    if (data && data.data && data.data.length > 0) {
      const jlpt = data.data[0].jlpt;
      if (jlpt && jlpt.length > 0) {
        return jlpt[0];
      }
    }
    
    // If the word contains multiple kanji, try to determine level based on individual kanji
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
    
    return null;
  } catch (error) {
    console.error('Error getting JLPT level:', error);
    
    // Try local fallback one more time
    const localLevel = getLocalFallbackLevel(word);
    if (localLevel) {
      return localLevel;
    }
    
    return null;
  }
}

/**
 * Get local fallback level for a specific kanji or word
 */
function getLocalFallbackLevel(word: string): string | null {
  // Check if it's a common word
  const n5Word = N5_WORDS.find(w => w.kanji === word || w.kana === word);
  if (n5Word) {
    return `jlpt-n5`;
  }
  
  const n4Word = N4_WORDS.find(w => w.kanji === word || w.kana === word);
  if (n4Word) {
    return `jlpt-n4`;
  }
  
  // If it's a single kanji, check our kanji data
  if (word.length === 1) {
    const kanjiLevel = getJlptLevelForKanji(word);
    if (kanjiLevel) {
      return `jlpt-${kanjiLevel.toLowerCase()}`;
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
  
  return null;
}
