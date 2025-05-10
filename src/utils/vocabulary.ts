export interface VocabularyWord {
  kana: string;
  kanji?: string;
  meaning: string;
  level: 'N1' | 'N2' | 'N3' | 'N4' | 'N5';
}

export async function loadVocabularyForLevel(level: 'N1' | 'N2' | 'N3' | 'N4' | 'N5'): Promise<VocabularyWord[]> {
  try {
    const response = await fetch(`/api/vocabulary/${level}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.words;
  } catch (error) {
    console.error(`Error loading vocabulary for level ${level}:`, error);
    return [];
  }
}

export function getRandomWords(words: VocabularyWord[], count: number): VocabularyWord[] {
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateChoices(correctWord: VocabularyWord, allWords: VocabularyWord[], count: number): VocabularyWord[] {
  // Get random words excluding the correct one
  const otherWords = allWords.filter(w => w !== correctWord);
  const wrongChoices = getRandomWords(otherWords, count - 1);
  
  // Add correct word and shuffle
  const choices = [...wrongChoices, correctWord];
  return choices.sort(() => Math.random() - 0.5);
}
