import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { N2_KANJI } from '@/data/jlpt-kanji-updated';
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
  const kanji = N2_KANJI.find(k => k.kanji === decodedSlug);
  
  // If kanji not found, return default metadata
  if (!kanji) {
    return {
      title: 'Kanji Not Found | JLPT Professor',
      description: 'The requested kanji could not be found.',
    };
  }

  // Create a clean meaning without HTML tags
  let cleanMeaning = '';
  if (kanji) {
    // Force the type to be any to handle the meaning property
    const kanjiAny = kanji as any;
    if (kanjiAny.meaning) {
      if (Array.isArray(kanjiAny.meaning) && kanjiAny.meaning.length > 0) {
        cleanMeaning = kanjiAny.meaning[0] ? kanjiAny.meaning[0].replace(/<[^>]*>/g, '') : '';
      } else if (typeof kanjiAny.meaning === 'string') {
        cleanMeaning = kanjiAny.meaning.replace(/<[^>]*>/g, '');
      }
    }
  }
  
  // Create a clean reading text (without HTML tags) for meta description
  const readingText = kanji.reading.replace(/<[^>]*>/g, '');
  
  return {
    title: `${kanji.kanji} (${cleanMeaning}) | JLPT N2 Kanji | JLPT Professor`,
    description: `Learn the JLPT N2 kanji ${kanji.kanji} (${readingText}): meaning, readings, example sentences, stroke order, and study tips.`,
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
