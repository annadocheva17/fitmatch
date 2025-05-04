import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import { colors } from '@/constants/colors';
import { X, Send, ChevronLeft } from 'lucide-react-native';
import { User } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { useMessageStore } from '@/store/message-store';
import { useAuthStore } from '@/store/auth-store';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface ChatModalProps {
  visible: boolean;
  user: User;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ visible, user, onClose }) => {
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { user: currentUser } = useAuthStore();
  const { 
    messages, 
    sendMessage, 
    fetchMessages, 
    getOrCreateConversation,
    setActiveConversation,
    activeConversation,
    isLoading,
    markAsRead
  } = useMessageStore();
  
  const slideAnim = useRef(new Animated.Value(width)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);
  
  useEffect(() => {
    if (visible && user && currentUser) {
      const initializeChat = async () => {
        try {
          const conversationId = await getOrCreateConversation(currentUser.id, user.id);
          setActiveConversation(conversationId);
          await fetchMessages(conversationId);
          
          // Mark messages as read when opening the chat
          await markAsRead(conversationId, currentUser.id);
        } catch (error) {
          console.error('Error initializing chat:', error);
        }
      };
      
      initializeChat();
    } else {
      setActiveConversation(null);
    }
    
    return () => {
      // Clean up when modal closes
      if (!visible) {
        setActiveConversation(null);
      }
    };
  }, [visible, user, currentUser, getOrCreateConversation, setActiveConversation, fetchMessages, markAsRead]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (activeConversation && messages[activeConversation]?.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [activeConversation, messages]);

  const handleSend = async () => {
    if (!message.trim() || !currentUser || !user) return;
    
    try {
      await sendMessage(currentUser.id, user.id, message.trim());
      setMessage('');
      
      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const currentMessages = activeConversation ? messages[activeConversation] || [] : [];

  // Get profile image from either profileImage or avatar property
  const profileImageSource = user.profileImage || user.avatar;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View 
          style={[
            styles.modalContent,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <LinearGradient
            colors={[colors.primary, '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <ChevronLeft size={24} color={colors.white} />
              </TouchableOpacity>
              
              <View style={styles.userInfo}>
                <Avatar 
                  source={profileImageSource} 
                  name={user?.name}
                  size={40} 
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.userName}>{user?.name}</Text>
                  <Text style={styles.userStatus}>Online</Text>
                </View>
              </View>
              
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {isLoading && currentMessages.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading messages...</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={currentMessages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <LinearGradient
                    colors={[colors.primary, colors.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.emptyIconContainer}
                  >
                    <Send size={24} color={colors.white} />
                  </LinearGradient>
                  <Text style={styles.emptyText}>No messages yet</Text>
                  <Text style={styles.emptySubtext}>Say hello to start the conversation!</Text>
                </View>
              }
              renderItem={({ item }) => {
                const isCurrentUser = currentUser && item.senderId === currentUser.id;
                return (
                  <View style={[
                    styles.messageBubble,
                    isCurrentUser ? styles.userMessage : styles.otherMessage
                  ]}>
                    <Text style={[
                      styles.messageText,
                      isCurrentUser ? styles.userMessageText : styles.otherMessageText
                    ]}>
                      {item.text}
                    </Text>
                    <Text style={[
                      styles.timestamp,
                      isCurrentUser ? styles.userTimestamp : styles.otherTimestamp
                    ]}>
                      {formatTime(item.timestamp)}
                    </Text>
                  </View>
                );
              }}
            />
          )}

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
                placeholderTextColor={colors.textSecondary}
                multiline
                maxLength={500}
              />
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  message.trim() === '' ? styles.sendButtonDisabled : styles.sendButtonActive
                ]} 
                onPress={handleSend}
                disabled={message.trim() === ''}
              >
                <Send size={20} color={message.trim() === '' ? colors.textSecondary : colors.white} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  userStatus: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeButton: {
    padding: 4,
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.white,
  },
  otherMessageText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherTimestamp: {
    color: colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 120,
    color: colors.text,
  },
  sendButton: {
    marginLeft: 12,
    padding: 12,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.card,
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});