import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { level: string } }
) {
  try {
    const level = params.level.toUpperCase();
    if (!['N1', 'N2', 'N3', 'N4', 'N5'].includes(level)) {
      return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'src', 'data', 'vocabulary', `n${level.substring(1)}-words.csv`);
    const csvData = fs.readFileSync(filePath, 'utf-8');
    
    const words = csvData.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => {
        const [kana, kanji, meaning] = line.split(',');
        return {
          kana: kana.trim(),
          kanji: kanji.trim() || undefined,
          meaning: meaning.trim(),
          level
        };
      });

    return NextResponse.json({ words });
  } catch (error) {
    console.error('Error loading vocabulary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
