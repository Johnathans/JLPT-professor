import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JLPT N2 Kanji List | JLPT Professor',
  description: 'Study and master the 374 kanji characters required for JLPT N2 level with comprehensive readings, meanings, and example sentences.',
  openGraph: {
    title: 'JLPT N2 Kanji List | JLPT Professor',
    description: 'Master the 374 essential kanji characters for JLPT N2 level with comprehensive study materials.',
    url: 'https://jlptprofessor.com/n2-kanji-list',
    siteName: 'JLPT Professor',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JLPT N2 Kanji List | JLPT Professor',
    description: 'Master the 374 essential kanji characters for JLPT N2 level with comprehensive study materials.',
  },
};

export default function N2KanjiListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
