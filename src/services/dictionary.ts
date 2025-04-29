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

export async function getExampleSentences(word: string): Promise<Array<{
  japanese: string;
  english: string;
}>> {
  try {
    // Fetch sentences through our API proxy
    const response = await fetch(`/api/examples?keyword=${encodeURIComponent(word)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch examples');
    }

    const data = await response.json();
    
    // Process and filter the results
    const sentences = data.results
      .slice(0, 3) // Limit to 3 examples
      .map((result: any) => ({
        japanese: result.text,
        english: result.translations[0]?.text || 'No translation available'
      }))
      .filter((example: any) => 
        // Filter out sentences that are too long or complex
        example.japanese.length < 30 && 
        !example.japanese.includes('〜') && 
        !example.japanese.includes('…')
      );

    return sentences.length > 0 ? sentences : [{
      japanese: `${word}の例文が見つかりませんでした。`,
      english: 'No example sentences found for this kanji.'
    }];
  } catch (error) {
    console.error('Error fetching example sentences:', error);
    return [{
      japanese: `${word}の例文が見つかりませんでした。`,
      english: 'No example sentences found for this kanji.'
    }];
  }
}
