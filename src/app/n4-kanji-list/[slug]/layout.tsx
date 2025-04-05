import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { N4_KANJI } from '@/data/jlpt-kanji-updated';
import styles from '@/styles/kanji-list.module.css';

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Decode the slug
  const decodedSlug = decodeURIComponent(await params.slug);
  
  // Find the kanji that matches this slug
  const kanjiData = N4_KANJI.find(k => k.kanji === decodedSlug);
  
  // If kanji not found, return default metadata
  if (!kanjiData) {
    return {
      title: 'Kanji Not Found | JLPT Professor',
      description: 'The requested kanji could not be found.',
    };
  }

  // Get the first meaning for meta description
  const primaryMeaning = kanjiData.meaning.split(',')[0].trim();
  
  // Create a clean reading text (without HTML tags) for meta description
  const readingText = kanjiData.reading.replace(/<[^>]*>/g, '');
  
  // Create a clean meaning without HTML tags
  const cleanMeaning = kanjiData.meaning.replace(/<[^>]*>/g, '');
  
  return {
    title: `${kanjiData.kanji} (${primaryMeaning}) | JLPT N4 Kanji | JLPT Professor`,
    description: `Learn the JLPT N4 kanji ${kanjiData.kanji} (${readingText}): meaning, readings, example sentences, stroke order, and study tips.`,
    openGraph: {
      title: `${kanjiData.kanji} - ${primaryMeaning} | JLPT N4 Kanji`,
      description: `Master the JLPT N4 kanji ${kanjiData.kanji}: ${readingText} - ${kanjiData.meaning}`,
      url: `https://jlptprofessor.com/n4-kanji-list/${encodeURIComponent(kanjiData.kanji)}`,
      siteName: 'JLPT Professor',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${kanjiData.kanji} - ${primaryMeaning} | JLPT N4 Kanji`,
      description: `Master the JLPT N4 kanji ${kanjiData.kanji}: ${readingText} - ${kanjiData.meaning}`,
    },
  };
}

export default function KanjiDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
