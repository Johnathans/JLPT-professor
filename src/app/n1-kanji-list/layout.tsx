import type { Metadata } from 'next';
import { n1WordsComplete } from '@/data/n1-words-complete';

export const metadata: Metadata = {
  title: 'JLPT N1 Kanji List | JLPT Professor',
  description: 'Study and master the most advanced kanji characters required for JLPT N1 level with comprehensive readings, meanings, and example sentences.',
  openGraph: {
    title: 'JLPT N1 Kanji List | JLPT Professor',
    description: 'Master the most advanced kanji characters for JLPT N1 level with comprehensive study materials.',
    url: 'https://jlptprofessor.com/n1-kanji-list',
    siteName: 'JLPT Professor',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JLPT N1 Kanji List | JLPT Professor',
    description: 'Master the most advanced kanji characters for JLPT N1 level with comprehensive study materials.',
  },
};

export default function N1KanjiListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
