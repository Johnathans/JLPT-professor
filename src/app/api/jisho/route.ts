import { NextRequest, NextResponse } from 'next/server';

async function searchForKanji(kanji: string) {
  try {
    // Use the character details page
    const url = `https://jisho.org/search/%23kanji%20${encodeURIComponent(kanji)}`;
    console.log('Requesting URL:', url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`Failed to fetch kanji: ${response.status}`);
    }

    const html = await response.text();
    console.log('Raw HTML (first 1000 chars):', html.substring(0, 1000));
    
    // First find the kanji details section
    const detailsMatch = html.match(/<div class="kanji details">([\s\S]*?)<\/div>/i);
    if (!detailsMatch) {
      console.log('No kanji details section found');
      return null;
    }

    const detailsSection = detailsMatch[1];
    console.log('Details section:', detailsSection);

    // Find the readings section within the details
    const readingsMatch = detailsSection.match(/<div class="kanji-details__main-readings">([\s\S]*?)<\/div>/i);
    if (!readingsMatch) {
      console.log('No readings section found');
      return null;
    }

    const readingsSection = readingsMatch[1];
    console.log('Readings section:', readingsSection);

    // Extract on'yomi and kun'yomi readings
    const onyomiMatch = readingsSection.match(/<dl class="dictionary_entry on_yomi"[^>]*>[\s\S]*?<dd>([^<]+)<\/dd>/i);
    const kunyomiMatch = readingsSection.match(/<dl class="dictionary_entry kun_yomi"[^>]*>[\s\S]*?<dd>([^<]+)<\/dd>/i);

    console.log('Matches:', {
      onyomi: onyomiMatch?.[1],
      kunyomi: kunyomiMatch?.[1]
    });

    if (!onyomiMatch && !kunyomiMatch) {
      console.log('No readings found in HTML');
      return null;
    }

    return {
      found: true,
      onyomi: onyomiMatch ? onyomiMatch[1].trim().split('、') : [],
      kunyomi: kunyomiMatch ? kunyomiMatch[1].trim().split('、') : []
    };
  } catch (error) {
    console.error('Error fetching kanji:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const kanji = searchParams.get('kanji');

  try {
    if (kanji) {
      console.log('Searching for kanji:', kanji);
      const result = await searchForKanji(kanji);
      console.log('Search result:', result);

      if (!result) {
        return NextResponse.json({ error: 'Failed to fetch kanji data' });
      }

      const response = {
        onyomi: result.onyomi.join('、'),
        kunyomi: result.kunyomi.join('、')
      };

      console.log('Final response:', response);
      return NextResponse.json(response);
    }

    return NextResponse.json({ error: 'No kanji parameter provided' });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
