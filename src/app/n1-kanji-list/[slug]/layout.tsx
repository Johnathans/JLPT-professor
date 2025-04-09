import type { Metadata, ResolvingMetadata } from 'next';
import { n1WordsComplete } from '@/data/n1-words-complete';
import { generateWordSlug } from '@/utils/url';

type LayoutProps = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Decode the slug
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  // Find the word that matches this slug
  const word = n1WordsComplete.find(w => generateWordSlug(w) === decodedSlug);
  
  // If word is not found, return default metadata
  if (!word) {
    return {
      title: 'Kanji Not Found | JLPT Professor',
      description: 'The requested kanji could not be found.',
    };
  }
  
  // Create a clean meaning without HTML tags
  let cleanMeaning = '';
  if (word) {
    // Force the type to be any to handle the meaning property
    const wordAny = word as any;
    if (wordAny.meaning) {
      if (Array.isArray(wordAny.meaning) && wordAny.meaning.length > 0) {
        cleanMeaning = wordAny.meaning[0] ? wordAny.meaning[0].replace(/<[^>]*>/g, '') : '';
      } else if (typeof wordAny.meaning === 'string') {
        cleanMeaning = wordAny.meaning.replace(/<[^>]*>/g, '');
      }
    }
  }
  
  const title = word.kanji 
    ? `${word.kanji} (${cleanMeaning}) | JLPT N1 Kanji | JLPT Professor`
    : `${word.kana} (${cleanMeaning}) | JLPT N1 Vocabulary | JLPT Professor`;
  
  const description = word.kanji
    ? `Learn the meaning, readings, and usage of the JLPT N1 kanji ${word.kanji} (${cleanMeaning}). Practice with example sentences and related vocabulary.`
    : `Learn the meaning, pronunciation, and usage of the JLPT N1 vocabulary word ${word.kana} (${cleanMeaning}). Practice with example sentences and related words.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default function KanjiDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
