import { NextRequest, NextResponse } from 'next/server';
import { ALL_JLPT_KANJI } from '@/utils/jlpt-utils';
import { n5WordsComplete as N5_WORDS } from '@/data/n5-words-complete';
import { n4WordsComplete as N4_WORDS } from '@/data/n4-words-complete';

// Cache for API responses to reduce API calls
const apiCache: Record<string, any> = {};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const jlpt = searchParams.get('jlpt');
  const kanji = searchParams.get('kanji');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;

  try {
    let response;

    // Handle JLPT level search
    if (jlpt) {
      const cacheKey = `jlpt-${jlpt}-${limit}`;
      if (apiCache[cacheKey]) {
        return NextResponse.json(apiCache[cacheKey]);
      }

      const url = `https://jisho.org/api/v1/search/words?keyword=%23jlpt-${jlpt.toLowerCase()}&page=1`;
      response = await fetch(url);
      
      if (!response.ok) {
        // Fallback to local data
        const localData = getLocalJlptWords(jlpt, limit);
        if (localData) {
          apiCache[cacheKey] = localData;
          return NextResponse.json(localData);
        }
        
        throw new Error(`Jisho API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Limit the number of results
      if (data.data && data.data.length > limit) {
        data.data = data.data.slice(0, limit);
      }
      
      apiCache[cacheKey] = data;
      return NextResponse.json(data);
    }
    
    // Handle kanji search
    if (kanji) {
      const cacheKey = `kanji-${kanji}`;
      if (apiCache[cacheKey]) {
        return NextResponse.json(apiCache[cacheKey]);
      }

      const url = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(kanji)}%20%23kanji`;
      response = await fetch(url);
      
      if (!response.ok) {
        // Fallback to local data
        const localData = getLocalKanjiData(kanji);
        if (localData) {
          apiCache[cacheKey] = localData;
          return NextResponse.json(localData);
        }
        
        throw new Error(`Jisho API error: ${response.status}`);
      }
      
      const data = await response.json();
      apiCache[cacheKey] = data;
      return NextResponse.json(data);
    }
    
    // Handle keyword search
    if (keyword) {
      const cacheKey = `keyword-${keyword}`;
      if (apiCache[cacheKey]) {
        return NextResponse.json(apiCache[cacheKey]);
      }

      const url = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(keyword)}`;
      response = await fetch(url);
      
      if (!response.ok) {
        // Fallback to local data
        const localData = getLocalWordData(keyword);
        if (localData) {
          apiCache[cacheKey] = localData;
          return NextResponse.json(localData);
        }
        
        throw new Error(`Jisho API error: ${response.status}`);
      }
      
      const data = await response.json();
      apiCache[cacheKey] = data;
      return NextResponse.json(data);
    }

    // No parameters provided
    return NextResponse.json({ error: 'No search parameters provided' }, { status: 400 });
  } catch (error: any) {
    console.error('Jisho API error:', error);
    
    // Check if we have fallback data for the request
    if (keyword) {
      const localData = getLocalWordData(keyword);
      if (localData) {
        return NextResponse.json(localData);
      }
    }
    
    if (jlpt) {
      const localData = getLocalJlptWords(jlpt, limit);
      if (localData) {
        return NextResponse.json(localData);
      }
    }
    
    if (kanji) {
      const localData = getLocalKanjiData(kanji);
      if (localData) {
        return NextResponse.json(localData);
      }
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data from Jisho API' },
      { status: 500 }
    );
  }
}

/**
 * Get local JLPT words data
 */
function getLocalJlptWords(level: string, limit: number) {
  const levelNumber = level.replace('n', '').trim();
  
  if (levelNumber === '5') {
    const words = N5_WORDS.slice(0, limit).map(word => ({
      japanese: [{ word: word.kanji || word.kana, reading: word.kana }],
      senses: [{ english_definitions: [word.meaning], parts_of_speech: ['Noun'] }],
      jlpt: [`jlpt-n5`]
    }));
    
    return { data: words };
  }
  
  if (levelNumber === '4') {
    const words = N4_WORDS.slice(0, limit).map(word => ({
      japanese: [{ word: word.kanji || word.kana, reading: word.kana }],
      senses: [{ english_definitions: [word.meaning], parts_of_speech: ['Noun'] }],
      jlpt: [`jlpt-n4`]
    }));
    
    return { data: words };
  }
  
  return null;
}

/**
 * Get local kanji data
 */
function getLocalKanjiData(kanji: string) {
  const kanjiData = ALL_JLPT_KANJI.find(k => k.kanji === kanji);
  
  if (kanjiData) {
    // Handle both types of KanjiData interfaces
    const reading = 'reading' in kanjiData ? kanjiData.reading : 
                   (kanjiData.onyomi && kanjiData.onyomi.length > 0 ? kanjiData.onyomi[0] : '');
    
    const meaning = 'meaning' in kanjiData && typeof kanjiData.meaning === 'string' ? 
                   kanjiData.meaning : 
                   (Array.isArray(kanjiData.meaning) && kanjiData.meaning.length > 0 ? 
                   kanjiData.meaning[0] : '');
    
    return {
      data: [{
        japanese: [{ word: kanjiData.kanji, reading: reading }],
        senses: [{ english_definitions: [meaning], parts_of_speech: ['Kanji'] }],
        jlpt: [`jlpt-n5`]
      }]
    };
  }
  
  return null;
}

/**
 * Get local word data
 */
function getLocalWordData(word: string) {
  // Check if it's a common word
  const n5Word = N5_WORDS.find(w => (w.kanji && w.kanji === word) || w.kana === word);
  if (n5Word) {
    return {
      data: [{
        japanese: [{ word: n5Word.kanji || n5Word.kana, reading: n5Word.kana }],
        senses: [{ english_definitions: [n5Word.meaning], parts_of_speech: ['Noun'] }],
        jlpt: [`jlpt-n5`]
      }]
    };
  }
  
  const n4Word = N4_WORDS.find(w => (w.kanji && w.kanji === word) || w.kana === word);
  if (n4Word) {
    return {
      data: [{
        japanese: [{ word: n4Word.kanji || n4Word.kana, reading: n4Word.kana }],
        senses: [{ english_definitions: [n4Word.meaning], parts_of_speech: ['Noun'] }],
        jlpt: [`jlpt-n4`]
      }]
    };
  }
  
  // If not found in our database, return null
  return null;
}
