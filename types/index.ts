export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  profileImage: string;
  avatar?: string; // Added avatar field for compatibility
  coverImage?: string;
  fitnessLevel?: FitnessLevel;
  preferredExercises?: string[];
  preferredTime?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  followers: number;
  following: number;
  workouts: number;
  points: number; // XP points
  achievements?: Achievement[];
  joinedAt: string;
  createdAt?: string;
  team?: string; // Added team field for leaderboard grouping
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface Exercise {
  id: string;
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

export interface WorkoutExercise {
  id?: string; // Added id property to match workout-store.ts
  name: string;
  sets: number;
  reps?: number;
  duration?: number;
  rest?: number;
  weight?: number; // Added weight property to match workout-store.ts
  distance?: number; // Added distance property to match workout-store.ts
  exerciseId?: string;
}

export interface Workout {
  id: string;
  title?: string;
  description?: string;
  level?: FitnessLevel;
  duration?: number;
  calories?: number;
  exercises: WorkoutExercise[];
  tags?: string[];
  createdBy?: string;
  createdAt?: string;
  likes?: string[]; // Added likes property to match workout-store.ts
  isPublic?: boolean; // Added isPublic property to match workout-store.ts
  userId?: string; // Added userId property to match workout-store.ts
  name?: string; // Added name property to match workout-store.ts
  type?: string; // Added type property to match workout-store.ts
  date?: string; // Added date property to match workout-store.ts
  notes?: string; // Added notes property to match workout-store.ts
  user?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    profileImage?: string;
  }; // Added user property to match workout-store.ts
}

export interface Post {
  id: string;
  userId: string;
  user?: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  images?: string[];
  workout?: Workout | string;
  likes: string[]; // Array of user IDs who liked the post
  comments: number;
  isLiked?: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
}

export interface ChallengeParticipant {
  userId: string;
  progress: number;
  completed: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  image?: string;
  type: string;
  reward: string | {
    type: 'badge' | 'points' | string;
    value: number | string;
  };
  goal: number | {
    target: number;
    unit: string;
  };
  metric: 'workouts' | 'steps' | 'distance' | 'calories' | 'liters' | 'servings' | 'flights';
  startDate: string;
  endDate: string;
  participants: ChallengeParticipant[] | User[] | number;
  isJoined?: boolean;
  isScheduled?: boolean; // Whether the user has scheduled this challenge
  scheduledStartDate?: string; // Custom start date if user schedules it
  xpReward: number; // XP reward for completing the challenge
  xpPerProgress: number; // XP earned per unit of progress
  status?: 'active' | 'upcoming' | 'completed'; // Challenge status
  leaderboard: {
    userId: string;
    progress: number;
    xpEarned: number; // XP earned so far
  }[];
  creatorId?: string; // Added to match store type
}

// Updated Match interface to be compatible with store/match-store.ts
export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  updatedAt: string; // Changed from optional to required to match store
  matchPercentage?: number;
  commonInterests?: string[];
  user?: MatchUser;
  matchedUser?: MatchUser | User; // Allow both MatchUser and full User
}

// Added MatchUser interface for the simplified user object in matches
export interface MatchUser {
  id: string;
  name: string;
  username: string;
  profileImage: string;
  avatar?: string; // Added for compatibility
  email?: string; // Added for compatibility
  bio?: string;
  fitnessLevel?: FitnessLevel; // Changed to FitnessLevel type
  preferredExercises?: string[];
  followers?: number; // Added for compatibility
  following?: number; // Added for compatibility
  workouts?: number; // Added for compatibility
  points?: number; // Added for compatibility
  joinedAt?: string; // Added for compatibility
}

export interface ProgressData {
  date: string;
  workouts: number;
  calories: number;
  duration: number;
  steps: number;
  distance: number;
}

export interface ProgressMetric {
  date: string;
  value: number;
  details?: any;
}

export interface Progress {
  workouts: ProgressMetric[];
  calories: ProgressMetric[];
  distance: ProgressMetric[];
  weight: ProgressMetric[];
  steps?: ProgressMetric[]; // Added steps tracking
  sleep?: ProgressMetric[]; // Added sleep tracking
  heartRate?: ProgressMetric[]; // Added heart rate tracking
}

export interface SignupData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LeaderboardEntry {
  user: User;
  points: number;
  rank: number;
  isCurrentUser: boolean;
}

export type LeaderboardPeriod = 'weekly' | 'monthly' | 'allTime';