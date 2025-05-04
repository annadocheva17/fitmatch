import { Post } from '@/types';
import { users } from './users';
import { workouts } from './workouts';

export const posts: Post[] = [
  {
    id: '1',
    userId: '1',
    user: {
      name: users[0].name,
      username: users[0].username,
      avatar: users[0].profileImage || '',
    },
    content: "Just finished an amazing 5K run! Feeling great and ready to tackle the day. Who else is getting their cardio in this morning?",
    images: ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'],
    likes: [],
    comments: 5,
    isLiked: false,
    createdAt: '2023-08-15T08:30:00Z',
  },
  {
    id: '2',
    userId: '2',
    user: {
      name: users[1].name,
      username: users[1].username,
      avatar: users[1].profileImage || '',
    },
    content: "New personal record on deadlifts today! 💪 Consistency is key, folks. What's your favorite strength exercise?",
    workout: workouts[0].id,
    likes: [],
    comments: 8,
    isLiked: true,
    createdAt: '2023-08-14T16:45:00Z',
  },
  {
    id: '3',
    userId: '3',
    user: {
      name: users[2].name,
      username: users[2].username,
      avatar: users[2].profileImage || '',
    },
    content: "Morning yoga session to start the day right. Finding balance in both body and mind is so important for overall wellness.",
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1220&q=80'],
    likes: [],
    comments: 3,
    isLiked: false,
    createdAt: '2023-08-14T07:15:00Z',
  },
  {
    id: '4',
    userId: '1',
    user: {
      name: users[0].name,
      username: users[0].username,
      avatar: users[0].profileImage || '',
    },
    content: "Trying out this new HIIT workout routine. It's intense but so worth it! Anyone else a fan of high-intensity interval training?",
    workout: workouts[1].id,
    likes: [],
    comments: 7,
    isLiked: true,
    createdAt: '2023-08-13T18:20:00Z',
  },
  {
    id: '5',
    userId: '4',
    user: {
      name: users[3].name,
      username: users[3].username,
      avatar: users[3].profileImage || '',
    },
    content: "Dance workout today! It's amazing how you can burn calories while having so much fun. Music makes all the difference!",
    images: ['https://images.unsplash.com/photo-1535743686920-55e4145369b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80'],
    likes: [],
    comments: 4,
    isLiked: false,
    createdAt: '2023-08-12T14:10:00Z',
  },
  {
    id: '6',
    userId: '5',
    user: {
      name: users[4].name,
      username: users[4].username,
      avatar: users[4].profileImage || '',
    },
    content: "Nutrition is just as important as exercise. Here's my post-workout protein shake recipe: banana, spinach, protein powder, almond milk, and a spoonful of peanut butter. Delicious!",
    likes: [],
    comments: 6,
    isLiked: false,
    createdAt: '2023-08-11T11:05:00Z',
  },
  {
    id: '7',
    userId: '1',
    user: {
      name: users[0].name,
      username: users[0].username,
      avatar: users[0].profileImage || '',
    },
    content: "Rest days are crucial for recovery. Today I'm focusing on stretching and mobility work. How do you spend your rest days?",
    likes: [],
    comments: 3,
    isLiked: false,
    createdAt: '2023-08-10T09:30:00Z',
  }
];