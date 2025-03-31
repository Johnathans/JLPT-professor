import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const type = searchParams.get('type');

  if (!keyword || !type) {
    return NextResponse.json({ error: 'Missing keyword or type' }, { status: 400 });
  }

  try {
    let response;
    if (type === 'word') {
      response = await fetch(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(keyword)}`);
    } else if (type === 'kanji') {
      response = await fetch(`https://kanjiapi.dev/v1/kanji/${encodeURIComponent(keyword)}`);
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Dictionary API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
