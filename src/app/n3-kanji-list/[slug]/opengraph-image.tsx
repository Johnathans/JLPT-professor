import { ImageResponse } from 'next/og';
import { n3KanjiComplete } from '@/data/n3-kanji-complete';
 
export const size = {
  width: 1200,
  height: 630,
};
 
export const contentType = 'image/png';
 
export default async function Image({ params }: { params: { slug: string } }) {
  // Decode the slug
  const decodedSlug = decodeURIComponent(params.slug);
  
  // Find the kanji that matches this slug
  const kanji = n3KanjiComplete.find(k => k.kanji === decodedSlug);
  
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
      { ...size }
    );
  }

  // Get the first meaning for display
  const primaryMeaning = kanji.meaning.split(',')[0].trim();
  
  // Create a clean reading text (without HTML tags)
  const readingText = kanji.reading.replace(/<[^>]*>/g, '');
  
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
          <div style={{ fontSize: 200, marginBottom: 24 }}>{kanji.kanji}</div>
          <div style={{ fontSize: 64 }}>{primaryMeaning}</div>
          <div style={{ fontSize: 48, marginTop: 24 }}>JLPT N3 Kanji | JLPT Professor</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
