import React from 'react';
import { Metadata } from 'next';
import { n4KanjiComplete } from '@/data/n4-kanji-complete';
import styles from '@/styles/kanji-list.module.css';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Props['params'] }): Promise<Metadata> {
  const { slug } = await params;
  const kanjiData = n4KanjiComplete.find(k => k.kanji === decodeURIComponent(slug));
  
  if (!kanjiData) {
    return {
      title: 'Kanji Not Found | JLPT Professor',
      description: 'The requested kanji could not be found.',
    };
  }

  // Format readings for display
  const onyomiText = kanjiData.onyomi.length > 0 ? `On: ${kanjiData.onyomi.join(', ')}` : '';
  const kunyomiText = kanjiData.kunyomi.length > 0 ? `Kun: ${kanjiData.kunyomi.join(', ')}` : '';
  const readingText = [onyomiText, kunyomiText].filter(Boolean).join(' ');

  // Create a clean meaning
  const meaningText = Array.isArray(kanjiData.meaning) 
    ? kanjiData.meaning.join(', ')
    : kanjiData.meaning;

  return {
    title: `${kanjiData.kanji} - N4 Kanji | JLPT Professor`,
    description: `Learn the N4 kanji ${kanjiData.kanji}. Readings: ${readingText}. Meaning: ${meaningText}.`,
    openGraph: {
      title: `${kanjiData.kanji} - N4 Kanji | JLPT Professor`,
      description: `Learn the N4 kanji ${kanjiData.kanji}. Readings: ${readingText}. Meaning: ${meaningText}.`,
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
