'use client';

import React from 'react';
import { Search, Home, BarChart2, Bell, Heart, CreditCard, LogOut, Moon, Sun } from 'react-feather';
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
          <div className={styles.logoIcon}>
            <img 
              src="/assets/1169415_professor_teacher_scientist_icon.svg" 
              alt="Professor" 
              className={styles.logoSvg}
            />
          </div>
          <span className={styles.logoText}>JLPT Professor</span>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <Search size={20} className={styles.searchIcon} />
        <input type="text" placeholder="Search..." className={styles.searchInput} />
      </div>

      <div className={styles.navContent}>
        <Link href="/dashboard" className={styles.navLink}>
          <div className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`}>
            <Home size={20} />
            <span>Dashboard</span>
          </div>
        </Link>
        <Link href="/study" className={styles.navLink}>
          <div className={`${styles.navItem} ${pathname === '/study' ? styles.active : ''}`}>
            <BarChart2 size={20} />
            <span>Study</span>
          </div>
        </Link>
        <div className={styles.navItem}>
          <Bell size={20} />
          <span>Notifications</span>
        </div>
        <div className={styles.navItem}>
          <Heart size={20} />
          <span>Favorites</span>
        </div>
        <div className={styles.navItem}>
          <CreditCard size={20} />
          <span>Study Cards</span>
        </div>
      </div>

      <div className={styles.navFooter}>
        <div className={styles.navItem}>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
        <div className={styles.navItem} onClick={toggleDarkMode}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          <div className={`${styles.toggle} ${isDarkMode ? styles.active : ''}`}>
            <div className={styles.toggleThumb} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
