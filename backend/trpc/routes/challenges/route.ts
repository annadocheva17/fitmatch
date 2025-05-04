import { z } from 'zod';
import { publicProcedure, router } from '../../create-context';
import { db } from '@/backend/db';

// Define the challenge goal schema
const goalSchema = z.object({
  type: z.enum(['distance', 'workouts', 'calories', 'steps']),
  target: z.number(),
  unit: z.string(),
});

// Define the challenge rewards schema
const rewardsSchema = z.object({
  type: z.enum(['badge', 'points']),
  value: z.union([z.string(), z.number()]),
});

// Define the challenge input schema
const challengeInput = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  goal: goalSchema,
  creatorId: z.string(),
  rewards: rewardsSchema.optional(),
  type: z.string().optional(),
  xpReward: z.number().optional(),
  xpPerProgress: z.number().optional(),
  metric: z.enum(['workouts', 'steps', 'distance', 'calories', 'liters', 'servings', 'flights']).optional(),
});

// Define the challenge ID input schema
const challengeIdInput = z.object({
  challengeId: z.string(),
});

// Define the join/leave challenge input schema - removed any pattern validation
const challengeUserInput = z.object({
  challengeId: z.string(),
  userId: z.string(),
});

// Define the update progress input schema
const progressInput = z.object({
  challengeId: z.string(),
  userId: z.string(),
  progress: z.number(),
});

// Define the update challenge input schema
const updateChallengeInput = z.object({
  challengeId: z.string(),
  data: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    goal: goalSchema.optional(),
    rewards: rewardsSchema.optional(),
    type: z.string().optional(),
    xpReward: z.number().optional(),
    xpPerProgress: z.number().optional(),
    metric: z.enum(['workouts', 'steps', 'distance', 'calories', 'liters', 'servings', 'flights']).optional(),
  }),
});

// Export the challenge router
export const challengeRouter = router({
  // Get all challenges
  getAll: publicProcedure.query(() => {
    return db.getChallenges();
  }),
  
  // Get a single challenge by ID
  getById: publicProcedure
    .input(challengeIdInput)
    .query(({ input }) => {
      return db.getChallenge(input.challengeId);
    }),
  
  // Get challenges for a user
  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return db.getUserChallenges(input.userId);
    }),
  
  // Create a new challenge
  create: publicProcedure
    .input(challengeInput)
    .mutation(({ input }) => {
      return db.createChallenge(input);
    }),
  
  // Join a challenge
  join: publicProcedure
    .input(challengeUserInput)
    .mutation(({ input }) => {
      return db.joinChallenge(input.challengeId, input.userId);
    }),
  
  // Leave a challenge
  leave: publicProcedure
    .input(challengeUserInput)
    .mutation(({ input }) => {
      return db.leaveChallenge(input.challengeId, input.userId);
    }),
  
  // Update challenge progress
  updateProgress: publicProcedure
    .input(progressInput)
    .mutation(({ input }) => {
      return db.updateChallengeProgress(
        input.challengeId,
        input.userId,
        input.progress
      );
    }),
    
  // Update challenge details
  update: publicProcedure
    .input(updateChallengeInput)
    .mutation(({ input }) => {
      return db.updateChallenge(input.challengeId, input.data);
    }),
    
  // Delete a challenge
  delete: publicProcedure
    .input(challengeIdInput)
    .mutation(({ input }) => {
      return db.deleteChallenge(input.challengeId);
    }),
});