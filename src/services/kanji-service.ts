/**
 * Kanji Service - Provides stroke order images and kanji data
 * 
 * This service uses KanjiVG to fetch kanji stroke order SVGs.
 * KanjiVG is a project that provides SVG files for kanji characters.
 * https://github.com/KanjiVG/kanjivg
 */

/**
 * Interface for kanji data
 */
export interface KanjiDetails {
  found: boolean;
  kanji: string;
  strokeCount?: number;
  meaning?: string;
  svgUrl?: string;
  error?: string;
  onyomi?: string[];
  kunyomi?: string[];
  examples?: string[];
}

/**
 * Get the URL for a kanji stroke order SVG from KanjiVG
 * 
 * @param kanji The kanji character to get stroke order for
 * @returns The URL of the stroke order SVG
 */
export async function getKanjiVgUrl(kanji: string): Promise<string | null> {
  // Ensure we have a single kanji character
  if (!kanji || kanji.length === 0) {
    return null;
  }
  
  const singleKanji = kanji.charAt(0);
  const codePoint = singleKanji.codePointAt(0);
  
  if (!codePoint) {
    return null;
  }
  
  // Format the code point as a 5-digit hex string (padded with zeros)
  const hexCode = codePoint.toString(16).padStart(5, '0');
  
  // Use the KanjiVG GitHub raw content URL with the correct path format
  return `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hexCode}.svg`;
}

/**
 * Get kanji data including stroke order SVG URL
 * 
 * @param kanji The kanji character to look up
 * @returns Promise with kanji data
 */
export async function getKanjiData(kanji: string): Promise<KanjiDetails | null> {
  try {
    // Check if input is valid
    if (!kanji || kanji.length === 0) {
      return { 
        found: false,
        kanji: '',
        error: 'No kanji provided' 
      };
    }

    // Get the first character if multiple are provided
    const singleKanji = kanji.charAt(0);
    
    // Get the SVG URL
    const svgUrl = await getKanjiVgUrl(singleKanji);
    
    return {
      found: true,
      kanji: singleKanji,
      svgUrl: svgUrl || undefined
    };
  } catch (error) {
    console.error('Error fetching kanji data:', error);
    return { 
      found: false,
      kanji,
      error: 'Error fetching kanji data' 
    };
  }
}

export const kanjiService = {
  getKanjiData,
  getKanjiVgUrl,
  
  async getKanjiByLevel(level: string): Promise<KanjiDetails[]> {
    // Implementation
    return [];
  },
  
  async getKanjiBySlug(slug: string): Promise<KanjiDetails | null> {
    // Implementation
    return null;
  }
};
