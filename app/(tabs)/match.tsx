import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth-store';
import { useMatchStore } from '@/store/match-store';
import { MatchCard } from '@/components/match/MatchCard';
import { UserMatchCard } from '@/components/match/UserMatchCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { MessageBadge } from '@/components/match/MessageBadge';
import { users } from '@/mocks/users';
import { matches } from '@/mocks/matches';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircle, UserCircle, Users, Search } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { ChatModal } from '@/components/match/ChatModal';

const { width } = Dimensions.get('window');

export default function MatchScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    matches: userMatches, 
    potentialMatches,
    fetchMatches, 
    fetchPotentialMatches,
    acceptMatch,
    declineMatch,
    createMatch,
    isLoading,
    error
  } = useMatchStore();
  
  const [activeTab, setActiveTab] = useState('potential');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  useEffect(() => {
    if (!user) {
      console.log('No user authenticated, using mock data');
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);
  
  const loadData = async () => {
    if (!user) return;
    
    try {
      await fetchMatches(user.id);
      await fetchPotentialMatches(user.id);
    } catch (error) {
      console.error('Error loading match data:', error);
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };
  
  const handleAcceptMatch = async (matchId) => {
    await acceptMatch(matchId);
  };
  
  const handleDeclineMatch = async (matchId) => {
    await declineMatch(matchId);
  };
  
  const handleCreateMatch = async (matchedUserId) => {
    if (!user) return;
    await createMatch(user.id, matchedUserId);
  };
  
  const handleOpenChat = (userId) => {
    const otherUser = users.find(u => u.id === userId);
    if (otherUser) {
      setSelectedUser(otherUser);
      setChatModalVisible(true);
    } else {
      console.error('User not found:', userId);
    }
  };
  
  const renderPotentialMatches = () => {
    // If we have potential matches from the store, use them
    if (potentialMatches && potentialMatches.length > 0) {
      return (
        <FlatList
          data={potentialMatches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UserMatchCard
              user={item}
              onViewProfile={() => router.push(`/profile/${item.id}`)}
              onMatch={() => handleCreateMatch(item.id)}
            />
          )}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      );
    }
    
    // Fallback to mock data if no potential matches
    return (
      <FlatList
        data={users.filter(u => u.id !== user?.id).slice(0, 5)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserMatchCard
            user={item}
            onViewProfile={() => router.push(`/profile/${item.id}`)}
            onMatch={() => handleCreateMatch(item.id)}
          />
        )}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };
  
  const renderPendingMatches = () => {
    // Filter pending matches
    const pendingMatches = userMatches?.filter(match => match.status === 'pending') || [];
    
    if (pendingMatches.length > 0) {
      return (
        <FlatList
          data={pendingMatches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MatchCard
              match={item}
              currentUserId={user?.id || ''}
              onAccept={() => handleAcceptMatch(item.id)}
              onDecline={() => handleDeclineMatch(item.id)}
              onProfilePress={() => router.push(`/profile/${item.userId === user?.id ? item.matchedUserId : item.userId}`)}
            />
          )}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      );
    }
    
    // Fallback to mock data if no pending matches
    if (pendingMatches.length === 0) {
      // Use mock matches that are pending
      const mockPendingMatches = matches.filter(match => 
        match.status === 'pending' && 
        (match.userId === user?.id || match.matchedUserId === user?.id)
      );
      
      if (mockPendingMatches.length > 0) {
        return (
          <FlatList
            data={mockPendingMatches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              // Find the other user in the match
              const otherUserId = item.userId === user?.id ? item.matchedUserId : item.userId;
              const otherUser = users.find(u => u.id === otherUserId);
              
              return (
                <MatchCard
                  match={{
                    ...item,
                    matchedUser: otherUser,
                  }}
                  currentUserId={user?.id || ''}
                  onAccept={() => handleAcceptMatch(item.id)}
                  onDecline={() => handleDeclineMatch(item.id)}
                  onProfilePress={() => router.push(`/profile/${otherUserId}`)}
                />
              );
            }}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        );
      }
      
      // If no mock pending matches either, show empty state
      return (
        <View style={styles.emptyContainer}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.emptyIconContainer}
          >
            <Users size={32} color={colors.white} />
          </LinearGradient>
          <Text style={styles.emptyText}>No pending matches</Text>
          <Text style={styles.emptySubtext}>Check back later or explore potential matches</Text>
        </View>
      );
    }
  };
  
  const renderAcceptedMatches = () => {
    // Filter accepted matches
    const acceptedMatches = userMatches?.filter(match => match.status === 'accepted') || [];
    
    if (acceptedMatches.length > 0) {
      return (
        <FlatList
          data={acceptedMatches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const otherUserId = item.userId === user?.id ? item.matchedUserId : item.userId;
            
            return (
              <Card style={styles.acceptedMatchCard} onPress={() => handleOpenChat(otherUserId)}>
                <View style={styles.acceptedMatchContent}>
                  <Image 
                    source={{ 
                      uri: item.matchedUser?.profileImage || 
                          item.matchedUser?.avatar || 
                          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80' 
                    }} 
                    style={styles.acceptedMatchImage} 
                  />
                  <View style={styles.acceptedMatchInfo}>
                    <Text style={styles.acceptedMatchName}>
                      {item.matchedUser?.name || 'Workout Partner'}
                    </Text>
                    
                    {item.matchPercentage && (
                      <View style={styles.matchPercentageContainer}>
                        <Text style={styles.matchPercentageText}>{item.matchPercentage}% Match</Text>
                      </View>
                    )}
                    
                    {item.commonInterests && item.commonInterests.length > 0 && (
                      <View style={styles.interestsContainer}>
                        {item.commonInterests.slice(0, 2).map((interest, index) => (
                          <Badge key={index} text={interest} style={styles.interestBadge} />
                        ))}
                        {item.commonInterests.length > 2 && (
                          <Text style={styles.moreInterests}>+{item.commonInterests.length - 2} more</Text>
                        )}
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.messageIconContainer}>
                    <MessageCircle size={24} color={colors.primary} />
                    <MessageBadge userId={user?.id || ''} otherUserId={otherUserId} />
                  </View>
                </View>
              </Card>
            );
          }}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      );
    }
    
    // Fallback to mock data if no accepted matches
    if (acceptedMatches.length === 0) {
      // Use mock matches that are accepted
      const mockAcceptedMatches = matches.filter(match => 
        match.status === 'accepted' && 
        (match.userId === user?.id || match.matchedUserId === user?.id)
      );
      
      if (mockAcceptedMatches.length > 0) {
        return (
          <FlatList
            data={mockAcceptedMatches}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              // Find the other user in the match
              const otherUserId = item.userId === user?.id ? item.matchedUserId : item.userId;
              const otherUser = users.find(u => u.id === otherUserId);
              
              return (
                <Card style={styles.acceptedMatchCard} onPress={() => handleOpenChat(otherUserId)}>
                  <View style={styles.acceptedMatchContent}>
                    <Image 
                      source={{ 
                        uri: otherUser?.profileImage || 
                            otherUser?.avatar || 
                            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80' 
                      }} 
                      style={styles.acceptedMatchImage} 
                    />
                    <View style={styles.acceptedMatchInfo}>
                      <Text style={styles.acceptedMatchName}>
                        {otherUser?.name || 'Workout Partner'}
                      </Text>
                      
                      <View style={styles.matchPercentageContainer}>
                        <Text style={styles.matchPercentageText}>
                          {Math.floor(Math.random() * 30) + 70}% Match
                        </Text>
                      </View>
                      
                      {otherUser?.preferredExercises && otherUser.preferredExercises.length > 0 && (
                        <View style={styles.interestsContainer}>
                          {otherUser.preferredExercises.slice(0, 2).map((interest, index) => (
                            <Badge key={index} text={interest} style={styles.interestBadge} />
                          ))}
                          {otherUser.preferredExercises.length > 2 && (
                            <Text style={styles.moreInterests}>+{otherUser.preferredExercises.length - 2} more</Text>
                          )}
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.messageIconContainer}>
                      <MessageCircle size={24} color={colors.primary} />
                      <MessageBadge userId={user?.id || ''} otherUserId={otherUserId} />
                    </View>
                  </View>
                </Card>
              );
            }}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        );
      }
      
      // If no mock accepted matches either, show empty state
      return (
        <View style={styles.emptyContainer}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.emptyIconContainer}
          >
            <UserCircle size={32} color={colors.white} />
          </LinearGradient>
          <Text style={styles.emptyText}>No matches yet</Text>
          <Text style={styles.emptySubtext}>Accept some pending matches to start connecting</Text>
        </View>
      );
    }
  };
  
  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading matches...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Workout Partners</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={22} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <Tabs
        tabs={[
          { key: 'potential', title: 'Discover' },
          { key: 'pending', title: 'Pending' },
          { key: 'accepted', title: 'Matches' },
        ]}
        selectedTab={activeTab}
        onTabChange={setActiveTab}
        style={styles.tabs}
      />
      
      {isLoading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={styles.content}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          {activeTab === 'potential' && renderPotentialMatches()}
          {activeTab === 'pending' && renderPendingMatches()}
          {activeTab === 'accepted' && renderAcceptedMatches()}
        </View>
      )}
      
      {selectedUser && (
        <ChatModal
          visible={chatModalVisible}
          user={selectedUser}
          onClose={() => {
            setChatModalVisible(false);
            setSelectedUser(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: -0.5,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabs: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: colors.errorLight,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: width * 0.7,
  },
  acceptedMatchCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
  },
  acceptedMatchContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptedMatchImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  acceptedMatchInfo: {
    flex: 1,
    marginLeft: 16,
  },
  acceptedMatchName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  matchPercentageContainer: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  matchPercentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  interestsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  interestBadge: {
    marginRight: 8,
    marginBottom: 4,
  },
  moreInterests: {
    fontSize: 12,
    color: colors.textSecondary,
    alignSelf: 'center',
  },
  messageIconContainer: {
    position: 'relative',
    marginLeft: 8,
  },
});