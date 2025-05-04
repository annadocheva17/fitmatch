import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useFeedStore } from '@/store/feed-store';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/Button';
import { X, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Modal } from 'react-native';

type CreatePostModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function CreatePostModal({ visible, onClose }: CreatePostModalProps) {
  const { createPost } = useFeedStore();
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || !content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await createPost({
        userId: user.id,
        content: content.trim(),
        images: images.length > 0 ? images : undefined,
      });
      
      // Reset form and close modal
      setContent('');
      setImages([]);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Post</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content}>
          <TextInput
            style={styles.input}
            placeholder="What's on your mind?"
            placeholderTextColor="#999"
            multiline
            value={content}
            onChangeText={setContent}
            autoFocus
          />
          
          {images.length > 0 && (
            <View style={styles.imageContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: image }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <X size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
            <ImageIcon size={24} color="#0066cc" />
            <Text style={styles.addImageText}>Add Photo</Text>
          </TouchableOpacity>
          
          <Button
            title={isSubmitting ? 'Posting...' : 'Post'}
            variant="primary"
            onPress={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            style={styles.postButton}
          >
            {isSubmitting && <ActivityIndicator color="#fff" size="small" style={styles.loader} />}
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  imageWrapper: {
    position: 'relative',
    width: '48%',
    aspectRatio: 1,
    margin: '1%',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addImageText: {
    marginLeft: 8,
    color: '#0066cc',
    fontSize: 16,
  },
  postButton: {
    minWidth: 100,
  },
  loader: {
    marginRight: 8,
  },
});