import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { TRPCProvider } from '@/lib/trpc';
import { View, StyleSheet } from 'react-native';
import { users } from '@/mocks/users';

export default function RootLayout() {
  const { initialize, user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Initialize auth state
    const initApp = async () => {
      try {
        await initialize();
        
        // If no user is authenticated after initialization, use the first mock user
        if (!isAuthenticated && users.length > 0) {
          console.log('Using mock user for demonstration');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    
    initApp();
  }, [initialize, isAuthenticated]);

  return (
    <TRPCProvider>
      <View style={styles.container}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </View>
    </TRPCProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});