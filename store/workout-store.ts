import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { workouts as mockWorkouts } from '@/mocks/workouts';
import { users } from '@/mocks/users';
import { trpcClient } from '@/lib/trpc';

// Define the Workout type
export type Workout = {
  id: string;
  userId: string;
  name: string;
  type: string;
  duration: number;
  calories: number;
  exercises: {
    id: string;
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
    distance?: number;
  }[];
  date: string;
  notes?: string;
  isPublic: boolean;
  likes: string[]; // Array of user IDs who liked the workout
  user?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
};

// Define the store state
type WorkoutState = {
  workouts: Workout[];
  isLoading: boolean;
  error: string | null;
  fetchWorkouts: () => Promise<void>;
  fetchUserWorkouts: (userId: string) => Promise<Workout[]>;
  likeWorkout: (workoutId: string) => void;
  unlikeWorkout: (workoutId: string) => void;
  createWorkout: (workout: Omit<Workout, 'id' | 'likes' | 'user'>) => void;
  updateWorkout: (workoutId: string, workout: Partial<Omit<Workout, 'id' | 'userId' | 'likes' | 'user'>>) => void;
  deleteWorkout: (workoutId: string) => void;
};

// Create the store
export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      workouts: [],
      isLoading: false,
      error: null,
      
      fetchWorkouts: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, this would be an API call
          // For now, we'll use mock data
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Fetch workouts from backend
          // const response = await trpcClient.workouts.getAll.query();
          // set({ workouts: response, isLoading: false });
          
          // For now, use mock data with user information
          const workoutsWithUsers = mockWorkouts.map(workout => {
            const user = users.find(u => u.id === workout.userId);
            return {
              ...workout,
              user: user ? {
                id: user.id,
                name: user.name,
                username: user.username,
                avatar: user.avatar,
              } : undefined,
            };
          });
          
          set({ workouts: workoutsWithUsers, isLoading: false });
        } catch (error) {
          console.error('Error fetching workouts:', error);
          set({ error: 'Failed to fetch workouts', isLoading: false });
        }
      },
      
      fetchUserWorkouts: async (userId: string) => {
        try {
          // In a real app, this would be an API call
          // For now, we'll filter the mock data
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Fetch user workouts from backend
          // const response = await trpcClient.workouts.getUserWorkouts.query({ userId });
          // return response;
          
          // For now, filter mock data
          const userWorkouts = get().workouts.filter(workout => workout.userId === userId);
          return userWorkouts.length > 0 ? userWorkouts : mockWorkouts.filter(workout => workout.userId === userId);
        } catch (error) {
          console.error('Error fetching user workouts:', error);
          return [];
        }
      },
      
      likeWorkout: (workoutId: string) => {
        set(state => {
          const updatedWorkouts = state.workouts.map(workout => {
            if (workout.id === workoutId) {
              // Add current user ID to likes array
              // In a real app, you would get the current user ID from auth
              const currentUserId = '1'; // Default to user 1 for demo
              
              // Check if user already liked the workout
              if (workout.likes.includes(currentUserId)) {
                return workout;
              }
              
              return {
                ...workout,
                likes: [...workout.likes, currentUserId],
              };
            }
            return workout;
          });
          
          return { workouts: updatedWorkouts };
        });
        
        // In a real app, you would also update the backend
        // trpcClient.workouts.like.mutate({ workoutId });
      },
      
      unlikeWorkout: (workoutId: string) => {
        set(state => {
          const updatedWorkouts = state.workouts.map(workout => {
            if (workout.id === workoutId) {
              // Remove current user ID from likes array
              const currentUserId = '1'; // Default to user 1 for demo
              
              return {
                ...workout,
                likes: workout.likes.filter(id => id !== currentUserId),
              };
            }
            return workout;
          });
          
          return { workouts: updatedWorkouts };
        });
        
        // In a real app, you would also update the backend
        // trpcClient.workouts.unlike.mutate({ workoutId });
      },
      
      createWorkout: (workout) => {
        set(state => {
          const newWorkout: Workout = {
            id: Date.now().toString(), // Generate a unique ID
            likes: [],
            ...workout,
          };
          
          // Add user information to the workout
          const user = users.find(u => u.id === workout.userId);
          if (user) {
            newWorkout.user = {
              id: user.id,
              name: user.name,
              username: user.username,
              avatar: user.avatar,
            };
          }
          
          return {
            workouts: [newWorkout, ...state.workouts],
          };
        });
        
        // In a real app, you would also update the backend
        // trpcClient.workouts.create.mutate(workout);
      },
      
      updateWorkout: (workoutId, workout) => {
        set(state => {
          const updatedWorkouts = state.workouts.map(w => {
            if (w.id === workoutId) {
              return {
                ...w,
                ...workout,
              };
            }
            return w;
          });
          
          return { workouts: updatedWorkouts };
        });
        
        // In a real app, you would also update the backend
        // trpcClient.workouts.update.mutate({ workoutId, ...workout });
      },
      
      deleteWorkout: (workoutId) => {
        set(state => ({
          workouts: state.workouts.filter(w => w.id !== workoutId),
        }));
        
        // In a real app, you would also update the backend
        // trpcClient.workouts.delete.mutate({ workoutId });
      },
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);