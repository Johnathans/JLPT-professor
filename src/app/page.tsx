'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useState } from 'react';
import Image from 'next/image';
import Logo from '@/components/Logo';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');

  // Calculate statistics based on actual data
  const n5KanjiCount = 80;  // Approximate count from n5-kanji-new.json
  const n4KanjiCount = 170; // Approximate count from n4-kanji-new.json
  const n3KanjiCount = 370; // Approximate count from n3-kanji-new.json
  const n2KanjiCount = 374; // From n2-kanji-new-part2.json
  const totalKanjiCount = n5KanjiCount + n4KanjiCount + n3KanjiCount + n2KanjiCount;
  
  const n5WordsCount = 800; // Approximate count from n5-words-complete.ts

  // Word categories for each level
  const wordCategories = {
    N5: [
      { name: 'Verbs', count: 150, link: '/n5-kanji-list?type=verb' },
      { name: 'Adjectives', count: 100, link: '/n5-kanji-list?type=adj' },
      { name: 'Nouns', count: 550, link: '/n5-kanji-list?type=noun' },
      { name: 'View All', count: n5WordsCount, link: '/n5-kanji-list' }
    ],
    N4: [
      { name: 'Verbs', count: 300, link: '/n4-kanji-list?type=verb' },
      { name: 'Adjectives', count: 200, link: '/n4-kanji-list?type=adj' },
      { name: 'Nouns', count: 1000, link: '/n4-kanji-list?type=noun' },
      { name: 'View All', count: 1500, link: '/n4-kanji-list' }
    ],
    N3: [
      { name: 'Verbs', count: 600, link: '/n3-kanji-list?type=verb' },
      { name: 'Adjectives', count: 400, link: '/n3-kanji-list?type=adj' },
      { name: 'Nouns', count: 2000, link: '/n3-kanji-list?type=noun' },
      { name: 'View All', count: 3000, link: '/n3-kanji-list' }
    ],
    N2: [
      { name: 'Verbs', count: 1200, link: '/n2-kanji-list?type=verb' },
      { name: 'Adjectives', count: 800, link: '/n2-kanji-list?type=adj' },
      { name: 'Nouns', count: 4000, link: '/n2-kanji-list?type=noun' },
      { name: 'View All', count: 6000, link: '/n2-kanji-list' }
    ],
    N1: [
      { name: 'Verbs', count: 2000, link: '/n1-kanji-list?type=verb' },
      { name: 'Adjectives', count: 1500, link: '/n1-kanji-list?type=adj' },
      { name: 'Nouns', count: 6500, link: '/n1-kanji-list?type=noun' },
      { name: 'View All', count: 10000, link: '/n1-kanji-list' }
    ]
  };

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logoWrapper}>
            <Logo size={60} className={styles.logoIcon} color="white" />
          </div>
          <h1 className={styles.title}>Master Japanese with JLPT Professor</h1>
          <p className={styles.subtitle}>
            Your complete study companion for the Japanese Language Proficiency Test.
            Comprehensive resources for all JLPT levels from N5 to N1.
          </p>
          <div className={styles.levelButtons}>
            <Link href="/n5-kanji-list" className={styles.levelButton}>N5 Beginner</Link>
            <Link href="/n4-kanji-list" className={styles.levelButton}>N4 Elementary</Link>
            <Link href="/n3-kanji-list" className={styles.levelButton}>N3 Intermediate</Link>
            <Link href="/n2-kanji-list" className={styles.levelButton}>N2 Advanced</Link>
            <Link href="/n1-kanji-list" className={styles.levelButton}>N1 Expert</Link>
          </div>
          <div className={styles.statCards}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{n5WordsCount}+</span>
              <span className={styles.statLabel}>Vocabulary Words</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{totalKanjiCount}+</span>
              <span className={styles.statLabel}>Kanji Characters</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statValue}>5</span>
              <span className={styles.statLabel}>JLPT Levels</span>
            </div>
          </div>
          <div className={styles.heroCta}>
            <Link href="/n5-kanji-list" className={styles.ctaButton}>
              Start Studying Now
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* JLPT Levels Section */}
      <section className={styles.levels}>
        <h2 className={styles.sectionTitle}>JLPT Levels</h2>
        <div className={styles.levelGrid}>
          <Link href="/n5-kanji-list" className={styles.levelCard}>
            <h3 className={styles.levelTitle}>N5</h3>
            <p>Basic Japanese knowledge. Around 800 vocabulary words.</p>
            <div className={styles.levelBottom}>
              <div className={styles.levelDotsContainer}>
                <div className={styles.levelDots}>
                  <span className={`${styles.levelDot} ${styles.active}`}></span>
                  <span className={styles.levelDot}></span>
                  <span className={styles.levelDot}></span>
                  <span className={styles.levelDot}></span>
                  <span className={styles.levelDot}></span>
                </div>
                <small className={styles.levelDotsLabel}>difficulty</small>
              </div>
              <span className={styles.levelArrow}>→</span>
            </div>
          </Link>
          <Link href="/n4-kanji-list" className={styles.levelCard}>
            <h3 className={styles.levelTitle}>N4</h3>
            <p>Basic Japanese ability. Around 1,500 vocabulary words.</p>
            <div className={styles.levelBottom}>
              <div className={styles.levelDotsContainer}>
                <div className={styles.levelDots}>
                  <span className={`${styles.levelDot} ${styles.active}`}></span>
                  <span className={`${styles.levelDot} ${styles.active}`}></span>
                  <span className={styles.levelDot}></span>
                  <span className={styles.levelDot}></span>
                  <span className={styles.levelDot}></span>
                </div>
                <small className={styles.levelDotsLabel}>difficulty</small>
              </div>
              <span className={styles.levelArrow}>→</span>
            </div>
          </Link>
          <Link href="/n3-kanji-list" className={styles.levelCard}>
            <h3 className={styles.levelTitle}>N3</h3>
            <p>Intermediate Japanese. Around 3,000 vocabulary words.</p>
            <div className={styles.levelBottom}>
              <div className={styles.levelDotsContainer}>
                <div className={styles.levelDots}>
                  <span className={`${styles.levelDot} ${styles.active}`}></span>
                  <span className={`${styles.levelDot} ${styles.active}`}></span>
                  <span className={`${styles.levelDot} ${styles.active}`}></span>
                  <span className={styles.levelDot}></span>
                  <span className={styles.levelDot}></span>
                </div>
                <small className={styles.levelDotsLabel}>difficulty</small>
              </div>
              <span className={styles.levelArrow}>→</span>
            </div>
          </Link>
          <Link href="/n2-kanji-list" className={styles.levelCard}>
            <h3 className={styles.levelTitle}>N2</h3>
            <p>Pre-advanced Japanese. Around 6,000 vocabulary words.</p>
            <div className={styles.levelBottom}>
              <div className={styles.levelDotsContainer}>
                <div className={styles.levelDots}>
                  <span className={`${styles.levelDot} ${styles.active}`}></span>
                  <span className={`${styles.levelDot} ${styles.active}`}></span>
                  <span className={`${styles.levelDot} ${styles.active}`}></span>
                  <span className={`${styles.levelDot} ${styles.active}`}></span>
                  <span className={styles.levelDot}></span>
                </div>
                <small className={styles.levelDotsLabel}>difficulty</small>
              </div>
              <span className={styles.levelArrow}>→</span>
            </div>
          </Link>
          <Link href="/n1-kanji-list" className={styles.levelCard}>
            <h3 className={styles.levelTitle}>N1</h3>
            <p>Advanced Japanese. Around 10,000 vocabulary words.</p>
            <div className={styles.levelBottom}>
              <div className={styles.levelDotsContainer}>
                <div className={styles.levelDots}>
                  <span className={`${styles.levelDot} ${styles.active}`}></span>
                  <span className={`${styles.levelDot} ${styles.active}`}></span>
                  <span className={`${styles.levelDot} ${styles.active}`}></span>
                  <span className={`${styles.levelDot} ${styles.active}`}></span>
                  <span className={`${styles.levelDot} ${styles.active}`}></span>
                </div>
                <small className={styles.levelDotsLabel}>difficulty</small>
              </div>
              <span className={styles.levelArrow}>→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Learning Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Smart Search</h3>
            <p>Find words instantly by kanji, reading, or meaning</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 6H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Word Categories</h3>
            <p>Browse by verbs, adjectives, nouns, and more</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Responsive Design</h3>
            <p>Study on any device with our adaptive interface</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20L12 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 20V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Focused Learning</h3>
            <p>Distraction-free design for efficient studying</p>
          </div>
        </div>
      </section>

      {/* Word Categories Section */}
      <section className={styles.wordCategories}>
        <h2>Word Categories</h2>
        <div className={styles.levelTabs}>
          {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setActiveTab(level)}
              className={`${styles.levelTab} ${activeTab === level ? styles.active : ''}`}
            >
              {level}
            </button>
          ))}
        </div>
        <div className={styles.categoryGrid}>
          {wordCategories[activeTab].map((category) => (
            <Link key={category.name} href={category.link} className={styles.categoryCard}>
              <h3 className={styles.categoryTitle}>{category.name}</h3>
              <p className={styles.wordCount}>{category.count} words</p>
              <span className={styles.categoryArrow}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Get Started Section */}
      <section className={styles.getStarted}>
        <div className={styles.getStartedContent}>
          <h2>Ready to Master Japanese?</h2>
          <p>Begin your journey with our carefully curated JLPT vocabulary lists.</p>
          <div className={styles.getStartedButtons}>
            <Link href="/n5-kanji-list" className={styles.ctaButton}>
              Start with N5
            </Link>
            <Link href="/n4-kanji-list" className={`${styles.ctaButton} ${styles.secondaryButton}`}>
              Browse N4
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
