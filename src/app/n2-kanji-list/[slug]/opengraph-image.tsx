import { ImageResponse } from 'next/og';
import { N2_KANJI } from '@/data/jlpt-kanji-updated';

// Define image size and content type
export const runtime = 'edge';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Define interfaces
interface KanjiDetails {
  kanji: string;
  meaning: string | string[];
  reading?: string;
  level?: string;
}

export default async function Image({ params }: { params: { slug: string } }) {
  // Decode the slug
  const decodedSlug = decodeURIComponent(params.slug);

  // Find the kanji that matches this slug
  const kanji = N2_KANJI.find((k: KanjiDetails) => k.kanji === decodedSlug);

  // If kanji not found, return a default image
  if (!kanji) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: '#7c4dff',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>Kanji Not Found</div>
            <div style={{ fontSize: 48, marginTop: 24 }}>JLPT Professor</div>
          </div>
        </div>
      ),
      size
    );
  }

  // Get the first meaning for display
  const primaryMeaning = Array.isArray(kanji.meaning) 
    ? kanji.meaning[0] 
    : typeof kanji.meaning === 'string' 
      ? kanji.meaning.split(',')[0].trim()
      : '';

  // Get the reading text
  const readingText = kanji.reading || '';
  
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: '#7c4dff',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '48px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: 200, marginBottom: 32 }}>{kanji.kanji}</div>
          <div style={{ fontSize: 48, marginBottom: 24 }}>{primaryMeaning}</div>
          <div style={{ fontSize: 32 }}>{readingText}</div>
          <div style={{ fontSize: 36, marginTop: 48 }}>JLPT Professor</div>
        </div>
      </div>
    ),
    size
  );
}
