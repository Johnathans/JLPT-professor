interface RomajiMap {
  [key: string]: string;
}

// Hiragana to Romaji mapping
const hiraganaToRomaji: RomajiMap = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo', 'ん': 'n',
  'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
  'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
  'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
  'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
  'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  'きょ': 'kyo', 'きゅ': 'kyu', 'きゃ': 'kya',
  'しょ': 'sho', 'しゅ': 'shu', 'しゃ': 'sha',
  'ちょ': 'cho', 'ちゅ': 'chu', 'ちゃ': 'cha',
  'にょ': 'nyo', 'にゅ': 'nyu', 'にゃ': 'nya',
  'ひょ': 'hyo', 'ひゅ': 'hyu', 'ひゃ': 'hya',
  'みょ': 'myo', 'みゅ': 'myu', 'みゃ': 'mya',
  'りょ': 'ryo', 'りゅ': 'ryu', 'りゃ': 'rya',
  'ぎょ': 'gyo', 'ぎゅ': 'gyu', 'ぎゃ': 'gya',
  'じょ': 'jo', 'じゅ': 'ju', 'じゃ': 'ja',
  'びょ': 'byo', 'びゅ': 'byu', 'びゃ': 'bya',
  'ぴょ': 'pyo', 'ぴゅ': 'pyu', 'ぴゃ': 'pya',
  'っ': '',  // Small tsu doubles the following consonant
};

// Katakana to Romaji mapping
const katakanaToRomaji: RomajiMap = {
  'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
  'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
  'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
  'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
  'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
  'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
  'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
  'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
  'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
  'ワ': 'wa', 'ヲ': 'wo', 'ン': 'n',
  'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
  'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
  'ダ': 'da', 'ヂ': 'ji', 'ヅ': 'zu', 'デ': 'de', 'ド': 'do',
  'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
  'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',
  'キョ': 'kyo', 'キュ': 'kyu', 'キャ': 'kya',
  'ショ': 'sho', 'シュ': 'shu', 'シャ': 'sha',
  'チョ': 'cho', 'チュ': 'chu', 'チャ': 'cha',
  'ニョ': 'nyo', 'ニュ': 'nyu', 'ニャ': 'nya',
  'ヒョ': 'hyo', 'ヒュ': 'hyu', 'ヒャ': 'hya',
  'ミョ': 'myo', 'ミュ': 'myu', 'ミャ': 'mya',
  'リョ': 'ryo', 'リュ': 'ryu', 'リャ': 'rya',
  'ギョ': 'gyo', 'ギュ': 'gyu', 'ギャ': 'gya',
  'ジョ': 'jo', 'ジュ': 'ju', 'ジャ': 'ja',
  'ビョ': 'byo', 'ビュ': 'byu', 'ビャ': 'bya',
  'ピョ': 'pyo', 'ピュ': 'pyu', 'ピャ': 'pya',
  'ッ': '',  // Small tsu doubles the following consonant
  // Long vowel mark
  'ー': '',
  // Additional katakana combinations
  'ファ': 'fa', 'フィ': 'fi', 'フェ': 'fe', 'フォ': 'fo',
  'ウィ': 'wi', 'ウェ': 'we', 'ウォ': 'wo',
  'ヴァ': 'va', 'ヴィ': 'vi', 'ヴ': 'vu', 'ヴェ': 've', 'ヴォ': 'vo'
};

/**
 * Converts hiragana or katakana text to romaji
 * @param text The Japanese text to convert
 * @returns The romaji conversion
 */
function toRomajiInternal(text: string): string {
  let romaji = '';
  let i = 0;

  while (i < text.length) {
    // Check for small tsu (っ/ッ)
    if (text[i] === 'っ' || text[i] === 'ッ') {
      // If it's the last character or no mapping exists for next character, skip it
      if (i === text.length - 1) {
        i++;
        continue;
      }
      // Double the first consonant of the next character
      const nextChar = text[i + 1];
      const nextRomaji = hiraganaToRomaji[nextChar] || katakanaToRomaji[nextChar];
      if (nextRomaji) {
        romaji += nextRomaji[0];
      }
      i++;
      continue;
    }

    // Check for two-character combinations first
    if (i < text.length - 1) {
      const combo = text.slice(i, i + 2);
      if (hiraganaToRomaji[combo] || katakanaToRomaji[combo]) {
        romaji += hiraganaToRomaji[combo] || katakanaToRomaji[combo];
        i += 2;
        continue;
      }
    }

    // Handle single characters
    const char = text[i];
    if (hiraganaToRomaji[char]) {
      romaji += hiraganaToRomaji[char];
    } else if (katakanaToRomaji[char]) {
      romaji += katakanaToRomaji[char];
    } else if (char !== 'ー') { // Skip long vowel mark
      romaji += char; // Keep unknown characters as-is
    }
    i++;
  }

  return romaji;
}

module.exports = { toRomaji: toRomajiInternal };
