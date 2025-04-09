import { Word } from '@/types/word';

export const n1KanjiComplete: Word[] = [
  {
    id: 'n1-kanji-1',
    kanji: '憂',
    kana: 'うれ.える',
    meaning: 'worry, grief, melancholy',
    type: 'verb',
    examples: [
      {
        japanese: '彼は将来を憂えている。',
        english: 'He is worried about the future.'
      }
    ]
  },
  {
    id: 'n1-kanji-2',
    kanji: '鬱',
    kana: 'うつ',
    meaning: 'depression, gloom, stagnation',
    type: 'noun',
    examples: [
      {
        japanese: '鬱は深刻な病気です。',
        english: 'Depression is a serious illness.'
      }
    ]
  },
  {
    id: 'n1-kanji-3',
    kanji: '抽',
    kana: 'ちゅう',
    meaning: 'abstract, extract, draw out',
    type: 'noun',
    examples: [
      {
        japanese: '抽選で当選者を決めます。',
        english: 'The winner will be decided by drawing lots.'
      }
    ]
  }
];

export default n1KanjiComplete;
