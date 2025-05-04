import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProgressMetric } from '@/types';
import { colors } from '@/constants/colors';
import { Flame } from 'lucide-react-native';

interface StreakCalendarProps {
  workouts: ProgressMetric[];
  month?: Date;
  onDayPress?: (date: Date) => void;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({
  workouts = [],
  month = new Date(),
  onDayPress,
}) => {
  // Get days in month
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  
  // Create array of day numbers (1-31)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Create array for empty cells before first day
  const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => null);
  
  // Combine empty cells and days
  const calendarDays = [...emptyCells, ...days];
  
  // Create workout map for quick lookup
  const workoutMap: Record<string, number> = {};
  workouts.forEach(workout => {
    if (!workout.date) return;
    
    const date = new Date(workout.date);
    if (date.getMonth() === monthIndex && date.getFullYear() === year) {
      workoutMap[date.getDate()] = workout.value;
    }
  });
  
  // Calculate current streak
  const calculateStreak = () => {
    if (!workouts || workouts.length === 0) {
      return 0;
    }
    
    const today = new Date();
    let streak = 0;
    let currentDate = new Date();
    
    // Check if there's a workout for today
    const todayStr = today.toISOString().split('T')[0];
    const hasWorkoutToday = workouts.some(w => w.date === todayStr && w.value > 0);
    
    if (!hasWorkoutToday) {
      // If no workout today, start checking from yesterday
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    // Count consecutive days with workouts
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const workoutForDate = workouts.find(w => w.date === dateStr);
      
      if (workoutForDate && workoutForDate.value > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const streak = calculateStreak();
  
  // Calculate longest streak
  const calculateLongestStreak = () => {
    if (!workouts || workouts.length === 0) {
      return 0;
    }
    
    // Sort workouts by date
    const sortedWorkouts = [...workouts].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let longestStreak = 0;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedWorkouts.length; i++) {
      const prevDate = new Date(sortedWorkouts[i-1].date);
      const currDate = new Date(sortedWorkouts[i].date);
      
      // Check if dates are consecutive
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
        currentStreak = 1;
      }
    }
    
    // Check if the last streak is the longest
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
    
    return longestStreak;
  };
  
  const longestStreak = calculateLongestStreak();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthTitle}>
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
        <View style={styles.streakContainer}>
          <View style={styles.streakItem}>
            <Flame size={16} color={colors.primary} />
            <Text style={styles.streakLabel}>Current</Text>
            <Text style={styles.streakValue}>{streak} days</Text>
          </View>
          <View style={styles.streakDivider} />
          <View style={styles.streakItem}>
            <Flame size={16} color="#FF9500" />
            <Text style={styles.streakLabel}>Longest</Text>
            <Text style={styles.streakValue}>{longestStreak} days</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.weekdaysContainer}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <Text key={index} style={styles.weekdayLabel}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.daysContainer}>
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.emptyCell} />;
          }
          
          const hasWorkout = workoutMap[day] > 0;
          const isToday = 
            new Date().getDate() === day && 
            new Date().getMonth() === monthIndex && 
            new Date().getFullYear() === year;
          
          return (
            <TouchableOpacity 
              key={`day-${day}`} 
              style={[
                styles.dayCell,
                hasWorkout && styles.workoutDay,
                isToday && styles.today,
              ]}
              onPress={() => {
                if (onDayPress) {
                  const selectedDate = new Date(year, monthIndex, day);
                  onDayPress(selectedDate);
                }
              }}
              disabled={!onDayPress}
            >
              <Text 
                style={[
                  styles.dayText,
                  hasWorkout && styles.workoutDayText,
                  isToday && styles.todayText,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.legendText}>Workout completed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.todayDot]} />
          <Text style={styles.legendText}>Today</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakItem: {
    alignItems: 'center',
  },
  streakDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  streakLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  streakValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  weekdaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyCell: {
    width: '14.28%',
    aspectRatio: 1,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    margin: 1,
  },
  workoutDay: {
    backgroundColor: colors.primary,
  },
  today: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    color: colors.text,
  },
  workoutDayText: {
    color: colors.white,
    fontWeight: '500',
  },
  todayText: {
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  todayDot: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});