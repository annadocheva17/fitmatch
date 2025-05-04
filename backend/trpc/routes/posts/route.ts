import { z } from 'zod';
import { publicProcedure, router } from '../../create-context';
import { db } from '@/backend/db';

// Define the post input schema
const postInput = z.object({
  userId: z.string(),
  content: z.string(),
  images: z.array(z.string()).optional(),
  workoutId: z.string().optional(),
});

// Define the post ID input schema
const postIdInput = z.object({
  postId: z.string(),
});

// Define the like/unlike input schema
const likeInput = z.object({
  postId: z.string(),
  userId: z.string(),
});

// Define the comment input schema
const commentInput = z.object({
  postId: z.string(),
  content: z.string(),
  userId: z.string(),
});

// Export the post router
export const postRouter = router({
  // Get all posts
  getPosts: publicProcedure.query(() => {
    return db.getPosts();
  }),
  
  // Get a single post by ID
  getById: publicProcedure
    .input(postIdInput)
    .query(({ input }) => {
      return db.getPost(input.postId);
    }),
  
  // Get posts by user ID
  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return db.getUserPosts(input.userId);
    }),
  
  // Create a new post
  createPost: publicProcedure
    .input(postInput)
    .mutation(({ input }) => {
      return db.createPost(input);
    }),
  
  // Like a post
  likePost: publicProcedure
    .input(likeInput)
    .mutation(({ input }) => {
      return db.likePost(input.postId, input.userId);
    }),
  
  // Unlike a post
  unlikePost: publicProcedure
    .input(likeInput)
    .mutation(({ input }) => {
      return db.unlikePost(input.postId, input.userId);
    }),
    
  // Comment on a post
  commentOnPost: publicProcedure
    .input(commentInput)
    .mutation(({ input }) => {
      // In a real app, this would create a comment in the database
      // For now, we'll just increment the comment count on the post
      const post = db.getPost(input.postId);
      if (post) {
        post.comments = typeof post.comments === 'number' ? post.comments + 1 : 1;
      }
      return post;
    }),
    
  // Delete a post
  deletePost: publicProcedure
    .input(postIdInput)
    .mutation(({ input }) => {
      // In a real app, this would delete the post from the database
      // For now, we'll just return success
      return { success: true };
    }),
});