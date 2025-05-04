import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useWorkoutStore } from '@/store/workout-store';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { Heart, MessageCircle, Share, Clock, Flame, Dumbbell, ArrowLeft } from 'lucide-react-native';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { workouts, fetchWorkouts, likeWorkout, unlikeWorkout } = useWorkoutStore();
  const { user: currentUser } = useAuthStore();
  const [workout, setWorkout] = useState<typeof workouts[0] | null>(null);
  
  useEffect(() => {
    fetchWorkouts();
  }, []);
  
  useEffect(() => {
    // Find workout by ID
    const foundWorkout = workouts.find(w => w.id === id);
    if (foundWorkout) {
      setWorkout(foundWorkout);
    }
  }, [id, workouts]);
  
  const handleLike = () => {
    if (workout) {
      likeWorkout(workout.id);
    }
  };
  
  const handleUnlike = () => {
    if (workout) {
      unlikeWorkout(workout.id);
    }
  };
  
  const handleShare = () => {
    // Share functionality would go here
    console.log('Share workout:', id);
  };
  
  const handleUserPress = (userId: string) => {
    router.push(`/profile/${userId}`);
  };
  
  // Check if current user has liked the workout
  // Add a null check for workout?.likes to prevent the error
  const isLiked = workout?.likes ? workout.likes.includes(currentUser?.id || '1') : false;
  
  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading workout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: workout.name || "",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.workoutCard}>
          <View style={styles.workoutHeader}>
            <TouchableOpacity 
              style={styles.userContainer}
              onPress={() => workout.user && handleUserPress(workout.user.id)}
            >
              {workout.user && (
                <>
                  <Avatar 
                    source={{ uri: workout.user.avatar }} 
                    size={40} 
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{workout.user.name}</Text>
                    <Text style={styles.userUsername}>@{workout.user.username}</Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
            
            <Badge label={workout.type || ""} variant="primary" />
          </View>
          
          <Text style={styles.workoutName}>{workout.name || ""}</Text>
          
          <View style={styles.workoutStats}>
            <View style={styles.statItem}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>{workout.duration} min</Text>
            </View>
            
            <View style={styles.statItem}>
              <Flame size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>{workout.calories} cal</Text>
            </View>
            
            <View style={styles.statItem}>
              <Dumbbell size={16} color={colors.textSecondary} />
              <Text style={styles.statText}>
                {workout.exercises ? workout.exercises.length : 0} exercises
              </Text>
            </View>
          </View>
          
          {(workout.notes) && (
            <Text style={styles.notes}>{workout.notes}</Text>
          )}
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={isLiked ? handleUnlike : handleLike}
            >
              <Heart 
                size={20} 
                color={isLiked ? colors.error : colors.textSecondary} 
                fill={isLiked ? colors.error : 'none'} 
              />
              <Text style={styles.actionText}>
                {workout.likes ? workout.likes.length : 0} {workout.likes && workout.likes.length === 1 ? 'Like' : 'Likes'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={20} color={colors.textSecondary} />
              <Text style={styles.actionText}>Comment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Share size={20} color={colors.textSecondary} />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </Card>
        
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          
          {workout.exercises && workout.exercises.map((exercise, index) => (
            <Card key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseIndex}>{index + 1}</Text>
              </View>
              
              <View style={styles.exerciseDetails}>
                {exercise.sets && (
                  <View style={styles.exerciseDetail}>
                    <Text style={styles.detailLabel}>Sets</Text>
                    <Text style={styles.detailValue}>{exercise.sets}</Text>
                  </View>
                )}
                
                {exercise.reps && (
                  <View style={styles.exerciseDetail}>
                    <Text style={styles.detailLabel}>Reps</Text>
                    <Text style={styles.detailValue}>{exercise.reps}</Text>
                  </View>
                )}
                
                {exercise.weight && (
                  <View style={styles.exerciseDetail}>
                    <Text style={styles.detailLabel}>Weight</Text>
                    <Text style={styles.detailValue}>{exercise.weight} kg</Text>
                  </View>
                )}
                
                {exercise.duration && (
                  <View style={styles.exerciseDetail}>
                    <Text style={styles.detailLabel}>Duration</Text>
                    <Text style={styles.detailValue}>{exercise.duration} min</Text>
                  </View>
                )}
                
                {exercise.distance && (
                  <View style={styles.exerciseDetail}>
                    <Text style={styles.detailLabel}>Distance</Text>
                    <Text style={styles.detailValue}>{exercise.distance} km</Text>
                  </View>
                )}
              </View>
            </Card>
          ))}
        </View>
        
        {workout.isPublic && (
          <Button 
            title="Try this workout" 
            onPress={() => {}} 
            style={styles.tryButton}
          />
        )}
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
    padding: 16,
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
  workoutCard: {
    padding: 16,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  userUsername: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  workoutName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  workoutStats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  notes: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  exercisesSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  exerciseCard: {
    padding: 16,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  exerciseIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    backgroundColor: colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  exerciseDetail: {
    marginRight: 16,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  tryButton: {
    marginTop: 24,
  },
  backButton: {
    padding: 8,
  },
});