// Simple in-memory database for the demo
// In a real app, this would be replaced with a real database

import { users as initialUsers } from '@/mocks/users';
import { posts as initialPosts } from '@/mocks/posts';
import { matches as initialMatches } from '@/mocks/matches';
import { challenges as initialChallenges } from '@/mocks/challenges';
import { Post } from '@/types';
import { Match } from '@/types';
import { Challenge } from '@/types';
import { User } from '@/types';

// Clone the initial data to avoid modifying the original objects
const users: User[] = JSON.parse(JSON.stringify(initialUsers));
const posts: Post[] = JSON.parse(JSON.stringify(initialPosts));
const matches: Match[] = JSON.parse(JSON.stringify(initialMatches));
const challenges: Challenge[] = JSON.parse(JSON.stringify(initialChallenges));

// Add user information to posts
posts.forEach(post => {
  const user = users.find(u => u.id === post.userId);
  if (user) {
    post.user = {
      name: user.name,
      username: user.username,
      avatar: user.profileImage || user.avatar || '',
    };
  }
});

// Add user information to matches and ensure valid status
matches.forEach(match => {
  const user = users.find(u => u.id === match.userId);
  const matchedUser = users.find(u => u.id === match.matchedUserId);
  
  if (user) {
    match.user = {
      id: user.id,
      name: user.name,
      username: user.username,
      profileImage: user.profileImage || user.avatar || '',
      avatar: user.avatar || user.profileImage || '',
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
  }
  
  if (matchedUser) {
    match.matchedUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      username: matchedUser.username,
      profileImage: matchedUser.profileImage || matchedUser.avatar || '',
      avatar: matchedUser.avatar || matchedUser.profileImage || '',
      email: matchedUser.email,
      bio: matchedUser.bio,
      fitnessLevel: matchedUser.fitnessLevel,
      preferredExercises: matchedUser.preferredExercises,
      followers: matchedUser.followers,
      following: matchedUser.following,
      workouts: matchedUser.workouts,
      points: matchedUser.points,
      joinedAt: matchedUser.joinedAt,
    };
  }
  
  // Ensure match status is one of the valid values
  if (match.status === 'declined') {
    match.status = 'declined';
  } else if (match.status !== 'pending' && match.status !== 'accepted') {
    match.status = 'pending';
  }
  
  // Ensure updatedAt is present
  if (!match.updatedAt) {
    match.updatedAt = match.createdAt;
  }
  
  // Add match percentage and common interests
  if (user && matchedUser) {
    // Calculate common interests
    const userInterests = user.preferredExercises || [];
    const matchedUserInterests = matchedUser.preferredExercises || [];
    
    const commonInterests = userInterests.filter(interest => 
      matchedUserInterests.includes(interest)
    );
    
    // Calculate match percentage based on common interests and other factors
    let matchScore = 70; // Base score
    
    // Add points for common interests
    if (commonInterests.length > 0) {
      matchScore += Math.min(commonInterests.length * 5, 20); // Max 20 points for interests
    }
    
    // Add points for same fitness level
    if (user.fitnessLevel === matchedUser.fitnessLevel) {
      matchScore += 5;
    }
    
    // Add points for location proximity (simplified)
    if (user.location && matchedUser.location) {
      matchScore += 5;
    }
    
    // Ensure score is between 70-99
    matchScore = Math.min(Math.max(matchScore, 70), 99);
    
    match.matchPercentage = matchScore;
    
    if (commonInterests.length > 0) {
      match.commonInterests = commonInterests;
    }
  }
});

// Messages and conversations storage
const conversations: any[] = [];
const messages: any[] = [];

// Add some mock conversations and messages
const mockConversation1 = {
  id: 'conv-1',
  participants: ['1', '2'], // Current user and Jamie Wilson
  lastMessage: null,
  createdAt: '2023-06-15T14:45:00Z',
  updatedAt: '2023-06-20T09:30:00Z',
};

const mockConversation2 = {
  id: 'conv-2',
  participants: ['1', '5'], // Current user and Sam Rogers
  lastMessage: null,
  createdAt: '2023-06-14T16:30:00Z',
  updatedAt: '2023-06-19T18:15:00Z',
};

