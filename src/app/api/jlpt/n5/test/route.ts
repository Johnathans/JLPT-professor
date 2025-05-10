import { NextRequest, NextResponse } from 'next/server';

async function fetchN5Kanji() {
  try {
    const url = 'https://jisho.org/api/v1/search/words';
    const params = new URLSearchParams({
      keyword: '#kanji #jlpt-n5'
    });

    console.log('Requesting URL:', `${url}?${params}`);

    const response = await fetch(`${url}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw response:', JSON.stringify(data, null, 2));

    // Extract and format kanji data
    const kanjiList = data.data.map((item: any) => {
      const kanji = item.japanese[0]?.word || '';
      const reading = item.japanese[0]?.reading || '';
      const meanings = item.senses[0]?.english_definitions || [];
      const tags = item.tags || [];
      const jlpt = item.jlpt || [];

      return {
        kanji,
        reading,
        meanings,
        tags,
        jlpt
      };
    });

    console.log('Processed kanji list:', kanjiList);
    return kanjiList;

  } catch (error) {
    console.error('Error fetching N5 kanji:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const result = await fetchN5Kanji();
    
    if (!result) {
      return NextResponse.json({ error: 'Failed to fetch kanji data' });
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
