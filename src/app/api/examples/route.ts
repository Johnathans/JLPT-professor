import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://tatoeba.org/eng/api_v0/search?query=${encodeURIComponent(keyword)}&from=jpn&to=eng`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'JLPT Professor/1.0 (https://jlptprofessor.com)'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Tatoeba API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from Tatoeba:', error);
    return NextResponse.json(
      { error: 'Failed to fetch example sentences' },
      { status: 500 }
    );
  }
}
