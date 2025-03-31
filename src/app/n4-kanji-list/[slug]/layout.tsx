import type { Metadata } from 'next';
import { n4KanjiComplete } from '@/data/n4-kanji-complete';

// Define the generateMetadata function for dynamic metadata
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  // Decode the slug
  const decodedSlug = decodeURIComponent(await params.slug);
  
  // Find the kanji that matches this slug
  const kanjiData = n4KanjiComplete.find(k => k.kanji === decodedSlug);
  
  // If kanji is not found, return default metadata
  if (!kanjiData) {
    return {
      title: 'Kanji Not Found | JLPT Professor',
      description: 'The requested kanji could not be found.',
    };
  }
  
  // Create a clean meaning without HTML tags
  const cleanMeaning = kanjiData.meaning.replace(/<[^>]*>/g, '');
  
  // Return metadata with dynamic values
  return {
    title: `${kanjiData.kanji} (${cleanMeaning}) | JLPT N4 Kanji | JLPT Professor`,
    description: `Learn the JLPT N4 kanji ${kanjiData.kanji} (${cleanMeaning}). View stroke order, readings, example sentences, and study tips for this essential Japanese character.`,
    openGraph: {
      title: `${kanjiData.kanji} (${cleanMeaning}) | JLPT N4 Kanji`,
      description: `Learn the JLPT N4 kanji ${kanjiData.kanji} (${cleanMeaning}). View readings, examples, and study tips.`,
      url: `https://jlptprofessor.com/n4-kanji-list/${encodeURIComponent(kanjiData.kanji)}`,
      siteName: 'JLPT Professor',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${kanjiData.kanji} (${cleanMeaning}) | JLPT N4 Kanji`,
      description: `Learn the JLPT N4 kanji ${kanjiData.kanji} (${cleanMeaning}). View readings, examples, and study tips.`,
    },
  };
}

export default function KanjiDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
