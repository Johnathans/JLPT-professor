import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';

let kuroshiro: Kuroshiro | null = null;
let initPromise: Promise<void> | null = null;

async function initializeKuroshiro() {
  if (kuroshiro) return;
  
  if (initPromise) {
    await initPromise;
    return;
  }

  initPromise = (async () => {
    kuroshiro = new Kuroshiro();
    await kuroshiro.init(new KuromojiAnalyzer());
  })();

  await initPromise;
}

export async function convertToRomaji(text: string): Promise<string> {
  await initializeKuroshiro();
  if (!kuroshiro) throw new Error('Kuroshiro not initialized');
  
  return kuroshiro.convert(text, {
    to: 'romaji',
    mode: 'spaced',
    romajiSystem: 'hepburn'
  });
}
