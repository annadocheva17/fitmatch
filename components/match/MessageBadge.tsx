import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '@/constants/colors';
import { useMessageStore } from '@/store/message-store';

interface MessageBadgeProps {
  userId: string;
  otherUserId: string;
}

export const MessageBadge: React.FC<MessageBadgeProps> = ({ userId, otherUserId }) => {
  const { getUnreadCount } = useMessageStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await getUnreadCount(userId, otherUserId);
        
        if (count > 0 && unreadCount === 0) {
          // Animate badge when it first appears
          setUnreadCount(count);
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 300,
            useNativeDriver: true,
          }).start();
        } else {
          setUnreadCount(count);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();

    // Set up an interval to periodically check for new messages
    const intervalId = setInterval(fetchUnreadCount, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [userId, otherUserId, getUnreadCount, unreadCount]);

  if (unreadCount === 0) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.badge,
        {
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});