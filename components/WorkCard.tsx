import { useColorScheme } from '@/hooks/useColorScheme';
import { Work } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface WorkCardProps {
  work: Work;
  onPress: () => void;
}

export default function WorkCard({ work, onPress }: WorkCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const renderContent = () => {
    switch (work.type) {
      case 'image':
        return (
          <Image
            source={{ uri: work.images?.[0] }}
            style={styles.dynamicImage}
            resizeMode="cover"
          />
        );
      case 'video':
        return (
          <View style={styles.videoContainer}>
            <Image
              source={{ uri: work.images?.[0] || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop' }}
              style={styles.dynamicImage}
              resizeMode="cover"
            />
            <View style={styles.playButton}>
              <Ionicons name="play" size={24} color="#FFFFFF" />
            </View>
          </View>
        );
      default:
        return (
          <>
          </>
        );
    }
  };

  return (
    <Pressable
      style={[
        styles.card,
        { 
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        }
      ]}
      onPress={onPress}
      android_ripple={{ color: 'rgba(59, 130, 246, 0.1)' }}
    >
      {renderContent()}
      
      <View style={styles.cardContent}>
        <Text 
          style={[styles.title, { color: isDark ? '#F9FAFB' : '#1F2937' }]}
          numberOfLines={2}
        >
          {work.title}
        </Text>
        
        {work.type === 'text' && work.content && (
          <Text 
            style={[styles.content, { color: isDark ? '#D1D5DB' : '#4B5563' }]}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {work.content}
          </Text>
        )}
        
        <View style={styles.authorInfo}>
          <Image
            source={{ uri: work.author.avatar }}
            style={styles.avatar}
          />
          <Text style={[styles.authorName, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {work.author.name}
          </Text>
        </View>
        
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons 
              name={work.stats.isLiked ? "heart" : "heart-outline"} 
              size={16} 
              color={work.stats.isLiked ? "#EF4444" : (isDark ? '#9CA3AF' : '#6B7280')} 
            />
            <Text style={[styles.statText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              {work.stats.likes}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons 
              name="chatbubble-outline" 
              size={16} 
              color={isDark ? '#9CA3AF' : '#6B7280'} 
            />
            <Text style={[styles.statText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              {work.stats.comments}
            </Text>
          </View>
        </View>
        
        <View style={styles.tags}>
          {work.tags.slice(0, 2).map((tag, index) => (
            <View 
              key={index} 
              style={[styles.tag, { backgroundColor: isDark ? '#374151' : '#EFF6FF' }]}
            >
              <Text style={[styles.tagText, { color: isDark ? '#60A5FA' : '#3B82F6' }]}>
                #{tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    elevation: 4,
    overflow: 'hidden',
    // 在Android上使用elevation，在iOS上使用shadowProps
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginVertical: 6,  // 添加垂直间距
    marginHorizontal: 2, // 添加水平间距
  },
  image: {
    width: '100%',
    height: 200,
  },
  dynamicImage: {
    width: '100%',
    aspectRatio: 1,
    minHeight: 150,
  },
  videoContainer: {
    position: 'relative',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    opacity: 0.9,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '500',
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
});