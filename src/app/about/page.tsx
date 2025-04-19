'use client';

import styles from './page.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About JLPT Professor</h1>
      <div className={styles.content}>
        <section className={styles.section}>
          <h2>Our Mission</h2>
          <p>
            JLPT Professor is dedicated to making Japanese language learning accessible and effective. 
            We focus on providing comprehensive study materials for the Japanese Language Proficiency Test (JLPT),
            helping students master kanji, vocabulary, and grammar through interactive tools and structured learning paths.
          </p>
        </section>

        <section className={styles.section}>
          <h2>What We Offer</h2>
          <ul className={styles.featureList}>
            <li>Comprehensive JLPT study materials (N5 to N1)</li>
            <li>Interactive flashcard system for efficient learning</li>
            <li>Detailed kanji information with readings and examples</li>
            <li>Regular content updates and improvements</li>
            <li>Mobile-friendly design for learning on the go</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Our Approach</h2>
          <p>
            We believe in a structured, systematic approach to Japanese language learning. 
            Our platform is designed to help you build a strong foundation in Japanese,
            progressing naturally from basic to advanced levels while maintaining motivation
            through interactive features and clear progress tracking.
          </p>
        </section>
      </div>
    </div>
  );
}
