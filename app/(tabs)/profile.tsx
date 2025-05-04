import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { useWorkoutStore } from '@/store/workout-store';
import { useChallengeStore } from '@/store/challenge-store';
import { useProgressStore } from '@/store/progress-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ActivityChart } from '@/components/progress/ActivityChart';
import { StreakCalendar } from '@/components/progress/StreakCalendar';
import { ChallengeCard } from '@/components/challenge/ChallengeCard';
import { Workout } from '@/types';
import { users } from '@/mocks/users';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, initializeWithMockUser } = useAuthStore();
  const { fetchUserWorkouts } = useWorkoutStore();
  const { fetchUserChallenges } = useChallengeStore();
  const { fetchProgress, getWorkoutStreak } = useProgressStore();
  
  const [userWorkouts, setUserWorkouts] = useState<Workout[]>([]);
  const [userChallenges, setUserChallenges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // If no user is authenticated, use a mock user for demonstration
    if (!isAuthenticated && initializeWithMockUser) {
      initializeWithMockUser();
    }
  }, [isAuthenticated, initializeWithMockUser]);
  
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          // Fetch user-specific data
          const workouts = await fetchUserWorkouts(user.id);
          setUserWorkouts(workouts);
          
          // Fetch user challenges
          await fetchUserChallenges(user.id);
          
          // Fetch progress data
          await fetchProgress();
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadUserData();
  }, [user, fetchUserWorkouts, fetchUserChallenges, fetchProgress]);
  
  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }
  
  const workoutStreak = getWorkoutStreak();
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader 
          user={user}
          onEditProfile={() => router.push('/edit-profile')}
        />
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        ) : (
          <>
            {/* Stats Section */}
            <View style={styles.statsContainer}>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>{user.workouts || 0}</Text>
                <Text style={styles.statLabel}>Workouts</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>{workoutStreak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </Card>
              <Card style={styles.statCard}>
                <Text style={styles.statValue}>{user.points || 0}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </Card>
            </View>
            
            {/* Level Progress */}
            <Card style={styles.levelCard}>
              <View style={styles.levelHeader}>
                <Text style={styles.levelTitle}>Level {Math.floor((user.points || 0) / 100) + 1}</Text>
                <Badge text={user.fitnessLevel || 'Beginner'} />
              </View>
              <ProgressBar 
                progress={((user.points || 0) % 100) / 100} 
                height={8}
                color="#4CAF50"
              />
              <Text style={styles.levelText}>
                {100 - ((user.points || 0) % 100)} XP to next level
              </Text>
            </Card>
            
            {/* Activity Chart */}
            <Card style={styles.chartCard}>
              <Text style={styles.sectionTitle}>Activity</Text>
              <ActivityChart />
            </Card>
            
            {/* Workout Streak */}
            <Card style={styles.streakCard}>
              <Text style={styles.sectionTitle}>Workout Streak</Text>
              <StreakCalendar />
            </Card>
            
            {/* Recent Workouts */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Workouts</Text>
                <TouchableOpacity onPress={() => router.push('/workouts')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              {userWorkouts.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  {userWorkouts.slice(0, 3).map((workout) => (
                    <Card key={workout.id} style={styles.workoutCard} onPress={() => router.push(`/workout/${workout.id}`)}>
                      <Text style={styles.workoutName}>{workout.name}</Text>
                      <Text style={styles.workoutType}>{workout.type}</Text>
                      <View style={styles.workoutStats}>
                        <Text style={styles.workoutStat}>{workout.duration} min</Text>
                        <Text style={styles.workoutStat}>{workout.calories} cal</Text>
                      </View>
                    </Card>
                  ))}
                </ScrollView>
              ) : (
                <Card style={styles.emptyCard}>
                  <Text style={styles.emptyText}>No workouts yet</Text>
                  <TouchableOpacity 
                    style={styles.createButton}
                    onPress={() => router.push('/create-workout')}
                  >
                    <Text style={styles.createButtonText}>Create Workout</Text>
                  </TouchableOpacity>
                </Card>
              )}
            </View>
            
            {/* Active Challenges */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Active Challenges</Text>
                <TouchableOpacity onPress={() => router.push('/challenges')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                {/* Show at least one challenge for demo purposes */}
                <ChallengeCard 
                  challenge={{
                    id: 'challenge-1',
                    title: '30 Day Fitness',
                    description: 'Complete a workout every day for 30 days',
                    type: 'Streak',
                    goal: 30,
                    progress: 12,
                    startDate: new Date().toISOString(),
                    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    participants: 24,
                    creatorId: user.id,
                  }}
                  onPress={() => router.push('/challenge/challenge-1')}
                />
                <ChallengeCard 
                  challenge={{
                    id: 'challenge-2',
                    title: '10K Steps Daily',
                    description: 'Walk 10,000 steps every day for a week',
                    type: 'Steps',
                    goal: 7,
                    progress: 3,
                    startDate: new Date().toISOString(),
                    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    participants: 56,
                    creatorId: 'user-2',
                  }}
                  onPress={() => router.push('/challenge/challenge-2')}
                />
              </ScrollView>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    width: '30%',
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  levelCard: {
    margin: 16,
    padding: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  levelText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'right',
  },
  chartCard: {
    margin: 16,
    padding: 16,
  },
  streakCard: {
    margin: 16,
    padding: 16,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
  },
  horizontalScroll: {
    paddingBottom: 8,
  },
  workoutCard: {
    width: 200,
    padding: 16,
    marginRight: 12,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  workoutType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  workoutStat: {
    fontSize: 12,
    color: '#666',
  },
  emptyCard: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  createButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});