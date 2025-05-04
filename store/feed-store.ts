import { create } from 'zustand';
import { posts as mockPosts } from '@/mocks/posts';
import { users as mockUsers } from '@/mocks/users';
import { Post, User } from '@/types';
import { trpcClient } from '@/lib/trpc';

interface FeedState {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'user' | 'likes' | 'comments'>) => Promise<Post | null>;
  likePost: (postId: string, userId: string) => Promise<void>;
  unlikePost: (postId: string, userId: string) => Promise<void>;
  commentOnPost: (postId: string, comment: string, userId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
}

// Helper function to enrich posts with user data
const enrichPostsWithUserData = (posts: any[]): Post[] => {
  return posts.map(post => {
    const user = mockUsers.find(u => u.id === post.userId);
    return {
      ...post,
      user: user ? {
        name: user.name,
        username: user.username,
        avatar: user.profileImage || user.avatar || '',
      } : undefined,
      // Ensure likes is an array
      likes: Array.isArray(post.likes) ? post.likes : [],
    };
  });
};

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      // Try to fetch posts from the API
      const apiPosts = await trpcClient.posts.getPosts.query();
      
      if (apiPosts && apiPosts.length > 0) {
        // If we got posts from the API, use them
        set({ 
          posts: apiPosts.map(post => ({
            ...post,
            // Ensure likes is an array
            likes: Array.isArray(post.likes) ? post.likes : [],
          })),
          isLoading: false 
        });
      } else {
        // Fallback to mock data
        const enrichedPosts = enrichPostsWithUserData(mockPosts);
        set({ posts: enrichedPosts, isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      
      // Fallback to mock data
      const enrichedPosts = enrichPostsWithUserData(mockPosts);
      
      set({ 
        posts: enrichedPosts, 
        isLoading: false,
        error: 'Using mock data. Network connection unavailable.'
      });
    }
  },

  createPost: async (postData) => {
    set({ isLoading: true, error: null });
    try {
      // Try to create post via API
      const newPost = await trpcClient.posts.createPost.mutate({
        userId: postData.userId,
        content: postData.content,
        images: postData.images,
        workoutId: postData.workout && typeof postData.workout === 'object' ? postData.workout.id : postData.workout,
      });
      
      if (newPost) {
        const user = mockUsers.find(u => u.id === postData.userId);
        const enrichedPost = {
          ...newPost,
          user: user ? {
            name: user.name,
            username: user.username,
            avatar: user.profileImage || user.avatar || '',
          } : undefined,
          // Ensure likes is an array
          likes: Array.isArray(newPost.likes) ? newPost.likes : [],
        };
        
        set(state => ({
          posts: [enrichedPost, ...state.posts],
          isLoading: false
        }));
        
        return enrichedPost;
      }
      
      // Fallback to mock creation
      const id = `post-${Date.now()}`;
      const createdAt = new Date().toISOString();
      const user = mockUsers.find(u => u.id === postData.userId);
      
      const newMockPost = {
        ...postData,
        id,
        createdAt,
        user: user ? {
          name: user.name,
          username: user.username,
          avatar: user.profileImage || user.avatar || '',
        } : undefined,
        likes: [],
        comments: 0,
      };
      
      set(state => ({
        posts: [newMockPost, ...state.posts],
        isLoading: false,
        error: 'Created post using mock data. Network connection unavailable.'
      }));
      
      return newMockPost;
    } catch (error) {
      console.error('Error creating post:', error);
      
      // Fallback to mock creation
      const id = `post-${Date.now()}`;
      const createdAt = new Date().toISOString();
      const user = mockUsers.find(u => u.id === postData.userId);
      
      const newMockPost = {
        ...postData,
        id,
        createdAt,
        user: user ? {
          name: user.name,
          username: user.username,
          avatar: user.profileImage || user.avatar || '',
        } : undefined,
        likes: [],
        comments: 0,
      };
      
      set(state => ({
        posts: [newMockPost, ...state.posts],
        isLoading: false,
        error: 'Created post using mock data. Network connection unavailable.'
      }));
      
      return newMockPost;
    }
  },

  likePost: async (postId, userId) => {
    try {
      // Try to like post via API
      await trpcClient.posts.likePost.mutate({ postId, userId });
      
      // Update local state
      set(state => ({
        posts: state.posts.map(post => {
          if (post.id === postId) {
            const likes = Array.isArray(post.likes) 
              ? [...post.likes, userId]
              : [userId];
            
            return {
              ...post,
              likes,
              isLiked: true
            };
          }
          return post;
        })
      }));
    } catch (error) {
      console.error('Error liking post:', error);
      
      // Fallback to mock like
      set(state => ({
        posts: state.posts.map(post => {
          if (post.id === postId) {
            const likes = Array.isArray(post.likes) 
              ? [...post.likes, userId]
              : [userId];
            
            return {
              ...post,
              likes,
              isLiked: true
            };
          }
          return post;
        }),
        error: 'Liked post using mock data. Network connection unavailable.'
      }));
    }
  },

  unlikePost: async (postId, userId) => {
    try {
      // Try to unlike post via API
      await trpcClient.posts.unlikePost.mutate({ postId, userId });
      
      // Update local state
      set(state => ({
        posts: state.posts.map(post => {
          if (post.id === postId) {
            const likes = Array.isArray(post.likes) 
              ? post.likes.filter(id => id !== userId)
              : [];
            
            return {
              ...post,
              likes,
              isLiked: false
            };
          }
          return post;
        })
      }));
    } catch (error) {
      console.error('Error unliking post:', error);
      
      // Fallback to mock unlike
      set(state => ({
        posts: state.posts.map(post => {
          if (post.id === postId) {
            const likes = Array.isArray(post.likes) 
              ? post.likes.filter(id => id !== userId)
              : [];
            
            return {
              ...post,
              likes,
              isLiked: false
            };
          }
          return post;
        }),
        error: 'Unliked post using mock data. Network connection unavailable.'
      }));
    }
  },

  commentOnPost: async (postId, comment, userId) => {
    try {
      // Try to comment on post via API
      await trpcClient.posts.commentOnPost.mutate({ 
        postId, 
        content: comment,
        userId 
      });
      
      // Update local state
      set(state => ({
        posts: state.posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: typeof post.comments === 'number' 
                ? post.comments + 1 
                : 1
            };
          }
          return post;
        })
      }));
    } catch (error) {
      console.error('Error commenting on post:', error);
      
      // Fallback to mock comment
      set(state => ({
        posts: state.posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: typeof post.comments === 'number' 
                ? post.comments + 1 
                : 1
            };
          }
          return post;
        }),
        error: 'Added comment using mock data. Network connection unavailable.'
      }));
    }
  },

  deletePost: async (postId) => {
    try {
      // Try to delete post via API
      await trpcClient.posts.deletePost.mutate({ postId });
      
      // Update local state
      set(state => ({
        posts: state.posts.filter(post => post.id !== postId)
      }));
    } catch (error) {
      console.error('Error deleting post:', error);
      
      // Fallback to mock delete
      set(state => ({
        posts: state.posts.filter(post => post.id !== postId),
        error: 'Deleted post using mock data. Network connection unavailable.'
      }));
    }
  },
}));