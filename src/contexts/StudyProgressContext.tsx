'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { StudyMode, JlptLevel } from '@/types/study';

// Define the state structure
type ProgressState = {
  [key in StudyMode]?: {
    [key in JlptLevel]?: number;
  };
};

// Define the action types
type ProgressAction =
  | { type: 'UPDATE_PROGRESS'; mode: StudyMode; level: JlptLevel; value: number }
  | { type: 'RESET_LEVEL_PROGRESS'; level: JlptLevel }
  | { type: 'RESET_ALL_PROGRESS' };

// Initial state with all modes and levels initialized to 0
const createInitialState = (): ProgressState => {
  const modes: StudyMode[] = ['vocabulary', 'sentences', 'kanji-meaning', 'kanji-onyomi', 'kanji-kunyomi', 'kanji-match'];
  const levels: JlptLevel[] = ['n1', 'n2', 'n3', 'n4', 'n5'];
  
  const state: ProgressState = {};
  
  modes.forEach(mode => {
    state[mode] = {};
    levels.forEach(level => {
      state[mode]![level] = 0;
    });
  });
  
  return state;
};

// Load state from localStorage if available
const loadInitialState = (): ProgressState => {
  if (typeof window === 'undefined') {
    return createInitialState();
  }
  
  try {
    const savedState = localStorage.getItem('jlptStudyProgress');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading progress from localStorage:', error);
  }
  
  return createInitialState();
};

// Create the reducer function
const progressReducer = (state: ProgressState, action: ProgressAction): ProgressState => {
  let newState: ProgressState;
  
  switch (action.type) {
    case 'UPDATE_PROGRESS':
      newState = {
        ...state,
        [action.mode]: {
          ...state[action.mode],
          [action.level]: action.value
        }
      };
      break;
      
    case 'RESET_LEVEL_PROGRESS':
      // Reset progress for a specific level
      newState = { ...state };
      Object.keys(newState).forEach(mode => {
        if (newState[mode as StudyMode]) {
          newState[mode as StudyMode] = {
            ...newState[mode as StudyMode],
            [action.level]: 0
          };
        }
      });
      break;
      
    case 'RESET_ALL_PROGRESS':
      newState = createInitialState();
      break;
      
    default:
      return state;
  }
  
  // Save to localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('jlptStudyProgress', JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
    }
  }
  
  return newState;
};

// Create the context
type ProgressContextType = {
  progressState: ProgressState;
  progressDispatch: React.Dispatch<ProgressAction>;
  getCurrentProgress: (mode: StudyMode, level: JlptLevel) => number;
  saveCurrentProgress: (mode: StudyMode, level: JlptLevel, value: number) => void;
  resetLevelProgress: (level: JlptLevel) => void;
  resetAllProgress: () => void;
};

const StudyProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Create the provider component
export const StudyProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progressState, progressDispatch] = useReducer(progressReducer, null, loadInitialState);

  // Helper functions for common operations
  const getCurrentProgress = (mode: StudyMode, level: JlptLevel): number => {
    const progress = progressState[mode]?.[level] ?? 0;
    console.log(`Context: Getting progress for ${mode}/${level}: ${progress}`);
    return progress;
  };
  
  const saveCurrentProgress = (mode: StudyMode, level: JlptLevel, value: number): void => {
    console.log(`Context: Saving progress for ${mode}/${level} to ${value}`);
    progressDispatch({ type: 'UPDATE_PROGRESS', mode, level, value });
  };
  
  const resetLevelProgress = (level: JlptLevel): void => {
    progressDispatch({ type: 'RESET_LEVEL_PROGRESS', level });
  };
  
  const resetAllProgress = (): void => {
    progressDispatch({ type: 'RESET_ALL_PROGRESS' });
  };

  return (
    <StudyProgressContext.Provider 
      value={{ 
        progressState, 
        progressDispatch, 
        getCurrentProgress, 
        saveCurrentProgress, 
        resetLevelProgress, 
        resetAllProgress 
      }}
    >
      {children}
    </StudyProgressContext.Provider>
  );
};

// Create a custom hook to use the context
export const useStudyProgress = () => {
  const context = useContext(StudyProgressContext);
  if (context === undefined) {
    throw new Error('useStudyProgress must be used within a StudyProgressProvider');
  }
  return context;
};
