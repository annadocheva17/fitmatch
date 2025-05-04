import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

export interface ProgressBarProps {
  progress: number; // 0 to 1
  style?: ViewStyle;
  barColor?: string;
  backgroundColor?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  style,
  barColor = colors.primary,
  backgroundColor = colors.border,
  height = 8,
}) => {
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  
  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor, height },
        style
      ]}
    >
      <View 
        style={[
          styles.progressBar, 
          { 
            width: `${clampedProgress * 100}%`,
            backgroundColor: barColor,
            height
          }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    borderRadius: 4,
  },
});