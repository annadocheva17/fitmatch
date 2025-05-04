import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LeaderboardEntry, LeaderboardPeriod, User } from '@/types';
import { users } from '@/mocks/users';
import { useAuthStore } from './auth-store';

interface LeaderboardState {
  entries: LeaderboardEntry[];
  period: LeaderboardPeriod;
  isLoading: boolean;
  error: string | null;
  fetchLeaderboard: (period?: LeaderboardPeriod) => Promise<void>;
  setPeriod: (period: LeaderboardPeriod) => void;
  getUserRank: () => number;
}

export const useLeaderboardStore = create<LeaderboardState>()(
  persist(
    (set, get) => ({
      entries: [],
      period: 'weekly',
      isLoading: false,
      error: null,
      
      fetchLeaderboard: async (period?: LeaderboardPeriod) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const selectedPeriod = period || get().period;
          const currentUserId = useAuthStore.getState().user?.id || '';
          
          // In a real app, we would fetch leaderboard data from the API
          // For demo purposes, we'll use mock data
          
          // Sort users by points
          const sortedUsers = [...users].sort((a, b) => b.points - a.points);
          
          // Create leaderboard entries
          const entries: LeaderboardEntry[] = sortedUsers.map((user, index) => ({
            user,
            points: user.points,
            rank: index + 1,
            isCurrentUser: user.id === currentUserId
          }));
          
          set({ entries, period: selectedPeriod, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            isLoading: false 
          });
        }
      },
      
      setPeriod: (period: LeaderboardPeriod) => {
        set({ period });
        get().fetchLeaderboard(period);
      },
      
      getUserRank: () => {
        const { entries } = get();
        const currentUserId = useAuthStore.getState().user?.id || '';
        
        const userEntry = entries.find(entry => entry.user.id === currentUserId);
        return userEntry?.rank || 0;
      }
    }),
    {
      name: 'leaderboard-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);