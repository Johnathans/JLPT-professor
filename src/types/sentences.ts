export interface ExampleSentence {
  japanese: string;
  furigana: string;
  english: string;
  grammarPoints: string[];
  vocabulary: Array<{
    word: string;
    reading: string;
  }>;
}

export interface KanjiSentences {
  kanji: string;
  sentences: ExampleSentence[];
}
