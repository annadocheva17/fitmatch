import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { ProgressMetric } from '@/types';
import { colors } from '@/constants/colors';

interface ActivityChartProps {
  data: ProgressMetric[];
  title: string;
  color?: string;
  height?: number;
  onBarPress?: (item: ProgressMetric) => void;
}

export const ActivityChart: React.FC<ActivityChartProps> = ({
  data = [],
  title,
  color = colors.primary,
  height = 150,
  onBarPress,
}) => {
  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      </View>
    );
  }

  // Sort data by date
  const sortedData = [...data].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Find max value for scaling
  const maxValue = Math.max(...sortedData.map(item => item.value));
  
  // Calculate bar width based on number of items
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32; // Accounting for padding
  const barWidth = Math.max(8, Math.min(30, chartWidth / sortedData.length - 4));

  // Format value for display
  const formatValue = (value: number) => {
    // If value is large, abbreviate it
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    
    // If value is a decimal, limit to 1 decimal place
    if (value % 1 !== 0) {
      return value.toFixed(1);
    }
    
    return value.toString();
  };

  return (
    <View style={[styles.container, { height: height + 50 }]}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={[styles.chartContainer, { height }]}>
        {sortedData.map((item, index) => {
          const barHeight = (item.value / maxValue) * height * 0.8;
          
          return (
            <TouchableOpacity 
              key={index} 
              style={styles.barContainer}
              onPress={() => onBarPress && onBarPress(item)}
              disabled={!onBarPress}
            >
              <View style={styles.barLabelContainer}>
                <Text style={styles.barValue}>{formatValue(item.value)}</Text>
              </View>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: Math.max(barHeight, 4), 
                    backgroundColor: color,
                    width: barWidth,
                  }
                ]} 
              />
              <Text style={styles.dateLabel}>
                {item.date ? new Date(item.date).toLocaleDateString(undefined, { day: 'numeric' }) : '-'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  barLabelContainer: {
    marginBottom: 4,
  },
  barValue: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  bar: {
    borderRadius: 4,
  },
  dateLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});