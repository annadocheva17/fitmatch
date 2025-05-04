import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { useChallengeStore } from '@/store/challenge-store';
import { useAuthStore } from '@/store/auth-store';
import { users } from '@/mocks/users';
import { colors } from '@/constants/colors';
import { Calendar, Trophy, Users, Clock, Flag, Award, ArrowLeft } from 'lucide-react-native';
import { formatDate } from '@/utils/date';
import { Challenge, ChallengeParticipant } from '@/types';

// Extended challenge type with creator info
interface ChallengeWithCreator extends Challenge {
  creatorId?: string;
}

export default function ChallengeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { challenges, joinChallenge, leaveChallenge, error, scheduleChallenge, unscheduleChallenge } = useChallengeStore();
  const { user: currentUser } = useAuthStore();
  const [challenge, setChallenge] = useState<ChallengeWithCreator | null>(null);
  
  useEffect(() => {
    // Find challenge by ID
    const foundChallenge = challenges.find(c => c.id === id);
    if (foundChallenge) {
      setChallenge(foundChallenge);
    }
  }, [id, challenges]);
  
  // Show error alert if there's an error
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);
  
  const handleJoin = () => {
    if (challenge && currentUser) {
      try {
        joinChallenge(challenge.id, currentUser.id);
      } catch (err) {
        console.error('Error joining challenge:', err);
        Alert.alert('Error', 'Failed to join challenge. Please try again.');
      }
    }
  };
  
  const handleLeave = () => {
    if (challenge && currentUser) {
      try {
        leaveChallenge(challenge.id, currentUser.id);
      } catch (err) {
        console.error('Error leaving challenge:', err);
        Alert.alert('Error', 'Failed to leave challenge. Please try again.');
      }
    }
  };
  
  const handleSchedule = () => {
    if (challenge && scheduleChallenge) {
      scheduleChallenge(challenge.id);
    }
  };
  
  const handleUnschedule = () => {
    if (challenge && unscheduleChallenge) {
      unscheduleChallenge(challenge.id);
    }
  };
  
  const handleUserPress = (userId: string) => {
    router.push(`/profile/${userId}`);
  };
  
  // Get creator information
  const creator = challenge?.creatorId ? users.find(u => u.id === challenge.creatorId) : null;
  
  // Get participant information - handle different participant formats
  const participants = challenge ? (() => {
    if (!challenge.participants) {
      return [];
    }
    
    if (typeof challenge.participants === 'number') {
      // If participants is just a number, return an empty array for now
      // In a real app, you might want to fetch the actual participants
      return [];
    }
    
    if (Array.isArray(challenge.participants)) {
      return challenge.participants.map(p => {
        // Handle different participant formats
        if (typeof p === 'string') {
          // If p is just a user ID
          const user = users.find(u => u.id === p);
          return {
            userId: p,
            progress: 0,
            completed: false,
            user
          };
        } else if (p && typeof p === 'object') {
          if ('userId' in p) {
            // If p is a participant object with userId
            const user = users.find(u => u.id === p.userId);
            return {
              ...p,
              user
            };
          } else if ('id' in p) {
            // If p is a User object
            return {
              userId: p.id,
              progress: 0,
              completed: false,
              user: p
            };
          }
        }
        // Fallback for unexpected formats
        return {
          userId: 'unknown',
          progress: 0,
          completed: false,
          user: null
        };
      });
    }
    
    // Fallback for unexpected formats
    return [];
  })() : [];
  
  // Sort participants by progress
  const sortedParticipants = [...participants].sort((a, b) => (b.progress || 0) - (a.progress || 0));
  
  // Check if current user is participating
  const currentUserParticipant = challenge && currentUser 
    ? (() => {
        if (typeof challenge.participants === 'number') {
          return null;
        }
        
        if (Array.isArray(challenge.participants)) {
          const participant = challenge.participants.find(p => {
            if (typeof p === 'string') return p === currentUser.id;
            if (p && typeof p === 'object') {
              if ('userId' in p) return p.userId === currentUser.id;
              if ('id' in p) return p.id === currentUser.id;
            }
            return false;
          });
          
          if (participant) {
            if (typeof participant === 'string') {
              return { userId: participant, progress: 0, completed: false };
            } else if (participant && typeof participant === 'object') {
              if ('userId' in participant) {
                return participant;
              } else if ('id' in participant) {
                return { userId: participant.id, progress: 0, completed: false };
              }
            }
          }
        }
        
        return null;
      })()
    : null;
  
  if (!challenge) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading challenge...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get participant count
  const participantCount = typeof challenge.participants === 'number' 
    ? challenge.participants 
    : Array.isArray(challenge.participants) 
      ? challenge.participants.length 
      : 0;

  // Get goal target and unit
  const goalTarget = typeof challenge.goal === 'object' && challenge.goal 
    ? challenge.goal.target || 100
    : typeof challenge.goal === 'number' 
      ? challenge.goal 
      : 100;
      
  const goalUnit = typeof challenge.goal === 'object' && challenge.goal 
    ? challenge.goal.unit || challenge.metric || 'reps'
    : challenge.metric || 'reps';

  // Format reward for display
  const renderReward = () => {
    if (!challenge.reward) return null;
    
    if (typeof challenge.reward === 'string') {
      return challenge.reward;
    } else if (typeof challenge.reward === 'object') {
      if (challenge.reward.type === 'badge') {
        return `${challenge.reward.value} Badge`;
      } else if (challenge.reward.type === 'points') {
        return `${challenge.reward.value} Points`;
      } else {
        return JSON.stringify(challenge.reward);
      }
    }
    
    return String(challenge.reward);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: challenge.title || 'Challenge',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        {challenge.image && (
          <Image 
            source={{ uri: challenge.image }} 
            style={styles.coverImage}
          />
        )}
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{challenge.title || 'Challenge'}</Text>
          
          <View style={styles.creatorContainer}>
            {creator && (
              <TouchableOpacity 
                style={styles.creatorInfo}
                onPress={() => handleUserPress(creator.id)}
              >
                <Avatar 
                  source={{ uri: creator.avatar }} 
                  size={24} 
                />
                <Text style={styles.creatorName}>Created by {creator.name}</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Calendar size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>
                {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Users size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>
                {participantCount} participants
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Trophy size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>
                {goalTarget} {goalUnit}
              </Text>
            </View>
          </View>
          
          <Text style={styles.description}>{challenge.description}</Text>
          
          {challenge.reward && (
            <View style={styles.rewardsContainer}>
              <Award size={20} color={colors.primary} />
              <Text style={styles.rewardsText}>
                Rewards: {renderReward()}
              </Text>
            </View>
          )}
        </View>
        
        {currentUserParticipant && (
          <Card style={styles.progressCard}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            
            <View style={styles.progressContainer}>
              <ProgressBar 
                progress={(currentUserParticipant.progress || 0) / goalTarget} 
              />
              
              <View style={styles.progressStats}>
                <Text style={styles.progressText}>
                  {currentUserParticipant.progress || 0} / {goalTarget} {goalUnit}
                </Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(((currentUserParticipant.progress || 0) / goalTarget) * 100)}%
                </Text>
              </View>
            </View>
            
            {currentUserParticipant.completed ? (
              <View style={styles.completedContainer}>
                <Trophy size={24} color={colors.success} />
                <Text style={styles.completedText}>Challenge Completed!</Text>
              </View>
            ) : (
              <Text style={styles.progressRemaining}>
                {goalTarget - (currentUserParticipant.progress || 0)} {goalUnit} to go
              </Text>
            )}
          </Card>
        )}
        
        <View style={styles.leaderboardSection}>
          <Text style={styles.sectionTitle}>Leaderboard</Text>
          
          {sortedParticipants.length > 0 ? (
            sortedParticipants.map((participant, index) => (
              <TouchableOpacity 
                key={participant.userId}
                style={styles.participantCard}
                onPress={() => participant.user && handleUserPress(participant.user.id)}
              >
                <View style={styles.participantRank}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                
                {participant.user && (
                  <View style={styles.participantInfo}>
                    <Avatar 
                      source={{ uri: participant.user.avatar }} 
                      size={40} 
                    />
                    <View style={styles.participantDetails}>
                      <Text style={styles.participantName}>{participant.user.name}</Text>
                      <View style={styles.participantProgress}>
                        <ProgressBar 
                          progress={(participant.progress || 0) / goalTarget} 
                          style={styles.participantProgressBar}
                        />
                        <Text style={styles.participantProgressText}>
                          {participant.progress || 0} / {goalTarget}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                
                {participant.completed && (
                  <Trophy size={20} color={colors.success} />
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Card style={styles.emptyLeaderboard}>
              <Text style={styles.emptyLeaderboardText}>No participants yet</Text>
              <Text style={styles.emptyLeaderboardSubtext}>Be the first to join this challenge!</Text>
            </Card>
          )}
        </View>
        
        <View style={styles.actionsContainer}>
          {challenge.isJoined || currentUserParticipant ? (
            <Button 
              title="Leave Challenge" 
              onPress={handleLeave} 
              variant="outline"
              style={styles.actionButton}
            />
          ) : (
            <Button 
              title="Join Challenge" 
              onPress={handleJoin} 
              style={styles.actionButton}
            />
          )}
          
          {challenge.status === 'upcoming' && (
            challenge.isScheduled ? (
              <Button 
                title="Unschedule" 
                onPress={handleUnschedule} 
                variant="outline"
                style={styles.actionButton}
              />
            ) : (
              <Button 
                title="Schedule" 
                onPress={handleSchedule} 
                variant="outline"
                style={styles.actionButton}
              />
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 32,
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
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  headerContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  rewardsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
  },
  rewardsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  progressCard: {
    margin: 16,
    padding: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: colors.text,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  progressRemaining: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
    marginLeft: 8,
  },
  leaderboardSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  participantRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  participantInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantDetails: {
    flex: 1,
    marginLeft: 12,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  participantProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantProgressBar: {
    flex: 1,
    marginRight: 8,
  },
  participantProgressText: {
    fontSize: 12,
    color: colors.textSecondary,
    width: 60,
  },
  emptyLeaderboard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyLeaderboardText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyLeaderboardSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  backButton: {
    padding: 8,
  },
});