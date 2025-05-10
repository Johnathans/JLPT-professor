export interface DashboardStats {
  score: number;
  playing: number;
  mastered: number;
  readyForReview: number;
  streak: number;
  playedToday: {
    total: number;
    new: number;
    review: number;
  };
  level: {
    current: number;
    pointsToNext: number;
  };
  leaderboard: {
    rank: number;
  };
}

export interface HistoryDataPoint {
  date: string;
  count: number;
}

export interface DashboardData extends DashboardStats {
  history: HistoryDataPoint[];
}
