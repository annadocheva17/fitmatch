import { z } from 'zod';
import { publicProcedure, router } from '../../create-context';
import { db } from '@/backend/db';
import { FitnessLevel } from '@/types';

// Define the user input schema
const userInput = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  profileImage: z.string().optional(),
  bio: z.string().optional(),
  fitnessLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
  preferredExercises: z.array(z.string()).optional(),
  preferredTime: z.array(z.string()).optional(),
  followers: z.number().default(0),
  following: z.number().default(0),
  workouts: z.number().default(0),
  points: z.number().default(0),
  joinedAt: z.string().default(() => new Date().toISOString()),
});

// Define the login input schema
const loginInput = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Define the user update input schema
const userUpdateInput = z.object({
  id: z.string(),
  name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  profileImage: z.string().optional(),
  bio: z.string().optional(),
  fitnessLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
  preferredExercises: z.array(z.string()).optional(),
  preferredTime: z.array(z.string()).optional(),
});

// Export the user router
export const userRouter = router({
  // Get a user by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const user = db.getUser(input.id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    }),
  
  // Login a user
  login: publicProcedure
    .input(loginInput)
    .mutation(({ input }) => {
      try {
        // In a real app, you would verify the password here
        const user = db.getUserByEmail(input.email);
        if (!user) {
          throw new Error('Invalid email or password');
        }
        return user;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    }),
  
  // Register a new user
  register: publicProcedure
    .input(userInput)
    .mutation(({ input }) => {
      try {
        // Check if email already exists
        const existingUser = db.getUserByEmail(input.email);
        if (existingUser) {
          throw new Error('Email already in use');
        }
        
        // Create the user with all required fields
        const userData = {
          ...input,
          followers: input.followers || 0,
          following: input.following || 0,
          workouts: input.workouts || 0,
          points: input.points || 0,
          joinedAt: input.joinedAt || new Date().toISOString(),
        };
        
        return db.createUser(userData);
      } catch (error) {
        console.error('Registration error:', error);
        throw error;
      }
    }),
  
  // Update a user
  update: publicProcedure
    .input(userUpdateInput)
    .mutation(({ input }) => {
      try {
        const { id, ...data } = input;
        // Ensure fitnessLevel is properly typed
        const typedData = {
          ...data,
          fitnessLevel: data.fitnessLevel as FitnessLevel | undefined,
        };
        
        const updatedUser = db.updateUser(id, typedData);
        if (!updatedUser) {
          throw new Error('User not found');
        }
        return updatedUser;
      } catch (error) {
        console.error('Update user error:', error);
        throw error;
      }
    }),
});