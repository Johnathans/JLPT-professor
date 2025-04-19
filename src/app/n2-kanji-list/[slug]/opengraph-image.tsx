import { ImageResponse } from 'next/og';
import { n2KanjiComplete } from '@/data/n2-kanji-complete';
import { KanjiData } from '@/types/word';

export const runtime = 'edge';
export const alt = 'JLPT N2 Kanji';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const kanji = n2KanjiComplete.find(k => k.kanji === params.slug) as KanjiData | undefined;
  
  if (!kanji) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: '#e8e3ff',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 'bold', color: '#7c4dff' }}>
              Kanji Not Found
            </div>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  }

  // Get the first meaning
  const meaning = Array.isArray(kanji.meaning)
    ? kanji.meaning[0] 
    : typeof kanji.meaning === 'string' 
      ? kanji.meaning.split(',')[0].trim()
      : '';

  // Get the reading text
  const readings = [
    ...(kanji.onyomi || []),
    ...(kanji.kunyomi || []),
  ].join('・');

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#e8e3ff',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: 144, fontWeight: 'bold' }}>
            {kanji.kanji}
          </div>
          <div style={{ fontSize: 48, fontWeight: 'bold', color: '#7c4dff' }}>
            {meaning}
          </div>
          <div style={{ fontSize: 36, color: '#5e35b1' }}>
            {readings}
          </div>
          <div style={{ fontSize: 24, color: '#666', marginTop: '1rem' }}>
            JLPT N2 Kanji
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
