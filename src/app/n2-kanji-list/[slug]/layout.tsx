import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { n2KanjiComplete } from '@/data/n2-kanji-complete';
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
  const kanji = n2KanjiComplete.find(k => k.kanji === decodedSlug);
  
  // If kanji not found, return default metadata
  if (!kanji) {
    return {
      title: 'Kanji Not Found | JLPT Professor',
      description: 'The requested kanji could not be found.',
    };
  }

  // Get the first meaning for display
  const cleanMeaning = Array.isArray(kanji.meaning)
    ? kanji.meaning[0]
    : typeof kanji.meaning === 'string'
      ? kanji.meaning.split(',')[0].trim()
      : '';
  
  // Create a clean reading text for meta description
  const readingText = [
    kanji.onyomi.length > 0 ? `On: ${kanji.onyomi.join(', ')}` : '',
    kanji.kunyomi.length > 0 ? `Kun: ${kanji.kunyomi.join(', ')}` : ''
  ].filter(Boolean).join(' ');
  
  return {
    title: `${kanji.kanji} (${cleanMeaning}) | JLPT N2 Kanji | JLPT Professor`,
    description: `Learn the meaning (${cleanMeaning}) and readings (${readingText}) of the JLPT N2 kanji ${kanji.kanji}.`,
    openGraph: {
      title: `${kanji.kanji} - ${cleanMeaning} | JLPT N2 Kanji`,
      description: `Master the JLPT N2 kanji ${kanji.kanji}: ${readingText} - ${cleanMeaning}`,
      url: `https://jlptprofessor.com/n2-kanji-list/${kanji.kanji}`,
      siteName: 'JLPT Professor',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${kanji.kanji} - ${cleanMeaning} | JLPT N2 Kanji`,
      description: `Master the JLPT N2 kanji ${kanji.kanji}: ${readingText} - ${cleanMeaning}`,
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
