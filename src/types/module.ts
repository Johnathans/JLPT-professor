export type JlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type ModuleStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface Module {
  id: string;
  title: string;
  description: string;
  level: JlptLevel;
  status: ModuleStatus;
  order: number;
  components: ModuleComponent[];
}

export interface ModuleComponent {
  id: string;
  type: 'kanji' | 'vocabulary' | 'grammar' | 'listening';
  title: string;
  description: string;
  totalItems: number;
  completedItems: number;
}

export interface ModuleProgress {
  id: string;
  moduleId: string;
  userId: string;
  status: ModuleStatus;
  score: number;
  lastStudied: string;
  module?: Module;
}

export interface DailyStudyPlan {
  id: string;
  userId: string;
  date: string;
  targetMinutes: number;
  completedMinutes: number;
  reviews: {
    kanji: number;
    vocabulary: number;
    grammar: number;
    listening: number;
  };
  completed: boolean;
}
