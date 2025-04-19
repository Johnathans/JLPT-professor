import { Word } from '@/types/word';

export function generateWordSlug(word: Word): string {
  const parts = [];
  
  // Add kanji if it exists
  if (word.kanji && word.kanji.trim() !== '') {
    parts.push(word.kanji);
  }
  
  // Add kana reading
  parts.push(word.kana);
  
  // Add romaji (we'll need to generate this)
  const romaji = word.kana
    .replace(/きょ/g, 'kyo').replace(/きゅ/g, 'kyu').replace(/きゃ/g, 'kya')
    .replace(/しょ/g, 'sho').replace(/しゅ/g, 'shu').replace(/しゃ/g, 'sha')
    .replace(/ちょ/g, 'cho').replace(/ちゅ/g, 'chu').replace(/ちゃ/g, 'cha')
    .replace(/にょ/g, 'nyo').replace(/にゅ/g, 'nyu').replace(/にゃ/g, 'nya')
    .replace(/ひょ/g, 'hyo').replace(/ひゅ/g, 'hyu').replace(/ひゃ/g, 'hya')
    .replace(/みょ/g, 'myo').replace(/みゅ/g, 'myu').replace(/みゃ/g, 'mya')
    .replace(/りょ/g, 'ryo').replace(/りゅ/g, 'ryu').replace(/りゃ/g, 'rya')
    .replace(/ぎょ/g, 'gyo').replace(/ぎゅ/g, 'gyu').replace(/ぎゃ/g, 'gya')
    .replace(/じょ/g, 'jo').replace(/じゅ/g, 'ju').replace(/じゃ/g, 'ja')
    .replace(/びょ/g, 'byo').replace(/びゅ/g, 'byu').replace(/びゃ/g, 'bya')
    .replace(/ぴょ/g, 'pyo').replace(/ぴゅ/g, 'pyu').replace(/ぴゃ/g, 'pya')
    .replace(/が/g, 'ga').replace(/ぎ/g, 'gi').replace(/ぐ/g, 'gu').replace(/げ/g, 'ge').replace(/ご/g, 'go')
    .replace(/ざ/g, 'za').replace(/じ/g, 'ji').replace(/ず/g, 'zu').replace(/ぜ/g, 'ze').replace(/ぞ/g, 'zo')
    .replace(/だ/g, 'da').replace(/ぢ/g, 'ji').replace(/づ/g, 'zu').replace(/で/g, 'de').replace(/ど/g, 'do')
    .replace(/ば/g, 'ba').replace(/び/g, 'bi').replace(/ぶ/g, 'bu').replace(/べ/g, 'be').replace(/ぼ/g, 'bo')
    .replace(/ぱ/g, 'pa').replace(/ぴ/g, 'pi').replace(/ぷ/g, 'pu').replace(/ぺ/g, 'pe').replace(/ぽ/g, 'po')
    .replace(/か/g, 'ka').replace(/き/g, 'ki').replace(/く/g, 'ku').replace(/け/g, 'ke').replace(/こ/g, 'ko')
    .replace(/さ/g, 'sa').replace(/し/g, 'shi').replace(/す/g, 'su').replace(/せ/g, 'se').replace(/そ/g, 'so')
    .replace(/た/g, 'ta').replace(/ち/g, 'chi').replace(/つ/g, 'tsu').replace(/て/g, 'te').replace(/と/g, 'to')
    .replace(/な/g, 'na').replace(/に/g, 'ni').replace(/ぬ/g, 'nu').replace(/ね/g, 'ne').replace(/の/g, 'no')
    .replace(/は/g, 'ha').replace(/ひ/g, 'hi').replace(/ふ/g, 'fu').replace(/へ/g, 'he').replace(/ほ/g, 'ho')
    .replace(/ま/g, 'ma').replace(/み/g, 'mi').replace(/む/g, 'mu').replace(/め/g, 'me').replace(/も/g, 'mo')
    .replace(/や/g, 'ya').replace(/ゆ/g, 'yu').replace(/よ/g, 'yo')
    .replace(/ら/g, 'ra').replace(/り/g, 'ri').replace(/る/g, 'ru').replace(/れ/g, 're').replace(/ろ/g, 'ro')
    .replace(/わ/g, 'wa').replace(/を/g, 'wo').replace(/ん/g, 'n')
    .replace(/あ/g, 'a').replace(/い/g, 'i').replace(/う/g, 'u').replace(/え/g, 'e').replace(/お/g, 'o');
  
  parts.push(romaji);
  
  // Add "meaning" at the end
  parts.push('meaning');
  
  // Join with hyphens and ensure URL-safe
  const slug = parts.join('-');
  return encodeURIComponent(slug);
}

export function parseWordSlug(slug: string): { kanji?: string; kana: string } {
  console.log('Parsing slug:', slug);
  const parts = decodeURIComponent(slug).split('-');
  
  // Remove "meaning" from the end
  parts.pop();
  
  // Remove romaji from the end
  parts.pop();

  console.log('Parts after removing meaning and romaji:', parts);
  
  // If we have 2 parts, it's kanji + kana
  if (parts.length === 2) {
    return {
      kanji: parts[0],
      kana: parts[1]
    };
  }
  
  // If we have 1 part, it's just kana
  return {
    kana: parts[0]
  };
}
