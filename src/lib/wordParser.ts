import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';
import { WordEntry } from '@/types/sentence';

/**
 * Parse a Japanese sentence into individual words with readings
 * @param text Japanese text to parse
 * @returns Array of WordEntry objects
 */
// Helper function to check if a string contains kanji
function containsKanji(str: string): boolean {
  // Kanji Unicode range: 4E00-9FFF
  return /[\u4E00-\u9FFF]/.test(str);
}

// Helper function to extract original text from the HTML
function extractOriginalText(html: string): string[] {
  // This is a simple approach - in a real implementation, you'd want to use a proper HTML parser
  const matches = html.match(/<ruby>([^<]+)<\/ruby>/g) || [];
  return matches.map(match => {
    // Extract the content between <ruby> and the first <rp>
    const content = match.replace(/<ruby>([^<]+)<rp>.*/, '$1');
    return content;
  });
}

// Function to get English translations for Japanese words
async function getEnglishTranslations(words: string[]): Promise<Record<string, string>> {
  const translations: Record<string, string> = {};
  
  try {
    // For each word, we'll make a request to Jisho API
    // In a real implementation, you might want to batch these requests
    for (const word of words) {
      if (!word || word.trim() === '') continue;
      
      try {
        // Use a simple approach for now - in production, you'd want to use a proper dictionary API
        // This is a placeholder - the actual implementation would depend on your available APIs
        translations[word] = await fetchTranslation(word);
      } catch (err) {
        console.error(`Error fetching translation for ${word}:`, err);
        translations[word] = ''; // Default to empty string if translation fails
      }
    }
  } catch (error) {
    console.error('Error getting translations:', error);
  }
  
  return translations;
}

// Placeholder function for fetching translations
// In a real implementation, you'd replace this with an actual API call
async function fetchTranslation(word: string): Promise<string> {
  // For now, return empty string - in a real implementation, you'd call a dictionary API
  return '';
}

export async function parseJapaneseText(text: string): Promise<WordEntry[]> {
  console.log('parseJapaneseText called with:', text);
  if (!text || text.trim() === '') {
    console.log('Empty text provided');
    return [];
  }
  
  try {
    // Create a new instance for each parse operation - this is important!
    console.log('Creating new Kuroshiro instance');
    const kuroshiro = new Kuroshiro();
    console.log('Initializing Kuroshiro with KuromojiAnalyzer');
    await kuroshiro.init(new KuromojiAnalyzer({ 
      dictPath: '/dict'
    }));
    console.log('Kuroshiro initialized successfully');
    
    // Get the original text (with kanji)
    const originalText = text;
    
    // Get the tokenized version with spaces
    console.log('Converting text to spaced format:', text);
    const spacedText = await kuroshiro.convert(text, {
      mode: "spaced",
      to: "hiragana"
    });
    console.log('Spaced text result:', spacedText);
    
    // Get the furigana version for readings
    console.log('Converting text to furigana format:', text);
    const furiganaHtml = await kuroshiro.convert(text, {
      mode: "furigana",
      to: "hiragana"
    });
    console.log('Furigana HTML result:', furiganaHtml);
    
    // Parse the spaced text to get individual words
    const words: WordEntry[] = [];
    
    if (typeof spacedText === 'string') {
      // Split by spaces to get individual words
      const readingTokens = spacedText.split(' ').filter(w => w.trim() !== '');
      console.log('Reading tokens from spaced text:', readingTokens);
      
      // Extract original tokens (with kanji) from the original text
      // This is a simplified approach - in a real implementation, you'd want to use a proper tokenizer
      const originalTokens = originalText.split('').reduce((acc, char, i) => {
        // If this is a new word or the first character
        if (i === 0 || char.match(/[\u3040-\u309F\u30A0-\u30FF]/) && originalText[i-1].match(/[\u4E00-\u9FFF]/)) {
          acc.push(char);
        } else {
          // Append to the last token
          acc[acc.length - 1] += char;
        }
        return acc;
      }, [] as string[]);
      
      console.log('Original tokens (approximate):', originalTokens);
      
      // For now, we'll use the reading tokens and try to match them with original tokens
      // In a real implementation, you'd want to use a proper tokenizer
      
      // Create word entries
      for (let i = 0; i < readingTokens.length; i++) {
        const reading = readingTokens[i];
        // Try to find a corresponding original token (with kanji)
        // This is a simplified approach and may not work perfectly
        const originalWord = i < originalTokens.length ? originalTokens[i] : reading;
        
        words.push({
          word: originalWord,
          reading: containsKanji(originalWord) ? reading : undefined,
          meaning: '' // We'll fill this in later
        });
      }
      
      // Try to get English translations for the words
      // This is a placeholder - in a real implementation, you'd use a proper dictionary API
      // const translations = await getEnglishTranslations(words.map(w => w.word));
      // words.forEach(word => {
      //   word.meaning = translations[word.word] || '';
      // });
    }

    return words;
  } catch (error) {
    console.error('Error parsing Japanese text:', error);
    // Re-throw with more helpful message
    if (error instanceof Error) {
      if (error.message.includes('Not Found')) {
        throw new Error('Dictionary files not found. Please ensure the /public/dict directory exists and contains Kuromoji dictionary files.');
      }
      throw error;
    }
    throw new Error('Unknown error parsing Japanese text');
  }
}
