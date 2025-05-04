import { User } from '@/types';

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    bio: 'Fitness enthusiast and marathon runner. Love outdoor activities and healthy food.',
    profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
    coverImage: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1075&q=80',
    fitnessLevel: 'Advanced',
    preferredExercises: ['Running', 'Swimming', 'Cycling', 'HIIT'],
    preferredTime: ['Morning', 'Evening'],
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: 'New York, NY'
    },
    followers: 245,
    following: 123,
    workouts: 87,
    points: 5400, // XP points
    team: 'Iron Tribe Fitness',
    achievements: [
      {
        id: 'a1',
        title: 'Marathon Finisher',
        description: 'Completed a full marathon',
        icon: '🏃',
        unlockedAt: '2023-05-15T10:30:00Z'
      },
      {
        id: 'a2',
        title: 'Early Bird',
        description: 'Completed 10 workouts before 7 AM',
        icon: '🌅',
        unlockedAt: '2023-04-20T06:15:00Z'
      }
    ],
    joinedAt: '2023-01-15T08:30:00Z'
  },
  {
    id: '2',
    name: 'Jamie Wilson',
    username: 'jamiew',
    email: 'jamie@example.com',
    bio: 'Yoga instructor and wellness coach. Passionate about mindfulness and healthy living.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    coverImage: 'https://images.unsplash.com/photo-1593810450967-f9c42742e3a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    fitnessLevel: 'Expert',
    preferredExercises: ['Yoga', 'Pilates', 'Meditation', 'Hiking'],
    preferredTime: ['Morning'],
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
      address: 'Los Angeles, CA'
    },
    followers: 1024,
    following: 256,
    workouts: 156,
    points: 4250, // XP points
    team: 'Iron Tribe Fitness',
    achievements: [
      {
        id: 'a3',
        title: 'Yoga Master',
        description: 'Completed 100 yoga sessions',
        icon: '🧘‍♀️',
        unlockedAt: '2023-06-01T16:45:00Z'
      }
    ],
    joinedAt: '2022-11-20T14:15:00Z'
  },
  {
    id: '3',
    name: 'Taylor Smith',
    username: 'taylors',
    email: 'taylor@example.com',
    bio: 'Bodybuilder and personal trainer. Helping others achieve their fitness goals.',
    profileImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    fitnessLevel: 'Expert',
    preferredExercises: ['Weightlifting', 'Bodybuilding', 'CrossFit', 'HIIT'],
    preferredTime: ['Evening'],
    location: {
      latitude: 41.8781,
      longitude: -87.6298,
      address: 'Chicago, IL'
    },
    followers: 789,
    following: 345,
    workouts: 210,
    points: 3850, // XP points
    team: 'Iron Tribe Fitness',
    achievements: [
      {
        id: 'a4',
        title: 'Iron Pumper',
        description: 'Lifted over 10,000 lbs in a single workout',
        icon: '💪',
        unlockedAt: '2023-03-10T18:20:00Z'
      },
      {
        id: 'a5',
        title: 'Consistency King',
        description: 'Worked out for 30 consecutive days',
        icon: '👑',
        unlockedAt: '2023-02-28T20:15:00Z'
      }
    ],
    joinedAt: '2022-10-05T11:45:00Z'
  },
  {
    id: '4',
    name: 'Jordan Lee',
    username: 'jordanl',
    email: 'jordan@example.com',
    bio: 'Nutritionist and fitness blogger. Sharing tips for a balanced lifestyle.',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80',
    coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1153&q=80',
    fitnessLevel: 'Intermediate',
    preferredExercises: ['Running', 'Yoga', 'Swimming', 'Cycling'],
    preferredTime: ['Afternoon'],
    location: {
      latitude: 29.7604,
      longitude: -95.3698,
      address: 'Houston, TX'
    },
    followers: 567,
    following: 432,
    workouts: 98,
    points: 2800, // XP points
    team: 'Iron Tribe Fitness',
    achievements: [
      {
        id: 'a6',
        title: 'Nutrition Guru',
        description: 'Logged meals for 60 consecutive days',
        icon: '🥗',
        unlockedAt: '2023-04-15T12:30:00Z'
      }
    ],
    joinedAt: '2023-02-10T09:20:00Z'
  },
  {
    id: '5',
    name: 'Sam Rogers',
    username: 'samr',
    email: 'sam@example.com',
    bio: 'CrossFit athlete and coach. Pushing limits and breaking barriers.',
    profileImage: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    coverImage: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
    fitnessLevel: 'Expert',
    preferredExercises: ['CrossFit', 'Olympic Weightlifting', 'Gymnastics', 'HIIT'],
    preferredTime: ['Morning', 'Evening'],
    location: {
      latitude: 33.4484,
      longitude: -112.0740,
      address: 'Phoenix, AZ'
    },
    followers: 1456,
    following: 578,
    workouts: 312,
    points: 2200, // XP points
    team: 'Iron Tribe Fitness',
    achievements: [
      {
        id: 'a7',
        title: 'CrossFit Beast',
        description: 'Completed 50 CrossFit WODs',
        icon: '🔥',
        unlockedAt: '2023-05-20T17:45:00Z'
      },
      {
        id: 'a8',
        title: 'Double Under Master',
        description: 'Performed 100 double unders unbroken',
        icon: '⚡',
        unlockedAt: '2023-03-25T16:10:00Z'
      },
      {
        id: 'a9',
        title: 'Muscle Up King',
        description: 'Performed 10 consecutive muscle ups',
        icon: '🏋️',
        unlockedAt: '2023-01-30T15:20:00Z'
      }
    ],
    joinedAt: '2022-09-15T10:30:00Z'
  },
  // New users for discover section
  {
    id: '6',
    name: 'Alex Rivera',
    username: 'alexfit',
    email: 'alex@example.com',
    bio: 'Calisthenics specialist and movement coach. Believe in bodyweight mastery.',
    profileImage: 'https://images.unsplash.com/photo-1618641986557-1ecd230959aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    fitnessLevel: 'Advanced',
    preferredExercises: ['Calisthenics', 'Gymnastics', 'Parkour', 'Mobility'],
    preferredTime: ['Afternoon', 'Evening'],
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: 'San Francisco, CA'
    },
    followers: 892,
    following: 315,
    workouts: 178,
    points: 3750,
    team: 'Movement Culture',
    achievements: [
      {
        id: 'a10',
        title: 'Handstand Master',
        description: 'Held a freestanding handstand for 60 seconds',
        icon: '🤸',
        unlockedAt: '2023-06-12T14:20:00Z'
      },
      {
        id: 'a11',
        title: 'Planche Progression',
        description: 'Achieved a straddle planche',
        icon: '💫',
        unlockedAt: '2023-05-05T11:30:00Z'
      }
    ],
    joinedAt: '2022-12-10T08:45:00Z'
  },
  {
    id: '7',
    name: 'Morgan Chen',
    username: 'morganc',
    email: 'morgan@example.com',
    bio: 'Triathlete and endurance coach. Pushing the limits of human potential.',
    profileImage: 'https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
    coverImage: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    fitnessLevel: 'Expert',
    preferredExercises: ['Swimming', 'Cycling', 'Running', 'Triathlon'],
    preferredTime: ['Early Morning', 'Evening'],
    location: {
      latitude: 47.6062,
      longitude: -122.3321,
      address: 'Seattle, WA'
    },
    followers: 1245,
    following: 387,
    workouts: 256,
    points: 4800,
    team: 'Endurance Elite',
    achievements: [
      {
        id: 'a12',
        title: 'Ironman Finisher',
        description: 'Completed a full Ironman triathlon',
        icon: '🏊‍♂️',
        unlockedAt: '2023-07-02T19:15:00Z'
      },
      {
        id: 'a13',
        title: 'Century Rider',
        description: 'Completed a 100-mile bike ride',
        icon: '🚴',
        unlockedAt: '2023-04-18T14:30:00Z'
      }
    ],
    joinedAt: '2022-08-20T15:10:00Z'
  },
  {
    id: '8',
    name: 'Riley Johnson',
    username: 'rileyj',
    email: 'riley@example.com',
    bio: 'Functional fitness coach specializing in mobility and injury prevention.',
    profileImage: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1030&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    fitnessLevel: 'Intermediate',
    preferredExercises: ['Mobility', 'Functional Training', 'Kettlebells', 'Yoga'],
    preferredTime: ['Morning', 'Afternoon'],
    location: {
      latitude: 39.7392,
      longitude: -104.9903,
      address: 'Denver, CO'
    },
    followers: 678,
    following: 245,
    workouts: 132,
    points: 3200,
    team: 'Functional Fitness Collective',
    achievements: [
      {
        id: 'a14',
        title: 'Mobility Master',
        description: 'Achieved full range of motion in all major joints',
        icon: '🧠',
        unlockedAt: '2023-05-28T10:45:00Z'
      },
      {
        id: 'a15',
        title: 'Kettlebell Pro',
        description: 'Completed 1000 kettlebell swings in a week',
        icon: '🏋️‍♀️',
        unlockedAt: '2023-03-15T16:20:00Z'
      }
    ],
    joinedAt: '2023-01-05T11:30:00Z'
  },
  {
    id: '9',
    name: 'Casey Martinez',
    username: 'caseym',
    email: 'casey@example.com',
    bio: 'Boxing coach and HIIT instructor. Helping people find their inner fighter.',
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    coverImage: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    fitnessLevel: 'Advanced',
    preferredExercises: ['Boxing', 'HIIT', 'Circuit Training', 'Cardio'],
    preferredTime: ['Evening', 'Night'],
    location: {
      latitude: 25.7617,
      longitude: -80.1918,
      address: 'Miami, FL'
    },
    followers: 945,
    following: 412,
    workouts: 187,
    points: 3600,
    team: 'Fight Club Fitness',
    achievements: [
      {
        id: 'a16',
        title: 'Boxing Champion',
        description: 'Won an amateur boxing match',
        icon: '🥊',
        unlockedAt: '2023-06-30T20:15:00Z'
      },
      {
        id: 'a17',
        title: 'HIIT Hero',
        description: 'Completed 50 HIIT workouts',
        icon: '⚡',
        unlockedAt: '2023-04-10T18:30:00Z'
      }
    ],
    joinedAt: '2022-11-15T13:20:00Z'
  },
  {
    id: '10',
    name: 'Dakota Kim',
    username: 'dakotak',
    email: 'dakota@example.com',
    bio: 'Powerlifter and strength coach. Believe in the power of progressive overload.',
    profileImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    coverImage: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
    fitnessLevel: 'Expert',
    preferredExercises: ['Powerlifting', 'Strength Training', 'Deadlifts', 'Squats'],
    preferredTime: ['Afternoon', 'Evening'],
    location: {
      latitude: 32.7157,
      longitude: -117.1611,
      address: 'San Diego, CA'
    },
    followers: 1120,
    following: 345,
    workouts: 210,
    points: 4100,
    team: 'Strength First',
    achievements: [
      {
        id: 'a18',
        title: '1000lb Club',
        description: 'Total of 1000+ lbs across squat, bench, and deadlift',
        icon: '🏆',
        unlockedAt: '2023-07-15T16:45:00Z'
      },
      {
        id: 'a19',
        title: 'Deadlift King',
        description: 'Deadlifted 3x bodyweight',
        icon: '💪',
        unlockedAt: '2023-05-10T14:20:00Z'
      }
    ],
    joinedAt: '2022-10-25T09:15:00Z'
  }
];