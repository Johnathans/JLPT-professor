'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface Exercise {
  id: number;
  type: 'kanji' | 'vocabulary' | 'writing' | 'review';
  title: string;
  icon: string;
  duration: number;
  items: number;
  completed?: boolean;
  score?: number;
}

interface StudySession {
  sessionId: string;
  startTime: string;
  currentExercise: number;
  exercises: Exercise[];
  progress: number;
  completed: boolean;
}

interface StudySessionState {
  session: StudySession | null;
  error: string | null;
}

// Action types
type ActionType =
  | { type: 'START_SESSION'; payload: Exercise[] }
  | { type: 'COMPLETE_EXERCISE'; payload: { exerciseId: number; score: number } }
  | { type: 'NEXT_EXERCISE' }
  | { type: 'PREVIOUS_EXERCISE' }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'RESET_SESSION' }
  | { type: 'SET_ERROR'; payload: string };

// Initial state
const initialState: StudySessionState = {
  session: null,
  error: null,
};

// Reducer
function studySessionReducer(state: StudySessionState, action: ActionType): StudySessionState {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        session: {
          sessionId: `session_${Date.now()}`,
          startTime: new Date().toISOString(),
          currentExercise: 0,
          exercises: action.payload,
          progress: 0,
          completed: false,
        },
        error: null,
      };

    case 'COMPLETE_EXERCISE': {
      if (!state.session) return state;

      const updatedExercises = state.session.exercises.map(exercise =>
        exercise.id === action.payload.exerciseId
          ? { ...exercise, completed: true, score: action.payload.score }
          : exercise
      );

      const progress = (updatedExercises.filter(ex => ex.completed).length / updatedExercises.length) * 100;

      return {
        ...state,
        session: {
          ...state.session,
          exercises: updatedExercises,
          progress,
        },
      };
    }

    case 'NEXT_EXERCISE': {
      if (!state.session) return state;

      const nextExercise = state.session.currentExercise + 1;
      if (nextExercise >= state.session.exercises.length) return state;

      return {
        ...state,
        session: {
          ...state.session,
          currentExercise: nextExercise,
        },
      };
    }

    case 'PREVIOUS_EXERCISE': {
      if (!state.session) return state;

      const prevExercise = state.session.currentExercise - 1;
      if (prevExercise < 0) return state;

      return {
        ...state,
        session: {
          ...state.session,
          currentExercise: prevExercise,
        },
      };
    }

    case 'COMPLETE_SESSION': {
      if (!state.session) return state;

      return {
        ...state,
        session: {
          ...state.session,
          completed: true,
        },
      };
    }

    case 'RESET_SESSION':
      return initialState;

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}

// Context
interface StudySessionContextType {
  state: StudySessionState;
  startSession: (exercises: Exercise[]) => void;
  completeExercise: (exerciseId: number, score: number) => void;
  nextExercise: () => void;
  previousExercise: () => void;
  completeSession: () => void;
  resetSession: () => void;
}

const StudySessionContext = createContext<StudySessionContextType | undefined>(undefined);

// Provider component
export function StudySessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(studySessionReducer, initialState);

  const startSession = (exercises: Exercise[]) => {
    dispatch({ type: 'START_SESSION', payload: exercises });
  };

  const completeExercise = (exerciseId: number, score: number) => {
    dispatch({ type: 'COMPLETE_EXERCISE', payload: { exerciseId, score } });
  };

  const nextExercise = () => {
    dispatch({ type: 'NEXT_EXERCISE' });
  };

  const previousExercise = () => {
    dispatch({ type: 'PREVIOUS_EXERCISE' });
  };

  const completeSession = () => {
    dispatch({ type: 'COMPLETE_SESSION' });
  };

  const resetSession = () => {
    dispatch({ type: 'RESET_SESSION' });
  };

  return (
    <StudySessionContext.Provider
      value={{
        state,
        startSession,
        completeExercise,
        nextExercise,
        previousExercise,
        completeSession,
        resetSession,
      }}
    >
      {children}
    </StudySessionContext.Provider>
  );
}

// Custom hook
export function useStudySession() {
  const context = useContext(StudySessionContext);
  if (context === undefined) {
    throw new Error('useStudySession must be used within a StudySessionProvider');
  }
  return context;
}
