import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { User } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { MapPin, Dumbbell, Calendar, ArrowLeft, Heart } from 'lucide-react-native';
import { Avatar } from '@/components/ui/Avatar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const cardWidth = width - 40; // 20px padding on each side

interface UserMatchCardProps {
  user: User;
  onMatch?: (userId: string) => void;
  onViewProfile?: (userId: string) => void;
  onGoBack?: () => void;
  showBackButton?: boolean;
}

export const UserMatchCard: React.FC<UserMatchCardProps> = ({
  user,
  onMatch,
  onViewProfile,
  onGoBack,
  showBackButton = false,
}) => {
  // Calculate match percentage based on common interests
  const calculateMatchPercentage = () => {
    // This is a simplified algorithm - in a real app, you'd have a more sophisticated matching algorithm
    const baseScore = Math.floor(Math.random() * 30) + 70; // Random score between 70-99%
    return baseScore;
  };

  // Get common interests (for display purposes)
  const getCommonInterests = () => {
    // In a real app, you'd compare with the current user's interests
    if (user.preferredExercises && user.preferredExercises.length > 0) {
      return user.preferredExercises.slice(0, 3);
    }
    return [];
  };

  const matchPercentage = calculateMatchPercentage();
  const commonInterests = getCommonInterests();

  return (
    <Card style={styles.card}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onGoBack}
        >
          <ArrowLeft size={24} color={colors.white} />
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={styles.coverContainer}
        onPress={() => onViewProfile ? onViewProfile(user.id) : null}
      >
        <Image 
          source={{ 
            uri: user.coverImage || 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1075&q=80' 
          }} 
          style={styles.coverImage}
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.coverGradient}
        />
        
        <View style={styles.profileImageContainer}>
          <Avatar 
            source={user.profileImage} 
            name={user.name}
            size={90}
            style={styles.profileImage}
          />
        </View>
        
        {matchPercentage > 0 && (
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.matchBadge}
          >
            <Text style={styles.matchPercentage}>{matchPercentage}%</Text>
            <Text style={styles.matchText}>Match</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.nameContainer}
          onPress={() => onViewProfile ? onViewProfile(user.id) : null}
        >
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.username}</Text>
        </TouchableOpacity>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Dumbbell size={18} color={colors.primary} />
            <Text style={styles.detailText}>
              {user.fitnessLevel || 'Beginner'} level
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Calendar size={18} color={colors.primary} />
            <Text style={styles.detailText}>
              {user.preferredTime && user.preferredTime.length > 0 
                ? `Prefers ${user.preferredTime.join(' or ')}`
                : 'Flexible schedule'}
            </Text>
          </View>
          
          {user.location && user.location.address && (
            <View style={styles.detailItem}>
              <MapPin size={18} color={colors.primary} />
              <Text style={styles.detailText}>
                {user.location.address}
              </Text>
            </View>
          )}
        </View>

        {commonInterests.length > 0 && (
          <View style={styles.interestsContainer}>
            <Text style={styles.interestsTitle}>Common interests:</Text>
            <View style={styles.interests}>
              {commonInterests.map((exercise, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{exercise}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Button
            title="Match"
            variant="primary"
            leftIcon={<Heart size={18} color={colors.white} />}
            onPress={() => onMatch ? onMatch(user.id) : null}
            style={styles.matchButton}
          />
          <Button
            title="View Profile"
            variant="outline"
            style={styles.viewProfileButton}
            onPress={() => onViewProfile ? onViewProfile(user.id) : null}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: 24,
    borderRadius: 20,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  coverContainer: {
    position: 'relative',
    height: 180,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -45,
    left: 24,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: colors.white,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileImage: {
    borderRadius: 45,
  },
  matchBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  matchPercentage: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 18,
  },
  matchText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  nameContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  username: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  details: {
    marginBottom: 20,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 15,
    color: colors.text,
  },
  interestsContainer: {
    marginBottom: 24,
  },
  interestsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  interests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestTag: {
    backgroundColor: colors.highlight,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  footer: {
    gap: 12,
  },
  matchButton: {
    borderRadius: 12,
  },
  viewProfileButton: {
    borderRadius: 12,
  },
});