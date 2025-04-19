/**
 * Detailed N4 Kanji Data
 * This file contains detailed information for N4 kanji
 * Updated on 2025-03-29T03:46:38.979Z
 */

export interface KanjiDetail {
  kanji: string;
  reading: string;
  meaning: string;
  jlptLevel: string | null;
  tags: string[];
  exampleSentences: {
    japanese: string;
    english: string;
  }[];
  relatedWords: {
    word: string;
    reading: string;
    meaning: string;
  }[];
  strokeOrder: {
    strokes: string[];
    strokeCount: number;
  };
  studyTips: string;
}

export const N4_KANJI_DETAILS: KanjiDetail[] = [
  {
    "kanji": "会",
    "reading": "かい",
    "meaning": "meeting, assembly, party, gathering, conference, athletic meet",
    "jlptLevel": "jlpt-n3",
    "tags": [
      "wanikani5"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "会",
        "reading": "え",
        "meaning": "gathering (esp. Buddhist, festive, etc.)"
      },
      {
        "word": "会社",
        "reading": "かいしゃ",
        "meaning": "company, corporation, firm"
      },
      {
        "word": "会議",
        "reading": "かいぎ",
        "meaning": "meeting, conference, session, assembly, council, convention, congress"
      },
      {
        "word": "会話",
        "reading": "かいわ",
        "meaning": "conversation, talk, chat"
      },
      {
        "word": "会議室",
        "reading": "かいぎしつ",
        "meaning": "conference room, council room"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"会\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "同",
    "reading": "どう",
    "meaning": "the same, the said",
    "jlptLevel": "jlpt-n1",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "同じ",
        "reading": "おなじ",
        "meaning": "same, identical, equal, alike, equivalent"
      },
      {
        "word": "同情",
        "reading": "どうじょう",
        "meaning": "sympathy, compassion, pity"
      },
      {
        "word": "同調",
        "reading": "どうちょう",
        "meaning": "conformity, alignment, agreement, sympathy, following suit"
      },
      {
        "word": "同志",
        "reading": "どうし",
        "meaning": "like-mindedness, (being of the) same mind, shared sentiment"
      },
      {
        "word": "同様",
        "reading": "どうよう",
        "meaning": "same, similar, (just) like, equal"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"同\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "事",
    "reading": "こと",
    "meaning": "thing, matter",
    "jlptLevel": "jlpt-n3",
    "tags": [
      "wanikani9"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "事",
        "reading": "ごと",
        "meaning": "nominalizing suffix"
      },
      {
        "word": "事",
        "reading": "じ",
        "meaning": "individual concrete phenomenon (as opposed to a general principle)"
      },
      {
        "word": "事故",
        "reading": "じこ",
        "meaning": "accident, incident, trouble"
      },
      {
        "word": "事実",
        "reading": "じじつ",
        "meaning": "fact, truth, reality"
      },
      {
        "word": "事務所",
        "reading": "じむしょ",
        "meaning": "office"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"事\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "社",
    "reading": "やしろ",
    "meaning": "(Shinto) shrine",
    "jlptLevel": "jlpt-n1",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "社",
        "reading": "しゃ",
        "meaning": "company, firm, office, association, society"
      },
      {
        "word": "社会",
        "reading": "しゃかい",
        "meaning": "society, public, community, the world"
      },
      {
        "word": "社説",
        "reading": "しゃせつ",
        "meaning": "editorial, leading article, leader"
      },
      {
        "word": "社会科学",
        "reading": "しゃかいかがく",
        "meaning": "social science"
      },
      {
        "word": "社長",
        "reading": "しゃちょう",
        "meaning": "company president, manager, director"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"社\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "発",
    "reading": "はつ",
    "meaning": "departure, departing from ..., leaving at (e.g. 8:30)",
    "jlptLevel": "jlpt-n1",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "発",
        "reading": "ハツ",
        "meaning": "green dragon tile"
      },
      {
        "word": "発音",
        "reading": "はつおん",
        "meaning": "pronunciation"
      },
      {
        "word": "発見",
        "reading": "はっけん",
        "meaning": "discovery, detection, finding"
      },
      {
        "word": "発明",
        "reading": "はつめい",
        "meaning": "invention"
      },
      {
        "word": "立つ",
        "reading": "たつ",
        "meaning": "to stand (up), to rise, to get to one's feet, to stand on end (e.g. of hairs), to stick up"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"発\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "者",
    "reading": "もの",
    "meaning": "person",
    "jlptLevel": "jlpt-n3",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "者",
        "reading": "しゃ",
        "meaning": "person, -er"
      },
      {
        "word": "者ども",
        "reading": "ものども",
        "meaning": "you"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"者\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "地",
    "reading": "ち",
    "meaning": "earth, ground, land, soil",
    "jlptLevel": "jlpt-n3",
    "tags": [
      "wanikani6"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "土",
        "reading": "つち",
        "meaning": "earth, soil, dirt, clay, mud"
      },
      {
        "word": "地",
        "reading": "じ",
        "meaning": "ground, land, earth, soil"
      },
      {
        "word": "地図",
        "reading": "ちず",
        "meaning": "map, atlas, chart, plan"
      },
      {
        "word": "地下鉄",
        "reading": "ちかてつ",
        "meaning": "subway, metro, underground (railway)"
      },
      {
        "word": "地震",
        "reading": "じしん",
        "meaning": "earthquake"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"地\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "業",
    "reading": "ぎょう",
    "meaning": "work, business, company, agency",
    "jlptLevel": null,
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "業",
        "reading": "わざ",
        "meaning": "deed, act, work, performance"
      },
      {
        "word": "業",
        "reading": "ごう",
        "meaning": "karma"
      },
      {
        "word": "業者",
        "reading": "ぎょうしゃ",
        "meaning": "trader, dealer, businessperson, company, vendor, supplier, manufacturer, maker, contractor"
      },
      {
        "word": "業績",
        "reading": "ぎょうせき",
        "meaning": "achievement, performance, results, work, contribution"
      },
      {
        "word": "業務",
        "reading": "ぎょうむ",
        "meaning": "business, work, operations, service, duties"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"業\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "場",
    "reading": "ば",
    "meaning": "place, spot, space",
    "jlptLevel": "jlpt-n3",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "場",
        "reading": "じょう",
        "meaning": "place, spot, grounds, arena, stadium, range, course"
      },
      {
        "word": "場所",
        "reading": "ばしょ",
        "meaning": "place, location, spot, position, area"
      },
      {
        "word": "場合",
        "reading": "ばあい",
        "meaning": "case, occasion, situation, circumstances"
      },
      {
        "word": "場面",
        "reading": "ばめん",
        "meaning": "scene, setting, place (where something happens), scenario, case"
      },
      {
        "word": "場内",
        "reading": "じょうない",
        "meaning": "in-house, (on) the grounds, (in) the premises, hall, theatre, theater"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"場\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "員",
    "reading": "いん",
    "meaning": "member",
    "jlptLevel": "jlpt-n1",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "員数",
        "reading": "いんずう",
        "meaning": "(total) number (of people or things), count, quota"
      },
      {
        "word": "員外",
        "reading": "いんがい",
        "meaning": "non-membership"
      },
      {
        "word": "員名",
        "reading": "いんめい",
        "meaning": "member name"
      },
      {
        "word": "員に備わるのみ",
        "reading": "いんにそなわるのみ",
        "meaning": "being a member of staff but useless as a worker"
      },
      {
        "word": "員林鎮",
        "reading": "",
        "meaning": "Yuanlin, Changhua"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"員\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "立つ",
    "reading": "たつ",
    "meaning": "to stand (up), to rise, to get to one's feet, to stand on end (e.g. of hairs), to stick up",
    "jlptLevel": "jlpt-n2",
    "tags": [
      "wanikani2"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "立派",
        "reading": "りっぱ",
        "meaning": "splendid, fine, handsome, elegant, imposing, prominent, impressive"
      },
      {
        "word": "立てる",
        "reading": "たてる",
        "meaning": "to stand up, to put up, to set up, to erect, to raise"
      },
      {
        "word": "立場",
        "reading": "たちば",
        "meaning": "position, situation"
      },
      {
        "word": "立ち上がる",
        "reading": "たちあがる",
        "meaning": "to stand up, to get up, to rise (to one's feet)"
      },
      {
        "word": "立ち止まる",
        "reading": "たちどまる",
        "meaning": "to stop (in one's tracks), to come to a stop, to halt, to pause, to stand still"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"立\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "開ける",
    "reading": "あける",
    "meaning": "to open (a door, etc.), to unwrap (e.g. parcel, package), to unlock",
    "jlptLevel": "jlpt-n3",
    "tags": [
      "wanikani10"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "開く",
        "reading": "ひらく",
        "meaning": "to open, to undo, to unseal, to unpack"
      },
      {
        "word": "開始",
        "reading": "かいし",
        "meaning": "start, commencement, beginning, initiation"
      },
      {
        "word": "開拓",
        "reading": "かいたく",
        "meaning": "reclamation (e.g. of wasteland), cultivation, development"
      },
      {
        "word": "開会",
        "reading": "かいかい",
        "meaning": "opening of a meeting"
      },
      {
        "word": "開放",
        "reading": "かいほう",
        "meaning": "opening (a door, window, etc.), leaving open"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"開\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "手",
    "reading": "て",
    "meaning": "hand, arm",
    "jlptLevel": "jlpt-n5",
    "tags": [
      "wanikani2"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "手紙",
        "reading": "てがみ",
        "meaning": "letter, note"
      },
      {
        "word": "手袋",
        "reading": "てぶくろ",
        "meaning": "glove, mitten, mitt"
      },
      {
        "word": "手首",
        "reading": "てくび",
        "meaning": "wrist"
      },
      {
        "word": "手前",
        "reading": "てまえ",
        "meaning": "before oneself, in front of one, nearby"
      },
      {
        "word": "手洗い",
        "reading": "てあらい",
        "meaning": "washing one's hands, water (or basin, etc.) for washing one's hands"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"手\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "力",
    "reading": "ちから",
    "meaning": "force, strength, might, vigour, vigor, energy",
    "jlptLevel": "jlpt-n4",
    "tags": [
      "wanikani1"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "力",
        "reading": "りょく",
        "meaning": "strength, power, proficiency, ability"
      },
      {
        "word": "力",
        "reading": "りき",
        "meaning": "strength, power, proficiency, ability"
      },
      {
        "word": "努める",
        "reading": "つとめる",
        "meaning": "to endeavor (to do), to endeavour, to try hard, to work hard, to strive, to make an effort, to exert oneself, to devote oneself, to be committed (to doing)"
      },
      {
        "word": "力強い",
        "reading": "ちからづよい",
        "meaning": "powerful, strong, forceful, vigorous"
      },
      {
        "word": "努めて",
        "reading": "つとめて",
        "meaning": "as much as possible, as far as possible, to the best of one's ability, diligently"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"力\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "問い",
    "reading": "とい",
    "meaning": "question, query",
    "jlptLevel": "jlpt-n3",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "問",
        "reading": "もん",
        "meaning": "counter for questions"
      },
      {
        "word": "問題",
        "reading": "もんだい",
        "meaning": "question (e.g. on a test), problem"
      },
      {
        "word": "問い合わせ",
        "reading": "といあわせ",
        "meaning": "inquiry, query, enquiry"
      },
      {
        "word": "問う",
        "reading": "とう",
        "meaning": "to ask, to inquire"
      },
      {
        "word": "問い合わせる",
        "reading": "といあわせる",
        "meaning": "to enquire, to inquire, to seek information"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"問\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "世",
    "reading": "よ",
    "meaning": "world, society, public",
    "jlptLevel": "jlpt-n1",
    "tags": [
      "wanikani4"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "代",
        "reading": "だい",
        "meaning": "charge, cost, price"
      },
      {
        "word": "代",
        "reading": "しろ",
        "meaning": "substitution"
      },
      {
        "word": "代理",
        "reading": "だいり",
        "meaning": "representation, agency, proxy"
      },
      {
        "word": "代名詞",
        "reading": "だいめいし",
        "meaning": "pronoun"
      },
      {
        "word": "代わり",
        "reading": "かわり",
        "meaning": "substitute, replacement, substituting, replacing"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"代\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "明",
    "reading": "みょう",
    "meaning": "vidya (wisdom)",
    "jlptLevel": null,
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "明",
        "reading": "めい",
        "meaning": "brightness"
      },
      {
        "word": "明",
        "reading": "さや",
        "meaning": "clearly, brightly"
      },
      {
        "word": "明",
        "reading": "みん",
        "meaning": "Ming dynasty (of China; 1368-1644)"
      },
      {
        "word": "明日",
        "reading": "あした",
        "meaning": "tomorrow"
      },
      {
        "word": "明るい",
        "reading": "あかるい",
        "meaning": "light, bright, well-lit, well-lighted"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"明\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "動",
    "reading": "どう",
    "meaning": "motion",
    "jlptLevel": null,
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "動物",
        "reading": "どうぶつ",
        "meaning": "animal"
      },
      {
        "word": "動物園",
        "reading": "どうぶつえん",
        "meaning": "zoo, zoological gardens"
      },
      {
        "word": "動詞",
        "reading": "どうし",
        "meaning": "verb"
      },
      {
        "word": "動機",
        "reading": "どうき",
        "meaning": "motive, incentive"
      },
      {
        "word": "動力",
        "reading": "どうりょく",
        "meaning": "power, motive power"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"動\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "都",
    "reading": "みやこ",
    "meaning": "capital (esp. Kyoto, Japan's former capital), seat of government",
    "jlptLevel": "jlpt-n3",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "京",
        "reading": "きょう",
        "meaning": "imperial capital (esp. Kyoto)"
      },
      {
        "word": "京都",
        "reading": "きょうと",
        "meaning": "Kyoto (city, prefecture)"
      },
      {
        "word": "京葉",
        "reading": "けいよう",
        "meaning": "Tokyo and Chiba"
      },
      {
        "word": "京劇",
        "reading": "きょうげき",
        "meaning": "classical Chinese opera"
      },
      {
        "word": "京阪",
        "reading": "けいはん",
        "meaning": "Kyoto and Osaka, Kyoto-Osaka area"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"京\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "目",
    "reading": "め",
    "meaning": "eye, eyeball",
    "jlptLevel": "jlpt-n5",
    "tags": [
      "wanikani2"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "目",
        "reading": "もく",
        "meaning": "order"
      },
      {
        "word": "目的",
        "reading": "もくてき",
        "meaning": "purpose, goal, aim, objective, intention"
      },
      {
        "word": "目標",
        "reading": "もくひょう",
        "meaning": "goal, target, aim, objective"
      },
      {
        "word": "目印",
        "reading": "めじるし",
        "meaning": "mark (for quick identification or recognition), sign"
      },
      {
        "word": "目指す",
        "reading": "めざす",
        "meaning": "to aim at (for, to do, to become), to try for, to have an eye on"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"目\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "通",
    "reading": "つう",
    "meaning": "authority, expert, connoisseur, well-informed person",
    "jlptLevel": "jlpt-n1",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "通学",
        "reading": "つうがく",
        "meaning": "commuting to school, school commute"
      },
      {
        "word": "通勤",
        "reading": "つうきん",
        "meaning": "commuting to work"
      },
      {
        "word": "通訳",
        "reading": "つうやく",
        "meaning": "interpretation (i.e. oral translation)"
      },
      {
        "word": "通貨",
        "reading": "つうか",
        "meaning": "currency"
      },
      {
        "word": "通路",
        "reading": "つうろ",
        "meaning": "passage, pathway, roadway, avenue, aisle"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"通\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "言",
    "reading": "げん",
    "meaning": "word, remark, statement",
    "jlptLevel": null,
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "言葉",
        "reading": "ことば",
        "meaning": "language, dialect"
      },
      {
        "word": "辞典",
        "reading": "じてん",
        "meaning": "dictionary, lexicon"
      },
      {
        "word": "言語",
        "reading": "げんご",
        "meaning": "language"
      },
      {
        "word": "言う",
        "reading": "いう",
        "meaning": "to say, to utter, to declare"
      },
      {
        "word": "言わば",
        "reading": "いわば",
        "meaning": "so to speak, so to call it, as it were"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"言\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "理",
    "reading": "り",
    "meaning": "reason, principle, logic",
    "jlptLevel": null,
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "理",
        "reading": "ことわり",
        "meaning": "reason, logic, sense, natural way of things"
      },
      {
        "word": "理解",
        "reading": "りかい",
        "meaning": "understanding, comprehension, appreciation"
      },
      {
        "word": "理想",
        "reading": "りそう",
        "meaning": "ideal, ideals"
      },
      {
        "word": "理由",
        "reading": "りゆう",
        "meaning": "reason, grounds, pretext, excuse, motive"
      },
      {
        "word": "理論",
        "reading": "りろん",
        "meaning": "theory"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"理\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "体",
    "reading": "からだ",
    "meaning": "body",
    "jlptLevel": "jlpt-n3",
    "tags": [
      "wanikani5",
      "wanikani8"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "体",
        "reading": "てい",
        "meaning": "appearance, air, condition, state, form"
      },
      {
        "word": "体",
        "reading": "たい",
        "meaning": "body, physique, posture"
      },
      {
        "word": "体温",
        "reading": "たいおん",
        "meaning": "body temperature"
      },
      {
        "word": "体育",
        "reading": "たいいく",
        "meaning": "physical education, PE, gym (class)"
      },
      {
        "word": "体操",
        "reading": "たいそう",
        "meaning": "gymnastics, physical exercises"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"体\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "田",
    "reading": "た",
    "meaning": "rice field",
    "jlptLevel": "jlpt-n3",
    "tags": [
      "wanikani2"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "田舎",
        "reading": "いなか",
        "meaning": "rural area, countryside, the sticks"
      },
      {
        "word": "田園",
        "reading": "でんえん",
        "meaning": "the country, countryside, rural districts"
      },
      {
        "word": "田んぼ",
        "reading": "たんぼ",
        "meaning": "paddy field, farm"
      },
      {
        "word": "鶴",
        "reading": "つる",
        "meaning": "crane (any bird of the family Gruidae, esp. the red-crowned crane, Grus japonensis)"
      },
      {
        "word": "田舎者",
        "reading": "いなかもの",
        "meaning": "person from the countryside, countryman, countryfolk, provincial person, bumpkin, hick, hillbilly, redneck"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"田\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "主人",
    "reading": "しゅじん",
    "meaning": "head (of a household), proprietor (of a store), proprietress, landlord, landlady",
    "jlptLevel": null,
    "tags": [
      "wanikani4"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "主",
        "reading": "あるじ",
        "meaning": "head (of a household), proprietor (of a store), proprietress, landlord, landlady, master (of a servant)"
      },
      {
        "word": "主",
        "reading": "ぬし",
        "meaning": "head (of a household, etc.), leader, master"
      },
      {
        "word": "主",
        "reading": "おも",
        "meaning": "chief, main, principal, important"
      },
      {
        "word": "主",
        "reading": "しゅ",
        "meaning": "(one's) master, (one's) employer, (one's) lord"
      },
      {
        "word": "主",
        "reading": "す",
        "meaning": "honorific (or familiar) suffix used after a name"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"主\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "題",
    "reading": "だい",
    "meaning": "title, subject, theme, topic",
    "jlptLevel": "jlpt-n3",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "題名",
        "reading": "だいめい",
        "meaning": "title, caption, heading"
      },
      {
        "word": "題材",
        "reading": "だいざい",
        "meaning": "subject, theme"
      },
      {
        "word": "題目",
        "reading": "だいもく",
        "meaning": "title, heading"
      },
      {
        "word": "題する",
        "reading": "だいする",
        "meaning": "to be titled (e.g. a book), to be named"
      },
      {
        "word": "題字",
        "reading": "だいじ",
        "meaning": "title lettering"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"題\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "意",
    "reading": "い",
    "meaning": "feelings, thoughts",
    "jlptLevel": null,
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "意味",
        "reading": "いみ",
        "meaning": "meaning, significance, sense"
      },
      {
        "word": "意志",
        "reading": "いし",
        "meaning": "will, volition, intention, intent, determination"
      },
      {
        "word": "意識",
        "reading": "いしき",
        "meaning": "consciousness"
      },
      {
        "word": "思う",
        "reading": "おもう",
        "meaning": "to think, to consider, to believe, to reckon"
      },
      {
        "word": "意見",
        "reading": "いけん",
        "meaning": "opinion, view, comment"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"意\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "不",
    "reading": "ふ",
    "meaning": "un-, non-",
    "jlptLevel": "jlpt-n3",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "無",
        "reading": "ぶ",
        "meaning": "un-, non-"
      },
      {
        "word": "不安",
        "reading": "ふあん",
        "meaning": "anxiety, uneasiness, worry, apprehension, fear, insecurity, suspense"
      },
      {
        "word": "不味い",
        "reading": "まずい",
        "meaning": "bad(-tasting), unpalatable, unsavoury, unsavory, awful, terrible, unpleasant"
      },
      {
        "word": "不便",
        "reading": "ふべん",
        "meaning": "inconvenience, inexpediency, unhandiness"
      },
      {
        "word": "不足",
        "reading": "ふそく",
        "meaning": "insufficiency, deficiency, shortage, lack, scarcity, deficit"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"不\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "作",
    "reading": "さく",
    "meaning": "work (e.g. of art), piece, production",
    "jlptLevel": "jlpt-n1",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "作文",
        "reading": "さくぶん",
        "meaning": "writing (an essay, prose, etc.), composition"
      },
      {
        "word": "作家",
        "reading": "さっか",
        "meaning": "author, writer, novelist, artist"
      },
      {
        "word": "作品",
        "reading": "さくひん",
        "meaning": "work (e.g. book, film, painting, composition), piece, production, opus"
      },
      {
        "word": "作業",
        "reading": "さぎょう",
        "meaning": "work, operation, task"
      },
      {
        "word": "作曲",
        "reading": "さっきょく",
        "meaning": "composition (of music), setting, writing music"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"作\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "用",
    "reading": "よう",
    "meaning": "business, task, errand, engagement",
    "jlptLevel": "jlpt-n4",
    "tags": [
      "wanikani3"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "用意",
        "reading": "ようい",
        "meaning": "preparation, arrangements, provision, getting ready, laying out (e.g. a meal)"
      },
      {
        "word": "用事",
        "reading": "ようじ",
        "meaning": "business, things to do, engagement, errand, affairs"
      },
      {
        "word": "用いる",
        "reading": "もちいる",
        "meaning": "to use, to make use of, to utilize, to utilise"
      },
      {
        "word": "用心",
        "reading": "ようじん",
        "meaning": "care, precaution, guarding, caution"
      },
      {
        "word": "用語",
        "reading": "ようご",
        "meaning": "term, terminology"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"用\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "度",
    "reading": "たび",
    "meaning": "time (three times, each time, etc.), times",
    "jlptLevel": "jlpt-n3",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "度",
        "reading": "ど",
        "meaning": "degree (angle, temperature, scale, etc.)"
      },
      {
        "word": "",
        "reading": "ど",
        "meaning": "extreme, ultra, mega, totally, very much, precisely, exactly"
      },
      {
        "word": "度々",
        "reading": "たびたび",
        "meaning": "often, again and again, over and over again, repeatedly, frequently"
      },
      {
        "word": "度胸",
        "reading": "どきょう",
        "meaning": "courage, bravery, pluck, nerve, grit, guts"
      },
      {
        "word": "度数",
        "reading": "どすう",
        "meaning": "frequency, number of times, incidence"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"度\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "強",
    "reading": "きょう",
    "meaning": "a little over, a little more than",
    "jlptLevel": null,
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "強盗",
        "reading": "ごうとう",
        "meaning": "robber, mugger"
      },
      {
        "word": "強い",
        "reading": "つよい",
        "meaning": "strong, potent, competent, domineering, tough"
      },
      {
        "word": "強化",
        "reading": "きょうか",
        "meaning": "strengthening, intensifying, reinforcement, enhancement, solidification"
      },
      {
        "word": "強制",
        "reading": "きょうせい",
        "meaning": "compulsion, coercion, forcing (to do), enforcement"
      },
      {
        "word": "強力",
        "reading": "きょうりょく",
        "meaning": "powerful, strong"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"強\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "公",
    "reading": "おおやけ",
    "meaning": "official, governmental, formal",
    "jlptLevel": "jlpt-n1",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "君",
        "reading": "きみ",
        "meaning": "you, buddy, pal"
      },
      {
        "word": "公",
        "reading": "こう",
        "meaning": "public affair, government matter, the state, the government, the public"
      },
      {
        "word": "公園",
        "reading": "こうえん",
        "meaning": "(public) park"
      },
      {
        "word": "公務員",
        "reading": "こうむいん",
        "meaning": "public employee, government employee, public-sector worker, public servant, civil servant"
      },
      {
        "word": "公平",
        "reading": "こうへい",
        "meaning": "fairness, impartiality, justice, objectivity"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"公\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "持",
    "reading": "じ",
    "meaning": "draw (in go, poetry contest, etc.), tie",
    "jlptLevel": null,
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "持つ",
        "reading": "もつ",
        "meaning": "to hold (in one's hand), to take, to carry"
      },
      {
        "word": "持ち上げる",
        "reading": "もちあげる",
        "meaning": "to elevate, to raise, to lift up"
      },
      {
        "word": "持参",
        "reading": "じさん",
        "meaning": "bringing, taking, carrying"
      },
      {
        "word": "持ち",
        "reading": "もち",
        "meaning": "having, holding, possessing, owning, using, holder, owner, user"
      },
      {
        "word": "齎す",
        "reading": "もたらす",
        "meaning": "to bring (news, knowledge, etc.), to introduce"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"持\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "野",
    "reading": "の",
    "meaning": "plain, field",
    "jlptLevel": "jlpt-n3",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "野菜",
        "reading": "やさい",
        "meaning": "vegetable"
      },
      {
        "word": "野党",
        "reading": "やとう",
        "meaning": "opposition party, the opposition"
      },
      {
        "word": "野心",
        "reading": "やしん",
        "meaning": "ambition, aspiration"
      },
      {
        "word": "野生",
        "reading": "やせい",
        "meaning": "wild"
      },
      {
        "word": "野外",
        "reading": "やがい",
        "meaning": "outdoors, outside, open air"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"野\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "以上",
    "reading": "いじょう",
    "meaning": "not less than ..., ... and over, ... and above, ... and upwards, ... or more",
    "jlptLevel": "jlpt-n4",
    "tags": [
      "wanikani7"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "以内",
        "reading": "いない",
        "meaning": "within, inside of, less than"
      },
      {
        "word": "以下",
        "reading": "いか",
        "meaning": "not exceeding ..., not more than ..., ... and under, ... and below, ... or fewer"
      },
      {
        "word": "以外",
        "reading": "いがい",
        "meaning": "excluding, except (for), apart from, other than, besides, in addition to"
      },
      {
        "word": "以前",
        "reading": "いぜん",
        "meaning": "before, prior to, ago"
      },
      {
        "word": "以来",
        "reading": "いらい",
        "meaning": "since, henceforth"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"以\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "思う",
    "reading": "おもう",
    "meaning": "to think, to consider, to believe, to reckon",
    "jlptLevel": "jlpt-n4",
    "tags": [
      "wanikani6"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "思い出す",
        "reading": "おもいだす",
        "meaning": "to recall, to remember, to recollect"
      },
      {
        "word": "思考",
        "reading": "しこう",
        "meaning": "thought, consideration, thinking"
      },
      {
        "word": "思想",
        "reading": "しそう",
        "meaning": "thought, idea, ideology"
      },
      {
        "word": "思い出",
        "reading": "おもいで",
        "meaning": "memories, recollections, reminiscence"
      },
      {
        "word": "思わず",
        "reading": "おもわず",
        "meaning": "unconsciously, involuntarily, instinctively, reflexively, spontaneously, unintentionally, in spite of oneself"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"思\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "家",
    "reading": "いえ",
    "meaning": "house, residence, dwelling, home",
    "jlptLevel": "jlpt-n5",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "家",
        "reading": "うち",
        "meaning": "one's house, one's home, one's family, one's household"
      },
      {
        "word": "家",
        "reading": "け",
        "meaning": "house, family"
      },
      {
        "word": "内",
        "reading": "うち",
        "meaning": "inside, within"
      },
      {
        "word": "屋",
        "reading": "や",
        "meaning": "shop, store, restaurant"
      },
      {
        "word": "家",
        "reading": "か",
        "meaning": "-ist, -er"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"家\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "世",
    "reading": "よ",
    "meaning": "world, society, public",
    "jlptLevel": "jlpt-n1",
    "tags": [
      "wanikani4"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "世",
        "reading": "せい",
        "meaning": "counter for generations"
      },
      {
        "word": "世界",
        "reading": "せかい",
        "meaning": "the world, society, the universe"
      },
      {
        "word": "世紀",
        "reading": "せいき",
        "meaning": "century"
      },
      {
        "word": "世代",
        "reading": "せだい",
        "meaning": "generation"
      },
      {
        "word": "世帯",
        "reading": "せたい",
        "meaning": "household, home, family, housekeeping"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"世\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "多",
    "reading": "た",
    "meaning": "multi-",
    "jlptLevel": null,
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "多分",
        "reading": "たぶん",
        "meaning": "probably, likely, perhaps, maybe"
      },
      {
        "word": "多い",
        "reading": "おおい",
        "meaning": "many, numerous, a lot"
      },
      {
        "word": "多数決",
        "reading": "たすうけつ",
        "meaning": "majority decision, majority vote, majority rule"
      },
      {
        "word": "大いに",
        "reading": "おおいに",
        "meaning": "very, very much, greatly, considerably, highly, exceedingly, a great deal, a lot, to one's heart's content"
      },
      {
        "word": "多少",
        "reading": "たしょう",
        "meaning": "a little, some, somewhat, slightly, to some degree, to some extent"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"多\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "正",
    "reading": "せい",
    "meaning": "(logical) true, regular",
    "jlptLevel": "jlpt-n3",
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "正",
        "reading": "しょう",
        "meaning": "exactly, precisely"
      },
      {
        "word": "正",
        "reading": "まさ",
        "meaning": "exact, precise"
      },
      {
        "word": "正直",
        "reading": "しょうじき",
        "meaning": "honest, frank, candid, straightforward"
      },
      {
        "word": "正午",
        "reading": "しょうご",
        "meaning": "noon, midday"
      },
      {
        "word": "正方形",
        "reading": "せいほうけい",
        "meaning": "square"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"正\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "安",
    "reading": "やす",
    "meaning": "cheap",
    "jlptLevel": null,
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "安定",
        "reading": "あんてい",
        "meaning": "stability, steadiness, consistency, equilibrium, balance, composure"
      },
      {
        "word": "安い",
        "reading": "やすい",
        "meaning": "cheap, inexpensive"
      },
      {
        "word": "安全",
        "reading": "あんぜん",
        "meaning": "safety, security"
      },
      {
        "word": "安心",
        "reading": "あんしん",
        "meaning": "peace of mind, relief, (sense of) security, safety, assurance, confidence"
      },
      {
        "word": "安易",
        "reading": "あんい",
        "meaning": "easy, simple"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"安\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "院",
    "reading": "いん",
    "meaning": "house of parliament (congress, diet, etc.)",
    "jlptLevel": null,
    "tags": [],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "院政",
        "reading": "いんせい",
        "meaning": "cloistered rule, government by cloistered emperors"
      },
      {
        "word": "院内",
        "reading": "いんない",
        "meaning": "inside the House, inside the Diet"
      },
      {
        "word": "院生",
        "reading": "いんせい",
        "meaning": "graduate student"
      },
      {
        "word": "院長",
        "reading": "いんちょう",
        "meaning": "director (of a hospital, institution, academy, etc.), superintendent, rector"
      },
      {
        "word": "院議",
        "reading": "いんぎ",
        "meaning": "legislative decision"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"院\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "心",
    "reading": "こころ",
    "meaning": "mind, heart, spirit",
    "jlptLevel": "jlpt-n4",
    "tags": [
      "wanikani3"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "心",
        "reading": "しん",
        "meaning": "heart, mind, spirit, vitality, inner strength"
      },
      {
        "word": "心臓",
        "reading": "しんぞう",
        "meaning": "heart"
      },
      {
        "word": "心配",
        "reading": "しんぱい",
        "meaning": "worry, concern, anxiety, uneasiness, fear"
      },
      {
        "word": "心理",
        "reading": "しんり",
        "meaning": "state of mind, mentality, psychology"
      },
      {
        "word": "心得る",
        "reading": "こころえる",
        "meaning": "to know, to understand, to be aware of, to regard as, to take for"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"心\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "境",
    "reading": "さかい",
    "meaning": "border, boundary",
    "jlptLevel": "jlpt-n3",
    "tags": [
      "wanikani24"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "界",
        "reading": "かい",
        "meaning": "community, circles, world"
      },
      {
        "word": "界隈",
        "reading": "かいわい",
        "meaning": "neighborhood, neighbourhood, vicinity"
      },
      {
        "word": "界面活性剤",
        "reading": "かいめんかっせいざい",
        "meaning": "surfactant"
      },
      {
        "word": "界面化学",
        "reading": "かいめんかがく",
        "meaning": "surface chemistry"
      },
      {
        "word": "界面",
        "reading": "かいめん",
        "meaning": "interface"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"界\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "教室",
    "reading": "きょうしつ",
    "meaning": "classroom, lecture room",
    "jlptLevel": "jlpt-n5",
    "tags": [
      "wanikani7"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "教育",
        "reading": "きょういく",
        "meaning": "education, schooling, training, instruction, teaching, upbringing"
      },
      {
        "word": "教会",
        "reading": "きょうかい",
        "meaning": "church, congregation"
      },
      {
        "word": "教授",
        "reading": "きょうじゅ",
        "meaning": "professor"
      },
      {
        "word": "教科書",
        "reading": "きょうかしょ",
        "meaning": "textbook, coursebook, schoolbook"
      },
      {
        "word": "教える",
        "reading": "おしえる",
        "meaning": "to teach, to instruct"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"教\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "文",
    "reading": "ぶん",
    "meaning": "sentence",
    "jlptLevel": "jlpt-n3",
    "tags": [
      "wanikani2"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "文",
        "reading": "ふみ",
        "meaning": "letter, note, mail"
      },
      {
        "word": "紋",
        "reading": "もん",
        "meaning": "(family) crest, coat of arms"
      },
      {
        "word": "文",
        "reading": "もん",
        "meaning": "mon, one-thousandth of a kan (unit of currency 1336-1870)"
      },
      {
        "word": "綾",
        "reading": "あや",
        "meaning": "figure, design"
      },
      {
        "word": "文化",
        "reading": "ぶんか",
        "meaning": "culture, civilization, civilisation"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"文\" multiple times. Try to use it in sentences and recognize it in different contexts."
  },
  {
    "kanji": "元",
    "reading": "もと",
    "meaning": "origin, source, beginning",
    "jlptLevel": "jlpt-n3",
    "tags": [
      "wanikani3"
    ],
    "exampleSentences": [],
    "relatedWords": [
      {
        "word": "元",
        "reading": "もと",
        "meaning": "former, ex-, past, one-time"
      },
      {
        "word": "元",
        "reading": "げん",
        "meaning": "unknown (e.g. in an equation)"
      },
      {
        "word": "元",
        "reading": "ユアン",
        "meaning": "yuan (monetary unit of China)"
      },
      {
        "word": "元気",
        "reading": "げんき",
        "meaning": "lively, full of spirit, energetic, vigorous, vital, spirited"
      },
      {
        "word": "元素",
        "reading": "げんそ",
        "meaning": "element, chemical element"
      }
    ],
    "strokeOrder": {
      "strokes": [],
      "strokeCount": 0
    },
    "studyTips": "Practice writing the kanji \"元\" multiple times. Try to use it in sentences and recognize it in different contexts."
  }
];
