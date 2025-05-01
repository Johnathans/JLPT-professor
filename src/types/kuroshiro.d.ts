declare module 'kuroshiro' {
  interface KuroshiroConfig {
    to?: 'hiragana' | 'katakana' | 'romaji';
    mode?: 'normal' | 'spaced' | 'okurigana' | 'furigana';
    romajiSystem?: 'nippon' | 'passport' | 'hepburn';
    detailed?: boolean;
  }

  export default class Kuroshiro {
    constructor();
    init(analyzer: any): Promise<void>;
    convert(text: string, config?: KuroshiroConfig): Promise<string>;
  }
}

declare module 'kuroshiro-analyzer-kuromoji' {
  export default class KuromojiAnalyzer {
    constructor(options?: { dictPath?: string });
  }
}
