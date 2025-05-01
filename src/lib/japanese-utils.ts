/**
 * Convert hiragana to katakana
 * @param hiragana String in hiragana
 * @returns String in katakana
 */
export function hiraganaToKatakana(hiragana: string): string {
  return hiragana.replace(/[\u3041-\u3096]/g, match => 
    String.fromCharCode(match.charCodeAt(0) + 0x60)
  );
}

/**
 * Convert katakana to hiragana
 * @param katakana String in katakana
 * @returns String in hiragana
 */
export function katakanaToHiragana(katakana: string): string {
  return katakana.replace(/[\u30A1-\u30F6]/g, match =>
    String.fromCharCode(match.charCodeAt(0) - 0x60)
  );
}
