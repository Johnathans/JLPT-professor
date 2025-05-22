import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JLPT_DATA_DIR = path.join(__dirname, '../data/jlpt');

interface VocabularyRow {
  Kanji: string;
  Hiragana: string;
  English: string;
}

interface KanjiRow {
  Kanji: string;
  Onyomi: string;
  Kunyomi: string;
  English: string;
}

interface GrammarRow {
  Grammar: string;
}

function processVocabularyFile(filePath: string, outputPath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const rows = parse(fileContent, { columns: true }) as VocabularyRow[];

  const vocabularyData = rows.map(row => ({
    kanji: row.Kanji || undefined,
    kana: row.Hiragana,
    meanings: row.English.replace(/"/g, '').split(',').map(m => m.trim()),
    jlpt: parseInt(filePath.includes('n5') ? '5' : 
           filePath.includes('n4') ? '4' :
           filePath.includes('n3') ? '3' :
           filePath.includes('n2') ? '2' : '1'),
    partOfSpeech: 'noun' // Default, will need to be updated
  }));

  const tsContent = `import { VocabularyData } from '../../index';

export const vocabulary: VocabularyData[] = ${JSON.stringify(vocabularyData, null, 2)};`;

  fs.writeFileSync(outputPath, tsContent);
}

function processKanjiFile(filePath: string, outputPath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const rows = parse(fileContent, { columns: true }) as KanjiRow[];

  const kanjiData = rows.map(row => ({
    meanings: row.English.replace(/"/g, '').split(',').map(m => m.trim()),
    onyomi: row.Onyomi ? row.Onyomi.split(' ').filter(o => o !== '-') : [],
    kunyomi: row.Kunyomi ? row.Kunyomi.split(' ').filter(k => k !== '-') : [],
    character: row.Kanji,
    jlpt: parseInt(filePath.includes('n5') ? '5' : 
          filePath.includes('n4') ? '4' :
          filePath.includes('n3') ? '3' :
          filePath.includes('n2') ? '2' : '1')
  }));

  const tsContent = `import { KanjiData } from '../../index';

export const kanji: KanjiData[] = ${JSON.stringify(kanjiData, null, 2)};`;

  fs.writeFileSync(outputPath, tsContent);
}

function processGrammarFile(filePath: string, outputPath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const rows = parse(fileContent, { columns: true }) as GrammarRow[];

  const grammarData = rows.map(row => ({
    pattern: row.Grammar,
    jlpt: parseInt(filePath.includes('n5') ? '5' : 
          filePath.includes('n4') ? '4' :
          filePath.includes('n3') ? '3' :
          filePath.includes('n2') ? '2' : '1')
  }));

  const tsContent = `import { GrammarData } from '../../index';

export const grammar: GrammarData[] = ${JSON.stringify(grammarData, null, 2)};`;

  fs.writeFileSync(outputPath, tsContent);
}

// Process all CSV files
fs.readdirSync(JLPT_DATA_DIR).forEach((level: string) => {
  const levelPath = path.join(JLPT_DATA_DIR, level);
  if (fs.statSync(levelPath).isDirectory()) {
    ['vocabulary', 'kanji', 'grammar'].forEach(type => {
      const typePath = path.join(levelPath, type);
      if (fs.existsSync(typePath)) {
        const csvFiles = fs.readdirSync(typePath).filter((f: string) => f.endsWith('.csv'));
        csvFiles.forEach((csvFile: string) => {
          const csvPath = path.join(typePath, csvFile);
          const tsPath = path.join(typePath, 'index.ts');
          
          if (type === 'vocabulary') {
            processVocabularyFile(csvPath, tsPath);
          } else if (type === 'kanji') {
            processKanjiFile(csvPath, tsPath);
          } else if (type === 'grammar') {
            processGrammarFile(csvPath, tsPath);
          }
        });
      }
    });
  }
});
