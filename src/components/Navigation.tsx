'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container">
        <Link href="/" className="d-flex align-items-center text-decoration-none text-dark">
          <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            <Logo size={24} color="white" />
          </div>
          <span className="ms-2" style={{ fontSize: '24px' }}>
            <span style={{ fontWeight: 800 }}>JLPT</span>{' '}
            <span style={{ fontWeight: 300 }}>Professor</span>
            <span 
              style={{ 
                fontSize: '11px',
                fontWeight: 500,
                background: '#00bfa5',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                marginLeft: '8px',
                position: 'relative',
                top: '-8px'
              }}
            >
              BETA
            </span>
          </span>
        </Link>
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
              <Link className="nav-link dropdown-toggle" href="#" id="n5Dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                N5
              </Link>
              <ul className="dropdown-menu" aria-labelledby="n5Dropdown">
                <li><Link className="dropdown-item" href="/n5-stories">Stories</Link></li>
                <li><Link className="dropdown-item" href="/n5-listening">Listening</Link></li>
                <li><Link className="dropdown-item" href="/n5-kanji-list">Kanji</Link></li>
                <li><Link className="dropdown-item" href="/n5-verbs">Verbs</Link></li>
                <li><Link className="dropdown-item" href="/n5-adjectives">Adjectives</Link></li>
                <li><Link className="dropdown-item" href="/n5-nouns">Nouns</Link></li>
                <li><Link className="dropdown-item" href="/n5-vocabulary">Vocabulary</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" href="#" id="n4Dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                N4
              </Link>
              <ul className="dropdown-menu" aria-labelledby="n4Dropdown">
                <li><Link className="dropdown-item" href="/n4-kanji-list">Kanji</Link></li>
                <li><Link className="dropdown-item" href="/n4-verbs">Verbs</Link></li>
                <li><Link className="dropdown-item" href="/n4-adjectives">Adjectives</Link></li>
                <li><Link className="dropdown-item" href="/n4-nouns">Nouns</Link></li>
                <li><Link className="dropdown-item" href="/n4-vocabulary">Vocabulary</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" href="#" id="n3Dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                N3
              </Link>
              <ul className="dropdown-menu" aria-labelledby="n3Dropdown">
                <li><Link className="dropdown-item" href="/n3-kanji-list">Kanji</Link></li>
                <li><Link className="dropdown-item" href="/n3-verbs">Verbs</Link></li>
                <li><Link className="dropdown-item" href="/n3-adjectives">Adjectives</Link></li>
                <li><Link className="dropdown-item" href="/n3-nouns">Nouns</Link></li>
                <li><Link className="dropdown-item" href="/n3-vocabulary">Vocabulary</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" href="#" id="n2Dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                N2
              </Link>
              <ul className="dropdown-menu" aria-labelledby="n2Dropdown">
                <li><Link className="dropdown-item" href="/n2-kanji-list">Kanji</Link></li>
                <li><Link className="dropdown-item" href="/n2-verbs">Verbs</Link></li>
                <li><Link className="dropdown-item" href="/n2-adjectives">Adjectives</Link></li>
                <li><Link className="dropdown-item" href="/n2-nouns">Nouns</Link></li>
                <li><Link className="dropdown-item" href="/n2-vocabulary">Vocabulary</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle" href="#" id="n1Dropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                N1
              </Link>
              <ul className="dropdown-menu" aria-labelledby="n1Dropdown">
                <li><Link className="dropdown-item" href="/n1-kanji-list">Kanji</Link></li>
                <li><Link className="dropdown-item" href="/n1-verbs">Verbs</Link></li>
                <li><Link className="dropdown-item" href="/n1-adjectives">Adjectives</Link></li>
                <li><Link className="dropdown-item" href="/n1-nouns">Nouns</Link></li>
                <li><Link className="dropdown-item" href="/n1-vocabulary">Vocabulary</Link></li>
              </ul>
            </li>
            <li className="nav-item ms-lg-3">
              <Link 
                className="nav-link login-button" 
                href="/login"
              >
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link signup-button" 
                href="/signup"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
