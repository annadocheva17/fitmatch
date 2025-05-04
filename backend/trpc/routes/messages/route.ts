import { z } from 'zod';
import { publicProcedure, router } from '../../create-context';
import { db } from '@/backend/db';

// Define the message input schema
const messageInput = z.object({
  conversationId: z.string(),
  senderId: z.string(),
  text: z.string(),
});

// Define the conversation input schema
const conversationInput = z.object({
  userId: z.string(),
  otherUserId: z.string(),
});

// Define the mark as read input schema
const markAsReadInput = z.object({
  conversationId: z.string(),
  userId: z.string(),
});

// Export the message router
export const messageRouter = router({
  // Get conversations for a user
  getConversations: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      try {
        return db.getConversations(input.userId);
      } catch (error) {
        console.error('Error getting conversations:', error);
        throw new Error('Failed to get conversations');
      }
    }),
  
  // Get or create a conversation between two users
  getOrCreateConversation: publicProcedure
    .input(conversationInput)
    .mutation(({ input }) => {
      try {
        return db.createConversation(input.userId, input.otherUserId);
      } catch (error) {
        console.error('Error creating conversation:', error);
        throw new Error('Failed to create conversation');
      }
    }),
  
  // Get messages for a conversation
  getMessages: publicProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(({ input }) => {
      try {
        return db.getMessages(input.conversationId);
      } catch (error) {
        console.error('Error getting messages:', error);
        throw new Error('Failed to get messages');
      }
    }),
  
  // Send a message
  sendMessage: publicProcedure
    .input(messageInput)
    .mutation(({ input }) => {
      try {
        return db.createMessage(input);
      } catch (error) {
        console.error('Error sending message:', error);
        throw new Error('Failed to send message');
      }
    }),
  
  // Get unread message count
  getUnreadCount: publicProcedure
    .input(conversationInput)
    .query(({ input }) => {
      try {
        return db.getUnreadCount(input.userId, input.otherUserId);
      } catch (error) {
        console.error('Error getting unread count:', error);
        throw new Error('Failed to get unread count');
      }
    }),
  
  // Mark messages as read
  markAsRead: publicProcedure
    .input(markAsReadInput)
    .mutation(({ input }) => {
      try {
        return db.markAsRead(input.conversationId, input.userId);
      } catch (error) {
        console.error('Error marking messages as read:', error);
        throw new Error('Failed to mark messages as read');
      }
    }),
});