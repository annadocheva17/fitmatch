import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trpcClient } from '@/lib/trpc';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message | null;
  createdAt: string;
  updatedAt: string;
}

type MessageState = {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // conversationId -> messages
  activeConversation: string | null;
  isLoading: boolean;
  error: string | null;
  fetchConversations: (userId: string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  getOrCreateConversation: (userId: string, otherUserId: string) => Promise<string>;
  sendMessage: (senderId: string, receiverId: string, text: string) => Promise<void>;
  setActiveConversation: (conversationId: string | null) => void;
  getUnreadCount: (userId: string, otherUserId: string) => Promise<number>;
  markAsRead: (conversationId: string, userId: string) => Promise<void>;
};

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversation: null,
      isLoading: false,
      error: null,
      
      fetchConversations: async (userId) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await trpcClient.messages.getConversations.query({ userId });
          set({ conversations: response, isLoading: false });
        } catch (error) {
          console.error('Error fetching conversations:', error);
          set({ 
            isLoading: false,
            error: 'Failed to fetch conversations. Please try again.'
          });
        }
      },
      
      fetchMessages: async (conversationId) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await trpcClient.messages.getMessages.query({ conversationId });
          
          set(state => ({
            messages: {
              ...state.messages,
              [conversationId]: response
            },
            isLoading: false
          }));
        } catch (error) {
          console.error('Error fetching messages:', error);
          set({ 
            isLoading: false,
            error: 'Failed to fetch messages. Please try again.'
          });
        }
      },
      
      getOrCreateConversation: async (userId, otherUserId) => {
        try {
          const response = await trpcClient.messages.getOrCreateConversation.mutate({
            userId,
            otherUserId
          });
          
          // Update conversations if this is a new one
          const existingConversation = get().conversations.find(
            conv => conv.id === response.id
          );
          
          if (!existingConversation) {
            set(state => ({
              conversations: [...state.conversations, response]
            }));
          }
          
          return response.id;
        } catch (error) {
          console.error('Error getting or creating conversation:', error);
          throw new Error('Failed to get or create conversation');
        }
      },
      
      sendMessage: async (senderId, receiverId, text) => {
        try {
          // First, ensure we have a conversation
          const conversationId = await get().getOrCreateConversation(senderId, receiverId);
          
          // Then send the message
          const newMessage = await trpcClient.messages.sendMessage.mutate({
            conversationId,
            senderId,
            text
          });
          
          // Update the local state
          set(state => {
            const currentMessages = state.messages[conversationId] || [];
            
            // Update the conversation's last message
            const updatedConversations = state.conversations.map(conv => {
              if (conv.id === conversationId) {
                return {
                  ...conv,
                  lastMessage: newMessage,
                  updatedAt: newMessage.timestamp
                };
              }
              return conv;
            });
            
            return {
              messages: {
                ...state.messages,
                [conversationId]: [...currentMessages, newMessage]
              },
              conversations: updatedConversations
            };
          });
        } catch (error) {
          console.error('Error sending message:', error);
          set({ error: 'Failed to send message. Please try again.' });
          throw error;
        }
      },
      
      setActiveConversation: (conversationId) => {
        set({ activeConversation: conversationId });
      },
      
      getUnreadCount: async (userId, otherUserId) => {
        try {
          const response = await trpcClient.messages.getUnreadCount.query({
            userId,
            otherUserId
          });
          
          return response;
        } catch (error) {
          console.error('Error getting unread count:', error);
          return 0;
        }
      },
      
      markAsRead: async (conversationId, userId) => {
        try {
          await trpcClient.messages.markAsRead.mutate({
            conversationId,
            userId
          });
          
          // Update the local state to mark messages as read
          set(state => {
            const currentMessages = state.messages[conversationId] || [];
            
            const updatedMessages = currentMessages.map(msg => {
              if (msg.senderId !== userId && !msg.read) {
                return { ...msg, read: true };
              }
              return msg;
            });
            
            return {
              messages: {
                ...state.messages,
                [conversationId]: updatedMessages
              }
            };
          });
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    }),
    {
      name: 'message-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        // Don't persist messages to keep storage size manageable
      }),
    }
  )
);