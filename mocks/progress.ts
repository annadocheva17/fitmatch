import { Progress } from '@/types';

// Generate dates for the last 30 days
const generateRecentDates = (days: number) => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

const last30Days = generateRecentDates(30);

// Generate more realistic workout data
const generateWorkouts = () => {
  const workouts = [];
  const workoutTypes = ['Running', 'Cycling', 'HIIT', 'Weightlifting', 'Yoga', 'Swimming'];
  
  // Create a pattern of workouts (some days with workouts, some without)
  const workoutDays = [0, 1, 3, 4, 6, 8, 9, 11, 13, 14, 16, 18, 20, 21, 23, 25, 27, 28, 29];
  
  for (const dayIndex of workoutDays) {
    const date = last30Days[dayIndex];
    const randomType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
    const duration = Math.floor(Math.random() * 60) + 20; // 20-80 minutes
    const calories = Math.floor(duration * (Math.random() * 8 + 7)); // 7-15 calories per minute
    
    workouts.push({
      date,
      value: 1,
      details: {
        type: randomType,
        duration,
        calories
      }
    });
  }
  
  return workouts;
};

// Generate calories data based on workouts
const generateCalories = (workouts: any[]) => {
  return workouts.map(workout => ({
    date: workout.date,
    value: workout.details.calories,
    details: {
      type: workout.details.type
    }
  }));
};

// Generate distance data (not all workouts have distance)
const generateDistance = (workouts: any[]) => {
  const distanceWorkouts = workouts.filter(w => 
    ['Running', 'Cycling', 'Swimming'].includes(w.details.type)
  );
  
  return distanceWorkouts.map(workout => {
    let distanceMultiplier = 0.1; // Base multiplier
    
    // Different activities have different distance ranges
    if (workout.details.type === 'Running') {
      distanceMultiplier = 0.12; // ~7.2km per hour
    } else if (workout.details.type === 'Cycling') {
      distanceMultiplier = 0.4; // ~24km per hour
    } else if (workout.details.type === 'Swimming') {
      distanceMultiplier = 0.05; // ~3km per hour
    }
    
    const distance = +(workout.details.duration * distanceMultiplier * (0.9 + Math.random() * 0.2)).toFixed(1);
    
    return {
      date: workout.date,
      value: distance,
      details: {
        type: workout.details.type,
        duration: workout.details.duration
      }
    };
  });
};

// Generate weight data (weekly measurements)
const generateWeight = () => {
  const weights = [];
  const startWeight = 75.5; // Starting weight in kg
  let currentWeight = startWeight;
  
  // Weekly measurements for the last 5 weeks
  for (let i = 0; i < 5; i++) {
    const weekIndex = i * 7;
    if (weekIndex < last30Days.length) {
      // Small random fluctuation with slight downward trend
      currentWeight = +(currentWeight - (Math.random() * 0.4) + (Math.random() * 0.2)).toFixed(1);
      
      weights.push({
        date: last30Days[weekIndex],
        value: currentWeight
      });
    }
  }
  
  return weights;
};

// Generate steps data (daily)
const generateSteps = () => {
  const steps = [];
  
  for (let i = 0; i < last30Days.length; i++) {
    // Base steps between 4000-12000
    let baseSteps = Math.floor(Math.random() * 8000) + 4000;
    
    // Weekend boost (more steps on weekends)
    const date = new Date(last30Days[i]);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      baseSteps += Math.floor(Math.random() * 3000) + 1000;
    }
    
    steps.push({
      date: last30Days[i],
      value: baseSteps,
      details: {
        goal: 10000
      }
    });
  }
  
  return steps;
};

// Generate sleep data (daily)
const generateSleep = () => {
  const sleep = [];
  
  for (let i = 0; i < last30Days.length; i++) {
    // Base sleep between 6-8 hours
    const baseHours = 6 + Math.random() * 2;
    
    // Weekend boost (more sleep on weekends)
    const date = new Date(last30Days[i]);
    const dayOfWeek = date.getDay();
    let sleepHours = baseHours;
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      sleepHours += Math.random() * 1.5;
    }
    
    // Convert to minutes for more precise data
    const sleepMinutes = Math.floor(sleepHours * 60);
    
    sleep.push({
      date: last30Days[i],
      value: sleepMinutes,
      details: {
        quality: Math.floor(Math.random() * 5) + 1, // 1-5 quality rating
        deepSleep: Math.floor(sleepMinutes * (0.15 + Math.random() * 0.1)), // 15-25% deep sleep
        remSleep: Math.floor(sleepMinutes * (0.2 + Math.random() * 0.1)) // 20-30% REM sleep
      }
    });
  }
  
  return sleep;
};

// Generate heart rate data (weekly averages)
const generateHeartRate = () => {
  const heartRate = [];
  
  for (let i = 0; i < 5; i++) {
    const weekIndex = i * 7;
    if (weekIndex < last30Days.length) {
      // Resting heart rate between 58-72 bpm
      const restingHR = Math.floor(Math.random() * 14) + 58;
      
      heartRate.push({
        date: last30Days[weekIndex],
        value: restingHR,
        details: {
          max: restingHR + Math.floor(Math.random() * 80) + 40, // Max HR during exercise
          min: restingHR - Math.floor(Math.random() * 5) - 2 // Min HR during sleep
        }
      });
    }
  }
  
  return heartRate;
};

// Generate the mock data
const workouts = generateWorkouts();
const calories = generateCalories(workouts);
const distance = generateDistance(workouts);
const weight = generateWeight();
const steps = generateSteps();
const sleep = generateSleep();
const heartRate = generateHeartRate();

// Export the complete progress data
export const progress: Progress = {
  workouts,
  calories,
  distance,
  weight,
  steps,
  sleep,
  heartRate
};