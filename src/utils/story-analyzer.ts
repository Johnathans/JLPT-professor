import n5VocabPart1 from '@/data/n5-vocabulary-part1.json';
import n5VocabPart2 from '@/data/n5-vocabulary-part2.json';
import n5VocabPart3 from '@/data/n5-vocabulary-part3.json';
import n5VocabPart4 from '@/data/n5-vocabulary-part4.json';

// Combine all N5 vocabulary
const n5Vocabulary = [
  ...n5VocabPart1.vocabulary,
  ...n5VocabPart2.vocabulary,
  ...n5VocabPart3.vocabulary,
  ...n5VocabPart4.vocabulary
].filter(Boolean);

console.log('Combined vocabulary length:', n5Vocabulary.length);

interface StorySegment {
  text: string;
  isKanji?: boolean;
  reading?: string;
  id?: string;
}

interface StoryContent {
  type: string;
  text?: string;
  segments?: StorySegment[];
}

interface VocabItem {
  japanese: string;
  hiragana: string;
  english: string;
  occurrences: number;
}

interface KanjiItem {
  kanji: string;
  reading: string;
  occurrences: number;
}

interface StoryStats {
  n5_words: number;
  n5_kanji: number;
  unique_kanji: Set<string>;
  word_occurrences: Map<string, number>;
  vocabulary: VocabItem[];
  kanji: KanjiItem[];
}

export function analyzeStory(content: StoryContent[]): StoryStats {
  if (!content || !Array.isArray(content)) {
    console.error('Invalid content:', content);
    return {
      n5_words: 0,
      n5_kanji: 0,
      unique_kanji: new Set(),
      word_occurrences: new Map(),
      vocabulary: [],
      kanji: []
    };
  }

  const stats: StoryStats = {
    n5_words: 0,
    n5_kanji: 0,
    unique_kanji: new Set(),
    word_occurrences: new Map(),
    vocabulary: [],
    kanji: []
  };

  // Track kanji with readings
  const kanjiMap = new Map<string, { reading: string; occurrences: number }>();
  
  // Process kanji segments
  content.forEach(item => {
    if (item?.segments) {
      item.segments.forEach(segment => {
        if (segment?.isKanji && segment.text) {
          stats.unique_kanji.add(segment.text);
          
          // Track kanji with readings
          const existingKanji = kanjiMap.get(segment.text);
          if (existingKanji) {
            existingKanji.occurrences++;
          } else {
            kanjiMap.set(segment.text, {
              reading: segment.reading || '',
              occurrences: 1
            });
          }
        }
      });
    }
  });

  // Convert kanji map to array
  stats.kanji = Array.from(kanjiMap.entries()).map(([kanji, info]) => ({
    kanji,
    reading: info.reading,
    occurrences: info.occurrences
  }));

  stats.n5_kanji = stats.unique_kanji.size;
  console.log('Found kanji:', Array.from(stats.unique_kanji));

  // Get all text content from the story
  const textSegments: string[] = [];
  content.forEach(item => {
    if (item?.segments) {
      item.segments.forEach(segment => {
        if (segment?.text) {
          textSegments.push(segment.text);
        }
      });
    } else if (item?.text) {
      textSegments.push(item.text);
    }
  });

  const fullText = textSegments.join('');
  console.log('Full text:', fullText);

  // Create a map for faster word lookup
  const wordMap = new Map<string, { kanji: string; hiragana: string; english: string }>();
  n5Vocabulary.forEach(vocabItem => {
    if (vocabItem?.japanese) {
      wordMap.set(vocabItem.japanese, {
        kanji: vocabItem.japanese,
        hiragana: vocabItem.hiragana || '',
        english: vocabItem.english || ''
      });
    }
    if (vocabItem?.hiragana) {
      wordMap.set(vocabItem.hiragana, {
        kanji: vocabItem.japanese,
        hiragana: vocabItem.hiragana,
        english: vocabItem.english || ''
      });
    }
  });

  // Track found vocabulary
  const vocabMap = new Map<string, { hiragana: string; english: string; occurrences: number }>();

  // Search for words in the text
  let totalWords = 0;
  for (const [searchWord, forms] of wordMap) {
    try {
      // Escape special regex characters
      const escapedForm = searchWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedForm, 'g');
      const matches = fullText.match(regex);
      
      if (matches) {
        const count = matches.length;
        const word = forms.kanji || forms.hiragana;
        stats.word_occurrences.set(word, (stats.word_occurrences.get(word) || 0) + count);
        totalWords += count;
        
        // Track vocabulary
        vocabMap.set(word, {
          hiragana: forms.hiragana,
          english: forms.english,
          occurrences: count
        });
        
        console.log(`Found word "${searchWord}" (${word}) ${count} times`);
      }
    } catch (e) {
      console.error(`Error matching word "${searchWord}":`, e);
    }
  }

  // Convert vocab map to array
  stats.vocabulary = Array.from(vocabMap.entries()).map(([word, info]) => ({
    japanese: word,
    hiragana: info.hiragana,
    english: info.english,
    occurrences: info.occurrences
  }));

  stats.n5_words = totalWords;
  console.log('Total N5 words:', totalWords);
  console.log('Word occurrences:', Object.fromEntries(stats.word_occurrences));

  return stats;
}

export function getStoryReadingTime(content: StoryContent[]): number {
  if (!content || !Array.isArray(content)) {
    return 0;
  }

  // Average reading speed for N5 level Japanese (characters per minute)
  const N5_READING_SPEED = 100;

  // Count total characters in the story
  const totalChars = content
    .map(item => {
      if (!item) return 0;
      if (item.segments) {
        return item.segments
          .filter(Boolean)
          .map(seg => (seg.text || '').length)
          .reduce((a, b) => a + b, 0);
      }
      return (item.text || '').length;
    })
    .reduce((a, b) => a + b, 0);

  console.log('Total characters:', totalChars);
  return Math.ceil(totalChars / N5_READING_SPEED);
}
