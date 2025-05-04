import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Progress, ProgressMetric } from '@/types';
import { progress as mockProgress } from '@/mocks/progress';

interface ProgressState {
  progress: Progress | null;
  isLoading: boolean;
  error: string | null;
  fetchProgress: () => Promise<void>;
  getWorkoutStreak: () => number;
  addWorkout: (data: { 
    date: string; 
    workoutType: string; 
    duration: number; 
    calories: number; 
    distance?: number;
  }) => void;
  addWeight: (data: { date: string; value: number }) => void;
  addSteps: (data: { date: string; value: number }) => void;
  addSleep: (data: { date: string; value: number; quality?: number }) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: null,
      isLoading: false,
      error: null,
      
      fetchProgress: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // In a real app, we would fetch progress from an API
          // For demo purposes, we'll use mock data
          
          set({ progress: mockProgress, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            isLoading: false 
          });
        }
      },
      
      getWorkoutStreak: () => {
        const progress = get().progress;
        
        if (!progress || !progress.workouts || progress.workouts.length === 0) {
          return 0;
        }
        
        // Sort workouts by date (newest first)
        const sortedWorkouts = [...progress.workouts].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        // Check if there's a workout for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const latestWorkoutDate = new Date(sortedWorkouts[0].date);
        latestWorkoutDate.setHours(0, 0, 0, 0);
        
        // If the latest workout is not from today, return 0
        if (latestWorkoutDate.getTime() !== today.getTime()) {
          return 0;
        }
        
        // Count consecutive days with workouts
        let streak = 1;
        let currentDate = today;
        
        for (let i = 1; i < sortedWorkouts.length; i++) {
          const prevDate = new Date(currentDate);
          prevDate.setDate(prevDate.getDate() - 1);
          
          const workoutDate = new Date(sortedWorkouts[i].date);
          workoutDate.setHours(0, 0, 0, 0);
          
          if (workoutDate.getTime() === prevDate.getTime()) {
            streak++;
            currentDate = prevDate;
          } else {
            break;
          }
        }
        
        return streak;
      },
      
      addWorkout: (data) => {
        const progress = get().progress;
        
        if (!progress) {
          return;
        }
        
        // Create new workout metric
        const workoutMetric: ProgressMetric = {
          date: data.date,
          value: 1,
          details: {
            type: data.workoutType,
            duration: data.duration
          }
        };
        
        // Create new calories metric
        const caloriesMetric: ProgressMetric = {
          date: data.date,
          value: data.calories,
          details: {
            type: data.workoutType
          }
        };
        
        // Create new distance metric if provided
        let distanceMetrics = [...progress.distance];
        if (data.distance) {
          const distanceMetric: ProgressMetric = {
            date: data.date,
            value: data.distance,
            details: {
              type: data.workoutType
            }
          };
          distanceMetrics = [...distanceMetrics, distanceMetric];
        }
        
        // Update progress
        set({
          progress: {
            ...progress,
            workouts: [...progress.workouts, workoutMetric],
            calories: [...progress.calories, caloriesMetric],
            distance: distanceMetrics
          }
        });
      },
      
      addWeight: (data) => {
        const progress = get().progress;
        
        if (!progress) {
          return;
        }
        
        // Create new weight metric
        const weightMetric: ProgressMetric = {
          date: data.date,
          value: data.value
        };
        
        // Update progress
        set({
          progress: {
            ...progress,
            weight: [...progress.weight, weightMetric]
          }
        });
      },
      
      addSteps: (data) => {
        const progress = get().progress;
        
        if (!progress) {
          return;
        }
        
        // Create new steps metric
        const stepsMetric: ProgressMetric = {
          date: data.date,
          value: data.value,
          details: {
            goal: 10000 // Default goal
          }
        };
        
        // Update progress
        set({
          progress: {
            ...progress,
            steps: progress.steps ? [...progress.steps, stepsMetric] : [stepsMetric]
          }
        });
      },
      
      addSleep: (data) => {
        const progress = get().progress;
        
        if (!progress) {
          return;
        }
        
        // Create new sleep metric (value in minutes)
        const sleepMetric: ProgressMetric = {
          date: data.date,
          value: data.value,
          details: {
            quality: data.quality || 3, // Default quality (1-5)
            deepSleep: Math.floor(data.value * 0.2), // Estimate 20% deep sleep
            remSleep: Math.floor(data.value * 0.25) // Estimate 25% REM sleep
          }
        };
        
        // Update progress
        set({
          progress: {
            ...progress,
            sleep: progress.sleep ? [...progress.sleep, sleepMetric] : [sleepMetric]
          }
        });
      }
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);