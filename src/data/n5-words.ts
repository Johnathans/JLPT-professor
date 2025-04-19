import { Word } from '@/types';
import { n5WordsPartTwo } from './n5-words-2';
import { n5PlaceWords } from './n5-words-places';
import { n5EssentialWords } from './n5-words-essentials';

const n5WordsPartOne: Word[] = [
  {
    id: 'ichi',
    word: '一',
    reading: 'いち',
    meanings: ['one', '1'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '一時間',
        romaji: 'Ichi jikan',
        english: 'One hour'
      }
    ]
  },
  {
    id: 'ni',
    word: '二',
    reading: 'に',
    meanings: ['two', '2'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '二年生',
        romaji: 'Ni-nensei',
        english: 'Second-year student'
      }
    ]
  },
  {
    id: 'san',
    word: '三',
    reading: 'さん',
    meanings: ['three', '3'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '三回',
        romaji: 'San-kai',
        english: 'Three times'
      }
    ]
  },
  {
    id: 'watashi',
    word: '私',
    reading: 'わたし',
    meanings: ['I', 'me'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '私は学生です。',
        romaji: 'Watashi wa gakusei desu.',
        english: 'I am a student.'
      }
    ]
  },
  {
    id: 'anata',
    word: 'あなた',
    reading: 'あなた',
    meanings: ['you'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: 'あなたの名前は？',
        romaji: 'Anata no namae wa?',
        english: 'What is your name?'
      }
    ]
  },
  {
    id: 'kore',
    word: 'これ',
    reading: 'これ',
    meanings: ['this', 'this one'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: 'これは本です。',
        romaji: 'Kore wa hon desu.',
        english: 'This is a book.'
      }
    ]
  },
  {
    id: 'sore',
    word: 'それ',
    reading: 'それ',
    meanings: ['that', 'that one'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: 'それは何ですか？',
        romaji: 'Sore wa nan desu ka?',
        english: 'What is that?'
      }
    ]
  },
  {
    id: 'are',
    word: 'あれ',
    reading: 'あれ',
    meanings: ['that', 'that thing over there'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: 'あれは駅です。',
        romaji: 'Are wa eki desu.',
        english: 'That is the station.'
      }
    ]
  },
  {
    id: 'koko',
    word: 'ここ',
    reading: 'ここ',
    meanings: ['here', 'this place'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: 'ここは図書館です。',
        romaji: 'Koko wa toshokan desu.',
        english: 'This is the library.'
      }
    ]
  },
  {
    id: 'soko',
    word: 'そこ',
    reading: 'そこ',
    meanings: ['there', 'that place'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: 'そこに座ってください。',
        romaji: 'Soko ni suwatte kudasai.',
        english: 'Please sit there.'
      }
    ]
  },
  {
    id: 'asoko',
    word: 'あそこ',
    reading: 'あそこ',
    meanings: ['over there', 'that place over there'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: 'あそこにコンビニがあります。',
        romaji: 'Asoko ni konbini ga arimasu.',
        english: 'There is a convenience store over there.'
      }
    ]
  },
  {
    id: 'hon',
    word: '本',
    reading: 'ほん',
    meanings: ['book'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: 'この本は面白いです。',
        romaji: 'Kono hon wa omoshiroi desu.',
        english: 'This book is interesting.'
      }
    ]
  },
  {
    id: 'enpitsu',
    word: '鉛筆',
    reading: 'えんぴつ',
    meanings: ['pencil'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '鉛筆で書きます。',
        romaji: 'Enpitsu de kakimasu.',
        english: 'I write with a pencil.'
      }
    ]
  },
  {
    id: 'tsukue',
    word: '机',
    reading: 'つくえ',
    meanings: ['desk'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '机の上に本があります。',
        romaji: 'Tsukue no ue ni hon ga arimasu.',
        english: 'There is a book on the desk.'
      }
    ]
  },
  {
    id: 'isu',
    word: '椅子',
    reading: 'いす',
    meanings: ['chair'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '椅子に座ります。',
        romaji: 'Isu ni suwarimasu.',
        english: 'I sit on the chair.'
      }
    ]
  }
];

