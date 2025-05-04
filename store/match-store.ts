import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { matches as mockMatches } from '@/mocks/matches';
import { users } from '@/mocks/users';
import { trpcClient } from '@/lib/trpc';
import { Match, MatchUser, User } from '@/types';

// Define the store state
type MatchState = {
  matches: Match[];
  potentialMatches: User[];
  isLoading: boolean;
  error: string | null;
  fetchMatches: (userId: string) => Promise<void>;
  fetchPotentialMatches: (userId: string) => Promise<void>;
  acceptMatch: (matchId: string) => Promise<void>;
  declineMatch: (matchId: string) => Promise<void>;
  createMatch: (userId: string, matchedUserId: string) => Promise<void>;
};

// Helper function to ensure match status is valid
const ensureValidStatus = (status: string): 'pending' | 'accepted' | 'declined' => {
  if (status === 'pending' || status === 'accepted' || status === 'declined') {
    return status;
  }
  // Map 'rejected' to 'declined' for compatibility
  if (status === 'rejected') {
    return 'declined';
  }
  return 'pending';
};

// Helper function to convert a user to a MatchUser
const toMatchUser = (user: User): MatchUser => {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    profileImage: user.profileImage,
    avatar: user.avatar,
    email: user.email,
    bio: user.bio,
    fitnessLevel: user.fitnessLevel,
    preferredExercises: user.preferredExercises,
    followers: user.followers,
    following: user.following,
    workouts: user.workouts,
    points: user.points,
    joinedAt: user.joinedAt,
  };
};

// Helper function to calculate match percentage and common interests
const enhanceMatchWithMetadata = (match: Match, currentUserId: string): Match => {
  // Find the current user and the other user
  const currentUser = users.find(u => u.id === currentUserId);
  const otherUserId = match.userId === currentUserId ? match.matchedUserId : match.userId;
  const otherUser = users.find(u => u.id === otherUserId);
  
  if (!currentUser || !otherUser) return match;
  
  // Calculate common interests
  const currentUserInterests = currentUser.preferredExercises || [];
  const otherUserInterests = otherUser.preferredExercises || [];
  
  const commonInterests = currentUserInterests.filter(interest => 
    otherUserInterests.includes(interest)
  );
  
  // Calculate match percentage based on common interests and other factors
  let matchScore = 70; // Base score
  
  // Add points for common interests
  if (commonInterests.length > 0) {
    matchScore += Math.min(commonInterests.length * 5, 20); // Max 20 points for interests
  }
  
  // Add points for same fitness level
  if (currentUser.fitnessLevel === otherUser.fitnessLevel) {
    matchScore += 5;
  }
  
  // Add points for location proximity (simplified)
  if (currentUser.location && otherUser.location) {
    matchScore += 5;
  }
  
  // Ensure score is between 70-99
  matchScore = Math.min(Math.max(matchScore, 70), 99);
  
  return {
    ...match,
    matchPercentage: matchScore,
    commonInterests: commonInterests.length > 0 ? commonInterests : undefined,
  };
};

