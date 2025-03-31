'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import storiesData from '@/data/n5-stories.json';
import styles from './stories.module.css';

export default function N5StoriesPage() {
  const [hoveredStory, setHoveredStory] = useState<string | null>(null);
  const [totalStats, setTotalStats] = useState({
    totalStories: 0,
    totalWords: 0,
    totalKanji: 0
  });

  useEffect(() => {
    // Create sets to track unique words and kanji
    const uniqueWords = new Set();
    const uniqueKanji = new Set();

    // Collect unique words and kanji from all stories
    storiesData.stories.forEach(story => {
      // Add words from vocabulary section
      if (story.vocabulary?.n5_words) {
        story.vocabulary.n5_words.forEach(word => {
          uniqueWords.add(word.word);
        });
      }

      // Add kanji from content
      story.content.forEach(segment => {
        if (segment.segments) {
          segment.segments.forEach(seg => {
            if (seg.isKanji) {
              uniqueKanji.add(seg.text);
            }
          });
        }
      });
    });

    const totals = {
      totalStories: storiesData.stories.length,
      totalWords: uniqueWords.size,
      totalKanji: uniqueKanji.size
    };
    setTotalStats(totals);
  }, []);

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>JLPT N5 Reading Practice</h1>
        <p className={styles.subtitle}>
          Master Japanese reading with our carefully curated collection of N5-level stories. 
          Each story is designed to build your confidence and reinforce essential vocabulary.
        </p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{totalStats.totalStories}</div>
            <div className={styles.statLabel}>Practice Stories</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{totalStats.totalWords}</div>
            <div className={styles.statLabel}>N5 Words</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{totalStats.totalKanji}</div>
            <div className={styles.statLabel}>N5 Kanji</div>
          </div>
        </div>
      </section>

      <section className={styles.storiesGrid}>
        {storiesData.stories.map((story) => (
          <Link
            href={`/n5-stories/${story.id}`}
            key={story.id}
            className={styles.storyCard}
            onMouseEnter={() => setHoveredStory(story.id)}
            onMouseLeave={() => setHoveredStory(null)}
          >
            <div className={styles.storyContent}>
              <div>
                <h2 className={styles.storyTitle}>{story.title}</h2>
                <p className={styles.storyDescription}>{story.description}</p>
              </div>
              
              <div className={styles.statsGrid}>
                <div className={styles.stat}>
                  <div className={styles.statValue}>{story.stats.n5_words || 0}</div>
                  <div className={styles.statLabel}>N5 Words</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statValue}>{story.stats.n5_kanji || 0}</div>
                  <div className={styles.statLabel}>N5 Kanji</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statValue}>{story.stats.estimated_time || 0}</div>
                  <div className={styles.statLabel}>Minutes</div>
                </div>
              </div>

              <div className={styles.readMore}>
                <span>Read Story</span>
                <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 12H4.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
