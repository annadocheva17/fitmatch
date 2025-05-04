import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useFeedStore } from '@/store/feed-store';
import { useAuthStore } from '@/store/auth-store';
import { PostCard } from '@/components/feed/PostCard';
import { Button } from '@/components/ui/Button';
import CreatePostModal from '@/components/feed/CreatePostModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function FeedScreen() {
  const { posts, fetchPosts, isLoading, likePost, unlikePost } = useFeedStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handleLikePost = (postId: string) => {
    if (!user) return;
    likePost(postId, user.id);
  };

  const handleUnlikePost = (postId: string) => {
    if (!user) return;
    unlikePost(postId, user.id);
  };

  const handleCommentPost = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  const handleSharePost = (postId: string) => {
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

  const isPostLiked = (post: any) => {
    if (!user) return false;
    if (Array.isArray(post.likes)) {
      return post.likes.includes(user.id);
    }
    return post.isLiked || false;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Feed',
          headerRight: () => (
            <Button
              title="New Post"
              variant="primary"
              onPress={() => setIsModalVisible(true)}
              style={styles.newPostButton}
            />
          ),
        }}
      />
      
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={handleLikePost}
            onUnlike={handleUnlikePost}
            onComment={handleCommentPost}
            onShare={handleSharePost}
            onUserPress={handleUserPress}
            onPostPress={handlePostPress}
            onWorkoutPress={handleWorkoutPress}
            isLiked={isPostLiked(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoading ? 'Loading posts...' : 'No posts yet. Be the first to post!'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      
      {/* Floating Action Button for creating new post */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
      
      <CreatePostModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16, // Added horizontal padding
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 300,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  newPostButton: {
    marginRight: 10,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 30,
    backgroundColor: colors.primary,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999,
  },
});