conversations.push(mockConversation1, mockConversation2);

// Add mock messages for conversation 1
const mockMessages1 = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: '2', // Jamie Wilson
    text: 'Hey! I saw you're into running. Want to join me for a morning run this weekend?',
    timestamp: '2023-06-15T14:45:00Z',
    read: true,
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: '1', // Current user
    text: 'Hi Jamie! That sounds great. What time were you thinking?',
    timestamp: '2023-06-15T15:00:00Z',
    read: true,
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: '2', // Jamie Wilson
    text: 'How about 7 AM on Saturday? There's a nice trail near the park.',
    timestamp: '2023-06-15T15:10:00Z',
    read: true,
  },
  {
    id: 'msg-4',
    conversationId: 'conv-1',
    senderId: '1', // Current user
    text: 'Perfect! I'll bring some water and energy bars. Looking forward to it!',
    timestamp: '2023-06-15T15:20:00Z',
    read: true,
  },
  {
    id: 'msg-5',
    conversationId: 'conv-1',
    senderId: '2', // Jamie Wilson
    text: 'Great! See you then. By the way, what's your usual pace?',
    timestamp: '2023-06-20T09:30:00Z',
    read: false,
  },
];

// Add mock messages for conversation 2
const mockMessages2 = [
  {
    id: 'msg-6',
    conversationId: 'conv-2',
    senderId: '1', // Current user
    text: 'Hey Sam, I noticed you're into CrossFit. I've been wanting to try it out. Any tips for beginners?',
    timestamp: '2023-06-14T16:30:00Z',
    read: true,
  },
  {
    id: 'msg-7',
    conversationId: 'conv-2',
    senderId: '5', // Sam Rogers
    text: 'Hey! Absolutely. Start with the fundamentals and focus on form before intensity. Would you like to join me for a beginner session?',
    timestamp: '2023-06-14T17:00:00Z',
    read: true,
  },
  {
    id: 'msg-8',
    conversationId: 'conv-2',
    senderId: '1', // Current user
    text: 'That would be awesome! When do you usually go to the gym?',
    timestamp: '2023-06-14T17:15:00Z',
    read: true,
  },
  {
    id: 'msg-9',
    conversationId: 'conv-2',
    senderId: '5', // Sam Rogers
    text: 'I typically go in the evenings around 6 PM. Does that work for you?',
    timestamp: '2023-06-14T17:30:00Z',
    read: true,
  },
  {
    id: 'msg-10',
    conversationId: 'conv-2',
    senderId: '1', // Current user
    text: 'That's perfect. How about this Thursday?',
    timestamp: '2023-06-14T17:45:00Z',
    read: true,
  },
  {
    id: 'msg-11',
    conversationId: 'conv-2',
    senderId: '5', // Sam Rogers
    text: 'Thursday works! I'll meet you at Iron Tribe Fitness at 6 PM. Bring water and comfortable clothes.',
    timestamp: '2023-06-19T18:15:00Z',
    read: false,
  },
];

messages.push(...mockMessages1, ...mockMessages2);

// Update last messages for conversations
mockConversation1.lastMessage = mockMessages1[mockMessages1.length - 1];
mockConversation2.lastMessage = mockMessages2[mockMessages2.length - 1];

