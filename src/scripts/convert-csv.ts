const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const csvFilePath = path.join(process.cwd(), 'src/data/n5 vocabulary - Sheet1.csv');
const outputPath = path.join(process.cwd(), 'src/data/n5-words-complete.ts');

const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true
});

const words = records.map((record: any) => ({
  kana: record.Kana || '',
  kanji: record.Kanji || '',
  type: record.Type || '',
  meaning: record['Definition/s'] || '',
}));

const output = `import { Word } from '@/types/word';

export const n5WordsComplete: Word[] = ${JSON.stringify(words, null, 2)};

export default n5WordsComplete;`;

fs.writeFileSync(outputPath, output);
console.log('Conversion complete!');
