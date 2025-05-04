import { create } from 'zustand';
import { challenges as mockChallenges } from '@/mocks/challenges';
import { Challenge, User } from '@/types';
import { trpcClient } from '@/lib/trpc';

// Define the Challenge type with required fields
interface ChallengeWithCreator extends Challenge {
  creatorId: string;
}

// Define the participant type to handle different formats
type ChallengeParticipant = {
  userId: string;
  progress?: number;
  completed?: boolean;
};

interface ChallengeState {
  challenges: ChallengeWithCreator[];
  isLoading: boolean;
  error: string | null;
  fetchChallenges: () => Promise<void>;
  fetchUserChallenges: (userId: string) => Promise<void>;
  createChallenge: (challenge: Omit<ChallengeWithCreator, 'id'>) => Promise<ChallengeWithCreator | null>;
  joinChallenge: (challengeId: string, userId: string) => Promise<void>;
  leaveChallenge: (challengeId: string, userId: string) => Promise<void>;
  updateChallenge: (challengeId: string, data: Partial<ChallengeWithCreator>) => Promise<void>;
  deleteChallenge: (challengeId: string) => Promise<void>;
  scheduleChallenge?: (challengeId: string) => Promise<void>;
  unscheduleChallenge?: (challengeId: string) => Promise<void>;
}

