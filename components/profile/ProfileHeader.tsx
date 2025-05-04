import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { User } from '@/types';
import { colors } from '@/constants/colors';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Users, Calendar, Award, Star } from 'lucide-react-native';

interface ProfileHeaderProps {
  user: User;
  isCurrentUser: boolean;
  onEditProfile?: () => void;
  onFollow?: () => void;
  onMessage?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isCurrentUser,
  onEditProfile,
  onFollow,
  onMessage,
}) => {
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  };

  return (
    <View style={styles.container}>
      {user.coverImage && (
        <Image
          source={{ uri: user.coverImage }}
          style={styles.coverImage}
        />
      )}
      
      <View style={styles.profileContent}>
        <View style={styles.avatarContainer}>
          <Avatar
            source={{ uri: user.profileImage || user.avatar }}
            name={user.name}
            size={80}
          />
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userUsername}>@{user.username}</Text>
          
          {user.bio && (
            <Text style={styles.userBio}>{user.bio}</Text>
          )}
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.workouts}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.points}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
          </View>
          
          <View style={styles.metaInfo}>
            {user.fitnessLevel && (
              <View style={styles.metaItem}>
                <Award size={16} color={colors.primary} />
                <Text style={styles.metaText}>{user.fitnessLevel}</Text>
              </View>
            )}
            
            {user.team && (
              <View style={styles.metaItem}>
                <Users size={16} color={colors.primary} />
                <Text style={styles.metaText}>{user.team}</Text>
              </View>
            )}
            
            <View style={styles.metaItem}>
              <Calendar size={16} color={colors.primary} />
              <Text style={styles.metaText}>{formatJoinDate(user.joinedAt)}</Text>
            </View>
          </View>
          
          <View style={styles.actionContainer}>
            {isCurrentUser ? (
              <Button
                title="Edit Profile"
                variant="outline"
                onPress={onEditProfile}
                style={styles.actionButton}
              />
            ) : (
              <Button
                title="Follow"
                variant="primary"
                onPress={onFollow}
                style={styles.actionButton}
              />
            )}
          </View>
        </View>
        
        {user.achievements && user.achievements.length > 0 && (
          <View style={styles.achievementsContainer}>
            <Text style={styles.achievementsTitle}>Achievements</Text>
            <View style={styles.achievementsList}>
              {user.achievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievementItem}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        <View style={styles.xpContainer}>
          <View style={styles.xpHeader}>
            <Star size={20} color="#FFD700" fill="#FFD700" />
            <Text style={styles.xpTitle}>XP Level</Text>
          </View>
          
          <View style={styles.xpLevelContainer}>
            <View style={styles.xpLevel}>
              <Text style={styles.xpLevelText}>
                Level {Math.floor(user.points / 1000) + 1}
              </Text>
              <Text style={styles.xpPoints}>{user.points} XP</Text>
            </View>
            
            <View style={styles.xpProgressContainer}>
              <View 
                style={[
                  styles.xpProgressBar, 
                  { width: `${(user.points % 1000) / 10}%` }
                ]} 
              />
            </View>
            
            <Text style={styles.xpProgressText}>
              {1000 - (user.points % 1000)} XP to next level
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  profileContent: {
    padding: 16,
  },
  avatarContainer: {
    marginTop: -50,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userInfo: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  userBio: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  metaInfo: {
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  actionContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
  },
  achievementsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  achievementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  achievementIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  achievementTitle: {
    fontSize: 14,
    color: colors.text,
  },
  xpContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  xpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  xpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  xpLevelContainer: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 16,
  },
  xpLevel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  xpLevelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  xpPoints: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  xpProgressContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  xpProgressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  xpProgressText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});