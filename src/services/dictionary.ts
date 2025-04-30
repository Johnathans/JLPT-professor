interface JishoResponse {
  data: {
    japanese: {
      word: string;
      reading: string;
    }[];
    senses: {
      english_definitions: string[];
      parts_of_speech: string[];
      tags: string[];
      see_also: string[];
      antonyms: string[];
      source: string[];
      info: string[];
    }[];
    tags: string[];
    is_common: boolean;
    jlpt: string[];
  }[];
}

interface KanjiResponse {
  grade?: number;
  stroke_count?: number;
  meanings?: string[];
  kun_readings?: string[];
  on_readings?: string[];
  name_readings?: string[];
  jlpt?: number;
  unicode?: string;
}

interface KanjiExamples {
  examples: {
    [key: string]: Array<{
      japanese: string;
      english: string;
    }>;
  };
}

interface ExampleData {
  examples: {
    [key: string]: Array<{
      japanese: string;
      english: string;
    }>;
  };
}

export async function searchWord(word: string): Promise<JishoResponse> {
  const response = await fetch(`/api/dictionary?keyword=${encodeURIComponent(word)}&type=word`);
  if (!response.ok) {
    console.error(`Failed to fetch word data: ${response.status} ${response.statusText}`);
    throw new Error('Failed to fetch word data');
  }
  return response.json();
}

export async function getKanjiDetails(kanji: string): Promise<KanjiResponse | null> {
  try {
    const response = await fetch(`/api/dictionary?keyword=${encodeURIComponent(kanji)}&type=kanji`);
    if (!response.ok) {
      console.warn(`Failed to fetch kanji data: ${response.status} ${response.statusText}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.warn(`Error fetching kanji data for ${kanji}:`, error);
    return null;
  }
}

import { getJlptLevelForKanji } from '@/data/n5-kanji-complete';

// Import all example files
import n5Examples from '@/data/examples/n5/examples.json';
import n4Examples from '@/data/examples/n4/examples.json';
import n3Examples from '@/data/examples/n3/examples.json';
import n2Examples from '@/data/examples/n2/examples.json';
import n1Examples from '@/data/examples/n1/examples.json';

export async function getExampleSentences(word: string, forcedLevel?: string): Promise<Array<{
  japanese: string;
  english: string;
}>> {
  try {
    // If a level is forced (e.g. we're on an N2 page), use that
    // Otherwise try to detect the level
    const level = forcedLevel || getJlptLevelForKanji(word);
    
    // Select the appropriate example file based on level
    let examples: Array<{ japanese: string; english: string; }> | undefined;
    switch (level) {
      case 'N5':
        examples = (n5Examples as ExampleData).examples[word];
        break;
      case 'N4':
        examples = (n4Examples as ExampleData).examples[word];
        break;
      case 'N3':
        examples = (n3Examples as ExampleData).examples[word];
        break;
      case 'N2':
        examples = (n2Examples as ExampleData).examples[word];
        break;
      case 'N1':
        examples = (n1Examples as ExampleData).examples[word];
        break;
      default:
        examples = undefined;
    }

    if (examples && examples.length > 0) {
      return examples;
    }

    // If no examples found, return a default message
    return [{
      japanese: `${word}の例文が見つかりませんでした。`,
      english: 'No example sentences found for this kanji.'
    }];
  } catch (err: any) {
    console.error('Error getting example sentences:', err);
    return [{
      japanese: `${word}の例文が見つかりませんでした。`,
      english: 'No example sentences found for this kanji.'
    }];
  }
}
