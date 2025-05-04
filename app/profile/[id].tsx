import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { Card } from '@/components/ui/Card';
import { PostCard } from '@/components/feed/PostCard';
import { useAuthStore } from '@/store/auth-store';
import { useFeedStore } from '@/store/feed-store';
import { users } from '@/mocks/users';
import { colors } from '@/constants/colors';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const { posts, fetchPosts, likePost, unlikePost } = useFeedStore();
  const [user, setUser] = useState<typeof users[0] | null>(null);
  
  useEffect(() => {
    // Find user by ID
    const foundUser = users.find(u => u.id === id);
    if (foundUser) {
      setUser(foundUser);
    }
    
    fetchPosts();
  }, [id]);
  
  const handleFollow = () => {
    // Follow functionality would go here
    alert('Follow functionality would be implemented in a real app');
  };
  
  const handleMessage = () => {
    // Message functionality would go here
    alert('Message functionality would be implemented in a real app');
  };
  
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
    router.push(`/post/${postId}`);
  };
  
  const handleShare = (postId: string) => {
    // Share functionality would go here
    console.log('Share post:', postId);
  };
  
  const handleUserPress = (userId: string) => {
    router.push(`/profile/${userId}`);
  };
  
  const handlePostPress = (postId: string) => {
    router.push(`/post/${postId}`);
  };
  
  const handleWorkoutPress = (workoutId: string) => {
    router.push(`/workout/${workoutId}`);
  };
  
  // Filter posts by user
  const userPosts = posts.filter(post => post.userId === id);
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: user.name,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <ProfileHeader
          user={user}
          isCurrentUser={user.id === (currentUser?.id || '1')}
          onEditProfile={() => router.push('/edit-profile')}
          onFollow={handleFollow}
          onMessage={handleMessage}
        />
        
        <View style={styles.postsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Posts</Text>
          </View>
          
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={(postId) => handleLike(postId, user.id)}
                onUnlike={(postId) => handleUnlike(postId, user.id)}
                onComment={handleComment}
                onShare={handleShare}
                onUserPress={handleUserPress}
                onPostPress={handlePostPress}
                onWorkoutPress={handleWorkoutPress}
              />
            ))
          ) : (
            <Card style={styles.emptyPostsCard}>
              <Text style={styles.emptyPostsText}>No posts yet</Text>
              <Text style={styles.emptyPostsSubtext}>
                This user hasn't shared any fitness updates
              </Text>
            </Card>
          )}
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
    paddingBottom: 24,
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
  postsSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  emptyPostsCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyPostsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyPostsSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
  },
});