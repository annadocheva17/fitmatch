import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleSignup = () => {
    router.push('/(auth)/signup');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' }}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>FitConnect</Text>
              <Text style={styles.subtitle}>Find your perfect workout partner</Text>
            </View>
            
            <View style={styles.features}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>🏋️</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Track Workouts</Text>
                  <Text style={styles.featureDescription}>
                    Log your exercises, sets, and reps to monitor your progress
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>👥</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Find Partners</Text>
                  <Text style={styles.featureDescription}>
                    Connect with like-minded fitness enthusiasts near you
                  </Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>🏆</Text>
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>Join Challenges</Text>
                  <Text style={styles.featureDescription}>
                    Participate in community challenges to stay motivated
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.actions}>
              <Button
                title="Create Account"
                variant="primary"
                size="lg"
                onPress={handleSignup}
                style={styles.signupButton}
              />
              
              <Button
                title="Log In"
                variant="outline"
                size="lg"
                onPress={handleLogin}
                style={styles.loginButton}
              />
              
              <TouchableOpacity 
                style={styles.skipContainer}
                onPress={() => router.replace('/(tabs)')}
              >
                <Text style={styles.skipText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  features: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    alignItems: 'center',
  },
  signupButton: {
    width: '100%',
    marginBottom: 12,
  },
  loginButton: {
    width: '100%',
    marginBottom: 16,
  },
  skipContainer: {
    padding: 8,
  },
  skipText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});