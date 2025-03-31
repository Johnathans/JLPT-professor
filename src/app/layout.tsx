'use client';

import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import styles from './page.module.css'
import Logo from '@/components/Logo'
import { useEffect } from 'react'
import { metadata } from './metadata'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container">
            <a className="navbar-brand d-flex align-items-center" href="/">
              <div className={styles.navLogoWrapper}>
                <Logo size={24} className={styles.navLogoIcon} />
              </div>
              <span className="ms-2" style={{ fontSize: '24px' }}><span style={{ fontWeight: 800 }}>JLPT</span> <span style={{ fontWeight: 300 }}>Professor</span></span>
            </a>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" 
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
              <ul className="navbar-nav align-items-center">
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="n5Dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    N5
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="n5Dropdown">
                    <li><a className="dropdown-item" href="/n5-kanji-list">Kanji</a></li>
                    <li><a className="dropdown-item" href="/n5-verbs">Verbs</a></li>
                    <li><a className="dropdown-item" href="/n5-adjectives">Adjectives</a></li>
                    <li><a className="dropdown-item" href="/n5-nouns">Nouns</a></li>
                    <li><a className="dropdown-item" href="/n5-vocabulary">Vocabulary</a></li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="n4Dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    N4
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="n4Dropdown">
                    <li><a className="dropdown-item" href="/n4-kanji-list">Kanji</a></li>
                    <li><a className="dropdown-item" href="/n4-verbs">Verbs</a></li>
                    <li><a className="dropdown-item" href="/n4-adjectives">Adjectives</a></li>
                    <li><a className="dropdown-item" href="/n4-nouns">Nouns</a></li>
                    <li><a className="dropdown-item" href="/n4-vocabulary">Vocabulary</a></li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="n3Dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    N3
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="n3Dropdown">
                    <li><a className="dropdown-item" href="/n3-kanji-list">Kanji</a></li>
                    <li><a className="dropdown-item" href="/n3-verbs">Verbs</a></li>
                    <li><a className="dropdown-item" href="/n3-adjectives">Adjectives</a></li>
                    <li><a className="dropdown-item" href="/n3-nouns">Nouns</a></li>
                    <li><a className="dropdown-item" href="/n3-vocabulary">Vocabulary</a></li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="n2Dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    N2
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="n2Dropdown">
                    <li><a className="dropdown-item" href="/n2-kanji-list">Kanji</a></li>
                    <li><a className="dropdown-item" href="/n2-verbs">Verbs</a></li>
                    <li><a className="dropdown-item" href="/n2-adjectives">Adjectives</a></li>
                    <li><a className="dropdown-item" href="/n2-nouns">Nouns</a></li>
                    <li><a className="dropdown-item" href="/n2-vocabulary">Vocabulary</a></li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="n1Dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    N1
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="n1Dropdown">
                    <li><a className="dropdown-item" href="/n1-kanji-list">Kanji</a></li>
                    <li><a className="dropdown-item" href="/n1-verbs">Verbs</a></li>
                    <li><a className="dropdown-item" href="/n1-adjectives">Adjectives</a></li>
                    <li><a className="dropdown-item" href="/n1-nouns">Nouns</a></li>
                    <li><a className="dropdown-item" href="/n1-vocabulary">Vocabulary</a></li>
                  </ul>
                </li>
                <li className="nav-item ms-lg-3">
                  <a 
                    className="nav-link login-button" 
                    href="/login"
                  >
                    Login
                  </a>
                </li>
                <li className="nav-item">
                  <a 
                    className="nav-link signup-button" 
                    href="/signup"
                  >
                    Sign Up
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <main>
          {children}
        </main>
        <footer className="py-4 mt-5 border-top">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="d-flex align-items-center mb-2">
                  <div className={styles.footerLogoWrapper}>
                    <Logo size={24} className={styles.footerLogoIcon} />
                  </div>
                  <span className="ms-2" style={{ fontSize: '24px' }}><span style={{ fontWeight: 800 }}>JLPT</span> <span style={{ fontWeight: 300 }}>Professor</span></span>
                </div>
                <p className="text-muted">Your comprehensive study companion for the Japanese Language Proficiency Test.</p>
              </div>
              <div className="col-md-3">
                <h5>JLPT Levels</h5>
                <ul className="list-unstyled">
                  <li><a href="/n5-kanji-list" className="text-decoration-none">N5 (Beginner)</a></li>
                  <li><a href="/n4-kanji-list" className="text-decoration-none">N4 (Basic)</a></li>
                  <li><a href="/n3-kanji-list" className="text-decoration-none">N3 (Intermediate)</a></li>
                  <li><a href="/n2-kanji-list" className="text-decoration-none">N2 (Advanced)</a></li>
                  <li><a href="/n1-kanji-list" className="text-decoration-none">N1 (Expert)</a></li>
                </ul>
              </div>
              <div className="col-md-3">
                <h5>Resources</h5>
                <ul className="list-unstyled">
                  <li><a href="/contact" className="text-decoration-none">Contact</a></li>
                  <li><a href="/privacy" className="text-decoration-none">Privacy Policy</a></li>
                  <li><a href="/terms" className="text-decoration-none">Terms of Service</a></li>
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
      </body>
    </html>
  );
}
