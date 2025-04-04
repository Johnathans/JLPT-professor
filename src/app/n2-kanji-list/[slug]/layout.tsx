import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { N2_KANJI } from '@/data/jlpt-kanji-updated';
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
  const kanji = N2_KANJI.find(k => k.kanji === decodedSlug);
  
  // If kanji not found, return default metadata
  if (!kanji) {
    return {
      title: 'Kanji Not Found | JLPT Professor',
      description: 'The requested kanji could not be found.',
    };
  }

  // Get the first meaning for meta description
  const primaryMeaning = kanji.meaning.split(',')[0].trim();
  
  // Create a clean reading text (without HTML tags) for meta description
  const readingText = kanji.reading.replace(/<[^>]*>/g, '');
  
  return {
    title: `${kanji.kanji} (${primaryMeaning}) | JLPT N2 Kanji | JLPT Professor`,
    description: `Learn the JLPT N2 kanji ${kanji.kanji} (${readingText}): meaning, readings, example sentences, stroke order, and study tips.`,
    openGraph: {
      title: `${kanji.kanji} - ${primaryMeaning} | JLPT N2 Kanji`,
      description: `Master the JLPT N2 kanji ${kanji.kanji}: ${readingText} - ${kanji.meaning}`,
      url: `https://jlptprofessor.com/n2-kanji-list/${kanji.kanji}`,
      siteName: 'JLPT Professor',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${kanji.kanji} - ${primaryMeaning} | JLPT N2 Kanji`,
      description: `Master the JLPT N2 kanji ${kanji.kanji}: ${readingText} - ${kanji.meaning}`,
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
