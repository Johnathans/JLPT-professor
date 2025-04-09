import type { Metadata } from 'next';
import { n5KanjiComplete } from '@/data/n5-kanji-complete';

type LayoutProps = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

// Define the generateMetadata function for dynamic metadata
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  // Decode the slug
  const decodedSlug = decodeURIComponent((await params).slug);
  
  // Find the kanji that matches this slug
  const kanjiData = n5KanjiComplete.find(k => k.kanji === decodedSlug);
  
  // If kanji is not found, return default metadata
  if (!kanjiData) {
    return {
      title: 'Kanji Not Found | JLPT Professor',
      description: 'The requested kanji could not be found.',
    };
  }
  
  // Create a clean meaning without HTML tags
  const meaning = kanjiData.meaning as string | string[];
  const cleanMeaning = typeof meaning === 'string' 
    ? meaning.replace(/<[^>]*>/g, '')
    : Array.isArray(meaning) 
      ? meaning[0].replace(/<[^>]*>/g, '')
      : '';
  
  // Return metadata with dynamic values
  return {
    title: `${kanjiData.kanji} (${cleanMeaning}) | JLPT N5 Kanji | JLPT Professor`,
    description: `Learn the JLPT N5 kanji ${kanjiData.kanji} (${cleanMeaning}). View stroke order, readings, example sentences, and study tips for this essential Japanese character.`,
    openGraph: {
      title: `${kanjiData.kanji} (${cleanMeaning}) | JLPT N5 Kanji`,
      description: `Learn the JLPT N5 kanji ${kanjiData.kanji} (${cleanMeaning}). View readings, examples, and study tips.`,
      url: `https://jlptprofessor.com/n5-kanji-list/${encodeURIComponent(kanjiData.kanji)}`,
      siteName: 'JLPT Professor',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${kanjiData.kanji} (${cleanMeaning}) | JLPT N5 Kanji`,
      description: `Learn the JLPT N5 kanji ${kanjiData.kanji} (${cleanMeaning}). View readings, examples, and study tips.`,
    },
  };
}

export default function KanjiDetailLayout({
  children,
  params,
}: LayoutProps) {
  return <>{children}</>;
}
