import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';

export interface BadgeProps {
  label: string;
  color?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = colors.primary,
  style,
  textStyle,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: {
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 4,
      fontSize: 10,
    },
    md: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 6,
      fontSize: 12,
    },
    lg: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
      fontSize: 14,
    },
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${color}20`, // 20% opacity
          borderColor: color,
          paddingVertical: sizeStyles[size].paddingVertical,
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
          borderRadius: sizeStyles[size].borderRadius,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color, fontSize: sizeStyles[size].fontSize },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});