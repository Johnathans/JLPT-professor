'use client';

import Link from 'next/link';
import styles from '@/styles/word-detail.module.css';

interface BackButtonProps {
  href: string;
}

export function BackButton({ href }: BackButtonProps) {
  return (
    <Link href={href} className={styles.backLink}>
      ← Back
    </Link>
  );
}

export default BackButton;
