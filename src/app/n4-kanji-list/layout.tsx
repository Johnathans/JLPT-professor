import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JLPT N4 Kanji List | JLPT Professor',
  description: 'Complete list of all JLPT N4 kanji with meanings, readings, and example sentences. Master the essential kanji required for the JLPT N4 exam.',
  openGraph: {
    title: 'JLPT N4 Kanji List | JLPT Professor',
    description: 'Complete list of all JLPT N4 kanji with meanings, readings, and example sentences.',
    url: 'https://jlptprofessor.com/n4-kanji-list',
    siteName: 'JLPT Professor',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JLPT N4 Kanji List | JLPT Professor',
    description: 'Complete list of all JLPT N4 kanji with meanings, readings, and example sentences.',
  },
};

export default function N4KanjiListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
