import { useColorScheme } from '@/hooks/useColorScheme';
import { Comment, Work } from '@/types';
import { fetchComments, fetchWorks } from '@/utils/mockData';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function WorkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [work, setWork] = useState<Work | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadWorkDetail();
  }, [id]);

  const loadWorkDetail = async () => {
    try {
      setLoading(true);
      // 模拟获取作品详情
      const works = await fetchWorks(1);
      const foundWork = works.find(w => w.id === id);
      if (foundWork) {
        setWork(foundWork);
        const commentsData = await fetchComments(id);
        setComments(commentsData);
      }
    } catch (error) {
      console.error('加载详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    if (!work) return;
    setWork({
      ...work,
      stats: {
        ...work.stats,
        isLiked: !work.stats.isLiked,
        likes: work.stats.isLiked ? work.stats.likes - 1 : work.stats.likes + 1,
      }
    });
  };

  const handleCollect = () => {
    if (!work) return;
    setWork({
      ...work,
      stats: {
        ...work.stats,
        isCollected: !work.stats.isCollected,
      }
    });
  };

  const handleFollow = () => {
    if (!work) return;
    setWork({
      ...work,
      author: {
        ...work.author,
        isFollowed: !work.author.isFollowed,
      }
    });
  };

  const renderContent = () => {
    if (!work) return null;

    switch (work.type) {
      case 'text':
        return (
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
              {work.title}
            </Text>
            <ScrollView style={styles.textContent}>
              <Text style={[styles.contentText, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                {work.content}
              </Text>
            </ScrollView>
          </View>
        );
      
      case 'image':
        return (
          <View>
            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              style={styles.imageCarousel}
            >
              {work.images?.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            <View style={styles.contentContainer}>
              <Text style={[styles.title, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                {work.title}
              </Text>
              <Text style={[styles.description, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                {work.content}
              </Text>
            </View>
          </View>
        );
      
      case 'video':
        return (
          <View>
            <View style={styles.videoContainer}>
              <Image
                source={{ uri: work.images?.[0] || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop' }}
                style={styles.videoThumbnail}
                resizeMode="cover"
              />
              <Pressable style={styles.playButton}>
                <Ionicons name="play" size={32} color="#FFFFFF" />
              </Pressable>
            </View>
            <View style={styles.contentContainer}>
              <Text style={[styles.title, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                {work.title}
              </Text>
              <Text style={[styles.description, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                {work.content}
              </Text>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#FAFAFA' }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={[styles.loadingText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            加载中...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!work) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#FAFAFA' }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            内容不存在
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#FAFAFA' }]}>
      {/* 头部导航 */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#374151' : '#E5E7EB' }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
          详情
        </Text>
        <Pressable style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {renderContent()}
        
        {/* 作者信息 */}
        <View style={[styles.authorSection, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <View style={styles.authorInfo}>
            <Image source={{ uri: work.author.avatar }} style={styles.authorAvatar} />
            <View style={styles.authorDetails}>
              <Text style={[styles.authorName, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                {work.author.name}
              </Text>
              <Text style={[styles.authorBio, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                分享知识，传递价值
              </Text>
            </View>
            <Pressable 
              style={[
                styles.followButton, 
                { 
                  backgroundColor: work.author.isFollowed ? (isDark ? '#374151' : '#F3F4F6') : '#3B82F6',
                  borderColor: work.author.isFollowed ? (isDark ? '#4B5563' : '#D1D5DB') : '#3B82F6',
                }
              ]}
              onPress={handleFollow}
            >
              <Text style={[
                styles.followButtonText, 
                { color: work.author.isFollowed ? (isDark ? '#9CA3AF' : '#6B7280') : '#FFFFFF' }
              ]}>
                {work.author.isFollowed ? '已关注' : '关注'}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* 标签 */}
        <View style={styles.tagsSection}>
          {work.tags.map((tag, index) => (
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
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={[styles.bottomBar, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderTopColor: isDark ? '#374151' : '#E5E7EB' }]}>
        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={handleLike}>
            <Ionicons 
              name={work.stats.isLiked ? "heart" : "heart-outline"} 
              size={24} 
              color={work.stats.isLiked ? "#EF4444" : (isDark ? '#9CA3AF' : '#6B7280')} 
            />
            <Text style={[styles.actionText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              {work.stats.likes}
            </Text>
          </Pressable>
          
          <Pressable style={styles.actionButton} onPress={() => setShowComments(true)}>
            <Ionicons name="chatbubble-outline" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
            <Text style={[styles.actionText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              {work.stats.comments}
            </Text>
          </Pressable>
          
          <Pressable style={styles.actionButton} onPress={() => setShowCollections(true)}>
            <Ionicons 
              name={work.stats.isCollected ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={work.stats.isCollected ? "#3B82F6" : (isDark ? '#9CA3AF' : '#6B7280')} 
            />
            <Text style={[styles.actionText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              收藏
            </Text>
          </Pressable>
          
          <Pressable style={styles.actionButton}>
            <Ionicons name="share-outline" size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
            <Text style={[styles.actionText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              分享
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 评论弹窗 */}
      <Modal
        visible={showComments}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDark ? '#111827' : '#FAFAFA' }]}>
          <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#374151' : '#E5E7EB' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
              评论 ({comments.length})
            </Text>
            <Pressable onPress={() => setShowComments(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
            </Pressable>
          </View>
          
          <ScrollView style={styles.commentsList}>
            {comments.map((comment) => (
              <View key={comment.id} style={[styles.commentItem, { borderBottomColor: isDark ? '#374151' : '#E5E7EB' }]}>
                <Image source={{ uri: comment.userAvatar }} style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                  <Text style={[styles.commentUser, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                    {comment.userName}
                  </Text>
                  <Text style={[styles.commentText, { color: isDark ? '#D1D5DB' : '#374151' }]}>
                    {comment.content}
                  </Text>
                  <Text style={[styles.commentTime, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
          
          <View style={[styles.commentInput, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF', borderTopColor: isDark ? '#374151' : '#E5E7EB' }]}>
            <TextInput
              style={[styles.textInput, { backgroundColor: isDark ? '#374151' : '#F3F4F6', color: isDark ? '#F9FAFB' : '#1F2937' }]}
              placeholder="写下你的评论..."
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <Pressable style={styles.sendButton}>
              <Ionicons name="send" size={20} color="#3B82F6" />
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>

      {/* 收藏夹弹窗 */}
      <Modal
        visible={showCollections}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: isDark ? '#111827' : '#FAFAFA' }]}>
          <View style={[styles.modalHeader, { borderBottomColor: isDark ? '#374151' : '#E5E7EB' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
              收藏到
            </Text>
            <Pressable onPress={() => setShowCollections(false)}>
              <Ionicons name="close" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
            </Pressable>
          </View>
          
          <View style={styles.collectionsList}>
            <Text style={[styles.collectionsPlaceholder, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              收藏夹功能开发中...
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  shareButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 20,
    lineHeight: 32,
  },
  textContent: {
    paddingHorizontal: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  imageCarousel: {
    height: 400,
  },
  carouselImage: {
    width: 400,
    height: 400,
  },
  videoContainer: {
    position: 'relative',
    height: 300,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
  authorSection: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  authorDetails: {
    flex: 1,
    marginLeft: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  authorBio: {
    fontSize: 14,
    marginTop: 2,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomBar: {
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    padding: 8,
  },
  collectionsList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  collectionsPlaceholder: {
    fontSize: 16,
  },
});