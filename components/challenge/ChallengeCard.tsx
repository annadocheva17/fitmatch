import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Challenge } from '@/types';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { colors } from '@/constants/colors';
import { Trophy, Users, Calendar, Dumbbell, Star, Clock } from 'lucide-react-native';

interface ChallengeCardProps {
  challenge: Challenge;
  onPress: (challengeId: string) => void;
  onJoin?: (challengeId: string) => void;
  onLeave?: (challengeId: string) => void;
  onView?: (challengeId: string) => void;
  isJoined?: boolean;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onPress,
  onJoin,
  onLeave,
  onView,
  isJoined,
}) => {
  // Calculate days remaining or days until start
  const today = new Date();
  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  
  const isUpcoming = startDate > today;
  const daysUntilStart = isUpcoming ? Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const daysRemaining = !isUpcoming ? Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  
  // Calculate progress
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progress = Math.min(Math.max(daysPassed / totalDays, 0), 1);
  
  // Determine status badge
  const getStatusBadge = () => {
    if (challenge.isScheduled) {
      return <Badge label="Scheduled" variant="info" />;
    } else if (today < startDate) {
      return <Badge label="Upcoming" variant="info" />;
    } else if (today > endDate) {
      return <Badge label="Completed" variant="success" />;
    } else if (isJoined || challenge.isJoined) {
      return <Badge label="Joined" variant="primary" />;
    } else {
      return <Badge label="Active" variant="warning" />;
    }
  };

  // Get participants count
  const getParticipantsCount = () => {
    if (typeof challenge.participants === 'number') {
      return challenge.participants;
    } else if (Array.isArray(challenge.participants)) {
      return challenge.participants.length;
    }
    return 0;
  };

  // Get goal target and unit
  const getGoalText = () => {
    if (typeof challenge.goal === 'object' && challenge.goal.target && challenge.goal.unit) {
      return `${challenge.goal.target} ${challenge.goal.unit}`;
    } else {
      return `${challenge.goal} ${challenge.metric}`;
    }
  };

  // Handle join button click
  const handleJoin = (e: any) => {
    e.stopPropagation();
    if (onJoin) {
      onJoin(challenge.id);
    }
  };

  // Handle leave button click
  const handleLeave = (e: any) => {
    e.stopPropagation();
    if (onLeave) {
      onLeave(challenge.id);
    }
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity 
        style={styles.container}
        onPress={() => onPress ? onPress(challenge.id) : (onView ? onView(challenge.id) : null)}
        activeOpacity={0.7}
      >
        {challenge.image && (
          <Image 
            source={{ uri: challenge.image }} 
            style={styles.image}
            resizeMode="cover"
          />
        )}
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{challenge.title}</Text>
            {getStatusBadge()}
          </View>
          
          <Text style={styles.description} numberOfLines={2}>
            {challenge.description}
          </Text>
          
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Trophy size={16} color={colors.primary} />
              <Text style={styles.detailText}>
                {challenge.reward}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Users size={16} color={colors.primary} />
              <Text style={styles.detailText}>
                {getParticipantsCount()} participants
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              {isUpcoming ? (
                <>
                  <Clock size={16} color={colors.primary} />
                  <Text style={styles.detailText}>
                    Starts in {daysUntilStart} days
                  </Text>
                </>
              ) : (
                <>
                  <Calendar size={16} color={colors.primary} />
                  <Text style={styles.detailText}>
                    {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Ended'}
                  </Text>
                </>
              )}
            </View>
            
            <View style={styles.detailItem}>
              <Dumbbell size={16} color={colors.primary} />
              <Text style={styles.detailText}>
                {challenge.type}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.detailText}>
                {challenge.xpReward} XP reward
              </Text>
            </View>
          </View>
          
          {!isUpcoming && !challenge.isScheduled && (
            <ProgressBar 
              progress={progress}
              height={6}
              style={styles.progressBar}
            />
          )}
          
          {(onJoin || onLeave) && (
            <View style={styles.actionContainer}>
              {isJoined || challenge.isJoined ? (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.leaveButton]}
                  onPress={handleLeave}
                >
                  <Text style={styles.leaveButtonText}>Leave Challenge</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.joinButton]}
                  onPress={handleJoin}
                >
                  <Text style={styles.joinButtonText}>Join Challenge</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 16,
  },
  container: {
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  progressBar: {
    marginTop: 4,
  },
  actionContainer: {
    marginTop: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButton: {
    backgroundColor: colors.primary,
  },
  joinButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  leaveButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  leaveButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});