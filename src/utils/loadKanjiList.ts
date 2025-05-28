import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export function loadKanjiList(level: string) {
  const csvPath = path.join(process.cwd(), 'src', 'data', 'jlpt', level.toLowerCase(), 'kanji', `JLPT Data - ${level} Kanji.csv`);
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  });
  
  // Extract just the kanji characters from the CSV
  return records.map((record: any) => record.Kanji);
}
