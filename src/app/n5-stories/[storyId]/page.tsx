'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import storiesData from '@/data/n5-stories.json';
import styles from './story.module.css';

interface Segment {
  text: string;
  isKanji?: boolean;
  reading?: string;
  id?: string;
}

interface ContentItem {
  type: string;
  text?: string;
  segments?: Segment[];
}

interface Story {
  id: string;
  title: string;
  titleTranslation: string;
  description: string;
  stats: {
    n5_words: number;
    n5_kanji: number;
    estimated_time: number;
  };
  content: ContentItem[];
  vocabulary: {
    n5_words: Array<{
      word: string;
      reading: string;
      meaning: string;
    }>;
  };
}

export default function StoryPage() {
  const params = useParams();
  const story = storiesData.stories.find(s => s.id === params.storyId) as Story;
  const [hoveredKanji, setHoveredKanji] = useState<string | null>(null);

  if (!story) {
    return (
      <div className={styles.container}>
        <h1>Story not found</h1>
        <Link href="/n5-stories" className={styles.backLink}>
          ← Back to Stories
        </Link>
      </div>
    );
  }

  const renderSegments = (segments: Segment[] = []) => {
    return segments.map((segment, index) => {
      if (segment.isKanji) {
        return (
          <span
            key={index}
            className={styles.kanji}
            onMouseEnter={() => setHoveredKanji(segment.id)}
            onMouseLeave={() => setHoveredKanji(null)}
          >
            {segment.text}
            {hoveredKanji === segment.id && (
              <span className={styles.reading}>{segment.reading}</span>
            )}
          </span>
        );
      }
      return <span key={index}>{segment.text}</span>;
    });
  };

  const renderContent = (content: ContentItem[]) => {
    return content.map((item, index) => {
      switch (item.type) {
        case 'title':
          return <h1 key={index} className={styles.storyTitle}>{item.text}</h1>;
        case 'subtitle':
          return (
            <h2 key={index} className={styles.subtitle}>
              {renderSegments(item.segments)}
            </h2>
          );
        case 'paragraph':
          return (
            <p key={index} className={styles.paragraph}>
              {renderSegments(item.segments)}
            </p>
          );
        case 'dialogue':
          return (
            <p key={index} className={styles.dialogue}>
              {renderSegments(item.segments)}
            </p>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className={styles.container}>
      <Link href="/n5-stories" className={styles.backLink}>
        ← Back to Stories
      </Link>
      
      <article className={styles.storyArticle}>
        <header className={styles.storyHeader}>
          <div className={styles.statsBar}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{story.stats.n5_words}</span>
              <span className={styles.statLabel}>N5 Words</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{story.stats.n5_kanji}</span>
              <span className={styles.statLabel}>N5 Kanji</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{story.stats.estimated_time}</span>
              <span className={styles.statLabel}>Minutes</span>
            </div>
          </div>
        </header>

        <div className={styles.storyContent}>
          {renderContent(story.content)}
        </div>

        <footer className={styles.storyFooter}>
          <div className={styles.vocabularySection}>
            <h3 className={styles.sectionTitle}>N5 Vocabulary in this Story</h3>
            <div className={styles.vocabularyGrid}>
              {story.vocabulary.n5_words.map((word, index) => (
                <div key={index} className={styles.vocabularyItem}>
                  <div className={styles.word}>{word.word}</div>
                  <div className={styles.reading}>{word.reading}</div>
                  <div className={styles.meaning}>{word.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
