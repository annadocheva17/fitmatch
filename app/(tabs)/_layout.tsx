import { Tabs } from 'expo-router';
import { useColorScheme, View, StyleSheet } from 'react-native';
import { Dumbbell, Users, Award, User, BarChart3 } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useEffect } from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // Add a small delay to ensure tabs are properly initialized
  useEffect(() => {
    const init = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    };
    
    init();
  }, []);

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Feed',
            tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="match"
          options={{
            title: 'Match',
            tabBarIcon: ({ color }) => <Users size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="challenges"
          options={{
            title: 'Challenges',
            tabBarIcon: ({ color }) => <Award size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: 'Progress',
            tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});