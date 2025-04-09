'use client';

import { useEffect, useState, use } from 'react';
import { n5VocabularyCombined } from '@/data/n5-vocabulary-combined';
import { Word } from '@/types/word';
import Link from 'next/link';
import styles from '@/styles/word-detail.module.css';
import { generateWordSlug } from '@/utils/url';

type Props = {
  params: Promise<{ slug: string }>;
}

export default function VocabularyDetailPage({ params }: Props) {
  // Unwrap the params promise at the component level
  const resolvedParams = use(params);
  
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedWords, setRelatedWords] = useState<Word[]>([]);

  useEffect(() => {
    // Find the word that matches this slug
    const foundWord = n5VocabularyCombined.find(w => generateWordSlug(w) === resolvedParams.slug);

    if (foundWord) {
      setWord(foundWord);
      
      // Find related words (other N5 vocabulary with same type or similar meaning)
      const related = n5VocabularyCombined
        .filter(w => w.id !== foundWord.id && 
          (w.type === foundWord.type || 
           w.meaning.toLowerCase().includes(foundWord.meaning.toLowerCase()) ||
           foundWord.meaning.toLowerCase().includes(w.meaning.toLowerCase())))
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, 4); // Limit to 4 related words
      
      setRelatedWords(related);
    } else {
      setError('Word not found');
    }
    
    setLoading(false);
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading word details...</p>
        </div>
      </div>
    );
  }

  if (error || !word) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          <h2>Error</h2>
          <p>{error || 'Word not found'}</p>
          <Link href="/n5-vocabulary" className={styles.backLink}>
            ← Back to N5 Vocabulary
          </Link>
        </div>
      </div>
    );
  }

  // Helper function to get conjugations based on word type
  const getConjugations = (word: Word) => {
    const isVerb = word.type.includes('verb');
    const isIAdjective = word.type.includes('i-adj');
    const isNaAdjective = word.type.includes('na-adj');

    if (isVerb) {
      return {
        title: 'Verb Conjugations',
        forms: [
          {
            label: 'Plain Form (Dictionary):',
            value: word.kana
          },
          {
            label: 'Polite Form (-masu):',
            value: `${word.kana.slice(0, -1)}ます`
          },
          {
            label: 'Negative Form (-nai):',
            value: `${word.kana.slice(0, -1)}ない`
          },
          {
            label: 'Past Form (-ta):',
            value: `${word.kana.slice(0, -1)}た`
          },
          {
            label: 'Te-form:',
            value: `${word.kana.slice(0, -1)}て`
          }
        ]
      };
    } else if (isIAdjective) {
      const stem = word.kana.slice(0, -1);
      return {
        title: 'Adjective Conjugations',
        forms: [
          {
            label: 'Plain Form:',
            value: word.kana
          },
          {
            label: 'Negative Form:',
            value: `${stem}くない`
          },
          {
            label: 'Past Form:',
            value: `${stem}かった`
          },
          {
            label: 'Te-form:',
            value: `${stem}くて`
          }
        ]
      };
    } else if (isNaAdjective) {
      return {
        title: 'Adjective Conjugations',
        forms: [
          {
            label: 'Plain Form:',
            value: word.kana
          },
          {
            label: 'Negative Form:',
            value: `${word.kana}じゃない`
          },
          {
            label: 'Past Form:',
            value: `${word.kana}だった`
          },
          {
            label: 'Te-form:',
            value: `${word.kana}で`
          }
        ]
      };
    }
    return null;
  };

  const conjugations = getConjugations(word);

  // Helper function to get type-specific usage notes
  const getUsageNotes = (word: Word) => {
    if (word.type.includes('verb')) {
      return [
        'Use the polite form (-masu) when speaking formally or to superiors',
        'Use the plain form in casual conversations or when writing',
        'The te-form is used to connect multiple actions or make requests',
        'The negative form (-nai) is used to express "not doing" the action'
      ];
    } else if (word.type.includes('i-adj')) {
      return [
        'Ends in い and conjugates like other i-adjectives',
        'Can directly modify nouns without any particles',
        'Changes to くない for negative form',
        'Changes to かった for past tense'
      ];
    } else if (word.type.includes('na-adj')) {
      return [
        'Requires な when modifying nouns',
        'Uses だ/です for present tense',
        'Uses じゃない/ではない for negative',
        'Uses だった/でした for past tense'
      ];
    } else if (word.type.includes('noun')) {
      return [
        'Can be used with は (wa) as the topic of a sentence',
        'Can be used with が (ga) as the subject of a sentence',
        'Can be used with を (wo) as the object of a sentence',
        'Can be used with の (no) to show possession'
      ];
    }
    return [
      'This word is commonly used in everyday Japanese',
      'Pay attention to the context when using this word',
      'Practice using it in simple sentences',
      'Try to learn related vocabulary to expand your knowledge'
    ];
  };

  const usageNotes = getUsageNotes(word);

  return (
    <div className={styles.container}>
      <div className={styles.wordDetailHeader}>
        <Link href="/n5-vocabulary" className={styles.backLink}>
          ← Back to N5 Vocabulary
        </Link>
        <h1 className={styles.wordDetailTitle}>
          {word.kanji && <span className={styles.kanjiHeading}>{word.kanji}</span>}
          <span className={styles.kanaHeading}>{word.kana}</span>
        </h1>
        <p className={styles.wordDetailMeaning}>{word.meaning}</p>
      </div>

      <div className={styles.wordDetailCard}>
        <div className={styles.wordDetailSection}>
          <h2>Details</h2>
          <div className={styles.wordDetailGrid}>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Type:</span>
              <span className={styles.wordDetailValue}>{word.type}</span>
            </div>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>JLPT Level:</span>
              <span className={styles.wordDetailValue}>N5</span>
            </div>
            {word.kanji && (
              <div className={styles.wordDetailItem}>
                <span className={styles.wordDetailLabel}>Kanji:</span>
                <span className={styles.wordDetailValue}>{word.kanji}</span>
              </div>
            )}
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Reading:</span>
              <span className={styles.wordDetailValue}>{word.kana}</span>
            </div>
            <div className={styles.wordDetailItem}>
              <span className={styles.wordDetailLabel}>Romaji:</span>
              <span className={styles.wordDetailValue}>{word.romaji}</span>
            </div>
          </div>
        </div>

        {conjugations && (
          <div className={styles.wordDetailSection}>
            <h2>{conjugations.title}</h2>
            <div className={styles.wordDetailGrid}>
              {conjugations.forms.map((form, index) => (
                <div key={index} className={styles.wordDetailItem}>
                  <span className={styles.wordDetailLabel}>{form.label}</span>
                  <span className={styles.wordDetailValue}>{form.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {word.examples && word.examples.length > 0 && (
          <div className={styles.wordDetailSection}>
            <h2>Example Sentences</h2>
            <ul className={styles.exampleList}>
              {word.examples.map((example, index) => (
                <li key={index} className={styles.exampleItem}>
                  <div className={styles.exampleJapanese}>{example.japanese}</div>
                  <div className={styles.exampleEnglish}>{example.english}</div>
                </li>
              ))}
            </ul>
          </div>
        ) || (
          <div className="alert alert-info" role="alert">
            No examples found for "{word.kanji}"
          </div>
        )}

        <div className={styles.wordDetailSection}>
          <h2>Usage Notes</h2>
          <p>
            This is a common {word.type} that you'll encounter frequently in everyday conversations.
            Here are some key points about using "{word.kana}":
          </p>
          <ul className={styles.studyTipsList}>
            {usageNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>

        <div className={styles.wordDetailSection}>
          <h2>Study Tips</h2>
          <ul className={styles.studyTipsList}>
            <li>Create flashcards with example sentences using this word</li>
            <li>Practice using this word in different contexts</li>
            <li>Try to use this word in your daily Japanese conversations</li>
            {word.kanji && <li>Practice writing the kanji if the word uses it</li>}
          </ul>
        </div>

        {relatedWords.length > 0 && (
          <div className={styles.wordDetailSection}>
            <h2>Related N5 Words</h2>
            <div className={styles.relatedWordsList}>
              {relatedWords.map((relatedWord, index) => (
                <Link 
                  key={index}
                  href={`/n5-vocabulary/${generateWordSlug(relatedWord)}`}
                  className={styles.relatedWordCard}
                >
                  <div className={styles.relatedWordKanji}>{relatedWord.kanji}</div>
                  <div className={styles.relatedWordKana}>{relatedWord.kana}</div>
                  <div className={styles.relatedWordMeaning}>{relatedWord.meaning}</div>
                </Link>
              ))}
            </div>
          </div>
        ) || (
          <div className="alert alert-info" role="alert">
            No compounds found for "{word.kanji}" in the N5 vocabulary list
          </div>
        )}

        <div className={styles.practiceSection}>
          <h2 className={styles.practiceTitle}>Practice N5 Vocabulary</h2>
          <p className={styles.practiceDescription}>
            Reinforce your knowledge of N5 vocabulary through interactive exercises.
          </p>
          <div className={styles.practiceButtonContainer}>
            <Link href="/n5-vocabulary/flashcards" className={styles.practiceButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
              </svg>
              Practice with Flashcards
            </Link>
            <Link href="/n5-vocabulary" className={styles.secondaryPracticeButton}>
              Explore More N5 Words
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
