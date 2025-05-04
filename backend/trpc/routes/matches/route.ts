import { z } from 'zod';
import { publicProcedure, router } from '../../create-context';
import { db } from '@/backend/db';

// Define the match input schema
const matchInput = z.object({
  userId: z.string(),
  matchedUserId: z.string(),
});

// Define the match ID input schema
const matchIdInput = z.object({
  matchId: z.string(),
});

// Define the match status input schema
const matchStatusInput = z.object({
  matchId: z.string(),
  status: z.enum(['pending', 'accepted', 'declined']),
});

// Export the match router
export const matchRouter = router({
  // Get matches for a user
  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      try {
        const matches = db.getMatches(input.userId);
        
        // Ensure all matches have a valid status
        return matches.map(match => ({
          ...match,
          status: match.status === 'rejected' ? 'declined' : match.status,
        }));
      } catch (error) {
        console.error('Error getting matches:', error);
        throw new Error('Failed to get matches');
      }
    }),
  
  // Get potential matches for a user
  getPotential: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      try {
        return db.getPotentialMatches(input.userId);
      } catch (error) {
        console.error('Error getting potential matches:', error);
        throw new Error('Failed to get potential matches');
      }
    }),
  
  // Create a new match
  create: publicProcedure
    .input(matchInput)
    .mutation(({ input }) => {
      try {
        return db.createMatch(input.userId, input.matchedUserId);
      } catch (error) {
        console.error('Error creating match:', error);
        throw new Error('Failed to create match');
      }
    }),
  
  // Update match status (accept/decline)
  updateStatus: publicProcedure
    .input(matchStatusInput)
    .mutation(({ input }) => {
      try {
        return db.updateMatchStatus(input.matchId, input.status);
      } catch (error) {
        console.error('Error updating match status:', error);
        throw new Error('Failed to update match status');
      }
    }),
  
  // Accept a match (shorthand for updateStatus)
  accept: publicProcedure
    .input(matchIdInput)
    .mutation(({ input }) => {
      try {
        return db.updateMatchStatus(input.matchId, 'accepted');
      } catch (error) {
        console.error('Error accepting match:', error);
        throw new Error('Failed to accept match');
      }
    }),
  
  // Decline a match (shorthand for updateStatus)
  decline: publicProcedure
    .input(matchIdInput)
    .mutation(({ input }) => {
      try {
        return db.updateMatchStatus(input.matchId, 'declined');
      } catch (error) {
        console.error('Error declining match:', error);
        throw new Error('Failed to decline match');
      }
    }),
});