export type QuestionType = 'multiple-choice' | 'fill-in' | 'matching' | 'listening';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  audio?: string;
  image?: string;
}

export interface TestSection {
  id: string;
  title: string;
  instructions: string;
  timeLimit: number; // in minutes
  questions: Question[];
}

export interface TestProgress {
  currentSection: number;
  currentQuestion: number;
  answers: Record<string, string | string[]>;
  timeRemaining: number;
  isComplete: boolean;
}

export interface TestResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  sectionScores: Record<string, number>;
  timeSpent: number;
  answers: Record<string, string | string[]>;
}
