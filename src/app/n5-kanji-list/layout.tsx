import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JLPT N5 Kanji List | JLPT Professor',
  description: 'Complete list of all JLPT N5 kanji with meanings, readings, and example sentences. Master the 103 basic kanji required for the JLPT N5 exam.',
  openGraph: {
    title: 'JLPT N5 Kanji List | JLPT Professor',
    description: 'Complete list of all JLPT N5 kanji with meanings, readings, and example sentences.',
    url: 'https://jlptprofessor.com/n5-kanji-list',
    siteName: 'JLPT Professor',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JLPT N5 Kanji List | JLPT Professor',
    description: 'Complete list of all JLPT N5 kanji with meanings, readings, and example sentences.',
  },
};

export default function N5KanjiListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
