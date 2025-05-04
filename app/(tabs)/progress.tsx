import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ActivityChart } from '@/components/progress/ActivityChart';
import { StreakCalendar } from '@/components/progress/StreakCalendar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useProgressStore } from '@/store/progress-store';
import { colors } from '@/constants/colors';
import { Calendar, Dumbbell, Flame, Weight, TrendingUp, Plus, Footprints, Moon, Heart } from 'lucide-react-native';
import { AddWorkoutModal } from '@/components/progress/AddWorkoutModal';
import { Tabs } from '@/components/ui/Tabs';

export default function ProgressScreen() {
  const { progress, fetchProgress, getWorkoutStreak, isLoading, addWorkout, addWeight } = useProgressStore();
  const [refreshing, setRefreshing] = useState(false);
  const [addWorkoutVisible, setAddWorkoutVisible] = useState(false);
  const [addWeightVisible, setAddWeightVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('fitness');
  
  useEffect(() => {
    fetchProgress();
  }, []);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProgress();
    setRefreshing(false);
  };
  
  const handleAddWorkout = () => {
    setAddWorkoutVisible(true);
  };
  
  const handleCloseAddWorkout = () => {
    setAddWorkoutVisible(false);
  };
  
  const handleSubmitWorkout = (data: { 
    date: string; 
    workoutType: string; 
    duration: number; 
    calories: number; 
    distance?: number;
  }) => {
    addWorkout(data);
    setAddWorkoutVisible(false);
  };
  
  const handleAddWeight = () => {
    // For simplicity, we'll just prompt for a weight value
    const weight = prompt('Enter your weight in kg:');
    if (weight && !isNaN(Number(weight))) {
      addWeight({
        date: new Date().toISOString(),
        value: Number(weight)
      });
    }
  };
  
  // Show loading state while data is being fetched
  if (isLoading && !progress?.workouts) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your progress...</Text>
      </SafeAreaView>
    );
  }
  
  // Ensure progress and workouts exist before calculating stats
  const workouts = progress?.workouts || [];
  const calories = progress?.calories || [];
  const distance = progress?.distance || [];
  const weights = progress?.weight || [];
  const steps = progress?.steps || [];
  const sleep = progress?.sleep || [];
  const heartRate = progress?.heartRate || [];
  
  const streak = getWorkoutStreak();
  
  // Calculate total stats
  const totalWorkouts = workouts.reduce((sum, item) => sum + item.value, 0);
  const totalCalories = calories.reduce((sum, item) => sum + item.value, 0);
  const totalDistance = distance.reduce((sum, item) => sum + item.value, 0);
  
  // Get current weight (most recent entry)
  const sortedWeights = [...weights].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const currentWeight = sortedWeights.length > 0 ? sortedWeights[0].value : null;
  
  // Get average steps
  const averageSteps = steps.length > 0 
    ? Math.round(steps.reduce((sum, item) => sum + item.value, 0) / steps.length) 
    : 0;
  
  // Get average sleep (in hours)
  const averageSleep = sleep.length > 0 
    ? Math.round(sleep.reduce((sum, item) => sum + item.value, 0) / sleep.length / 60 * 10) / 10 
    : 0;
  
  // Get latest heart rate
  const latestHeartRate = heartRate.length > 0 
    ? heartRate.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].value 
    : 0;

  // Format minutes to hours and minutes
  const formatSleepTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Progress</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddWorkout}
          >
            <Plus size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
        
        <Tabs
          tabs={[
            { key: 'fitness', title: 'Fitness' },
            { key: 'health', title: 'Health' }
          ]}
          selectedTab={activeTab}
          onTabChange={setActiveTab}
          style={styles.tabs}
        />
        
        {activeTab === 'fitness' ? (
          <>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Dumbbell size={20} color={colors.primary} />
                </View>
                <Text style={styles.statValue}>{totalWorkouts}</Text>
                <Text style={styles.statLabel}>Workouts</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Calendar size={20} color={colors.primary} />
                </View>
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Flame size={20} color={colors.primary} />
                </View>
                <Text style={styles.statValue}>{totalCalories}</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <TrendingUp size={20} color={colors.primary} />
                </View>
                <Text style={styles.statValue}>{totalDistance.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Km</Text>
              </View>
            </View>
            
            <StreakCalendar workouts={workouts} />
            
            <View style={styles.chartsContainer}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Workout Activity</Text>
                <Badge label="Last 15 days" variant="primary" size="sm" />
              </View>
              <ActivityChart 
                data={workouts.slice(-15)} 
                title="Workouts" 
                color={colors.primary}
              />
              
              {calories.length > 0 && (
                <>
                  <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>Calories Burned</Text>
                    <Badge label="Last 10 workouts" variant="secondary" size="sm" />
                  </View>
                  <ActivityChart 
                    data={calories.slice(-10)} 
                    title="Calories" 
                    color={colors.secondary}
                  />
                </>
              )}
              
              {distance.length > 0 && (
                <>
                  <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>Distance</Text>
                    <Badge label="Last 6 workouts" variant="info" size="sm" />
                  </View>
                  <ActivityChart 
                    data={distance.slice(-6)} 
                    title="Distance (km)" 
                    color={colors.info}
                  />
                </>
              )}
            </View>
            
            <Card style={styles.weightCard}>
              <View style={styles.weightHeader}>
                <View style={styles.weightTitleContainer}>
                  <Weight size={20} color={colors.text} />
                  <Text style={styles.weightTitle}>Weight Tracking</Text>
                </View>
                <TouchableOpacity 
                  style={styles.weightAddButton}
                  onPress={handleAddWeight}
                >
                  <Plus size={16} color={colors.primary} />
                  <Text style={styles.weightAddButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
              
              {currentWeight ? (
                <View style={styles.weightContent}>
                  <Text style={styles.currentWeight}>{currentWeight} kg</Text>
                  {weights.length > 1 && (
                    <ActivityChart 
                      data={weights.slice(-7)} 
                      title="Weight History" 
                      color="#9333EA"
                      height={120}
                    />
                  )}
                </View>
              ) : (
                <View style={styles.emptyWeight}>
                  <Text style={styles.emptyWeightText}>No weight data recorded</Text>
                  <Text style={styles.emptyWeightSubtext}>
                    Add your weight to track changes over time
                  </Text>
                </View>
              )}
            </Card>
          </>
        ) : (
          <>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: '#E6F7FF' }]}>
                  <Footprints size={20} color="#0096FF" />
                </View>
                <Text style={styles.statValue}>{averageSteps.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Avg. Steps</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: '#F0E6FF' }]}>
                  <Moon size={20} color="#9333EA" />
                </View>
                <Text style={styles.statValue}>{averageSleep}</Text>
                <Text style={styles.statLabel}>Avg. Sleep (h)</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: '#FFE6E6' }]}>
                  <Heart size={20} color="#FF3B30" />
                </View>
                <Text style={styles.statValue}>{latestHeartRate}</Text>
                <Text style={styles.statLabel}>Heart Rate</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: colors.highlight }]}>
                  <Weight size={20} color={colors.primary} />
                </View>
                <Text style={styles.statValue}>{currentWeight ? currentWeight : '--'}</Text>
                <Text style={styles.statLabel}>Weight (kg)</Text>
              </View>
            </View>
            
            {steps.length > 0 && (
              <>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Daily Steps</Text>
                  <Badge label="Last 7 days" variant="info" size="sm" />
                </View>
                <ActivityChart 
                  data={steps.slice(-7)} 
                  title="Steps" 
                  color="#0096FF"
                />
              </>
            )}
            
            {sleep.length > 0 && (
              <>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Sleep Duration</Text>
                  <Badge label="Last 7 days" variant="secondary" size="sm" />
                </View>
                <Card style={styles.sleepCard}>
                  <View style={styles.sleepChartContainer}>
                    <ActivityChart 
                      data={sleep.slice(-7).map(item => ({
                        ...item,
                        value: item.value / 60 // Convert minutes to hours for display
                      }))} 
                      title="Sleep (hours)" 
                      color="#9333EA"
                    />
                  </View>
                  
                  <View style={styles.sleepDetailsContainer}>
                    {sleep.slice(-3).map((sleepData, index) => (
                      <View key={index} style={styles.sleepDetailItem}>
                        <Text style={styles.sleepDate}>
                          {new Date(sleepData.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </Text>
                        <Text style={styles.sleepTime}>{formatSleepTime(sleepData.value)}</Text>
                        <View style={styles.sleepQualityContainer}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <View 
                              key={i} 
                              style={[
                                styles.sleepQualityDot,
                                i < (sleepData.details?.quality || 0) && styles.sleepQualityDotActive
                              ]} 
                            />
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                </Card>
              </>
            )}
            
            {heartRate.length > 0 && (
              <>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartTitle}>Resting Heart Rate</Text>
                  <Badge label="Last 7 days" variant="danger" size="sm" />
                </View>
                <ActivityChart 
                  data={heartRate.slice(-7)} 
                  title="BPM" 
                  color="#FF3B30"
                />
              </>
            )}
          </>
        )}
      </ScrollView>

      <AddWorkoutModal
        visible={addWorkoutVisible}
        onClose={handleCloseAddWorkout}
        onSubmit={handleSubmitWorkout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.card,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  chartsContainer: {
    marginTop: 8,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  weightCard: {
    marginTop: 16,
    marginBottom: 24,
  },
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weightTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  weightAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  weightAddButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  weightContent: {
    alignItems: 'center',
  },
  currentWeight: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  emptyWeight: {
    alignItems: 'center',
    padding: 24,
  },
  emptyWeightText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyWeightSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sleepCard: {
    marginBottom: 16,
  },
  sleepChartContainer: {
    marginBottom: 8,
  },
  sleepDetailsContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  sleepDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sleepDate: {
    fontSize: 14,
    color: colors.textSecondary,
    width: '30%',
  },
  sleepTime: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    width: '30%',
  },
  sleepQualityContainer: {
    flexDirection: 'row',
    width: '30%',
  },
  sleepQualityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginRight: 4,
  },
  sleepQualityDotActive: {
    backgroundColor: '#9333EA',
  },
});