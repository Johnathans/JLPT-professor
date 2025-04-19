import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { Word } from '@/types/word';

// Read the CSV file
const csvFilePath = path.resolve(__dirname, '../data/n5 vocabulary - Sheet1.csv');
const csvData = fs.readFileSync(csvFilePath, 'utf-8');

// Parse CSV data
const records = parse(csvData, {
  columns: true,
  skip_empty_lines: true
});

// Convert to Word format
const words: Word[] = records.map((record: any) => ({
  kana: record.Kana || '',
  kanji: record.Kanji || '',
  type: record.Type || '',
  meaning: record['Definition/s'] || '',
}));

// Write to JSON file
const outputPath = path.resolve(__dirname, '../data/n5-words-complete.ts');
const output = `import { Word } from '@/types/word';

export const n5WordsComplete: Word[] = ${JSON.stringify(words, null, 2)};

export default n5WordsComplete;`;
fs.writeFileSync(outputPath, output);
console.log('Conversion complete!');
