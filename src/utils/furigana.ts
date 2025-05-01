/**
 * Convert text with Japanese parentheses notation to HTML ruby tags
 * Example input: 林（はやし）さん
 * Example output: <ruby>林<rp>(</rp><rt>はやし</rt><rp>)</rp></ruby>さん
 */
export function convertToFurigana(text: string): string {
  // Match kanji followed by reading in parentheses
  // Using Japanese parentheses: （）
  const pattern = /([一-龯々]+)（([ぁ-んー]+)）/g;
  
  return text.replace(pattern, (match, kanji, reading) => {
    return `<ruby>${kanji}<rp>(</rp><rt>${reading}</rt><rp>)</rp></ruby>`;
  });
}

/**
 * Add furigana readings to Japanese text using Jisho API
 * This will look up each word and add the readings in parentheses
 */
export async function addReadings(text: string): Promise<string> {
  // First split into words (you might want to use a proper tokenizer later)
  const words = text.match(/[一-龯々]+/g) || [];
  let result = text;

  // Look up each word
  for (const word of words) {
    try {
      const response = await fetch(`/api/jisho?keyword=${encodeURIComponent(word)}`);
      const data = await response.json();
      
      if (data.data?.[0]?.japanese?.[0]) {
        const { word: kanji, reading } = data.data[0].japanese[0];
        if (kanji && reading) {
          // Replace the word with word + reading in parentheses
          result = result.replace(kanji, `${kanji}（${reading}）`);
        }
      }
    } catch (error) {
      console.error('Error getting reading for word:', word, error);
    }
  }

  return result;
}
