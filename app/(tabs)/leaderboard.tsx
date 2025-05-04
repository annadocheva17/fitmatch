import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useLeaderboardStore } from '@/store/leaderboard-store';
import { useAuthStore } from '@/store/auth-store';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { LeaderboardPeriod } from '@/types';
import { Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LeaderboardScreen() {
  const router = useRouter();
  const { entries, period, isLoading, fetchLeaderboard, setPeriod, getUserRank } = useLeaderboardStore();
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState<LeaderboardPeriod>('weekly');
  
  useEffect(() => {
    fetchLeaderboard();
  }, []);
  
  const handlePeriodChange = (newPeriod: LeaderboardPeriod) => {
    setSelectedPeriod(newPeriod);
    setPeriod(newPeriod);
  };
  
  const handleUserPress = (userId: string) => {
    router.push(`/profile/${userId}`);
  };
  
  // Get top 3 users
  const topUsers = entries.slice(0, 3);
  
  // Get remaining users (positions 4-10)
  const remainingUsers = entries.slice(3, 10);
  
  // Get current user's rank
  const userRank = getUserRank();
  
  // Get star count based on points
  const getStarCount = (points: number) => {
    if (points >= 5000) return 3;
    if (points >= 3000) return 2;
    if (points >= 1000) return 1;
    return 0;
  };
  
  // Render stars
  const renderStars = (count: number) => {
    return Array(count).fill(0).map((_, index) => (
      <Star key={index} size={16} color="#FFD700" fill="#FFD700" />
    ));
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'weekly' && styles.periodButtonActive
            ]}
            onPress={() => handlePeriodChange('weekly')}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === 'weekly' && styles.periodButtonTextActive
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'monthly' && styles.periodButtonActive
            ]}
            onPress={() => handlePeriodChange('monthly')}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === 'monthly' && styles.periodButtonTextActive
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'allTime' && styles.periodButtonActive
            ]}
            onPress={() => handlePeriodChange('allTime')}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === 'allTime' && styles.periodButtonTextActive
              ]}
            >
              All Time
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading leaderboard...</Text>
          </View>
        ) : (
          <>
            <View style={styles.topUsersContainer}>
              {topUsers.map((entry, index) => {
                const position = index + 1;
                let cardColor = '#E0E0E0';
                let textColor = colors.text;
                
                if (position === 1) {
                  cardColor = '#FFD700'; // Gold
                  textColor = '#5D4037';
                } else if (position === 2) {
                  cardColor = '#C0C0C0'; // Silver
                  textColor = '#5D4037';
                } else if (position === 3) {
                  cardColor = '#CD7F32'; // Bronze
                  textColor = '#5D4037';
                }
                
                const isCurrentUser = entry.user.id === user?.id;
                const starCount = getStarCount(entry.points);
                
                return (
                  <TouchableOpacity
                    key={entry.user.id}
                    style={[
                      styles.topUserCard,
                      { 
                        backgroundColor: cardColor,
                        transform: [{ translateY: position === 1 ? 0 : 20 }]
                      }
                    ]}
                    onPress={() => handleUserPress(entry.user.id)}
                  >
                    {isCurrentUser && (
                      <View style={styles.youBadge}>
                        <Text style={styles.youBadgeText}>You</Text>
                      </View>
                    )}
                    
                    <View style={styles.topUserContent}>
                      <View style={styles.avatarContainer}>
                        <Avatar
                          source={entry.user.profileImage}
                          name={entry.user.name}
                          size="lg"
                        />
                      </View>
                      
                      <Text style={[styles.userName, { color: textColor }]}>
                        {entry.user.name}
                      </Text>
                      
                      <Text style={[styles.userTeam, { color: textColor }]}>
                        {entry.user.team || 'No Team'}
                      </Text>
                      
                      <View style={styles.starsContainer}>
                        {renderStars(starCount)}
                      </View>
                      
                      <Text style={[styles.userPoints, { color: textColor }]}>
                        {entry.points} XP
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            <Card style={styles.remainingUsersCard}>
              {remainingUsers.map((entry) => {
                const isCurrentUser = entry.user.id === user?.id;
                
                return (
                  <TouchableOpacity
                    key={entry.user.id}
                    style={[
                      styles.userRow,
                      isCurrentUser && styles.currentUserRow
                    ]}
                    onPress={() => handleUserPress(entry.user.id)}
                  >
                    <View style={styles.rankContainer}>
                      <Text style={styles.rankText}>{entry.rank}</Text>
                    </View>
                    
                    <Avatar
                      source={entry.user.profileImage}
                      name={entry.user.name}
                      size="sm"
                    />
                    
                    <View style={styles.userInfo}>
                      <Text style={styles.userRowName}>{entry.user.name}</Text>
                      <Text style={styles.userRowTeam}>{entry.user.team || 'No Team'}</Text>
                    </View>
                    
                    <Text style={styles.userRowPoints}>{entry.points} XP</Text>
                  </TouchableOpacity>
                );
              })}
            </Card>
            
            <LinearGradient
              colors={['rgba(103, 58, 183, 0.8)', 'rgba(81, 45, 168, 0.9)']}
              style={styles.userRankCard}
            >
              <Text style={styles.userRankTitle}>Your Ranking</Text>
              <Text style={styles.userRankValue}>{userRank}/{entries.length}</Text>
              <Text style={styles.userRankPeriod}>This {period}</Text>
            </LinearGradient>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  periodButtonActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  periodButtonTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  topUsersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
    height: 220,
  },
  topUserCard: {
    width: '30%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  topUserContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  userTeam: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  userPoints: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  youBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 1,
  },
  youBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  remainingUsersCard: {
    marginBottom: 24,
    padding: 0,
    overflow: 'hidden',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  currentUserRow: {
    backgroundColor: 'rgba(103, 58, 183, 0.1)',
  },
  rankContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userRowName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  userRowTeam: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  userRowPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  userRankCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  userRankTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 8,
  },
  userRankValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  userRankPeriod: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});