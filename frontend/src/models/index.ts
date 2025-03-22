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
  is_active: boolean;
  created_at: string;
  last_login?: string;
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

export interface TopViewedSpecies {
  species_id: string;
  scientific_name: string;
  view_count: number;
}

export interface TopSearch {
  query_text: string;
  search_count: number;
}

// Dashboard interfaces
export interface DashboardSummary {
  users: {
    total_users: number;
    new_users_week: number;
  };
  content: {
    total_content: number;
    pending_moderation: number;
  };
  species: {
    total_species: number;
  };
  views: {
    total_views: number;
    views_this_week: number;
  };
}

export interface UserStatsData {
  roleDistribution: Array<{
    role: string;
    count: number;
  }>;
  registrationStats?: Array<{
    period: string;
    count: number;
  }>;
}

export interface ContentStatsData {
  statusDistribution: Array<{
    status: string;
    count: number;
  }>;
  typeDistribution?: Array<{
    type: string;
    count: number;
  }>;
}

export interface SpeciesStatsData {
  kingdomDistribution: Array<{
    kingdom: string;
    count: number;
  }>;
  classDistribution?: Array<{
    class: string;
    count: number;
  }>;
}

// Analytics interfaces
export interface TopViewedSpecies {
  species_id: string;
  scientific_name: string;
  view_count: number;
}

export interface TopSearch {
  query_text: string;
  search_count: number;
}

// Content Moderation interfaces
export interface ModerationContent {
  id: number;
  title: string;
  content: string;
  content_type: "myth" | "legend" | "proverb";
  author_id: number;
  author_name: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface ModerationQueueResponse {
  content: ModerationContent[];
  totalPages: number;
}

// Species Management interfaces
export interface SpeciesListItem {
  composite_key: string;
  gbif_key: number;
  scientific_name: string;
  vernacular_names: string[];
  kingdom: string;
  kingdom_key: number;
  class?: string;
  class_key?: number;
  image_url?: string;
}

export interface SpeciesListResponse {
  species: SpeciesListItem[];
  totalPages: number;
}
