import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Modal,
  PanResponder,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 本地图片资源
const localImages = [
  require('../../assets/images/imags-1.jpg'),
  require('../../assets/images/imags-2.jpg'),
  require('../../assets/images/imags-3.jpg'),
  require('../../assets/images/imags-4.jpg'),
  require('../../assets/images/image-5.jpg'),
  require('../../assets/images/image-6.jpg'),
  require('../../assets/images/imags-7.jpg'),
  require('../../assets/images/imags-8.jpg'),
  require('../../assets/images/imags-9.jpg'),
  require('../../assets/images/imags-10.jpg'),
];

// 模拟数据
const initialAuthors = [
  {
    id: '1',
    name: '小明',
    avatar: 'https://picsum.photos/100/100?random=1',
    hasUpdate: true,
    updateCount: 3,
  },
  {
    id: '2',
    name: '小红',
    avatar: 'https://picsum.photos/100/100?random=2',
    hasUpdate: true,
    updateCount: 1,
  },
  {
    id: '3',
    name: '小李',
    avatar: 'https://picsum.photos/100/100?random=3',
    hasUpdate: false,
    updateCount: 0,
  },
  {
    id: '4',
    name: '小王',
    avatar: 'https://picsum.photos/100/100?random=4',
    hasUpdate: true,
    updateCount: 2,
  },
];

const initialWorks = [
  {
    id: '1',
    authorId: '1',
    authorName: '小明',
    authorAvatar: 'https://picsum.photos/100/100?random=1',
    type: 'video',
    title: '美丽的日落风景',
    content: '今天拍摄的日落真的太美了，分享给大家看看！',
    media: [localImages[0]],
    likes: 128,
    comments: 23,
    time: '2小时前',
  },
  {
    id: '2',
    authorId: '2',
    authorName: '小红',
    authorAvatar: 'https://picsum.photos/100/100?random=2',
    type: 'images',
    title: '今日穿搭分享',
    content: '今天的穿搭怎么样？简约风格，舒适又好看～',
    media: [localImages[1], localImages[2], localImages[3]],
    likes: 256,
    comments: 45,
    time: '4小时前',
  },
  {
    id: '3',
    authorId: '1',
    authorName: '小明',
    authorAvatar: 'https://picsum.photos/100/100?random=1',
    type: 'markdown',
    title: '生活感悟',
    content: `# 生活的美好

生活就像一杯茶，不会苦一辈子，但总会苦一阵子。

## 珍惜当下

- 感恩生活中的每一个美好瞬间
- 有时候放慢脚步，你会发现世界其实很美好
- **重要的是保持积极的心态**

> 生活不是等待暴风雨过去，而是学会在雨中跳舞。

让我们一起享受生活的每一个瞬间！`,
    media: [localImages[4]],
    likes: 89,
    comments: 12,
    time: '6小时前',
  },
  {
    id: '4',
    authorId: '4',
    authorName: '小王',
    authorAvatar: 'https://picsum.photos/100/100?random=4',
    type: 'video',
    title: '健身日常',
    content: '坚持健身第30天，身体状态越来越好了！',
    media: [localImages[5]],
    likes: 167,
    comments: 28,
    time: '8小时前',
  },
];

