import { Word } from '@/types/word';
import { n5WordsComplete } from '@/data/n5-words-complete';
import { n4WordsComplete } from '@/data/n4-words-complete';
import { getJlptLevel } from '@/services/jisho-service';

interface VocabMatch {
  kanji: string;
  kana: string;
  meaning: string;
}

interface StoryAnalysis {
  totalCharacters: number;
  uniqueCharacters: number;
  kanjiCount: number;
  uniqueKanji: string[];
  kanjiByLevel: {
    [key: string]: string[];
  };
  vocabulary: VocabMatch[];
  unknownWords: string[];
}

/**
 * Analyze Japanese text for kanji usage and vocabulary
 */
export async function analyzeStory(text: string): Promise<StoryAnalysis> {
  // Initialize analysis object
  const analysis: StoryAnalysis = {
    totalCharacters: 0,
    uniqueCharacters: 0,
    kanjiCount: 0,
    uniqueKanji: [],
    kanjiByLevel: {},
    vocabulary: [],
    unknownWords: []
  };

  // Early return for empty text
  if (!text) {
    return analysis;
  }

  // Count total characters
  analysis.totalCharacters = text.length;

  // Get unique characters
  const uniqueChars = Array.from(new Set(text));
  analysis.uniqueCharacters = uniqueChars.length;

  // Extract kanji characters
  const kanjiChars = uniqueChars.filter(char => /[\u4e00-\u9faf]/.test(char));
  analysis.kanjiCount = kanjiChars.length;
  analysis.uniqueKanji = kanjiChars;

  // Categorize kanji by JLPT level
  for (const kanji of kanjiChars) {
    const level = await getJlptLevel(kanji);
    if (level) {
      if (!analysis.kanjiByLevel[level]) {
        analysis.kanjiByLevel[level] = [];
      }
      analysis.kanjiByLevel[level].push(kanji);
    }
  }

  // Find vocabulary matches
  const words = [...n5WordsComplete, ...n4WordsComplete];
  const foundWords = new Set<string>();

  // First pass: Look for exact matches
  for (const vocabItem of words) {
    if (vocabItem.kanji && text.includes(vocabItem.kanji)) {
      foundWords.add(vocabItem.kanji);
      analysis.vocabulary.push({
        kanji: vocabItem.kanji,
        kana: vocabItem.kana || '',
        meaning: vocabItem.meaning || ''
      });
    }
    if (vocabItem.kana && text.includes(vocabItem.kana)) {
      foundWords.add(vocabItem.kana);
      analysis.vocabulary.push({
        kanji: vocabItem.kana,
        kana: vocabItem.kana,
        meaning: vocabItem.meaning || ''
      });
    }
  }

  // Find unknown words (sequences of kanji not in our vocabulary)
  const kanjiRegex = /[\u4e00-\u9faf]+/g;
  const kanjiSequences = text.match(kanjiRegex) || [];
  
  for (const sequence of kanjiSequences) {
    if (!foundWords.has(sequence)) {
      analysis.unknownWords.push(sequence);
    }
  }

  return analysis;
}
