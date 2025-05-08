'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ColorModeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

// Script to be injected into the HTML to prevent flash of unstyled content
const ThemeScript = () => {
  const codeToRunOnClient = `
    (function() {
      try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark-mode');
          document.body.classList.add('dark-mode');
        }
      } catch (e) {
        console.error('Error applying theme:', e);
      }
    })()
  `;

  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />;
};

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check local storage for saved preference
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    
    // Update local storage and body class when theme changes
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.documentElement.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode, isInitialized]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <>
      <ThemeScript />
      <ColorModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
        {isInitialized ? children : null}
      </ColorModeContext.Provider>
    </>
  );
}

export function useColorMode() {
  const context = useContext(ColorModeContext);
  if (context === undefined) {
    throw new Error('useColorMode must be used within a ColorModeProvider');
  }
  return context;
}
