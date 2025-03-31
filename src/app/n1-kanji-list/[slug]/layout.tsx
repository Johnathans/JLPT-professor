import type { Metadata } from 'next';
import { n1WordsComplete } from '@/data/n1-words-complete';
import { generateWordSlug } from '@/utils/url';

export function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Metadata {
  // Decode the slug
  const decodedSlug = decodeURIComponent(params.slug);
  
  // Find the word that matches this slug
  const word = n1WordsComplete.find(w => generateWordSlug(w) === decodedSlug);
  
  // If word is not found, return default metadata
  if (!word) {
    return {
      title: 'Kanji Not Found | JLPT Professor',
      description: 'The requested kanji could not be found.',
    };
  }
  
  const title = word.kanji 
    ? `${word.kanji} (${word.meaning}) | JLPT N1 Kanji | JLPT Professor`
    : `${word.kana} (${word.meaning}) | JLPT N1 Vocabulary | JLPT Professor`;
  
  const description = word.kanji
    ? `Learn the meaning, readings, and usage of the JLPT N1 kanji ${word.kanji} (${word.meaning}). Practice with example sentences and related vocabulary.`
    : `Learn the meaning, pronunciation, and usage of the JLPT N1 vocabulary word ${word.kana} (${word.meaning}). Practice with example sentences and related words.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
