'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import styles from '@/app/page.module.css';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <footer className={`py-4 border-top${!isAuthPage ? ' mt-5' : ''}`}>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="d-flex align-items-center mb-2">
              <div className={styles.footerLogoWrapper}>
                <Logo size={24} className={styles.footerLogoIcon} color="white" />
              </div>
              <span className="ms-2" style={{ fontSize: '24px' }}><span style={{ fontWeight: 800 }}>JLPT</span> <span style={{ fontWeight: 300 }}>Professor</span></span>
            </div>
            <p className="text-muted">Your comprehensive study companion for the Japanese Language Proficiency Test.</p>
          </div>
          <div className="col-md-3">
            <h5>JLPT Levels</h5>
            <ul className="list-unstyled">
              <li><Link href="/n5-kanji-list" className={styles.footerLink}>N5 (Beginner)</Link></li>
              <li><Link href="/n4-kanji-list" className={styles.footerLink}>N4 (Basic)</Link></li>
              <li><Link href="/n3-kanji-list" className={styles.footerLink}>N3 (Intermediate)</Link></li>
              <li><Link href="/n2-kanji-list" className={styles.footerLink}>N2 (Advanced)</Link></li>
              <li><Link href="/n1-kanji-list" className={styles.footerLink}>N1 (Expert)</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Resources</h5>
            <ul className="list-unstyled">
              <li><Link href="/contact" className="text-decoration-none">Contact</Link></li>
              <li><Link href="/privacy" className="text-decoration-none">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-decoration-none">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12 text-center">
            <p className="text-muted">&copy; {new Date().getFullYear()} JLPT Professor. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
