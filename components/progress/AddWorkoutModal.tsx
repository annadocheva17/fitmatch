import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch
} from 'react-native';
import { X, Calendar as CalendarIcon, Clock, Flame, TrendingUp, Footprints } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddWorkoutModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    date: string;
    workoutType: string;
    duration: number;
    calories: number;
    distance?: number;
  }) => void;
}

const workoutTypes = [
  'Running',
  'Cycling',
  'Swimming',
  'Weightlifting',
  'HIIT',
  'Yoga',
  'Pilates',
  'CrossFit',
  'Walking',
  'Hiking',
  'Other'
];

export function AddWorkoutModal({ visible, onClose, onSubmit }: AddWorkoutModalProps) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [workoutType, setWorkoutType] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [includeDistance, setIncludeDistance] = useState(false);
  const [distance, setDistance] = useState('');
  const [includeSteps, setIncludeSteps] = useState(false);
  const [steps, setSteps] = useState('');
  const [selectedWorkoutType, setSelectedWorkoutType] = useState<string | null>(null);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    if (selectedWorkoutType && duration && calories) {
      onSubmit({
        date: date.toISOString(),
        workoutType: selectedWorkoutType,
        duration: Number(duration),
        calories: Number(calories),
        distance: includeDistance && distance ? Number(distance) : undefined
      });
      
      // Reset form
      setDate(new Date());
      setWorkoutType('');
      setDuration('');
      setCalories('');
      setIncludeDistance(false);
      setDistance('');
      setIncludeSteps(false);
      setSteps('');
      setSelectedWorkoutType(null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Auto-calculate calories based on workout type and duration
  const calculateCalories = () => {
    if (!selectedWorkoutType || !duration) return;
    
    const durationNum = Number(duration);
    if (isNaN(durationNum)) return;
    
    let caloriesPerMinute = 7; // Default
    
    switch (selectedWorkoutType) {
      case 'Running':
        caloriesPerMinute = 10;
        break;
      case 'Cycling':
        caloriesPerMinute = 8;
        break;
      case 'Swimming':
        caloriesPerMinute = 9;
        break;
      case 'Weightlifting':
        caloriesPerMinute = 6;
        break;
      case 'HIIT':
        caloriesPerMinute = 12;
        break;
      case 'Yoga':
        caloriesPerMinute = 4;
        break;
      case 'Pilates':
        caloriesPerMinute = 5;
        break;
      case 'CrossFit':
        caloriesPerMinute = 11;
        break;
      case 'Walking':
        caloriesPerMinute = 5;
        break;
      case 'Hiking':
        caloriesPerMinute = 7;
        break;
    }
    
    const estimatedCalories = Math.round(durationNum * caloriesPerMinute);
    setCalories(estimatedCalories.toString());
  };

  // Auto-suggest distance based on workout type and duration
  const suggestDistance = () => {
    if (!selectedWorkoutType || !duration) return;
    
    const durationNum = Number(duration);
    if (isNaN(durationNum)) return;
    
    let kmPerHour = 0;
    
    switch (selectedWorkoutType) {
      case 'Running':
        kmPerHour = 10;
        break;
      case 'Cycling':
        kmPerHour = 20;
        break;
      case 'Swimming':
        kmPerHour = 3;
        break;
      case 'Walking':
        kmPerHour = 5;
        break;
      case 'Hiking':
        kmPerHour = 4;
        break;
      default:
        return; // Don't suggest distance for other workout types
    }
    
    const estimatedDistance = (durationNum / 60 * kmPerHour).toFixed(1);
    setDistance(estimatedDistance);
    setIncludeDistance(true);
  };

  const isFormValid = selectedWorkoutType && duration && calories && (!includeDistance || distance);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Workout</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity 
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <CalendarIcon size={20} color={colors.primary} />
                <Text style={styles.dateText}>{formatDate(date)}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Workout Type</Text>
              <View style={styles.workoutTypesContainer}>
                {workoutTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.workoutTypeButton,
                      selectedWorkoutType === type && styles.selectedWorkoutType
                    ]}
                    onPress={() => {
                      setSelectedWorkoutType(type);
                      // Auto-suggest distance for relevant workout types
                      if (['Running', 'Cycling', 'Swimming', 'Walking', 'Hiking'].includes(type)) {
                        suggestDistance();
                      } else {
                        setIncludeDistance(false);
                      }
                    }}
                  >
                    <Text 
                      style={[
                        styles.workoutTypeText,
                        selectedWorkoutType === type && styles.selectedWorkoutTypeText
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Duration (minutes)</Text>
              <View style={styles.inputWithIcon}>
                <Clock size={20} color={colors.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter duration"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  value={duration}
                  onChangeText={(text) => {
                    setDuration(text);
                    // Auto-calculate calories when duration changes
                    if (text && selectedWorkoutType) {
                      calculateCalories();
                      suggestDistance();
                    }
                  }}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Calories Burned</Text>
              <View style={styles.inputWithIcon}>
                <Flame size={20} color={colors.primary} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter calories"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  value={calories}
                  onChangeText={setCalories}
                />
              </View>
              {selectedWorkoutType && duration && (
                <TouchableOpacity onPress={calculateCalories} style={styles.suggestionButton}>
                  <Text style={styles.suggestionText}>Suggest calories</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.formGroup}>
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Include Distance</Text>
                <Switch
                  value={includeDistance}
                  onValueChange={setIncludeDistance}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
              
              {includeDistance && (
                <View style={styles.inputWithIcon}>
                  <TrendingUp size={20} color={colors.primary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter distance (km)"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="decimal-pad"
                    value={distance}
                    onChangeText={setDistance}
                  />
                </View>
              )}
              
              {includeDistance && selectedWorkoutType && duration && (
                <TouchableOpacity onPress={suggestDistance} style={styles.suggestionButton}>
                  <Text style={styles.suggestionText}>Suggest distance</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Include Steps</Text>
                <Switch
                  value={includeSteps}
                  onValueChange={setIncludeSteps}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
              
              {includeSteps && (
                <View style={styles.inputWithIcon}>
                  <Footprints size={20} color={colors.primary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter steps"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="number-pad"
                    value={steps}
                    onChangeText={setSteps}
                  />
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button 
              title="Save Workout" 
              onPress={handleSubmit} 
              disabled={!isFormValid}
              style={styles.submitButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  workoutTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  workoutTypeButton: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
  },
  selectedWorkoutType: {
    backgroundColor: colors.primary,
  },
  workoutTypeText: {
    color: colors.text,
    fontSize: 14,
  },
  selectedWorkoutTypeText: {
    color: colors.white,
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  suggestionText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitButton: {
    marginTop: 8,
  },
});