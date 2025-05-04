import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, Animated } from 'react-native';
import { colors } from '@/constants/colors';

export interface TabsProps {
  tabs: Array<{ key: string; title: string }>;
  selectedTab: string;
  onTabChange: (tabKey: string) => void;
  style?: ViewStyle;
  initialTab?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  selectedTab,
  onTabChange,
  style,
  initialTab,
}) => {
  // Handle tab change
  const handleTabChange = (tabKey: string) => {
    if (onTabChange) {
      onTabChange(tabKey);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tab,
            selectedTab === tab.key && styles.selectedTab,
          ]}
          onPress={() => handleTabChange(tab.key)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === tab.key && styles.selectedTabText,
            ]}
          >
            {tab.title}
          </Text>
          
          {selectedTab === tab.key && (
            <View style={styles.indicator} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  selectedTab: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  selectedTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 1.5,
  },
});