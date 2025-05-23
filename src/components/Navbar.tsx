'use client';

import React from 'react';
import { Moon, Sun, Home, BookOpen, RefreshCw, BarChart2, LogOut } from 'react-feather';
import styles from '@/styles/dashboard.module.css';
import { useColorMode } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  className?: string;
  forceDarkMode?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ className, forceDarkMode }) => {
  const { isDarkMode: contextDarkMode, toggleDarkMode } = useColorMode();
  const isDarkMode = forceDarkMode !== undefined ? forceDarkMode : contextDarkMode;
  const pathname = usePathname();

  return (
    <nav className={`${styles.nav} ${className || ''}`}>
      <div className={styles.navHeader}>
        <div className={styles.logo}>
          {/* SVG logo removed as requested */}
          <span className={styles.logoText}>
            <span className={styles.jlptText}>JLPT</span>
            <span className={styles.professorText}>Professor</span>
          </span>
        </div>
      </div>

      {/* Search bar removed */}

      <div className={styles.navContent}>
        <Link href="/dashboard" className={styles.navLink}>
          <div className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`}>
            <Home size={20} className={styles.navIcon} />
            <span>Dashboard</span>
          </div>
        </Link>
        <Link href="/study" className={styles.navLink}>
          <div className={`${styles.navItem} ${pathname === '/study' ? styles.active : ''}`}>
            <BookOpen size={20} className={styles.navIcon} />
            <span>Study</span>
          </div>
        </Link>
        <div className={styles.navItem}>
          <RefreshCw size={20} className={styles.navIcon} />
          <span>Review</span>
        </div>
        <div className={styles.navItem}>
          <BarChart2 size={20} className={styles.navIcon} />
          <span>Progress</span>
        </div>
        <div className={styles.navItem}>
          <LogOut size={20} className={styles.navIcon} />
          <span>Logout</span>
        </div>
        <div className={styles.navItem} onClick={toggleDarkMode}>
          {isDarkMode ? <Sun size={20} className={styles.navIcon} /> : <Moon size={20} className={styles.navIcon} />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          <div className={`${styles.toggle} ${isDarkMode ? styles.active : ''}`}>
            <div className={styles.toggleThumb} />
          </div>
        </div>
        
        <div className={styles.proBox}>
          <span>JLPT Professor Pro</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
