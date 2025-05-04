import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface AvatarProps {
  source?: { uri?: string } | null;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  style?: any;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 40,
  name,
  style,
}) => {
  // Convert size string to number
  const getSize = (): number => {
    if (typeof size === 'number') return size;
    
    switch (size) {
      case 'sm': return 32;
      case 'md': return 40;
      case 'lg': return 56;
      case 'xl': return 80;
      default: return 40;
    }
  };
  
  const avatarSize = getSize();
  
  // Get initials from name
  const getInitials = () => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  // Check if we have a valid image source
  const hasValidSource = source && source.uri && source.uri.length > 0;

  // Generate a consistent color based on the name
  const getColorFromName = () => {
    if (!name) return [colors.primary, colors.secondary];
    
    const charCode = name.charCodeAt(0);
    const colorPairs = [
      ['#4F46E5', '#7C3AED'], // Indigo to Purple
      ['#0EA5E9', '#0284C7'], // Sky to Cyan
      ['#10B981', '#059669'], // Emerald to Green
      ['#F59E0B', '#D97706'], // Amber to Yellow
      ['#EF4444', '#DC2626'], // Red
      ['#8B5CF6', '#6D28D9'], // Violet to Purple
      ['#EC4899', '#DB2777'], // Pink to Rose
    ];
    
    return colorPairs[charCode % colorPairs.length];
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
        },
        style,
      ]}
    >
      {hasValidSource ? (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
        />
      ) : (
        <LinearGradient
          colors={getColorFromName()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradientContainer,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
        >
          <Text
            style={[
              styles.initials,
              {
                fontSize: avatarSize * 0.4,
              },
            ]}
          >
            {getInitials()}
          </Text>
        </LinearGradient>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  gradientContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: colors.white,
    fontWeight: '600',
  },
});