// Helper function to normalize challenge data
const normalizeChallenge = (challenge: any): ChallengeWithCreator => {
  return {
    ...challenge,
    creatorId: challenge.creatorId || 'unknown',
  } as ChallengeWithCreator;
};

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenges: [],
  isLoading: false,
  error: null,

  fetchChallenges: async () => {
    set({ isLoading: true, error: null });
    try {
      // Try to fetch challenges from the API
      const apiChallenges = await trpcClient.challenges.getAll.query();
      
      if (apiChallenges && apiChallenges.length > 0) {
        // If we got challenges from the API, use them
        set({ 
          challenges: apiChallenges.map(normalizeChallenge),
          isLoading: false 
        });
      } else {
        // Fallback to mock data
        set({ 
          challenges: mockChallenges.map(normalizeChallenge),
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      
      // Fallback to mock data
      set({ 
        challenges: mockChallenges.map(normalizeChallenge),
        isLoading: false,
        error: 'Failed to fetch challenges. Using mock data.'
      });
    }
  },

  fetchUserChallenges: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      // Try to fetch user challenges from the API
      const apiChallenges = await trpcClient.challenges.getByUserId.query({ userId });
      
      if (apiChallenges && Array.isArray(apiChallenges) && apiChallenges.length > 0) {
        // If we got challenges from the API, use them
        set({ 
          challenges: apiChallenges.map(normalizeChallenge),
          isLoading: false 
        });
      } else {
        // Fallback to mock data - filter challenges where user is a participant
        const userChallenges = mockChallenges.filter(challenge => {
          if (typeof challenge.participants === 'number') return false;
          if (!Array.isArray(challenge.participants)) return false;
          
          return challenge.participants.some((p: any) => {
            if (typeof p === 'string') return p === userId;
            if (p && typeof p === 'object' && 'userId' in p) return p.userId === userId;
            return false;
          });
        });
        
        set({ 
          challenges: userChallenges.map(normalizeChallenge),
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Error fetching user challenges:', error);
      
      // Fallback to mock data - filter challenges where user is a participant
      const userChallenges = mockChallenges.filter(challenge => {
        if (typeof challenge.participants === 'number') return false;
        if (!Array.isArray(challenge.participants)) return false;
        
        return challenge.participants.some((p: any) => {
          if (typeof p === 'string') return p === userId;
          if (p && typeof p === 'object' && 'userId' in p) return p.userId === userId;
          return false;
        });
      });
      
      set({ 
        challenges: userChallenges.map(normalizeChallenge),
        isLoading: false,
        error: 'Failed to fetch user challenges. Using mock data.'
      });
    }
  },

  createChallenge: async (challengeData) => {
    set({ isLoading: true, error: null });
    try {
      // Try to create challenge via API
      const newChallenge = await trpcClient.challenges.create.mutate({
        ...challengeData,
        // Ensure required fields have default values if not provided
        type: challengeData.type || 'Workout',
        metric: challengeData.metric || 'workouts',
        xpReward: challengeData.xpReward || 100,
        xpPerProgress: challengeData.xpPerProgress || 10,
      });
      
      if (newChallenge) {
        const enrichedChallenge = normalizeChallenge(newChallenge);
        
        set(state => ({
          challenges: [enrichedChallenge, ...state.challenges],
          isLoading: false
        }));
        
        return enrichedChallenge;
      }
      
      // Fallback to mock creation
      const id = `challenge-${Date.now()}`;
      
      const newMockChallenge = {
        ...challengeData,
        id,
        type: challengeData.type || 'Workout',
        metric: challengeData.metric || 'workouts',
        xpReward: challengeData.xpReward || 100,
        xpPerProgress: challengeData.xpPerProgress || 10,
      } as ChallengeWithCreator;
      
      set(state => ({
        challenges: [newMockChallenge, ...state.challenges],
        isLoading: false,
        error: 'Created challenge using mock data. API unavailable.'
      }));
      
      return newMockChallenge;
    } catch (error) {
      console.error('Error creating challenge:', error);
      
      // Fallback to mock creation
      const id = `challenge-${Date.now()}`;
      
      const newMockChallenge = {
        ...challengeData,
        id,
        type: challengeData.type || 'Workout',
        metric: challengeData.metric || 'workouts',
        xpReward: challengeData.xpReward || 100,
        xpPerProgress: challengeData.xpPerProgress || 10,
      } as ChallengeWithCreator;
      
      set(state => ({
        challenges: [newMockChallenge, ...state.challenges],
        isLoading: false,
        error: 'Failed to create challenge via API. Created using mock data.'
      }));
      
      return newMockChallenge;
    }
  },

  joinChallenge: async (challengeId, userId) => {
    set({ error: null });
    try {
      // Validate inputs before making the API call
      if (!challengeId || typeof challengeId !== 'string') {
        throw new Error('Invalid challenge ID');
      }
      
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID');
      }
      
      // Try to join challenge via API
      await trpcClient.challenges.join.mutate({ 
        challengeId: challengeId.toString(), 
        userId: userId.toString() 
      });
      
      // Update local state
      set((state) => {
        const updatedChallenges = state.challenges.map(challenge => {
          if (challenge.id === challengeId) {
            let updatedParticipants: ChallengeParticipant[] = [];
            
            if (typeof challenge.participants === 'number') {
              updatedParticipants = [{ userId, progress: 0, completed: false }];
            } else if (Array.isArray(challenge.participants)) {
              // Handle different participant formats
              const typedParticipants = challenge.participants.map((p: any) => {
                if (typeof p === 'string') {
                  return { userId: p, progress: 0, completed: false };
                } else if (p && typeof p === 'object') {
                  if ('userId' in p) {
                    return p as ChallengeParticipant;
                  } else if ('id' in p) {
                    // Handle User objects
                    return { userId: p.id, progress: 0, completed: false };
                  }
                }
                return { userId: 'unknown', progress: 0, completed: false };
              });
              
              updatedParticipants = [
                ...typedParticipants,
                { userId, progress: 0, completed: false }
              ];
            } else {
              updatedParticipants = [{ userId, progress: 0, completed: false }];
            }
            
            return {
              ...challenge,
              participants: updatedParticipants,
              isJoined: true
            };
          }
          return challenge;
        });
        
        return { challenges: updatedChallenges };
      });
    } catch (error) {
      console.error('Error joining challenge:', error);
      
      // Fallback to mock join
      set((state) => {
        const updatedChallenges = state.challenges.map(challenge => {
          if (challenge.id === challengeId) {
            let updatedParticipants: ChallengeParticipant[] = [];
            
            if (typeof challenge.participants === 'number') {
              updatedParticipants = [{ userId, progress: 0, completed: false }];
            } else if (Array.isArray(challenge.participants)) {
              // Handle different participant formats
              const typedParticipants = challenge.participants.map((p: any) => {
                if (typeof p === 'string') {
                  return { userId: p, progress: 0, completed: false };
                } else if (p && typeof p === 'object') {
                  if ('userId' in p) {
                    return p as ChallengeParticipant;
                  } else if ('id' in p) {
                    // Handle User objects
                    return { userId: p.id, progress: 0, completed: false };
                  }
                }
                return { userId: 'unknown', progress: 0, completed: false };
              });
              
              updatedParticipants = [
                ...typedParticipants,
                { userId, progress: 0, completed: false }
              ];
            } else {
              updatedParticipants = [{ userId, progress: 0, completed: false }];
            }
            
            return {
              ...challenge,
              participants: updatedParticipants,
              isJoined: true
            };
          }
          return challenge;
        });
        
        return { 
          challenges: updatedChallenges,
          error: 'Joined challenge using mock data. API unavailable.'
        };
      });
    }
  },

  leaveChallenge: async (challengeId, userId) => {
    set({ error: null });
    try {
      // Validate inputs before making the API call
      if (!challengeId || typeof challengeId !== 'string') {
        throw new Error('Invalid challenge ID');
      }
      
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID');
      }
      
      // Try to leave challenge via API
      await trpcClient.challenges.leave.mutate({ 
        challengeId: challengeId.toString(), 
        userId: userId.toString() 
      });
      
      // Update local state
      set((state) => {
        const updatedChallenges = state.challenges.map(challenge => {
          if (challenge.id === challengeId) {
            let updatedParticipants: ChallengeParticipant[] = [];
            
            if (Array.isArray(challenge.participants)) {
              // Handle different participant formats
              updatedParticipants = challenge.participants
                .filter((p: any) => {
                  if (typeof p === 'string') return p !== userId;
                  if (p && typeof p === 'object') {
                    if ('userId' in p) return p.userId !== userId;
                    if ('id' in p) return p.id !== userId;
                  }
                  return true;
                })
                .map((p: any) => {
                  if (typeof p === 'string') {
                    return { userId: p, progress: 0, completed: false };
                  } else if (p && typeof p === 'object') {
                    if ('userId' in p) {
                      return p as ChallengeParticipant;
                    } else if ('id' in p) {
                      // Handle User objects
                      return { userId: p.id, progress: 0, completed: false };
                    }
                  }
                  return { userId: 'unknown', progress: 0, completed: false };
                });
            }
            
            return {
              ...challenge,
              participants: updatedParticipants,
              isJoined: false
            };
          }
          return challenge;
        });
        
        return { challenges: updatedChallenges };
      });
    } catch (error) {
      console.error('Error leaving challenge:', error);
      
      // Fallback to mock leave
      set((state) => {
        const updatedChallenges = state.challenges.map(challenge => {
          if (challenge.id === challengeId) {
            let updatedParticipants: ChallengeParticipant[] = [];
            
            if (Array.isArray(challenge.participants)) {
              // Handle different participant formats
              updatedParticipants = challenge.participants
                .filter((p: any) => {
                  if (typeof p === 'string') return p !== userId;
                  if (p && typeof p === 'object') {
                    if ('userId' in p) return p.userId !== userId;
                    if ('id' in p) return p.id !== userId;
                  }
                  return true;
                })
                .map((p: any) => {
                  if (typeof p === 'string') {
                    return { userId: p, progress: 0, completed: false };
                  } else if (p && typeof p === 'object') {
                    if ('userId' in p) {
                      return p as ChallengeParticipant;
                    } else if ('id' in p) {
                      // Handle User objects
                      return { userId: p.id, progress: 0, completed: false };
                    }
                  }
                  return { userId: 'unknown', progress: 0, completed: false };
                });
            }
            
            return {
              ...challenge,
              participants: updatedParticipants,
              isJoined: false
            };
          }
          return challenge;
        });
        
        return { 
          challenges: updatedChallenges,
          error: 'Left challenge using mock data. API unavailable.'
        };
      });
    }
  },

  updateChallenge: async (challengeId, data) => {
    set({ isLoading: true, error: null });
    try {
      // Validate inputs before making the API call
      if (!challengeId || typeof challengeId !== 'string') {
        throw new Error('Invalid challenge ID');
      }
      
      // Try to update challenge via API
      await trpcClient.challenges.update.mutate({ 
        challengeId: challengeId.toString(), 
        data: {
          ...data,
          // Ensure required fields have default values if not provided
          type: data.type || undefined,
          metric: data.metric || undefined,
          xpReward: data.xpReward || undefined,
          xpPerProgress: data.xpPerProgress || undefined,
        } 
      });
      
      // Update local state
      set(state => ({
        challenges: state.challenges.map(challenge => 
          challenge.id === challengeId ? { ...challenge, ...data } : challenge
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error updating challenge:', error);
      
      // Fallback to mock update
      set(state => ({
        challenges: state.challenges.map(challenge => 
          challenge.id === challengeId ? { ...challenge, ...data } : challenge
        ),
        isLoading: false,
        error: 'Updated challenge using mock data. API unavailable.'
      }));
    }
  },

  deleteChallenge: async (challengeId) => {
    set({ isLoading: true, error: null });
    try {
      // Validate inputs before making the API call
      if (!challengeId || typeof challengeId !== 'string') {
        throw new Error('Invalid challenge ID');
      }
      
      // Try to delete challenge via API
      await trpcClient.challenges.delete.mutate({ challengeId: challengeId.toString() });
      
      // Update local state
      set(state => ({
        challenges: state.challenges.filter(challenge => challenge.id !== challengeId),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting challenge:', error);
      
      // Fallback to mock delete
      set(state => ({
        challenges: state.challenges.filter(challenge => challenge.id !== challengeId),
        isLoading: false,
        error: 'Deleted challenge using mock data. API unavailable.'
      }));
    }
  },
  
  // Add these methods to support the challenge detail screen
  scheduleChallenge: async (challengeId) => {
    set({ error: null });
    try {
      // Update local state only for now
      set(state => ({
        challenges: state.challenges.map(challenge => 
          challenge.id === challengeId ? { ...challenge, isScheduled: true } : challenge
        )
      }));
    } catch (error) {
      console.error('Error scheduling challenge:', error);
      set({ error: 'Failed to schedule challenge.' });
    }
  },
  
  unscheduleChallenge: async (challengeId) => {
    set({ error: null });
    try {
      // Update local state only for now
      set(state => ({
        challenges: state.challenges.map(challenge => 
          challenge.id === challengeId ? { ...challenge, isScheduled: false } : challenge
        )
      }));
    } catch (error) {
      console.error('Error unscheduling challenge:', error);
      set({ error: 'Failed to unschedule challenge.' });
    }
  }
}));