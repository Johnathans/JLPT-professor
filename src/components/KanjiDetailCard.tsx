'use client';

import { useState } from 'react';
import { KanjiDetail } from '@/data/n4-kanji-details';
import StrokeOrderDisplay from '@/components/StrokeOrderDisplay';
import JlptLevelBadge from '@/components/JlptLevelBadge';
import Link from 'next/link';
import { generateWordSlug } from '@/utils/url';
import styles from '@/styles/kanji-list.module.css';

interface KanjiDetailCardProps {
  kanjiDetail: KanjiDetail;
}

export default function KanjiDetailCard({ kanjiDetail }: KanjiDetailCardProps) {
  const [showAllExamples, setShowAllExamples] = useState(false);
  
  // Limit example sentences initially
  const displayedExamples = showAllExamples 
    ? kanjiDetail.exampleSentences 
    : kanjiDetail.exampleSentences.slice(0, 3);
  
  return (
    <div className={styles.kanjiDetailCard}>
      <div className={styles.kanjiHeader}>
        <div className={styles.kanjiMain}>
          <h1 className={styles.kanjiCharacter}>{kanjiDetail.kanji}</h1>
          <div className={styles.kanjiReading}>{kanjiDetail.reading}</div>
        </div>
        <div className={styles.kanjiMeaning}>{kanjiDetail.meaning}</div>
        <div className={styles.levelBadgeWrapper}>
          <JlptLevelBadge word={kanjiDetail.kanji} />
        </div>
      </div>
      
      {/* Stroke Order Display */}
      <div className={styles.strokeOrderSection}>
        <h2 className={styles.sectionTitle}>Stroke Order</h2>
        <StrokeOrderDisplay kanji={kanjiDetail.kanji} />
      </div>
      
      {/* Example Sentences */}
      {kanjiDetail.exampleSentences.length > 0 && (
        <div className={styles.exampleSentencesSection}>
          <h2 className={styles.sectionTitle}>Example Sentences</h2>
          <div className={styles.exampleSentencesList}>
            {displayedExamples.map((example, index) => (
              <div key={index} className={styles.exampleSentence}>
                <div className={styles.japaneseSentence}>{example.japanese}</div>
                <div className={styles.englishSentence}>{example.english}</div>
              </div>
            ))}
          </div>
          
          {kanjiDetail.exampleSentences.length > 3 && (
            <button 
              className={styles.showMoreButton}
              onClick={() => setShowAllExamples(!showAllExamples)}
            >
              {showAllExamples ? 'Show Less' : `Show ${kanjiDetail.exampleSentences.length - 3} More Examples`}
            </button>
          )}
        </div>
      )}
      
      {/* Related Words */}
      {kanjiDetail.relatedWords.length > 0 && (
        <div className={styles.relatedWordsSection}>
          <h2 className={styles.sectionTitle}>Related Words</h2>
          <div className={styles.relatedWordsList}>
            {kanjiDetail.relatedWords.map((word, index) => (
              <Link 
                key={index} 
                href={`/n4-kanji-list/${generateWordSlug(word.word, word.reading, word.meaning)}`}
                className={styles.relatedWordCard}
              >
                <div className={styles.relatedWordKanji}>{word.word}</div>
                <div className={styles.relatedWordReading}>{word.reading}</div>
                <div className={styles.relatedWordMeaning}>{word.meaning}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Study Tips */}
      {kanjiDetail.studyTips && (
        <div className={styles.studyTipsSection}>
          <h2 className={styles.sectionTitle}>Study Tips</h2>
          <div className={styles.studyTipsContent}>
            {kanjiDetail.studyTips}
          </div>
        </div>
      )}
      
      {/* Practice Section */}
      <div className={styles.practiceSection}>
        <h2 className={styles.sectionTitle}>Practice</h2>
        <div className={styles.practiceButtons}>
          <button className={styles.practiceButton}>
            Practice with Flashcards
          </button>
          <Link href="/n4-kanji-list" className={styles.practiceButton}>
            Explore More N4 Kanji
          </Link>
        </div>
      </div>
    </div>
  );
}
