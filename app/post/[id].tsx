import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { PostCard } from '@/components/feed/PostCard';
import { useFeedStore } from '@/store/feed-store';
import { colors } from '@/constants/colors';
import { ArrowLeft } from 'lucide-react-native';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { posts, fetchPosts, likePost, unlikePost } = useFeedStore();
  const [post, setPost] = useState<typeof posts[0] | null>(null);
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  useEffect(() => {
    // Find post by ID
    const foundPost = posts.find(p => p.id === id);
    if (foundPost) {
      setPost(foundPost);
    }
  }, [id, posts]);
  
  const handleLike = (postId: string, userId: string) => {
    if (postId) {
      likePost(postId, userId);
    }
  };
  
  const handleUnlike = (postId: string, userId: string) => {
    if (postId) {
      unlikePost(postId, userId);
    }
  };
  
  const handleComment = (postId: string) => {
    // Comment functionality would go here
    console.log('Comment on post:', postId);
  };
  
  const handleShare = (postId: string) => {
    // Share functionality would go here
    console.log('Share post:', postId);
  };
  
  const handleUserPress = (userId: string) => {
    router.push(`/profile/${userId}`);
  };
  
  const handlePostPress = (postId: string) => {
    // Already on post detail screen
  };
  
  const handleWorkoutPress = (workoutId: string) => {
    router.push(`/workout/${workoutId}`);
  };
  
  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading post...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Post',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <PostCard
          post={post}
          onLike={(postId) => handleLike(postId, '1')} // Assuming '1' is the current user ID
          onUnlike={(postId) => handleUnlike(postId, '1')} // Assuming '1' is the current user ID
          onComment={handleComment}
          onShare={handleShare}
          onUserPress={handleUserPress}
          onPostPress={handlePostPress}
          onWorkoutPress={handleWorkoutPress}
        />
        
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments</Text>
          
          <View style={styles.emptyCommentsContainer}>
            <Text style={styles.emptyCommentsText}>No comments yet</Text>
            <Text style={styles.emptyCommentsSubtext}>Be the first to comment on this post</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  commentsSection: {
    marginTop: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  emptyCommentsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyCommentsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyCommentsSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
});