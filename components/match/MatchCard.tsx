import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Match } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { MessageCircle, UserCircle, Clock, Check, X, Dumbbell } from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';
import { MessageBadge } from './MessageBadge';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface MatchCardProps {
  match: Match;
  onAccept?: (matchId: string) => void;
  onDecline?: (matchId: string) => void;
  onMessage?: (userId: string) => void;
  onProfilePress?: (userId: string) => void;
  isPending?: boolean;
  currentUserId?: string;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onAccept,
  onDecline,
  onMessage,
  onProfilePress,
  isPending,
  currentUserId,
}) => {
  // Determine if the current user is the initiator or the recipient
  const isInitiator = currentUserId ? match.userId === currentUserId : match.status === 'pending' && !isPending;
  const otherUser = isInitiator ? match.matchedUser : match.user;
  const otherUserId = isInitiator ? match.matchedUserId : match.userId;
  
  if (!otherUser) return null;

  // Get profile image from either profileImage or avatar property
  const profileImageSource = otherUser.profileImage || (otherUser as any).avatar;

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get common interests if available
  const commonInterests = match.commonInterests || [];

  return (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => onProfilePress && otherUserId ? onProfilePress(otherUserId) : null}
        >
          <Avatar 
            source={profileImageSource} 
            name={otherUser.name}
            size={56} 
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.name}>{otherUser.name}</Text>
            <Text style={styles.username}>@{otherUser.username}</Text>
            
            {otherUser.fitnessLevel && (
              <View style={styles.fitnessLevelContainer}>
                <Dumbbell size={14} color={colors.primary} />
                <Text style={styles.fitnessLevel}>
                  {otherUser.fitnessLevel} level
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        
        {match.matchPercentage && (
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.matchPercentageContainer}
          >
            <Text style={styles.matchPercentageText}>{match.matchPercentage}%</Text>
            <Text style={styles.matchLabel}>Match</Text>
          </LinearGradient>
        )}
      </View>
      
      {commonInterests.length > 0 && (
        <View style={styles.commonInterests}>
          <Text style={styles.commonInterestsTitle}>Common interests:</Text>
          <View style={styles.interestTags}>
            {commonInterests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {match.status === 'pending' && !isInitiator && (
        <View style={styles.actions}>
          <View style={styles.requestInfo}>
            <Text style={styles.requestText}>
              Wants to workout with you
            </Text>
            <View style={styles.timeContainer}>
              <Clock size={12} color={colors.textSecondary} />
              <Text style={styles.timeText}>{formatDate(match.createdAt)}</Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <Button
              title="Accept"
              variant="primary"
              leftIcon={<Check size={16} color={colors.white} />}
              onPress={() => onAccept && onAccept(match.id)}
              style={styles.acceptButton}
            />
            <Button
              title="Decline"
              variant="outline"
              leftIcon={<X size={16} color={colors.primary} />}
              onPress={() => onDecline && onDecline(match.id)}
              style={styles.declineButton}
            />
          </View>
        </View>
      )}
      
      {match.status === 'pending' && isInitiator && (
        <View style={styles.pendingContainer}>
          <LinearGradient
            colors={[colors.warning, '#F9A825']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pendingBadge}
          >
            <Text style={styles.pendingBadgeText}>
              Request sent
            </Text>
          </LinearGradient>
          
          <View style={styles.timeContainer}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={styles.pendingTimeText}>{formatDate(match.createdAt)}</Text>
          </View>
          <Text style={styles.pendingSubtext}>
            Waiting for response
          </Text>
        </View>
      )}
      
      {match.status === 'accepted' && (
        <View style={styles.matchedContainer}>
          <LinearGradient
            colors={[colors.success, '#0D9488']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.matchedBadge}
          >
            <Text style={styles.matchedBadgeText}>
              Workout Partners
            </Text>
          </LinearGradient>
          
          <View style={styles.timeContainer}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={styles.matchedTimeText}>Matched {formatDate(match.updatedAt)}</Text>
          </View>
          
          <View style={styles.actionButtons}>
            <View style={styles.messageButton}>
              <Button
                title="Message"
                variant="primary"
                leftIcon={<MessageCircle size={16} color={colors.white} />}
                onPress={() => onMessage && otherUserId ? onMessage(otherUserId) : null}
                style={styles.actionButton}
              />
              {currentUserId && otherUserId && (
                <MessageBadge userId={currentUserId} otherUserId={otherUserId} />
              )}
            </View>
            <Button
              title="Profile"
              variant="outline"
              leftIcon={<UserCircle size={16} color={colors.primary} />}
              onPress={() => onProfilePress && otherUserId ? onProfilePress(otherUserId) : null}
              style={styles.actionButton}
            />
          </View>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    padding: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  fitnessLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fitnessLevel: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  matchPercentageContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  matchPercentageText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  matchLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.white,
    opacity: 0.9,
  },
  commonInterests: {
    padding: 16,
  },
  commonInterestsTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    color: colors.text,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: colors.highlight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
  },
  actions: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  requestInfo: {
    marginBottom: 16,
  },
  requestText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    borderRadius: 12,
  },
  declineButton: {
    flex: 1,
    borderRadius: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
  },
  pendingContainer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  pendingBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  pendingBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  pendingTimeText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  pendingSubtext: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 8,
  },
  matchedContainer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  matchedBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  matchedBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  matchedTimeText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
    marginBottom: 16,
  },
  messageButton: {
    flex: 1,
    position: 'relative',
  },
});