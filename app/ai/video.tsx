import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface GeneratedVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  timestamp: Date;
  type: 'generated' | 'edited';
}

export default function VideoScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState<'generate' | 'edit'>('generate');
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);

  const videoStyles = [
    { id: 'realistic', name: '写实风格', icon: 'videocam' },
    { id: 'animation', name: '动画风格', icon: 'color-palette' },
    { id: 'cinematic', name: '电影风格', icon: 'film' },
    { id: 'documentary', name: '纪录片', icon: 'library' },
  ];

  const promptSuggestions = [
    '一只小猫在阳光下玩耍的温馨场景',
    '未来城市的科幻交通场景',
    '海边日落时的浪漫景色',
    '森林中小动物们的日常生活',
    '太空探索的壮观画面',
    '古代城堡的神秘氛围',
  ];

  const editingTools = [
    { id: 'trim', name: '剪辑', icon: 'cut', description: '裁剪视频长度' },
    { id: 'filter', name: '滤镜', icon: 'color-filter', description: '添加视觉效果' },
    { id: 'music', name: '配乐', icon: 'musical-notes', description: '添加背景音乐' },
    { id: 'subtitle', name: '字幕', icon: 'text', description: '自动生成字幕' },
    { id: 'transition', name: '转场', icon: 'swap-horizontal', description: '添加转场效果' },
    { id: 'speed', name: '变速', icon: 'speedometer', description: '调整播放速度' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);

    // 模拟AI视频生成
    setTimeout(() => {
      const newVideo: GeneratedVideo = {
        id: Date.now().toString(),
        title: prompt.trim().substring(0, 30) + (prompt.length > 30 ? '...' : ''),
        description: prompt.trim(),
        thumbnailUrl: `https://picsum.photos/400/225?random=${Date.now()}`,
        duration: '0:15',
        timestamp: new Date(),
        type: 'generated',
      };

      setGeneratedVideos(prev => [newVideo, ...prev]);
      setIsProcessing(false);
      setPrompt('');
    }, 5000);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const handleToolPress = (toolId: string) => {
    // 这里可以导航到具体的编辑工具页面
    console.log('打开编辑工具:', toolId);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#FAFAFA' }]}>
        {/* 头部导航 */}
        <View style={[styles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            AI视频
          </Text>
          <Text style={[styles.headerSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            智能视频创作
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
        </TouchableOpacity>
      </View>

      {/* 标签切换 */}
      <View style={[styles.tabContainer, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'generate' && styles.activeTab,
            activeTab === 'generate' && { backgroundColor: '#EF4444' },
          ]}
          onPress={() => setActiveTab('generate')}
        >
          <Ionicons
            name="videocam"
            size={20}
            color={activeTab === 'generate' ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#6B7280')}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'generate' ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#6B7280'),
              },
            ]}
          >
            视频生成
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'edit' && styles.activeTab,
            activeTab === 'edit' && { backgroundColor: '#EF4444' },
          ]}
          onPress={() => setActiveTab('edit')}
        >
          <Ionicons
            name="cut"
            size={20}
            color={activeTab === 'edit' ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#6B7280')}
          />
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'edit' ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#6B7280'),
              },
            ]}
          >
            视频编辑
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'generate' ? (
          <>
            {/* 视频生成区域 */}
            <View style={styles.generateSection}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                描述你想要的视频内容
              </Text>
              <TextInput
                style={[
                  styles.promptInput,
                  {
                    backgroundColor: isDark ? '#374151' : '#F9FAFB',
                    color: isDark ? '#F9FAFB' : '#1F2937',
                    borderColor: isDark ? '#4B5563' : '#E5E7EB',
                  },
                ]}
                placeholder="例如：一只小猫在阳光下玩耍，画面温馨可爱，时长15秒..."
                placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                value={prompt}
                onChangeText={setPrompt}
                multiline
                numberOfLines={4}
                maxLength={300}
              />
              <Text style={[styles.charCount, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
                {prompt.length}/300
              </Text>

              {/* 生成按钮 */}
              <TouchableOpacity
                style={[
                  styles.generateButton,
                  {
                    backgroundColor: prompt.trim() && !isProcessing ? '#EF4444' : (isDark ? '#374151' : '#E5E7EB'),
                  },
                ]}
                onPress={handleGenerate}
                disabled={!prompt.trim() || isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="videocam" size={20} color={prompt.trim() ? '#FFFFFF' : (isDark ? '#6B7280' : '#9CA3AF')} />
                )}
                <Text
                  style={[
                    styles.generateButtonText,
                    {
                      color: prompt.trim() && !isProcessing ? '#FFFFFF' : (isDark ? '#6B7280' : '#9CA3AF'),
                    },
                  ]}
                >
                  {isProcessing ? '正在生成视频...' : '开始生成'}
                </Text>
              </TouchableOpacity>

              {/* 处理进度 */}
              {isProcessing && (
                <View style={styles.progressContainer}>
                  <Text style={[styles.progressText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                    AI正在为您创作视频，预计需要3-5分钟...
                  </Text>
                </View>
              )}
            </View>

            {/* 创意提示 */}
            {generatedVideos.length === 0 && (
              <View style={styles.suggestionsSection}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                  💡 创意灵感
                </Text>
                <View style={styles.suggestionsList}>
                  {promptSuggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.suggestionButton, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
                      onPress={() => handleSuggestionPress(suggestion)}
                    >
                      <Text style={[styles.suggestionText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
                        {suggestion}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </>
        ) : (
          <>
            {/* 视频编辑区域 */}
            <View style={styles.editSection}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                选择编辑工具
              </Text>
              <View style={styles.toolsGrid}>
                {editingTools.map((tool) => (
                  <TouchableOpacity
                    key={tool.id}
                    style={[styles.toolCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
                    onPress={() => handleToolPress(tool.id)}
                  >
                    <View style={[styles.toolIcon, { backgroundColor: '#EF444415' }]}>
                      <Ionicons name={tool.icon as any} size={24} color="#EF4444" />
                    </View>
                    <Text style={[styles.toolName, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                      {tool.name}
                    </Text>
                    <Text style={[styles.toolDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      {tool.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 上传区域 */}
              <View style={styles.uploadSection}>
                <TouchableOpacity
                  style={[styles.uploadButton, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
                >
                  <Ionicons name="cloud-upload" size={32} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <Text style={[styles.uploadText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
                    点击上传视频文件
                  </Text>
                  <Text style={[styles.uploadHint, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
                    支持 MP4, MOV, AVI 格式，最大 100MB
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* 生成历史 */}
        {generatedVideos.length > 0 && (
          <View style={styles.historySection}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
              创作历史
            </Text>
            <View style={styles.videoGrid}>
              {generatedVideos.map((video) => (
                <View
                  key={video.id}
                  style={[styles.videoCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
                >
                  <View style={styles.videoThumbnail}>
                    <Image source={{ uri: video.thumbnailUrl }} style={styles.thumbnailImage} />
                    <View style={styles.playOverlay}>
                      <Ionicons name="play" size={24} color="#FFFFFF" />
                    </View>
                    <View style={styles.durationBadge}>
                      <Text style={styles.durationText}>{video.duration}</Text>
                    </View>
                  </View>
                  <View style={styles.videoInfo}>
                    <Text style={[styles.videoTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]} numberOfLines={1}>
                      {video.title}
                    </Text>
                    <Text style={[styles.videoDescription, { color: isDark ? '#9CA3AF' : '#6B7280' }]} numberOfLines={2}>
                      {video.description}
                    </Text>
                    <Text style={[styles.videoTime, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
                      {video.timestamp.toLocaleString('zh-CN')}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.downloadButton}>
                    <Ionicons name="download" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeTab: {
    // backgroundColor will be set dynamically
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  content: {
    flex: 1,
  },
  generateSection: {
    padding: 20,
  },
  editSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  promptInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 8,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    marginBottom: 16,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
  },
  suggestionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  suggestionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    margin: 6,
  },
  suggestionText: {
    fontSize: 14,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 20,
  },
  toolCard: {
    width: (screenWidth - 64) / 2,
    padding: 16,
    borderRadius: 12,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  uploadSection: {
    marginTop: 20,
  },
  uploadButton: {
    alignItems: 'center',
    paddingVertical: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  uploadHint: {
    fontSize: 12,
    marginTop: 4,
  },
  historySection: {
    paddingHorizontal: 20,
  },
  videoGrid: {
    marginHorizontal: -8,
  },
  videoCard: {
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  videoThumbnail: {
    position: 'relative',
    marginBottom: 12,
  },
  thumbnailImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  playOverlay: {
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
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  videoInfo: {
    marginBottom: 8,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  videoTime: {
    fontSize: 12,
  },
  downloadButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});