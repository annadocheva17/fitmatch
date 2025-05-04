import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { 
  LogOut, 
  Bell, 
  Lock, 
  HelpCircle, 
  Info, 
  Moon, 
  Smartphone, 
  Globe, 
  ArrowLeft 
} from 'lucide-react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [darkMode, setDarkMode] = React.useState(false);
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            router.replace('/(auth)');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    // In a real app, you would update the theme here
  };
  
  const handlePushNotificationsToggle = () => {
    setPushNotifications(!pushNotifications);
    // In a real app, you would update the notification settings
  };
  
  const handleEmailNotificationsToggle = () => {
    setEmailNotifications(!emailNotifications);
    // In a real app, you would update the notification settings
  };
  
  const navigateToPrivacy = () => {
    // Navigate to privacy policy
    Alert.alert('Privacy Policy', 'This would navigate to the privacy policy in a real app.');
  };
  
  const navigateToTerms = () => {
    // Navigate to terms of service
    Alert.alert('Terms of Service', 'This would navigate to the terms of service in a real app.');
  };
  
  const navigateToHelp = () => {
    // Navigate to help center
    Alert.alert('Help Center', 'This would navigate to the help center in a real app.');
  };
  
  const navigateToAbout = () => {
    // Navigate to about
    Alert.alert('About', 'This would navigate to the about page in a real app.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Settings',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Moon size={20} color={colors.text} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Smartphone size={20} color={colors.text} />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={handlePushNotificationsToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={colors.text} />
              <Text style={styles.settingText}>Email Notifications</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={handleEmailNotificationsToggle}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <TouchableOpacity style={styles.settingItem} onPress={navigateToPrivacy}>
            <View style={styles.settingInfo}>
              <Lock size={20} color={colors.text} />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={navigateToTerms}>
            <View style={styles.settingInfo}>
              <Globe size={20} color={colors.text} />
              <Text style={styles.settingText}>Terms of Service</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.settingItem} onPress={navigateToHelp}>
            <View style={styles.settingInfo}>
              <HelpCircle size={20} color={colors.text} />
              <Text style={styles.settingText}>Help Center</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={navigateToAbout}>
            <View style={styles.settingInfo}>
              <Info size={20} color={colors.text} />
              <Text style={styles.settingText}>About</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
});