import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

const fitnessLevels = [
  { id: 'beginner', label: 'Beginner', description: 'New to fitness or returning after a long break' },
  { id: 'intermediate', label: 'Intermediate', description: 'Consistent with workouts for 6+ months' },
  { id: 'advanced', label: 'Advanced', description: 'Experienced with various workout types for 1+ years' },
];

const exerciseTypes = [
  { id: 'weightlifting', label: 'Weightlifting' },
  { id: 'cardio', label: 'Cardio' },
  { id: 'yoga', label: 'Yoga' },
  { id: 'pilates', label: 'Pilates' },
  { id: 'crossfit', label: 'CrossFit' },
  { id: 'hiit', label: 'HIIT' },
  { id: 'running', label: 'Running' },
  { id: 'cycling', label: 'Cycling' },
  { id: 'swimming', label: 'Swimming' },
  { id: 'boxing', label: 'Boxing' },
  { id: 'martial-arts', label: 'Martial Arts' },
  { id: 'calisthenics', label: 'Calisthenics' },
];

const preferredTimes = [
  { id: 'morning', label: 'Morning (5am-11am)' },
  { id: 'afternoon', label: 'Afternoon (11am-5pm)' },
  { id: 'evening', label: 'Evening (5pm-10pm)' },
  { id: 'late-night', label: 'Late Night (10pm-5am)' },
  { id: 'weekends', label: 'Weekends Only' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateProfile, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  
  const handleExerciseToggle = (exerciseId: string) => {
    if (selectedExercises.includes(exerciseId)) {
      setSelectedExercises(selectedExercises.filter(id => id !== exerciseId));
    } else {
      setSelectedExercises([...selectedExercises, exerciseId]);
    }
  };
  
  const handleTimeToggle = (timeId: string) => {
    if (selectedTimes.includes(timeId)) {
      setSelectedTimes(selectedTimes.filter(id => id !== timeId));
    } else {
      setSelectedTimes([...selectedTimes, timeId]);
    }
  };
  
  const handleNext = () => {
    if (step === 1 && !fitnessLevel) {
      alert('Please select your fitness level');
      return;
    }
    
    if (step === 2 && selectedExercises.length === 0) {
      alert('Please select at least one exercise type');
      return;
    }
    
    if (step === 3) {
      handleComplete();
      return;
    }
    
    setStep(step + 1);
  };
  
  const handleBack = () => {
    if (step === 1) {
      router.back();
      return;
    }
    
    setStep(step - 1);
  };
  
  const handleComplete = async () => {
    try {
      await updateProfile({
        fitnessLevel,
        preferredExercises: selectedExercises,
        preferredTime: selectedTimes,
      });
      
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What's your fitness level?</Text>
            <Text style={styles.stepDescription}>
              This helps us personalize your experience and find suitable workout partners
            </Text>
            
            <View style={styles.optionsContainer}>
              {fitnessLevels.map(level => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.levelOption,
                    fitnessLevel === level.id && styles.selectedOption
                  ]}
                  onPress={() => setFitnessLevel(level.id)}
                >
                  <Text style={[
                    styles.levelLabel,
                    fitnessLevel === level.id && styles.selectedLabel
                  ]}>
                    {level.label}
                  </Text>
                  <Text style={[
                    styles.levelDescription,
                    fitnessLevel === level.id && styles.selectedDescription
                  ]}>
                    {level.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What exercises do you enjoy?</Text>
            <Text style={styles.stepDescription}>
              Select all that apply. This helps us match you with compatible workout partners
            </Text>
            
            <ScrollView style={styles.scrollContainer}>
              <View style={styles.exercisesGrid}>
                {exerciseTypes.map(exercise => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={[
                      styles.exerciseOption,
                      selectedExercises.includes(exercise.id) && styles.selectedOption
                    ]}
                    onPress={() => handleExerciseToggle(exercise.id)}
                  >
                    <Text style={[
                      styles.exerciseLabel,
                      selectedExercises.includes(exercise.id) && styles.selectedLabel
                    ]}>
                      {exercise.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>When do you prefer to workout?</Text>
            <Text style={styles.stepDescription}>
              Select all that apply. This helps us find partners with compatible schedules
            </Text>
            
            <View style={styles.optionsContainer}>
              {preferredTimes.map(time => (
                <TouchableOpacity
                  key={time.id}
                  style={[
                    styles.timeOption,
                    selectedTimes.includes(time.id) && styles.selectedOption
                  ]}
                  onPress={() => handleTimeToggle(time.id)}
                >
                  <Text style={[
                    styles.timeLabel,
                    selectedTimes.includes(time.id) && styles.selectedLabel
                  ]}>
                    {time.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: '',
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
        }} 
      />
      
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(step / 3) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>Step {step} of 3</Text>
        </View>
        
        {renderStep()}
        
        <View style={styles.footer}>
          <Button
            title={step === 3 ? "Complete" : "Continue"}
            variant="primary"
            size="lg"
            isLoading={isLoading}
            onPress={handleNext}
            rightIcon={step !== 3 ? <ArrowRight size={20} color={colors.white} /> : undefined}
          />
          
          {step === 3 && (
            <TouchableOpacity 
              style={styles.skipContainer}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  optionsContainer: {
    flex: 1,
  },
  levelOption: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  levelLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  selectedLabel: {
    color: colors.primary,
  },
  levelDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedDescription: {
    color: colors.text,
  },
  scrollContainer: {
    flex: 1,
  },
  exercisesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  exerciseOption: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  exerciseLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  timeOption: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  footer: {
    marginTop: 16,
  },
  skipContainer: {
    alignItems: 'center',
    padding: 16,
  },
  skipText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  backButton: {
    padding: 8,
  },
});