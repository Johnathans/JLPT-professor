'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { StudyMode, JlptLevel, ProgressMetrics } from '../types/study';

// Progress metrics interface is now imported from '../types/study'

// Define the state structure
type ProgressState = {
  [key in StudyMode]?: {
    [key in JlptLevel]?: ProgressMetrics;
  };
};

// Define the action types
type ProgressAction =
  | { type: 'UPDATE_PROGRESS'; mode: StudyMode; level: JlptLevel; metrics: ProgressMetrics }
  | { type: 'RESET_LEVEL_PROGRESS'; level: JlptLevel }
  | { type: 'RESET_ALL_PROGRESS' };

// Default metrics for initializing progress
const defaultMetrics: ProgressMetrics = {
  currentItem: 0,
  totalAnswered: 0,
  correctAnswers: 0,
  accuracy: 0,
  remainingCards: 0
};

// Helper function to validate metrics and ensure no NaN values
const validateMetrics = (metrics: ProgressMetrics): ProgressMetrics => {
  return {
    currentItem: metrics.currentItem || 0,
    totalAnswered: isNaN(metrics.totalAnswered) ? 0 : metrics.totalAnswered,
    correctAnswers: isNaN(metrics.correctAnswers) ? 0 : metrics.correctAnswers,
    accuracy: isNaN(metrics.accuracy) ? 0 : metrics.accuracy,
    remainingCards: metrics.remainingCards || 0
  };
};

// Initial state with all modes and levels initialized with default metrics
const createInitialState = (): ProgressState => {
  const modes: StudyMode[] = ['vocabulary', 'sentences', 'kanji-meaning', 'kanji-onyomi', 'kanji-kunyomi', 'kanji-match'];
  const levels: JlptLevel[] = ['n1', 'n2', 'n3', 'n4', 'n5'];
  
  const state: ProgressState = {};
  
  modes.forEach(mode => {
    state[mode] = {};
    levels.forEach(level => {
      state[mode]![level] = { ...defaultMetrics };
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
          [action.level]: validateMetrics(action.metrics)
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
            [action.level]: { ...defaultMetrics }
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
  getProgressMetrics: (mode: StudyMode, level: JlptLevel) => ProgressMetrics;
  saveProgressMetrics: (mode: StudyMode, level: JlptLevel, metrics: ProgressMetrics) => void;
  resetLevelProgress: (level: JlptLevel) => void;
  resetAllProgress: () => void;
};

const StudyProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Create the provider component
export const StudyProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progressState, progressDispatch] = useReducer(progressReducer, null, loadInitialState);

  // Helper functions for common operations
  const getProgressMetrics = (mode: StudyMode, level: JlptLevel): ProgressMetrics => {
    const metrics = progressState[mode]?.[level] || defaultMetrics;
    return validateMetrics(metrics);
  };
  
  const saveProgressMetrics = (mode: StudyMode, level: JlptLevel, metrics: ProgressMetrics): void => {
    progressDispatch({ type: 'UPDATE_PROGRESS', mode, level, metrics: validateMetrics(metrics) });
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
        getProgressMetrics, 
        saveProgressMetrics, 
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