// Create the store
export const useMatchStore = create<MatchState>()(
  persist(
    (set, get) => ({
      matches: [],
      potentialMatches: [],
      isLoading: false,
      error: null,
      
      fetchMatches: async (userId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Try to fetch matches from backend using tRPC
          try {
            const response = await trpcClient.matches.getByUserId.query({ userId });
            
            // Ensure all matches have valid status and required fields
            const validatedMatches = response.map(match => {
              // Enhance match with metadata
              const enhancedMatch = enhanceMatchWithMetadata({
                ...match,
                status: ensureValidStatus(match.status),
                updatedAt: match.updatedAt || match.createdAt, // Ensure updatedAt is not undefined
              }, userId);
              
              return enhancedMatch;
            }) as Match[];
            
            set({ matches: validatedMatches, isLoading: false });
          } catch (error) {
            // If the API call fails, use mock data
            console.log('Using mock data for matches');
            throw error;
          }
        } catch (error) {
          console.error('Error fetching matches:', error);
          
          // Fallback to mock data if the API call fails
          const matchesWithUsers = mockMatches.map(match => {
            const user = users.find(u => u.id === match.userId);
            const matchedUser = users.find(u => u.id === match.matchedUserId);
            
            const baseMatch = {
              ...match,
              status: ensureValidStatus(match.status),
              updatedAt: match.updatedAt || match.createdAt, // Ensure updatedAt is not undefined
              user: user ? toMatchUser(user) : undefined,
              matchedUser: matchedUser ? toMatchUser(matchedUser) : undefined,
            } as Match;
            
            // Enhance match with metadata
            return enhanceMatchWithMetadata(baseMatch, userId);
          });
          
          set({ 
            matches: matchesWithUsers, 
            isLoading: false,
            error: null // Don't show error when using mock data
          });
        }
      },
      
      fetchPotentialMatches: async (userId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Try to fetch potential matches from backend using tRPC
          try {
            const response = await trpcClient.matches.getPotential.query({ userId });
            set({ potentialMatches: response, isLoading: false });
          } catch (error) {
            // If the API call fails, use mock data
            console.log('Using mock data for potential matches');
            throw error;
          }
        } catch (error) {
          console.error('Error fetching potential matches:', error);
          
          // Fallback to mock data if the API call fails
          const currentMatches = get().matches;
          
          const potentialUsers = users
            .filter(user => user.id !== userId) // Filter out current user
            .filter(user => {
              // Filter out users that are already matched
              return !currentMatches.some(
                match => 
                  (match.userId === userId && match.matchedUserId === user.id) ||
                  (match.userId === user.id && match.matchedUserId === userId)
              );
            });
          
          set({ 
            potentialMatches: potentialUsers, 
            isLoading: false,
            error: null // Don't show error when using mock data
          });
        }
      },
      
      acceptMatch: async (matchId) => {
        // Optimistically update the UI
        set(state => {
          const updatedMatches = state.matches.map(match => {
            if (match && match.id === matchId) {
              return {
                ...match,
                status: 'accepted' as const,
                updatedAt: new Date().toISOString(),
              };
            }
            return match;
          });
          
          return { matches: updatedMatches };
        });
        
        try {
          // Try to update the backend
          try {
            await trpcClient.matches.accept.mutate({ matchId });
          } catch (error) {
            // If the API call fails, just log it but keep the optimistic update
            console.log('Using mock data for accept match');
            console.error(error);
          }
        } catch (error) {
          console.error('Error accepting match:', error);
          
          // Only revert the optimistic update if there's a serious error
          if (error instanceof Error && error.message !== 'Network request failed') {
            set(state => {
              const updatedMatches = state.matches.map(match => {
                if (match && match.id === matchId) {
                  return {
                    ...match,
                    status: 'pending' as const,
                    updatedAt: new Date().toISOString(),
                  };
                }
                return match;
              });
              
              return { 
                matches: updatedMatches,
                error: 'Failed to accept match. Please try again.'
              };
            });
          }
        }
      },
      
      declineMatch: async (matchId) => {
        // Optimistically update the UI
        set(state => {
          const updatedMatches = state.matches.map(match => {
            if (match && match.id === matchId) {
              return {
                ...match,
                status: 'declined' as const,
                updatedAt: new Date().toISOString(),
              };
            }
            return match;
          });
          
          return { matches: updatedMatches };
        });
        
        try {
          // Try to update the backend
          try {
            await trpcClient.matches.decline.mutate({ matchId });
          } catch (error) {
            // If the API call fails, just log it but keep the optimistic update
            console.log('Using mock data for decline match');
            console.error(error);
          }
        } catch (error) {
          console.error('Error declining match:', error);
          
          // Only revert the optimistic update if there's a serious error
          if (error instanceof Error && error.message !== 'Network request failed') {
            set(state => {
              const updatedMatches = state.matches.map(match => {
                if (match && match.id === matchId) {
                  return {
                    ...match,
                    status: 'pending' as const,
                    updatedAt: new Date().toISOString(),
                  };
                }
                return match;
              });
              
              return { 
                matches: updatedMatches,
                error: 'Failed to decline match. Please try again.'
              };
            });
          }
        }
      },
      
      createMatch: async (userId, matchedUserId) => {
        try {
          // Try to create the match on the backend
          let newMatch;
          try {
            newMatch = await trpcClient.matches.create.mutate({
              userId,
              matchedUserId,
            });
          } catch (error) {
            // If the API call fails, create a local match
            console.log('Using mock data for create match');
            console.error(error);
            throw error;
          }
          
          if (newMatch) {
            // Ensure the new match has a valid status and required fields
            const baseMatch: Match = {
              ...newMatch,
              status: ensureValidStatus(newMatch.status),
              updatedAt: newMatch.updatedAt || newMatch.createdAt, // Ensure updatedAt is not undefined
            };
            
            // Enhance match with metadata
            const enhancedMatch = enhanceMatchWithMetadata(baseMatch, userId);
            
            // Update the local state with the new match
            set(state => ({
              matches: [enhancedMatch, ...state.matches],
              // Remove the matched user from potential matches
              potentialMatches: state.potentialMatches.filter(
                user => user.id !== matchedUserId
              ),
            }));
          }
        } catch (error) {
          console.error('Error creating match:', error);
          
          // Fallback to local creation if the API call fails
          set(state => {
            const currentUser = users.find(u => u.id === userId);
            const matchedUser = users.find(u => u.id === matchedUserId);
            
            if (!currentUser || !matchedUser) {
              return {
                ...state,
                error: 'Failed to create match. User not found.'
              };
            }
            
            const localNewMatch: Match = {
              id: Date.now().toString(),
              userId,
              matchedUserId,
              status: 'pending',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              user: toMatchUser(currentUser),
              matchedUser: toMatchUser(matchedUser),
            };
            
            // Enhance match with metadata
            const enhancedMatch = enhanceMatchWithMetadata(localNewMatch, userId);
            
            return {
              matches: [enhancedMatch, ...state.matches],
              potentialMatches: state.potentialMatches.filter(
                user => user.id !== matchedUserId
              ),
              error: null // Don't show error when using mock data
            };
          });
        }
      },
    }),
    {
      name: 'match-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);