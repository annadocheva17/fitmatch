import { Challenge } from '@/types';

// Helper function to create dates relative to today
const getRelativeDate = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const challenges: Challenge[] = [
  {
    id: 'c1',
    title: '30-Day Workout Challenge',
    description: 'Complete at least 20 workouts in 30 days to earn 500 points and the "Consistency Champion" badge.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    type: 'Workout',
    reward: '500 points + badge',
    goal: 20,
    metric: 'workouts',
    startDate: '2023-08-01T00:00:00Z',
    endDate: '2023-08-31T23:59:59Z',
    participants: 42,
    isJoined: true,
    xpReward: 500,
    xpPerProgress: 25, // 25 XP per workout
    status: 'active',
    leaderboard: [
      {
        userId: '1',
        progress: 12,
        xpEarned: 300
      },
      {
        userId: '2',
        progress: 15,
        xpEarned: 375
      },
      {
        userId: '3',
        progress: 10,
        xpEarned: 250
      },
      {
        userId: '5',
        progress: 14,
        xpEarned: 350
      }
    ]
  },
  {
    id: 'c2',
    title: 'Summer Running Challenge',
    description: 'Run a total of 100km during the summer to earn 750 points and the "Road Runner" badge.',
    image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    type: 'Running',
    reward: '750 points + badge',
    goal: 100,
    metric: 'distance',
    startDate: '2023-07-01T00:00:00Z',
    endDate: '2023-09-30T23:59:59Z',
    participants: 78,
    isJoined: true,
    xpReward: 750,
    xpPerProgress: 7.5, // 7.5 XP per km
    status: 'active',
    leaderboard: [
      {
        userId: '1',
        progress: 68,
        xpEarned: 510
      },
      {
        userId: '4',
        progress: 42,
        xpEarned: 315
      }
    ]
  },
  {
    id: 'c3',
    title: 'Calorie Burner Challenge',
    description: 'Burn 10,000 calories in two weeks to earn 600 points and the "Calorie Crusher" badge.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    type: 'Cardio',
    reward: '600 points + badge',
    goal: 10000,
    metric: 'calories',
    startDate: '2023-08-10T00:00:00Z',
    endDate: '2023-08-24T23:59:59Z',
    participants: 56,
    isJoined: false,
    xpReward: 600,
    xpPerProgress: 0.06, // 0.06 XP per calorie
    status: 'active',
    leaderboard: [
      {
        userId: '2',
        progress: 6500,
        xpEarned: 390
      },
      {
        userId: '3',
        progress: 4800,
        xpEarned: 288
      },
      {
        userId: '4',
        progress: 5200,
        xpEarned: 312
      },
      {
        userId: '5',
        progress: 7100,
        xpEarned: 426
      }
    ]
  },
  {
    id: 'c4',
    title: '10K Steps Daily',
    description: 'Walk at least 10,000 steps every day for 21 days to earn the "Step Master" badge and 400 points.',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    type: 'Walking',
    reward: '400 points + badge',
    goal: 210000,
    metric: 'steps',
    startDate: '2023-09-01T00:00:00Z',
    endDate: '2023-09-21T23:59:59Z',
    participants: 124,
    isJoined: false,
    xpReward: 400,
    xpPerProgress: 0.002, // 0.002 XP per step
    status: 'active',
    leaderboard: [
      {
        userId: '1',
        progress: 145000,
        xpEarned: 290
      },
      {
        userId: '2',
        progress: 168000,
        xpEarned: 336
      },
      {
        userId: '4',
        progress: 132000,
        xpEarned: 264
      }
    ]
  },
  {
    id: 'c5',
    title: 'Yoga Flow Marathon',
    description: 'Complete 15 yoga sessions in a month to improve flexibility and earn the "Zen Master" badge.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1220&q=80',
    type: 'Yoga',
    reward: '350 points + badge',
    goal: 15,
    metric: 'workouts',
    startDate: '2023-09-15T00:00:00Z',
    endDate: '2023-10-15T23:59:59Z',
    participants: 67,
    isJoined: false,
    xpReward: 350,
    xpPerProgress: 23.33, // ~23.33 XP per yoga session
    status: 'active',
    leaderboard: [
      {
        userId: '3',
        progress: 8,
        xpEarned: 187
      },
      {
        userId: '5',
        progress: 10,
        xpEarned: 233
      }
    ]
  },
  {
    id: 'c6',
    title: 'Strength Training Challenge',
    description: 'Complete 12 strength training workouts in 4 weeks to build muscle and earn the "Iron Pumper" badge.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    type: 'Strength',
    reward: '450 points + badge',
    goal: 12,
    metric: 'workouts',
    startDate: '2023-08-15T00:00:00Z',
    endDate: '2023-09-12T23:59:59Z',
    participants: 89,
    isJoined: true,
    xpReward: 450,
    xpPerProgress: 37.5, // 37.5 XP per workout
    status: 'active',
    leaderboard: [
      {
        userId: '1',
        progress: 12,
        xpEarned: 450
      },
      {
        userId: '2',
        progress: 10,
        xpEarned: 375
      },
      {
        userId: '3',
        progress: 12,
        xpEarned: 450
      }
    ]
  },
  {
    id: 'c7',
    title: 'Marathon Prep Challenge',
    description: 'Run a total of 200km in 8 weeks to prepare for your upcoming marathon and earn the "Marathon Ready" badge.',
    image: 'https://images.unsplash.com/photo-1530143584546-02191bc84eb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
    type: 'Running',
    reward: '800 points + badge',
    goal: 200,
    metric: 'distance',
    startDate: '2023-07-15T00:00:00Z',
    endDate: '2023-09-15T23:59:59Z',
    participants: 45,
    isJoined: false,
    xpReward: 800,
    xpPerProgress: 4, // 4 XP per km
    status: 'active',
    leaderboard: [
      {
        userId: '1',
        progress: 180,
        xpEarned: 720
      },
      {
        userId: '4',
        progress: 200,
        xpEarned: 800
      },
      {
        userId: '5',
        progress: 165,
        xpEarned: 660
      }
    ]
  },
  {
    id: 'c8',
    title: 'Hydration Challenge',
    description: 'Drink 3 liters of water daily for 14 days to improve hydration and earn the "Hydration Hero" badge.',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1036&q=80',
    type: 'Wellness',
    reward: '300 points + badge',
    goal: 42,
    metric: 'liters',
    startDate: '2023-09-01T00:00:00Z',
    endDate: '2023-09-14T23:59:59Z',
    participants: 156,
    isJoined: false,
    xpReward: 300,
    xpPerProgress: 7.14, // ~7.14 XP per liter
    status: 'active',
    leaderboard: [
      {
        userId: '2',
        progress: 42,
        xpEarned: 300
      },
      {
        userId: '3',
        progress: 39,
        xpEarned: 279
      },
      {
        userId: '4',
        progress: 42,
        xpEarned: 300
      },
      {
        userId: '5',
        progress: 36,
        xpEarned: 257
      }
    ]
  },
  {
    id: 'c9',
    title: 'HIIT Warrior Challenge',
    description: 'Complete 20 high-intensity interval training sessions in 30 days to boost your metabolism and earn the "HIIT Warrior" badge.',
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80',
    type: 'HIIT',
    reward: '650 points + badge',
    goal: 20,
    metric: 'workouts',
    startDate: '2023-08-01T00:00:00Z',
    endDate: '2023-08-30T23:59:59Z',
    participants: 72,
    isJoined: true,
    xpReward: 650,
    xpPerProgress: 32.5, // 32.5 XP per workout
    status: 'active',
    leaderboard: [
      {
        userId: '1',
        progress: 20,
        xpEarned: 650
      },
      {
        userId: '3',
        progress: 18,
        xpEarned: 585
      },
      {
        userId: '5',
        progress: 20,
        xpEarned: 650
      }
    ]
  },
  {
    id: 'c10',
    title: 'Cycling Adventure',
    description: 'Cycle 300km in 30 days to explore your surroundings and earn the "Road Explorer" badge.',
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    type: 'Cycling',
    reward: '700 points + badge',
    goal: 300,
    metric: 'distance',
    startDate: '2023-09-01T00:00:00Z',
    endDate: '2023-09-30T23:59:59Z',
    participants: 93,
    isJoined: false,
    xpReward: 700,
    xpPerProgress: 2.33, // ~2.33 XP per km
    status: 'active',
    leaderboard: [
      {
        userId: '1',
        progress: 210,
        xpEarned: 490
      },
      {
        userId: '2',
        progress: 180,
        xpEarned: 420
      },
      {
        userId: '4',
        progress: 240,
        xpEarned: 560
      }
    ]
  },
  // Upcoming challenges
  {
    id: 'c11',
    title: 'Winter Fitness Bootcamp',
    description: 'Complete 15 full-body workouts in 30 days to stay fit during winter and earn the "Winter Warrior" badge.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    type: 'Workout',
    reward: '550 points + badge',
    goal: 15,
    metric: 'workouts',
    startDate: getRelativeDate(10), // Starts in 10 days
    endDate: getRelativeDate(40), // Ends in 40 days
    participants: 32,
    isJoined: false,
    isScheduled: false,
    xpReward: 550,
    xpPerProgress: 36.7, // ~36.7 XP per workout
    status: 'upcoming',
    leaderboard: []
  },
  {
    id: 'c12',
    title: 'Mindfulness Meditation',
    description: 'Practice meditation for 10 minutes daily for 21 days to improve mental clarity and earn the "Mindful Master" badge.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    type: 'Wellness',
    reward: '400 points + badge',
    goal: 21,
    metric: 'workouts',
    startDate: getRelativeDate(5), // Starts in 5 days
    endDate: getRelativeDate(26), // Ends in 26 days
    participants: 48,
    isJoined: false,
    isScheduled: false,
    xpReward: 400,
    xpPerProgress: 19, // 19 XP per session
    status: 'upcoming',
    leaderboard: []
  },
  {
    id: 'c13',
    title: 'Flexibility Challenge',
    description: 'Complete 20 stretching sessions in 30 days to improve flexibility and earn the "Flexibility Master" badge.',
    image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    type: 'Flexibility',
    reward: '450 points + badge',
    goal: 20,
    metric: 'workouts',
    startDate: getRelativeDate(15), // Starts in 15 days
    endDate: getRelativeDate(45), // Ends in 45 days
    participants: 27,
    isJoined: false,
    isScheduled: false,
    xpReward: 450,
    xpPerProgress: 22.5, // 22.5 XP per session
    status: 'upcoming',
    leaderboard: []
  },
  {
    id: 'c14',
    title: 'Healthy Eating Challenge',
    description: 'Eat 5 servings of fruits and vegetables daily for 14 days to improve nutrition and earn the "Nutrition Ninja" badge.',
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80',
    type: 'Nutrition',
    reward: '350 points + badge',
    goal: 70,
    metric: 'servings',
    startDate: getRelativeDate(7), // Starts in 7 days
    endDate: getRelativeDate(21), // Ends in 21 days
    participants: 64,
    isJoined: false,
    isScheduled: false,
    xpReward: 350,
    xpPerProgress: 5, // 5 XP per serving
    status: 'upcoming',
    leaderboard: []
  },
  {
    id: 'c15',
    title: 'Stair Climbing Challenge',
    description: 'Climb 1000 flights of stairs in 30 days to improve leg strength and earn the "Stair Master" badge.',
    image: 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    type: 'Cardio',
    reward: '600 points + badge',
    goal: 1000,
    metric: 'flights',
    startDate: getRelativeDate(20), // Starts in 20 days
    endDate: getRelativeDate(50), // Ends in 50 days
    participants: 18,
    isJoined: false,
    isScheduled: false,
    xpReward: 600,
    xpPerProgress: 0.6, // 0.6 XP per flight
    status: 'upcoming',
    leaderboard: []
  }
];