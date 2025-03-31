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

export async function getExampleSentences(word: string): Promise<string[]> {
  // Note: This would use the Tatoeba API in production
  // For now, returning mock data
  return [
    `私は${word}が好きです。`,
    `彼は${word}を使います。`,
    `${word}はとても面白いです。`
  ];
}
