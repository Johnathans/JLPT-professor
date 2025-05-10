import { NextRequest, NextResponse } from 'next/server';

interface KanjiResponse {
  kanji: string;
  grade: number;
  jlpt: number | null;
  stroke_count: number;
  meanings: string[];
  kun_readings: string[];
  on_readings: string[];
  name_readings: string[];
  unicode: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { character: string } }
) {
  try {
    const { character } = params;
    console.log('Fetching kanji data for:', character);

    const response = await fetch(`https://kanjiapi.dev/v1/kanji/${character}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch kanji: ${response.status}`);
    }

    const data: KanjiResponse = await response.json();
    console.log('Kanji data:', data);

    return NextResponse.json({
      kanji: data.kanji,
      jlpt: data.jlpt,
      meanings: data.meanings,
      readings: {
        on: data.on_readings,
        kun: data.kun_readings
      },
      info: {
        grade: data.grade,
        strokeCount: data.stroke_count,
        unicode: data.unicode
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch kanji data' },
      { status: 500 }
    );
  }
}
