'use client';

import { createContext, useContext, useState } from 'react';

export type WordStatus = 'New Words' | 'Review Words' | 'Learned Words';

interface WordStatusContextType {
  status: WordStatus;
  setStatus: (status: WordStatus) => void;
}

const WordStatusContext = createContext<WordStatusContextType | undefined>(undefined);

export function WordStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<WordStatus>('New Words');

  return (
    <WordStatusContext.Provider value={{ status, setStatus }}>
      {children}
    </WordStatusContext.Provider>
  );
}

export function useWordStatus() {
  const context = useContext(WordStatusContext);
  if (context === undefined) {
    throw new Error('useWordStatus must be used within a WordStatusProvider');
  }
  return context;
}
