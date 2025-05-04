import { Stack } from "expo-router";
import { colors } from "@/constants/colors";
import { View, StyleSheet } from "react-native";

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerShadowVisible: false,
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: colors.white,
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: "Welcome to FitMatch",
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="auth-options" 
          options={{ 
            title: "Join FitMatch",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            title: "Log In",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="signup" 
          options={{ 
            title: "Sign Up",
            headerBackTitle: "Back",
          }} 
        />
        <Stack.Screen 
          name="onboarding" 
          options={{ 
            title: "Set Up Your Profile",
            headerBackTitle: "Back",
          }} 
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});