// Export the data and helper functions
export const db = {
  users,
  posts,
  matches,
  challenges,
  conversations,
  messages,
  
  // User methods
  getUser: (id: string) => users.find(user => user.id === id),
  getUserByEmail: (email: string) => users.find(user => user.email === email),
  createUser: (userData: any) => {
    // Ensure all required fields are present
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      profileImage: userData.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      bio: userData.bio,
      fitnessLevel: userData.fitnessLevel,
      preferredExercises: userData.preferredExercises,
      preferredTime: userData.preferredTime,
      followers: userData.followers || 0,
      following: userData.following || 0,
      workouts: userData.workouts || 0,
      points: userData.points || 0,
      joinedAt: userData.joinedAt || new Date().toISOString(),
    };
    users.push(newUser);
    return newUser;
  },
  updateUser: (id: string, data: Partial<User>) => {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...data };
      return users[index];
    }
    return null;
  },
  
  // Post methods
  getPosts: () => posts,
  getPost: (id: string) => posts.find(post => post.id === id),
  getUserPosts: (userId: string) => posts.filter(post => post.userId === userId),
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'user'>) => {
    const user = users.find(u => u.id === post.userId);
    const newPost: Post = {
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: 0,
      ...post,
    };
    
    if (user) {
      newPost.user = {
        name: user.name,
        username: user.username,
        avatar: user.profileImage || user.avatar || '',
      };
    }
    
    posts.unshift(newPost); // Add to the beginning of the array
    return newPost;
  },
  likePost: (postId: string, userId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post && !post.likes.includes(userId)) {
      post.likes.push(userId);
      return post;
    }
    return null;
  },
  unlikePost: (postId: string, userId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.likes = post.likes.filter(id => id !== userId);
      return post;
    }
    return null;
  },
  
  // Match methods
  getMatches: (userId: string) => {
    const userMatches = matches.filter(
      match => match.userId === userId || match.matchedUserId === userId
    );
    
    // Ensure all matches have a valid status and updatedAt
    return userMatches.map(match => {
      // Convert 'rejected' to 'declined' for compatibility
      let status = match.status;
      if (status === 'declined') {
        status = 'declined';
      } else if (status !== 'pending' && status !== 'accepted') {
        status = 'pending';
      }
      
      // Calculate match percentage and common interests if not already present
      if (!match.matchPercentage || !match.commonInterests) {
        const user = users.find(u => u.id === match.userId);
        const matchedUser = users.find(u => u.id === match.matchedUserId);
        
        if (user && matchedUser) {
          // Calculate common interests
          const userInterests = user.preferredExercises || [];
          const matchedUserInterests = matchedUser.preferredExercises || [];
          
          const commonInterests = userInterests.filter(interest => 
            matchedUserInterests.includes(interest)
          );
          
          // Calculate match percentage based on common interests and other factors
          let matchScore = 70; // Base score
          
          // Add points for common interests
          if (commonInterests.length > 0) {
            matchScore += Math.min(commonInterests.length * 5, 20); // Max 20 points for interests
          }
          
          // Add points for same fitness level
          if (user.fitnessLevel === matchedUser.fitnessLevel) {
            matchScore += 5;
          }
          
          // Add points for location proximity (simplified)
          if (user.location && matchedUser.location) {
            matchScore += 5;
          }
          
          // Ensure score is between 70-99
          matchScore = Math.min(Math.max(matchScore, 70), 99);
          
          match.matchPercentage = matchScore;
          
          if (commonInterests.length > 0) {
            match.commonInterests = commonInterests;
          }
        }
      }
      
      return { 
        ...match, 
        status,
        updatedAt: match.updatedAt || match.createdAt
      };
    });
  },
  getPotentialMatches: (userId: string) => {
    const userMatches = matches.filter(
      match => match.userId === userId || match.matchedUserId === userId
    );
    const matchedUserIds = userMatches.map(match => 
      match.userId === userId ? match.matchedUserId : match.userId
    );
    
    return users.filter(user => 
      user.id !== userId && !matchedUserIds.includes(user.id)
    );
  },
  createMatch: (userId: string, matchedUserId: string) => {
    const user = users.find(u => u.id === userId);
    const matchedUser = users.find(u => u.id === matchedUserId);
    
    if (!user || !matchedUser) return null;
    
    // Calculate common interests
    const userInterests = user.preferredExercises || [];
    const matchedUserInterests = matchedUser.preferredExercises || [];
    
    const commonInterests = userInterests.filter(interest => 
      matchedUserInterests.includes(interest)
    );
    
    // Calculate match percentage based on common interests and other factors
    let matchScore = 70; // Base score
    
    // Add points for common interests
    if (commonInterests.length > 0) {
      matchScore += Math.min(commonInterests.length * 5, 20); // Max 20 points for interests
    }
    
    // Add points for same fitness level
    if (user.fitnessLevel === matchedUser.fitnessLevel) {
      matchScore += 5;
    }
    
    // Add points for location proximity (simplified)
    if (user.location && matchedUser.location) {
      matchScore += 5;
    }
    
    // Ensure score is between 70-99
    matchScore = Math.min(Math.max(matchScore, 70), 99);
    
    const newMatch: Match = {
      id: `match-${Date.now()}`,
      userId,
      matchedUserId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      matchPercentage: matchScore,
      commonInterests: commonInterests.length > 0 ? commonInterests : undefined,
    };
    
    if (user) {
      newMatch.user = {
        id: user.id,
        name: user.name,
        username: user.username,
        profileImage: user.profileImage || user.avatar || '',
        avatar: user.avatar || user.profileImage || '',
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
    }
    
    if (matchedUser) {
      newMatch.matchedUser = {
        id: matchedUser.id,
        name: matchedUser.name,
        username: matchedUser.username,
        profileImage: matchedUser.profileImage || matchedUser.avatar || '',
        avatar: matchedUser.avatar || matchedUser.profileImage || '',
        email: matchedUser.email,
        bio: matchedUser.bio,
        fitnessLevel: matchedUser.fitnessLevel,
        preferredExercises: matchedUser.preferredExercises,
        followers: matchedUser.followers,
        following: matchedUser.following,
        workouts: matchedUser.workouts,
        points: matchedUser.points,
        joinedAt: matchedUser.joinedAt,
      };
    }
    
    matches.push(newMatch);
    return newMatch;
  },
  updateMatchStatus: (matchId: string, status: 'pending' | 'accepted' | 'declined') => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      match.status = status;
      match.updatedAt = new Date().toISOString();
      return match;
    }
    return null;
  },
  
  // Challenge methods
  getChallenges: () => challenges,
  getChallenge: (id: string) => challenges.find(challenge => challenge.id === id),
  getUserChallenges: (userId: string) => challenges.filter(
    challenge => {
      if (typeof challenge.participants === 'number') {
        return false;
      }
      
      if (Array.isArray(challenge.participants)) {
        return challenge.participants.some((p: any) => {
          if (typeof p === 'string') return p === userId;
          if (p && typeof p === 'object') {
            if ('userId' in p) return p.userId === userId;
            if ('id' in p) return p.id === userId;
          }
          return false;
        });
      }
      
      return false;
    }
  ),
  createChallenge: (challenge: any) => {
    const newChallenge: Challenge = {
      id: `challenge-${Date.now()}`,
      title: challenge.title,
      description: challenge.description,
      image: challenge.image,
      type: challenge.type || 'Workout',
      reward: challenge.rewards?.value ? `${challenge.rewards.value} ${challenge.rewards.type}` : '100 points',
      goal: challenge.goal?.target || 10,
      metric: challenge.metric || 'workouts',
      startDate: challenge.startDate,
      endDate: challenge.endDate,
      participants: [{
        userId: challenge.creatorId,
        progress: 0,
        completed: false,
      }] as { userId: string; progress: number; completed: boolean; }[],
      status: new Date(challenge.startDate) > new Date() ? 'upcoming' : 'active',
      isJoined: true,
      isScheduled: false,
      xpReward: challenge.xpReward || 100,
      xpPerProgress: challenge.xpPerProgress || 10,
      leaderboard: [],
      creatorId: challenge.creatorId,
    };
    
    challenges.push(newChallenge);
    return newChallenge;
  },
  joinChallenge: (challengeId: string, userId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      if (typeof challenge.participants === 'number') {
        challenge.participants = [{
          userId,
          progress: 0,
          completed: false,
        }] as { userId: string; progress: number; completed: boolean; }[];
      } else if (Array.isArray(challenge.participants)) {
        if (!challenge.participants.some((p: any) => {
          if (typeof p === 'string') return p === userId;
          if (p && typeof p === 'object') {
            if ('userId' in p) return p.userId === userId;
            if ('id' in p) return p.id === userId;
          }
          return false;
        })) {
          // Add participant with proper type
          const participant = {
            userId,
            progress: 0,
            completed: false,
          };
          (challenge.participants as { userId: string; progress: number; completed: boolean; }[]).push(participant);
        }
      }
      challenge.isJoined = true;
      return challenge;
    }
    return null;
  },
  leaveChallenge: (challengeId: string, userId: string) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && Array.isArray(challenge.participants)) {
      challenge.participants = challenge.participants.filter((p: any) => {
        if (typeof p === 'string') return p !== userId;
        if (p && typeof p === 'object') {
          if ('userId' in p) return p.userId !== userId;
          if ('id' in p) return p.id !== userId;
        }
        return true;
      });
      challenge.isJoined = false;
      return challenge;
    }
    return null;
  },
  updateChallengeProgress: (challengeId: string, userId: string, progress: number) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && Array.isArray(challenge.participants)) {
      const participant = challenge.participants.find((p: any) => {
        if (typeof p === 'string') return p === userId;
        if (p && typeof p === 'object') {
          if ('userId' in p) return p.userId === userId;
          if ('id' in p) return p.id === userId;
        }
        return false;
      });
      
      if (participant && typeof participant === 'object' && 'userId' in participant) {
        participant.progress = progress;
        participant.completed = progress >= (typeof challenge.goal === 'object' ? challenge.goal.target : challenge.goal);
        
        // Update leaderboard
        const leaderboardEntry = challenge.leaderboard.find(entry => entry.userId === userId);
        if (leaderboardEntry) {
          leaderboardEntry.progress = progress;
          leaderboardEntry.xpEarned = Math.min(progress * challenge.xpPerProgress, challenge.xpReward);
        } else {
          challenge.leaderboard.push({
            userId,
            progress,
            xpEarned: Math.min(progress * challenge.xpPerProgress, challenge.xpReward),
          });
        }
        
        return challenge;
      }
    }
    return null;
  },
  
  updateChallenge: (challengeId: string, data: any) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      Object.assign(challenge, data);
      return challenge;
    }
    return null;
  },
  
  deleteChallenge: (challengeId: string) => {
    const index = challenges.findIndex(c => c.id === challengeId);
    if (index !== -1) {
      const deletedChallenge = challenges.splice(index, 1)[0];
      return deletedChallenge;
    }
    return null;
  },
  
  // Conversation and message methods
  getConversations: (userId: string) => {
    return conversations.filter(conv => 
      conv.participants.includes(userId)
    );
  },
  getConversation: (userId: string, otherUserId: string) => {
    return conversations.find(conv => 
      conv.participants.includes(userId) && 
      conv.participants.includes(otherUserId)
    );
  },
  createConversation: (userId: string, otherUserId: string) => {
    const existingConv = conversations.find(conv => 
      conv.participants.includes(userId) && 
      conv.participants.includes(otherUserId)
    );
    
    if (existingConv) return existingConv;
    
    const newConversation = {
      id: `conv-${Date.now()}`,
      participants: [userId, otherUserId],
      lastMessage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    conversations.push(newConversation);
    return newConversation;
  },
  getMessages: (conversationId: string) => {
    return messages.filter(msg => msg.conversationId === conversationId);
  },
  createMessage: (message: any) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      ...message,
      timestamp: new Date().toISOString(),
    };
    
    messages.push(newMessage);
    
    // Update the conversation's last message
    const conversation = conversations.find(conv => conv.id === message.conversationId);
    if (conversation) {
      conversation.lastMessage = newMessage;
      conversation.updatedAt = newMessage.timestamp;
    }
    
    return newMessage;
  },
  getUnreadCount: (userId: string, otherUserId: string) => {
    const conversation = conversations.find(conv => 
      conv.participants.includes(userId) && 
      conv.participants.includes(otherUserId)
    );
    
    if (!conversation) return 0;
    
    return messages.filter(msg => 
      msg.conversationId === conversation.id && 
      msg.senderId === otherUserId && 
      !msg.read
    ).length;
  },
  markAsRead: (conversationId: string, userId: string) => {
    const unreadMessages = messages.filter(msg => 
      msg.conversationId === conversationId && 
      msg.senderId !== userId && 
      !msg.read
    );
    
    unreadMessages.forEach(msg => {
      msg.read = true;
    });
    
    return unreadMessages.length;
  },
};