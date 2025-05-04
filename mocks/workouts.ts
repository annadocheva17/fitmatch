import { Workout } from '@/store/workout-store';

export const workouts: Workout[] = [
  {
    id: 'w1',
    userId: '1',
    name: 'Full Body HIIT',
    type: 'HIIT',
    duration: 30,
    calories: 350,
    exercises: [
      {
        id: 'e1',
        name: 'Jumping Jacks',
        sets: 3,
        reps: 20,
      },
      {
        id: 'e2',
        name: 'Push-ups',
        sets: 3,
        reps: 15,
      },
      {
        id: 'e3',
        name: 'Squats',
        sets: 3,
        reps: 20,
      },
      {
        id: 'e4',
        name: 'Mountain Climbers',
        sets: 3,
        reps: 30,
      },
      {
        id: 'e5',
        name: 'Burpees',
        sets: 3,
        reps: 10,
      }
    ],
    date: '2023-07-15T10:30:00Z',
    notes: 'A high-intensity interval training workout that targets all major muscle groups for a full-body burn.',
    isPublic: true,
    likes: ['2', '3', '4'],
  },
  {
    id: 'w2',
    userId: '2',
    name: 'Yoga Flow',
    type: 'Yoga',
    duration: 45,
    calories: 180,
    exercises: [
      {
        id: 'e6',
        name: 'Sun Salutation',
        sets: 1,
        reps: 5,
      },
      {
        id: 'e7',
        name: 'Warrior Poses',
        sets: 1,
        reps: 10,
      },
      {
        id: 'e8',
        name: 'Downward Dog',
        sets: 1,
        reps: 5,
      },
      {
        id: 'e9',
        name: 'Tree Pose',
        sets: 1,
        reps: 2,
      },
      {
        id: 'e10',
        name: 'Corpse Pose',
        sets: 1,
        reps: 1,
      }
    ],
    date: '2023-07-10T08:45:00Z',
    notes: 'A gentle yoga flow to improve flexibility, balance, and mindfulness. Perfect for beginners and recovery days.',
    isPublic: true,
    likes: ['1', '5'],
  },
  {
    id: 'w3',
    userId: '3',
    name: 'Upper Body Strength',
    type: 'Strength',
    duration: 60,
    calories: 450,
    exercises: [
      {
        id: 'e11',
        name: 'Bench Press',
        sets: 4,
        reps: 8,
        weight: 60,
      },
      {
        id: 'e12',
        name: 'Pull-ups',
        sets: 4,
        reps: 10,
      },
      {
        id: 'e13',
        name: 'Shoulder Press',
        sets: 3,
        reps: 12,
        weight: 40,
      },
      {
        id: 'e14',
        name: 'Bicep Curls',
        sets: 3,
        reps: 15,
        weight: 15,
      },
      {
        id: 'e15',
        name: 'Tricep Dips',
        sets: 3,
        reps: 15,
      }
    ],
    date: '2023-07-05T16:20:00Z',
    notes: 'Focus on building upper body strength with this comprehensive workout targeting chest, back, shoulders, and arms.',
    isPublic: true,
    likes: ['1', '2', '4', '5'],
  },
  {
    id: 'w4',
    userId: '4',
    name: '30-Minute Cardio Blast',
    type: 'Cardio',
    duration: 30,
    calories: 320,
    exercises: [
      {
        id: 'e16',
        name: 'High Knees',
        sets: 3,
        duration: 60,
        reps: 0, // Adding required reps property
      },
      {
        id: 'e17',
        name: 'Jumping Lunges',
        sets: 3,
        reps: 20,
      },
      {
        id: 'e18',
        name: 'Jump Rope',
        sets: 3,
        duration: 60,
        reps: 0, // Adding required reps property
      },
      {
        id: 'e19',
        name: 'Squat Jumps',
        sets: 3,
        reps: 15,
      },
      {
        id: 'e20',
        name: 'Plank Jacks',
        sets: 3,
        reps: 20,
      }
    ],
    date: '2023-07-01T12:15:00Z',
    notes: 'A quick but intense cardio workout to boost your heart rate and burn calories.',
    isPublic: true,
    likes: ['3'],
  },
  {
    id: 'w5',
    userId: '5',
    name: 'Lower Body Focus',
    type: 'Strength',
    duration: 45,
    calories: 380,
    exercises: [
      {
        id: 'e21',
        name: 'Barbell Squats',
        sets: 4,
        reps: 12,
        weight: 70,
      },
      {
        id: 'e22',
        name: 'Romanian Deadlifts',
        sets: 4,
        reps: 10,
        weight: 80,
      },
      {
        id: 'e23',
        name: 'Walking Lunges',
        sets: 3,
        reps: 20,
      },
      {
        id: 'e24',
        name: 'Leg Press',
        sets: 3,
        reps: 15,
        weight: 100,
      },
      {
        id: 'e25',
        name: 'Calf Raises',
        sets: 3,
        reps: 20,
        weight: 30,
      }
    ],
    date: '2023-06-25T17:30:00Z',
    notes: 'Build strength and definition in your legs and glutes with this targeted lower body workout.',
    isPublic: true,
    likes: ['1', '2'],
  }
];