// 生成更多作品数据
const generateMoreWorks = (startId: number) => {
  const moreWorks = [];
  for (let i = 0; i < 5; i++) {
    const id = (startId + i).toString();
    const authorIndex = Math.floor(Math.random() * initialAuthors.length);
    const author = initialAuthors[authorIndex];
    const types = ['video', 'images', 'markdown'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let media = [];
    let content = '';
    
    if (type === 'video') {
      media = [localImages[Math.floor(Math.random() * localImages.length)]];
      content = `这是第 ${id} 个视频作品的描述，包含了精彩的内容。`;
    } else if (type === 'images') {
      const imageCount = Math.floor(Math.random() * 3) + 1;
      media = [];
      for (let j = 0; j < imageCount; j++) {
        media.push(localImages[Math.floor(Math.random() * localImages.length)]);
      }
      content = `这是第 ${id} 个图片作品的描述，展示了美丽的画面。`;
    } else if (type === 'markdown') {
      media = [localImages[Math.floor(Math.random() * localImages.length)]];
      content = `# 作品标题 ${id}

这是一个包含 **Markdown** 格式的作品。

## 主要内容

- 第一个要点
- 第二个要点
- 第三个要点

> 这是一个引用文本，展示了作品的核心思想。

让我们一起欣赏这个精彩的内容！`;
    }

    moreWorks.push({
      id,
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      type,
      title: `作品标题 ${id}`,
      content,
      media,
      likes: Math.floor(Math.random() * 500) + 50,
      comments: Math.floor(Math.random() * 100) + 10,
      time: `${Math.floor(Math.random() * 24) + 1}小时前`,
    });
  }
  return moreWorks;
};

// 简单的Markdown渲染组件
const MarkdownRenderer = ({ content, isDark }: { content: string; isDark: boolean }) => {
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    
    lines.forEach((line: string, index: number) => {
      if (line.startsWith('# ')) {
        elements.push(
          <Text key={index} style={[styles.markdownH1, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            {line.substring(2)}
          </Text>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <Text key={index} style={[styles.markdownH2, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            {line.substring(3)}
          </Text>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <Text key={index} style={[styles.markdownList, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
            • {line.substring(2)}
          </Text>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <View key={index} style={styles.markdownQuote}>
            <Text style={[styles.markdownQuoteText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              {line.substring(2)}
            </Text>
          </View>
        );
      } else if (line.trim() !== '') {
        // 处理粗体文本
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const textElements = parts.map((part: string, partIndex: number) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <Text key={partIndex} style={styles.markdownBold}>
                {part.substring(2, part.length - 2)}
              </Text>
            );
          }
          return part;
        });
        
        elements.push(
          <Text key={index} style={[styles.markdownText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
            {textElements}
          </Text>
        );
      }
    });
    
    return elements;
  };

  return <View style={styles.markdownContainer}>{renderMarkdown(content)}</View>;
};

export default function DynamicScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAuthorIndex, setCurrentAuthorIndex] = useState(0);
  
  // 数据状态
  const [authors, setAuthors] = useState(initialAuthors);
  const [works, setWorks] = useState(initialWorks);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const scrollViewRef = useRef(null);
  const nextWorkId = useRef(5);

  // 上拉刷新
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 重置数据
    setAuthors([...initialAuthors]);
    setWorks([...initialWorks]);
    nextWorkId.current = 5;
    setHasMoreData(true);
    
    setRefreshing(false);
  }, []);

  // 下拉加载更多
  const loadMoreWorks = useCallback(async () => {
    if (loadingMore || !hasMoreData) return;
    
    setLoadingMore(true);
    
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const moreWorks = generateMoreWorks(nextWorkId.current);
    setWorks(prevWorks => [...prevWorks, ...moreWorks]);
    nextWorkId.current += 5;
    
    // 模拟数据加载完毕
    if (nextWorkId.current > 20) {
      setHasMoreData(false);
    }
    
    setLoadingMore(false);
  }, [loadingMore, hasMoreData]);

  // 打开作者详情弹窗
  const openAuthorModal = (author: any) => {
    const authorIndex = authors.findIndex(a => a.id === author.id);
    setCurrentAuthorIndex(authorIndex);
    setSelectedAuthor(author);
    setModalVisible(true);
    
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  // 关闭弹窗
  const closeModal = () => {
    Animated.spring(slideAnim, {
      toValue: screenHeight,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      setModalVisible(false);
      setSelectedAuthor(null);
    });
  };

  // 切换作者
  const switchAuthor = (direction: string) => {
    let newIndex;
    if (direction === 'left' && currentAuthorIndex > 0) {
      newIndex = currentAuthorIndex - 1;
    } else if (direction === 'right' && currentAuthorIndex < authors.length - 1) {
      newIndex = currentAuthorIndex + 1;
    } else {
      return;
    }
    
    setCurrentAuthorIndex(newIndex);
    setSelectedAuthor(authors[newIndex]);
  };

  // 手势处理
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 20;
    },
    onPanResponderMove: (evt, gestureState) => {
      // 可以添加实时滑动效果
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 50) {
        switchAuthor('left');
      } else if (gestureState.dx < -50) {
        switchAuthor('right');
      }
    },
  });

  // 渲染作者头像
  const renderAuthor = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.authorItem}
      onPress={() => openAuthorModal(item)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.hasUpdate && (
          <View style={styles.updateBadge}>
            <Text style={styles.updateText}>{item.updateCount}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.authorName, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // 渲染作品卡片
  const renderWork = ({ item }: { item: any }) => (
    <View style={[styles.workCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
      {/* 类型标识 - 右上角 */}
      <View style={[styles.typeIndicator, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}>
        {item.type === 'video' && (
          <Ionicons name="videocam" size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
        )}
        {item.type === 'images' && (
          <Ionicons name="images" size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
        )}
        {item.type === 'markdown' && (
          <Ionicons name="document-text" size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
        )}
      </View>

      {/* 作者信息 */}
      <View style={styles.workHeader}>
        <Image source={{ uri: item.authorAvatar }} style={styles.workAuthorAvatar} />
        <View style={styles.workAuthorInfo}>
          <Text style={[styles.workAuthorName, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            {item.authorName}
          </Text>
          <Text style={[styles.workTime, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {item.time}
          </Text>
        </View>
      </View>

      {/* 作品标题 */}
      <Text style={[styles.workTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
        {item.title}
      </Text>

      {/* 根据类型渲染不同内容 */}
      {item.type === 'markdown' ? (
        <MarkdownRenderer content={item.content} isDark={isDark} />
      ) : (
        <Text style={[styles.workContent, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
          {item.content}
        </Text>
      )}

      {/* 媒体内容 */}
      {item.type === 'video' && item.media.length > 0 && (
        <View style={styles.mediaContainer}>
          <View style={styles.videoContainer}>
            <Image source={item.media[0]} style={styles.videoThumbnail} />
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {item.type === 'images' && item.media.length > 0 && (
        <View style={styles.mediaContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageCarousel}
          >
            {item.media.map((image: any, index: number) => (
              <Image
                key={index}
                source={image}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {item.media.length > 1 && (
            <View style={styles.imageIndicator}>
              <Text style={[styles.indicatorText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                1 / {item.media.length}
              </Text>
            </View>
          )}
        </View>
      )}

      {item.type === 'markdown' && item.media.length > 0 && (
        <View style={styles.mediaContainer}>
          <Image
            source={item.media[0]}
            style={styles.markdownImage}
            resizeMode="cover"
          />
        </View>
      )}

      {/* 互动区域 */}
      <View style={styles.workActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <Text style={[styles.actionText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {item.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <Text style={[styles.actionText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            {item.comments}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // 渲染加载更多指示器
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={isDark ? '#9CA3AF' : '#6B7280'} />
        <Text style={[styles.loadingText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          加载更多...
        </Text>
      </View>
    );
  };

  // 渲染无更多数据提示
  const renderNoMoreData = () => {
    if (hasMoreData || works.length === 0) return null;
    
    return (
      <View style={styles.noMoreData}>
        <Text style={[styles.noMoreText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
          没有更多内容了
        </Text>
      </View>
    );
  };

  // 获取当前作者的作品
  const getCurrentAuthorWorks = () => {
    if (!selectedAuthor) return [];
    return works.filter(work => work.authorId === selectedAuthor.id);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#FAFAFA' }]}>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor={isDark ? '#9CA3AF' : '#6B7280'}
            title="下拉刷新"
            titleColor={isDark ? '#9CA3AF' : '#6B7280'}
          />
        }
      >
        {/* 作者列表 */}
        <View style={styles.authorsSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            关注的作者
          </Text>
          <FlatList
            ref={scrollViewRef}
            data={authors}
            renderItem={renderAuthor}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.authorsList}
          />
        </View>

        {/* 作品列表 */}
        <View style={styles.worksSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            最新动态
          </Text>
          <FlatList
            data={works}
            renderItem={renderWork}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.worksList}
            onEndReached={loadMoreWorks}
            onEndReachedThreshold={0.1}
            ListFooterComponent={() => (
              <>
                {renderFooter()}
                {renderNoMoreData()}
              </>
            )}
          />
        </View>
      </ScrollView>

      {/* 作者详情弹窗 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor: isDark ? '#111827' : '#FFFFFF',
                transform: [{ translateY: slideAnim }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            {/* 关闭按钮 */}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
            </TouchableOpacity>

            {/* 作者列表 */}
            <View style={styles.modalAuthorsSection}>
              <FlatList
                data={authors}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalAuthorItem,
                      index === currentAuthorIndex && styles.selectedAuthor,
                    ]}
                    onPress={() => {
                      setCurrentAuthorIndex(index);
                      setSelectedAuthor(item);
                    }}
                  >
                    <Image source={{ uri: item.avatar }} style={styles.modalAvatar} />
                    <Text style={[
                      styles.modalAuthorName,
                      { color: isDark ? '#F9FAFB' : '#1F2937' },
                      index === currentAuthorIndex && { color: '#3B82F6' }
                    ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.modalAuthorsList}
              />
            </View>

            {/* 当前作者的作品列表 */}
            <View style={styles.modalWorksSection}>
              <FlatList
                data={getCurrentAuthorWorks()}
                renderItem={renderWork}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalWorksList}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  authorsSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  authorsList: {
    paddingHorizontal: 16,
  },
  authorItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
    marginTop: 8
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  updateBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  authorName: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  updateHint: {
    fontSize: 10,
    color: '#EF4444',
    marginTop: 2,
    textAlign: 'center',
  },
  worksSection: {
    flex: 1,
    paddingTop: 16,
  },
  worksList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  workCard: {
    position: 'relative',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  workHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  workAuthorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  workAuthorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  workAuthorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  workTime: {
    fontSize: 12,
    marginTop: 2,
  },
  workTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  typeText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  workContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  mediaContainer: {
    marginBottom: 12,
  },
  videoContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
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
  imageCarousel: {
    borderRadius: 8,
  },
  carouselImage: {
    width: screenWidth - 64,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  indicatorText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  markdownImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  markdownContainer: {
    marginBottom: 12,
  },
  markdownH1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  markdownH2: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  markdownText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  markdownList: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 2,
    marginLeft: 8,
  },
  markdownQuote: {
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
    paddingLeft: 12,
    marginVertical: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingVertical: 8,
    borderRadius: 4,
  },
  markdownQuoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  markdownBold: {
    fontWeight: 'bold',
  },
  workActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 4,
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  noMoreData: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noMoreText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: screenHeight * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAuthorsSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalAuthorsList: {
    paddingHorizontal: 16,
  },
  modalAuthorItem: {
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
  },
  selectedAuthor: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  modalAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  modalAuthorName: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  modalWorksSection: {
    flex: 1,
    paddingTop: 16,
  },
  modalWorksList: {
    paddingHorizontal: 16,
  },
});
