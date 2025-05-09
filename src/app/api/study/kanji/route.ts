import { NextResponse } from 'next/server';
import { KANJI_DATA, KanjiData, JLPTLevel } from '@/app/admin/kanji/data';

// Interface for the API response
interface KanjiApiData {
  id: string;
  kanji: string;
  meanings: string[];
  onyomi: string[];
  kunyomi: string[];
  info: {
    grade: number;
    jlpt: number;
    strokeCount: number;
  };
}

/**
 * API route to fetch kanji data for study mode
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level') || 'n5';
  
  try {
    // Validate the level parameter
    if (!['n1', 'n2', 'n3', 'n4', 'n5'].includes(level)) {
      return NextResponse.json(
        { error: 'Invalid JLPT level' },
        { status: 400 }
      );
    }
    
    // Get kanji data from the admin data source
    const kanjiData = KANJI_DATA[level as JLPTLevel];
    
    // Filter out kanji that don't have both onyomi and kunyomi readings
    const filteredData = kanjiData.filter(
      item => item.onyomi && item.onyomi.length > 0 && item.kunyomi && item.kunyomi.length > 0
    );
    
    // Transform the data to match the expected API response format
    const formattedData: KanjiApiData[] = filteredData.map((item, index) => ({
      id: `${level}-${index}`,
      kanji: item.kanji,
      meanings: Array.isArray(item.meanings) ? [...item.meanings] : [],
      onyomi: Array.isArray(item.onyomi) ? [...item.onyomi] : [],
      kunyomi: Array.isArray(item.kunyomi) ? [...item.kunyomi] : [],
      info: {
        grade: item.info.grade,
        jlpt: item.info.jlpt,
        strokeCount: item.info.strokeCount
      }
    }));
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error loading kanji:', error);
    return NextResponse.json(
      { error: 'Failed to load kanji data' },
      { status: 500 }
    );
  }
}
