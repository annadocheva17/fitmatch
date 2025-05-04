import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';

export default function AuthOptionsScreen() {
  const router = useRouter();
  
  const handleDemoLogin = () => {
    router.push('/login?demo=true');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80' }} 
              style={styles.logoImage}
            />
            <Text style={styles.logoText}>FitMatch</Text>
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Join the Community</Text>
            <Text style={styles.subtitle}>
              Create an account or log in to connect with fitness enthusiasts around you
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Link href="/signup" asChild>
            <TouchableOpacity>
              <Button
                title="Create Account"
                variant="primary"
                size="lg"
                style={styles.button}
              />
            </TouchableOpacity>
          </Link>
          
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Button
                title="Log In"
                variant="outline"
                size="lg"
                style={styles.button}
              />
            </TouchableOpacity>
          </Link>
          
          <View style={styles.demoContainer}>
            <Text style={styles.demoText}>Want to try it out first?</Text>
            <TouchableOpacity onPress={handleDemoLogin}>
              <Text style={styles.demoLink}>Use demo account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    backgroundColor: colors.white,
    marginTop: 'auto',
  },
  button: {
    marginBottom: 12,
  },
  demoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  demoText: {
    color: colors.textSecondary,
    marginRight: 4,
  },
  demoLink: {
    color: colors.primary,
    fontWeight: '600',
  },
});