// Time-related words
const timeWords: Word[] = [
  {
    id: 'kyou',
    word: '今日',
    reading: 'きょう',
    meanings: ['today', 'this day'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '今日は晴れです。',
        romaji: 'Kyou wa hare desu.',
        english: 'Today is sunny.'
      }
    ]
  },
  {
    id: 'ashita',
    word: '明日',
    reading: 'あした',
    meanings: ['tomorrow'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '明日は雨です。',
        romaji: 'Ashita wa ame desu.',
        english: 'Tomorrow will be rainy.'
      }
    ]
  },
  {
    id: 'kinou',
    word: '昨日',
    reading: 'きのう',
    meanings: ['yesterday'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '昨日は忙しかったです。',
        romaji: 'Kinou wa isogashikatta desu.',
        english: 'Yesterday was busy.'
      }
    ]
  },
  {
    id: 'ima',
    word: '今',
    reading: 'いま',
    meanings: ['now', 'the present time'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '今何時ですか。',
        romaji: 'Ima nanji desu ka.',
        english: 'What time is it now?'
      }
    ]
  },
  {
    id: 'jikan',
    word: '時間',
    reading: 'じかん',
    meanings: ['time', 'hour'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '時間がありません。',
        romaji: 'Jikan ga arimasen.',
        english: 'There is no time.'
      }
    ]
  }
];

// Basic verbs
const basicVerbs: Word[] = [
  {
    id: 'iku',
    word: '行く',
    reading: 'いく',
    meanings: ['to go'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '学校に行きます。',
        romaji: 'Gakkou ni ikimasu.',
        english: 'I go to school.'
      }
    ]
  },
  {
    id: 'kuru',
    word: '来る',
    reading: 'くる',
    meanings: ['to come'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '友達が来ます。',
        romaji: 'Tomodachi ga kimasu.',
        english: 'My friend is coming.'
      }
    ]
  },
  {
    id: 'taberu',
    word: '食べる',
    reading: 'たべる',
    meanings: ['to eat'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '朝ごはんを食べます。',
        romaji: 'Asagohan wo tabemasu.',
        english: 'I eat breakfast.'
      }
    ]
  },
  {
    id: 'nomu',
    word: '飲む',
    reading: 'のむ',
    meanings: ['to drink'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '水を飲みます。',
        romaji: 'Mizu wo nomimasu.',
        english: 'I drink water.'
      }
    ]
  },
  {
    id: 'suru',
    word: 'する',
    reading: 'する',
    meanings: ['to do'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '宿題をします。',
        romaji: 'Shukudai wo shimasu.',
        english: 'I do homework.'
      }
    ]
  }
];

// Basic adjectives
const basicAdjectives: Word[] = [
  {
    id: 'ooi',
    word: '多い',
    reading: 'おおい',
    meanings: ['many', 'numerous'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '学生が多いです。',
        romaji: 'Gakusei ga ooi desu.',
        english: 'There are many students.'
      }
    ]
  },
  {
    id: 'sukunai',
    word: '少ない',
    reading: 'すくない',
    meanings: ['few', 'little', 'scarce'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '時間が少ないです。',
        romaji: 'Jikan ga sukunai desu.',
        english: 'There is little time.'
      }
    ]
  },
  {
    id: 'ii',
    word: 'いい',
    reading: 'いい',
    meanings: ['good', 'nice', 'fine'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: 'いい天気ですね。',
        romaji: 'Ii tenki desu ne.',
        english: 'Nice weather, isn\'t it?'
      }
    ]
  },
  {
    id: 'warui',
    word: '悪い',
    reading: 'わるい',
    meanings: ['bad', 'poor'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '天気が悪いです。',
        romaji: 'Tenki ga warui desu.',
        english: 'The weather is bad.'
      }
    ]
  },
  {
    id: 'atarashii',
    word: '新しい',
    reading: 'あたらしい',
    meanings: ['new'],
    jlptLevel: 'N5',
    examples: [
      {
        japanese: '新しい本を買いました。',
        romaji: 'Atarashii hon wo kaimashita.',
        english: 'I bought a new book.'
      }
    ]
  }
];

export const n5Words: Word[] = [
  ...n5WordsPartOne,
  ...n5WordsPartTwo,
  ...timeWords,
  ...basicVerbs,
  ...basicAdjectives,
  ...n5PlaceWords,
  ...n5EssentialWords
];
