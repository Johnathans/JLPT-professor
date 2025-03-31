import React from 'react';
import { Metadata } from 'next';
import { n3KanjiComplete } from '@/data/n3-kanji-complete';

export const metadata: Metadata = {
  title: 'JLPT N3 Kanji List | JLPT Professor',
  description: `Study and master the ${n3KanjiComplete.length} kanji characters required for JLPT N3 level with comprehensive readings, meanings, and example sentences.`,
  openGraph: {
    title: 'JLPT N3 Kanji List | JLPT Professor',
    description: `Master the ${n3KanjiComplete.length} essential kanji characters for JLPT N3 level with comprehensive study materials.`,
    url: 'https://jlptprofessor.com/n3-kanji-list',
    siteName: 'JLPT Professor',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JLPT N3 Kanji List | JLPT Professor',
    description: `Master the ${n3KanjiComplete.length} essential kanji characters for JLPT N3 level with comprehensive study materials.`,
  },
};

export default function N3KanjiListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
