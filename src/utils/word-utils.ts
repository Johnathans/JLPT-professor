import { Word } from '@/types/word';

/**
 * Find words related to the given word based on shared kanji characters
 * @param word The word to find related words for
 * @param wordList The list of words to search through
 * @param maxResults Maximum number of related words to return (default: 6)
 * @returns Array of related words
 */
export function findRelatedWords(word: Word, wordList: Word[], maxResults: number = 6): Word[] {
  if (!word.kanji) return [];
  
  // Split the kanji into individual characters
  const kanjiChars = word.kanji.split('');
  
  // Find words that share at least one kanji character
  const relatedWords = wordList.filter(w => {
    // Skip the current word
    if (w.id === word.id) return false;
    
    // Skip words without kanji
    if (!w.kanji) return false;
    
    // Check if any kanji character matches
    return kanjiChars.some(char => w.kanji?.includes(char));
  });
  
  // Sort by relevance (number of shared kanji characters)
  relatedWords.sort((a, b) => {
    const aSharedCount = kanjiChars.filter(char => a.kanji?.includes(char)).length;
    const bSharedCount = kanjiChars.filter(char => b.kanji?.includes(char)).length;
    
    return bSharedCount - aSharedCount;
  });
  
  // Return limited number of results
  return relatedWords.slice(0, maxResults);
}

/**
 * Get the type description for a word based on its type code
 * @param typeCode The type code from the word data (e.g., "u-v", "i-adj")
 * @returns Human-readable description of the word type
 */
export function getWordTypeDescription(typeCode: string): string {
  const typeLower = typeCode.toLowerCase();
  
  if (typeLower.includes('u-v')) {
    return 'Godan Verb (う-Verb)';
  } else if (typeLower.includes('ru-v')) {
    return 'Ichidan Verb (る-Verb)';
  } else if (typeLower.includes('i-adj')) {
    return 'い-Adjective';
  } else if (typeLower.includes('na-adj') || typeLower.includes('adj-na')) {
    return 'な-Adjective';
  } else if (typeLower.includes('n')) {
    return 'Noun';
  } else if (typeLower.includes('adv')) {
    return 'Adverb';
  } else if (typeLower.includes('exp')) {
    return 'Expression';
  } else if (typeLower.includes('prt')) {
    return 'Particle';
  } else if (typeLower.includes('int')) {
    return 'Interjection';
  } else if (typeLower.includes('conj')) {
    return 'Conjunction';
  } else if (typeLower.includes('pref')) {
    return 'Prefix';
  } else if (typeLower.includes('suf')) {
    return 'Suffix';
  } else {
    return 'Other';
  }
}

/**
 * Format a Japanese date string
 * @param dateStr Date string in YYYY-MM-DD format
 * @returns Formatted date string
 */
export function formatJapaneseDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/**
 * Get JLPT level description
 * @param level JLPT level (N1-N5)
 * @returns Description of the JLPT level
 */
export function getJlptLevelDescription(level: string): string {
  switch (level.toUpperCase()) {
    case 'N5':
      return 'N5 (Beginner)';
    case 'N4':
      return 'N4 (Basic)';
    case 'N3':
      return 'N3 (Intermediate)';
    case 'N2':
      return 'N2 (Advanced)';
    case 'N1':
      return 'N1 (Expert)';
    default:
      return level;
  }
}
