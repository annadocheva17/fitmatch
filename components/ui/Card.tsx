import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled';
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  variant = 'elevated',
  onPress
}) => {
  const getCardStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return styles.elevated;
      case 'outlined':
        return styles.outlined;
      case 'filled':
        return styles.filled;
      default:
        return styles.elevated;
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity 
        style={[styles.card, getCardStyle(), style]} 
        onPress={onPress}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.card, getCardStyle(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 0, // Ensure cards don't have horizontal margins
  },
  elevated: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  outlined: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filled: {
    backgroundColor: colors.card,
  },
});