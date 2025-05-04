import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginData, SignupData } from '@/types';
import { users } from '@/mocks/users';
import { trpcClient } from '@/lib/trpc';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updateProfile: (profileData: any) => Promise<void>;
  // Add a method to initialize with a mock user for development
  initializeWithMockUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      initialize: async () => {
        // This function checks if there's a persisted user and sets the auth state
        // The persist middleware will automatically restore the state, so we just
        // need to make sure isAuthenticated is set correctly based on user existence
        const currentUser = get().user;
        if (currentUser) {
          set({ isAuthenticated: true });
        } else {
          // If no user is found, use the first mock user for demo purposes
          if (users.length > 0) {
            set({ 
              user: users[0], 
              isAuthenticated: true,
              error: 'Using mock user data for demonstration'
            });
          }
        }
      },
      
      // Add a method to initialize with a mock user for development
      initializeWithMockUser: () => {
        if (users.length > 0) {
          set({ 
            user: users[0], 
            isAuthenticated: true,
            error: 'Using mock user data for demonstration'
          });
        }
      },
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Login using tRPC
          const user = await trpcClient.users.login.mutate({
            email,
            password,
          });
          
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error: any) {
          console.error('Login error:', error);
          
          // Extract the error message from the tRPC error
          let errorMessage = 'Invalid email or password';
          
          if (error?.message) {
            if (error.message.includes('email')) {
              errorMessage = 'Please enter a valid email address';
            } else if (error.message.includes('password')) {
              errorMessage = 'Password is required';
            } else if (error.message.includes('pattern')) {
              errorMessage = 'Invalid email format';
            } else {
              errorMessage = error.message;
            }
          }
          
          // Fallback to mock data if the API call fails
          const mockUser = users.find(u => u.email === email);
          
          if (mockUser) {
            set({ 
              user: mockUser, 
              isAuthenticated: true, 
              isLoading: false,
              error: 'Connected to mock data. Network connection unavailable.'
            });
            return true;
          } else {
            set({ error: errorMessage, isLoading: false });
            return false;
          }
        }
      },
      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Generate a username from the name
          const username = name.toLowerCase().replace(/\s+/g, '.');
          
          // Register using tRPC
          const newUser = await trpcClient.users.register.mutate({
            name,
            username,
            email,
            password,
            profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            followers: 0,
            following: 0,
            workouts: 0,
            points: 0,
            joinedAt: new Date().toISOString(),
          });
          
          set({ user: newUser, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error: any) {
          console.error('Signup error:', error);
          
          // Extract the error message from the tRPC error
          let errorMessage = 'Failed to create account';
          
          if (error?.message) {
            if (error.message.includes('email')) {
              errorMessage = 'Please enter a valid email address';
            } else if (error.message.includes('already in use')) {
              errorMessage = 'Email already in use';
            } else {
              errorMessage = error.message;
            }
          }
          
          // Check if email already exists in mock data
          const existingUser = users.find(u => u.email === email);
          
          if (existingUser) {
            set({ error: 'Email already in use', isLoading: false });
            return false;
          }
          
          // Create a new mock user
          const mockNewUser: User = {
            id: `user-${Date.now()}`,
            name,
            username: name.toLowerCase().replace(/\s+/g, '.'),
            email,
            profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            followers: 0,
            following: 0,
            workouts: 0,
            points: 0,
            joinedAt: new Date().toISOString(),
          };
          
          set({ 
            user: mockNewUser, 
            isAuthenticated: true, 
            isLoading: false,
            error: 'Connected to mock data. Network connection unavailable.'
          });
          return true;
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      updateUser: async (userData: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;
        
        // Optimistically update the UI
        set({ user: { ...currentUser, ...userData } });
        
        try {
          // Update the user on the backend
          const updatedUser = await trpcClient.users.update.mutate({
            id: currentUser.id,
            ...userData,
          });
          
          // Update the local state with the response from the server
          set({ user: updatedUser });
        } catch (error: any) {
          console.error('Error updating user:', error);
          
          // Extract the error message
          let errorMessage = 'Failed to update user. Please try again.';
          if (error?.message) {
            errorMessage = error.message;
          }
          
          // Revert to the original user data if the API call fails
          set({ 
            user: currentUser,
            error: errorMessage
          });
        }
      },
      updateProfile: async (profileData: any) => {
        const currentUser = get().user;
        if (!currentUser) return;
        
        // Optimistically update the UI
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, this would call an API endpoint
          // For now, we'll just update the local state
          const updatedUser = {
            ...currentUser,
            ...profileData,
          };
          
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set({ 
            user: updatedUser,
            isLoading: false
          });
        } catch (error: any) {
          console.error('Error updating profile:', error);
          
          // Extract the error message
          let errorMessage = 'Failed to update profile. Please try again.';
          if (error?.message) {
            errorMessage = error.message;
          }
          
          set({ 
            error: errorMessage,
            isLoading: false
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);