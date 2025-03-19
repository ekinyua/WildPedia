export interface Species {
  key: number;
  scientificName: string;
  vernacularNames: string[];
  rank: string;
  kingdom: string;
  phylum: string;
  family: string;
  class?: string;
  order?: string;
  genus?: string;
  specificEpithet?: string;
  habitat?: string;
  description?: string;
  image?: string;
  compositeKey?: string;
  threat_status?: string;
  sound_url?: string;
  location?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: "user" | "moderator" | "admin";
  fullName?: string;
  location?: string;
  organization?: string;
  expertiseArea?: string;
  profileImageUrl?: string;
  googleId?: string;
}

export interface CulturalContent {
  id: number;
  speciesId: string;
  content_type: "myth" | "legend" | "proverb";
  contentType: "myth" | "legend" | "proverb";
  title: string;
  content: string;
  language: "en" | "rw" | "sw";
  source?: string;
  authorId: number;
  author_name?: string;
  authorName?: string;
  status: "pending" | "approved" | "rejected";
  votes: number;
  upvotes: number;
  downvotes: number;
  userVoteDirection?: "up" | "down" | null;
  hasVoted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpeciesFact {
  id: number;
  speciesId: string;
  category:
    | "habitat"
    | "behavior"
    | "diet"
    | "reproduction"
    | "conservation"
    | "distribution"
    | "physical_characteristics"
    | "ecological_role"
    | "human_use"
    | "other";
  fact: string;
  sourceReference: string;
  createdBy: number;
  creatorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation: string;
}

export interface Organization {
  id: number;
  name: string;
  location: string;
  description: string;
  websiteUrl?: string;
  logoUrl?: string;
  country: string;
}

export interface UserBadge {
  type: string;
  name: string;
  description: string;
  awarded_at: string;
}

export interface UserStats {
  user_id: number;
  xp: number;
  quizzes_completed: number;
  correct_answers: number;
  badges: UserBadge[];
  rank?: number;
}

export interface LeaderboardEntry {
  user_id: number;
  username: string;
  xp: number;
  quizzes_completed: number;
  correct_answers: number;
  badges: UserBadge[];
  rank: number;
}

export interface QuizResult {
  xpEarned: number;
  stats: UserStats;
  newBadges: UserBadge[];
}
