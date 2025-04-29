'use client';

import Link from 'next/link';
import styles from '@/styles/signup-cta.module.css';

export default function SignupCTA() {
  return (
    <div className={styles.ctaSection}>
      <div className={styles.ctaContent}>
        <h2>Ready to Start Learning?</h2>
        <p>Create a free account to track your progress</p>
        <Link href="/signup" className={styles.ctaButton}>
          Sign Up Free
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}
