import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { N3_KANJI } from '@/data/jlpt-kanji-updated';
import styles from '@/styles/kanji-list.module.css';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Decode the slug
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  // Find the kanji that matches this slug
  const kanji = N3_KANJI.find(k => k.kanji === decodedSlug);
  
  // If kanji not found, return default metadata
  if (!kanji) {
    return {
      title: 'Kanji Not Found | JLPT Professor',
      description: 'The requested kanji could not be found.',
    };
  }

  // Create a clean meaning
  const primaryMeaning = Array.isArray(kanji.meaning) 
    ? kanji.meaning[0] 
    : typeof kanji.meaning === 'string' 
      ? kanji.meaning.split(',')[0].trim()
      : '';

  // Create a reading text from onyomi and kunyomi
  const onyomiText = kanji.onyomi?.length > 0 ? `On: ${kanji.onyomi.join(', ')}` : '';
  const kunyomiText = kanji.kunyomi?.length > 0 ? `Kun: ${kanji.kunyomi.join(', ')}` : '';
  const readingText = [onyomiText, kunyomiText].filter(Boolean).join(' ');
  
  return {
    title: `${kanji.kanji} (${primaryMeaning}) | JLPT N3 Kanji | JLPT Professor`,
    description: `Learn the JLPT N3 kanji ${kanji.kanji} (${primaryMeaning}). Readings: ${readingText}. Practice writing, reading, and understanding this essential Japanese character.`,
    keywords: [
      'JLPT N3',
      'Japanese kanji',
      'kanji study',
      'Japanese language',
      kanji.kanji,
      ...Array.isArray(kanji.meaning) ? kanji.meaning : [kanji.meaning],
      ...(kanji.onyomi || []),
      ...(kanji.kunyomi || [])
    ].filter(Boolean).join(', '),
    openGraph: {
      title: `${kanji.kanji} - JLPT N3 Kanji Study`,
      description: `Learn the meaning and readings of the JLPT N3 kanji ${kanji.kanji}. ${readingText}`,
      type: 'article',
      locale: 'en_US',
    },
  };
}

export default function KanjiDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.kanjiDetailContainer}>
      {children}
    </div>
  );
}
