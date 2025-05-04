import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { Camera, AtSign, User, Info, MapPin, ArrowLeft, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile, isLoading } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  }>(user?.location || { latitude: 0, longitude: 0, address: '' });
  
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };
  
  const handleGetLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
    
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Get address from coordinates
      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      setLocation({
        latitude,
        longitude,
        address: address ? `${address.city}, ${address.region}` : '',
      });
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Could not get your location. Please try again.');
    }
  };
  
  const handleSave = async () => {
    try {
      await updateProfile({
        name,
        username,
        bio,
        profileImage,
        location,
      });
      
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Edit Profile',
          headerLeft: () => (
            <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity style={styles.imageContainer} onPress={handlePickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Camera size={40} color={colors.textSecondary} />
              </View>
            )}
            <View style={styles.imageEditButton}>
              <Camera size={16} color={colors.white} />
            </View>
          </TouchableOpacity>
          
          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              leftIcon={<User size={20} color={colors.textSecondary} />}
            />
            
            <Input
              label="Username"
              placeholder="Choose a username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              leftIcon={<AtSign size={20} color={colors.textSecondary} />}
            />
            
            <Input
              label="Bio"
              placeholder="Tell us about yourself and your fitness journey..."
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              style={styles.bioInput}
              leftIcon={<Info size={20} color={colors.textSecondary} />}
            />
            
            <View style={styles.locationContainer}>
              <Text style={styles.locationLabel}>Location</Text>
              <TouchableOpacity 
                style={styles.locationButton}
                onPress={handleGetLocation}
              >
                <MapPin size={20} color={colors.primary} />
                <Text style={styles.locationText}>
                  {location.address || 'Set your location'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title="Save Changes"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            onPress={handleSave}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  imageContainer: {
    alignSelf: 'center',
    marginVertical: 24,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  form: {
    marginBottom: 24,
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: colors.text,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  cancelButton: {
    padding: 8,
  },
});