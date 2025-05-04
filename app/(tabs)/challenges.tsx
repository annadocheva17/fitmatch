import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useChallengeStore } from '@/store/challenge-store';
import { useAuthStore } from '@/store/auth-store';
import { ChallengeCard } from '@/components/challenge/ChallengeCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';

export default function ChallengesScreen() {
  const { challenges, fetchChallenges, fetchUserChallenges, joinChallenge, leaveChallenge, error } = useChallengeStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();

  useEffect(() => {
    if (activeTab === 'all') {
      fetchChallenges();
    } else if (activeTab === 'joined' && user) {
      fetchUserChallenges(user.id);
    }
  }, [activeTab, user, fetchChallenges, fetchUserChallenges]);

  // Show error alert if there's an error
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'all') {
      await fetchChallenges();
    } else if (activeTab === 'joined' && user) {
      await fetchUserChallenges(user.id);
    }
    setRefreshing(false);
  };

  const handleJoinChallenge = (challengeId: string) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to join a challenge');
      return;
    }
    
    try {
      joinChallenge(challengeId, user.id);
    } catch (err) {
      console.error('Error joining challenge:', err);
      Alert.alert('Error', 'Failed to join challenge. Please try again.');
    }
  };

  const handleLeaveChallenge = (challengeId: string) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to leave a challenge');
      return;
    }
    
    try {
      leaveChallenge(challengeId, user.id);
    } catch (err) {
      console.error('Error leaving challenge:', err);
      Alert.alert('Error', 'Failed to leave challenge. Please try again.');
    }
  };

  const handleViewChallenge = (challengeId: string) => {
    router.push(`/challenge/${challengeId}`);
  };

  const isJoined = (challenge: any) => {
    if (!user) return false;
    if (typeof challenge.participants === 'number') return false;
    if (!Array.isArray(challenge.participants)) return false;
    
    return challenge.participants.some((p: any) => {
      if (typeof p === 'string') return p === user.id;
      if (p && typeof p === 'object') {
        if ('userId' in p) return p.userId === user.id;
        if ('id' in p) return p.id === user.id;
      }
      return false;
    });
  };

  const joinedChallenges = challenges.filter(challenge => {
    if (!user) return false;
    return isJoined(challenge);
  });

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'Challenges',
          headerRight: () => (
            <Button
              title="Create"
              variant="primary"
              onPress={() => router.push('/challenge/create')}
              style={styles.createButton}
            />
          ),
        }}
      />
      
      <Tabs
        tabs={[
          { key: 'all', title: 'All Challenges' },
          { key: 'joined', title: `My Challenges (${joinedChallenges.length})` },
        ]}
        selectedTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <FlatList
        data={activeTab === 'all' ? challenges : joinedChallenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChallengeCard
            challenge={item}
            onPress={handleViewChallenge}
            onJoin={handleJoinChallenge}
            onLeave={handleLeaveChallenge}
            isJoined={isJoined(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'all' 
                ? 'No challenges available. Create one to get started!'
                : 'You haven\'t joined any challenges yet.'}
            </Text>
            {activeTab === 'joined' && (
              <Button
                title="Browse Challenges"
                variant="primary"
                onPress={() => setActiveTab('all')}
                style={styles.browseButton}
              />
            )}
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 300,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  createButton: {
    marginRight: 10,
  },
  browseButton: {
    minWidth: 200,
  },
});