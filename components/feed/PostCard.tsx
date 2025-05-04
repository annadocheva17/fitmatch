import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Post } from '@/types';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { colors } from '@/constants/colors';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react-native';

interface PostCardProps {
  post: Post;
  onPostPress?: (postId: string) => void;
  onLike?: (postId: string) => void;
  onUnlike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onUserPress?: (userId: string) => void;
  onWorkoutPress?: (workoutId: string) => void;
  onOptionsPress?: (postId: string) => void;
  isLiked?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPostPress,
  onLike,
  onUnlike,
  onComment,
  onShare,
  onUserPress,
  onWorkoutPress,
  onOptionsPress,
  isLiked,
}) => {
  // Format date to relative time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks}w`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths}mo`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}y`;
  };

  const handleLikeToggle = () => {
    if (isLiked) {
      onUnlike && onUnlike(post.id);
    } else {
      onLike && onLike(post.id);
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => onUserPress && post.userId ? onUserPress(post.userId) : null}
        >
          {post.user && (
            <Avatar 
              source={{ uri: post.user.avatar }} 
              name={post.user.name}
              size={32} // Changed from "sm" to a number value
              style={styles.avatar}
            />
          )}
          <View>
            <Text style={styles.userName}>{post.user?.name}</Text>
            <Text style={styles.userHandle}>@{post.user?.username}</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
          <TouchableOpacity 
            style={styles.optionsButton}
            onPress={() => onOptionsPress && onOptionsPress(post.id)}
          >
            <MoreHorizontal size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.content}
        onPress={() => onPostPress && onPostPress(post.id)}
        activeOpacity={0.9}
      >
        <Text style={styles.postText}>{post.content}</Text>
        
        {post.images && post.images.length > 0 && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: post.images[0] }} 
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
        
        {post.workout && (
          <TouchableOpacity 
            style={styles.workoutContainer}
            onPress={() => {
              if (onWorkoutPress && typeof post.workout === 'string') {
                onWorkoutPress(post.workout);
              } else if (onWorkoutPress && typeof post.workout === 'object' && post.workout.id) {
                onWorkoutPress(post.workout.id);
              }
            }}
          >
            <Text style={styles.workoutLabel}>Workout</Text>
            <Text style={styles.workoutTitle}>
              {typeof post.workout === 'object' ? post.workout.title : 'View Workout'}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleLikeToggle}
        >
          <Heart 
            size={18} 
            color={isLiked ? colors.error : colors.textSecondary} 
            fill={isLiked ? colors.error : 'transparent'} 
          />
          <Text 
            style={[
              styles.actionText, 
              isLiked && styles.likedText
            ]}
          >
            {typeof post.likes === 'number' ? post.likes : post.likes.length}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onComment && onComment(post.id)}
        >
          <MessageCircle size={18} color={colors.textSecondary} />
          <Text style={styles.actionText}>
            {typeof post.comments === 'number' ? post.comments : 0}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => onShare && onShare(post.id)}
        >
          <Share2 size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  userHandle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 8,
  },
  optionsButton: {
    padding: 4,
  },
  content: {
    marginBottom: 12,
  },
  postText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  workoutContainer: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  workoutLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  workoutTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  likedText: {
    color: colors.error,
  },
});