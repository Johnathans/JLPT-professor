import { Word } from '@/types';
import { n5Words } from './n5-words';

// Higher level words (N4-N1)
const otherWords: Word[] = [
  {
    id: 'jouzu',
    word: '上手',
    reading: 'じょうず',
    meanings: ['skillful', 'good at', 'proficient'],
    jlptLevel: 'N4',
    examples: [
      {
        japanese: '日本語が上手ですね。',
        romaji: 'Nihongo ga jouzu desu ne.',
        english: 'Your Japanese is good.'
      }
    ]
  },
  {
    id: 'kekkou',
    word: '結構',
    reading: 'けっこう',
    meanings: ['quite', 'fairly', 'well', 'fine'],
    jlptLevel: 'N3',
    examples: [
      {
        japanese: 'それは結構です。',
        romaji: 'Sore wa kekkou desu.',
        english: "That's fine."
      }
    ]
  }
];

export const words: Word[] = [...n5Words, ...otherWords];
