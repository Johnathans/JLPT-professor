'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

interface JlptLevelContextType {
  level: JlptLevel;
  setLevel: (level: JlptLevel) => void;
}

const JlptLevelContext = createContext<JlptLevelContextType | undefined>(undefined);

export function JlptLevelProvider({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState<JlptLevel>('N5');

  return (
    <JlptLevelContext.Provider value={{ level, setLevel }}>
      {children}
    </JlptLevelContext.Provider>
  );
}

export function useJlptLevel() {
  const context = useContext(JlptLevelContext);
  if (context === undefined) {
    throw new Error('useJlptLevel must be used within a JlptLevelProvider');
  }
  return context;
}
