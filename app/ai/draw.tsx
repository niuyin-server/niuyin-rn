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

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
  style: string;
}

export default function DrawScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const drawingStyles = [
    { id: 'realistic', name: '写实风格', icon: 'camera' },
    { id: 'cartoon', name: '卡通风格', icon: 'happy' },
    { id: 'anime', name: '动漫风格', icon: 'star' },
    { id: 'oil', name: '油画风格', icon: 'brush' },
    { id: 'watercolor', name: '水彩风格', icon: 'water' },
    { id: 'sketch', name: '素描风格', icon: 'pencil' },
  ];

  const promptSuggestions = [
    '一只可爱的小猫在花园里玩耍',
    '未来科技城市的夜景',
    '梦幻森林中的精灵',
    '宁静的湖边日落',
    '太空中的宇宙飞船',
    '古代城堡的神秘景象',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // 模拟AI绘图生成
    setTimeout(() => {
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt: prompt.trim(),
        imageUrl: `https://picsum.photos/400/400?random=${Date.now()}`,
        timestamp: new Date(),
        style: selectedStyle,
      };

      setGeneratedImages(prev => [newImage, ...prev]);
      setIsGenerating(false);
      setPrompt('');
    }, 3000);
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setPrompt(suggestion);
  };

  const getStyleName = (styleId: string) => {
    return drawingStyles.find(style => style.id === styleId)?.name || '写实风格';
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
            AI绘图
          </Text>
          <Text style={[styles.headerSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            文字生成图片
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 输入区域 */}
        <View style={styles.inputSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            描述你想要的画面
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
            placeholder="例如：一只可爱的小猫在花园里玩耍，阳光明媚，色彩鲜艳..."
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={[styles.charCount, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
            {prompt.length}/500
          </Text>
        </View>

        {/* 风格选择 */}
        <View style={styles.styleSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            选择绘画风格
          </Text>
          <View style={styles.styleGrid}>
            {drawingStyles.map((style) => (
              <TouchableOpacity
                key={style.id}
                style={[
                  styles.styleButton,
                  {
                    backgroundColor: selectedStyle === style.id
                      ? '#3B82F6'
                      : (isDark ? '#374151' : '#F3F4F6'),
                  },
                ]}
                onPress={() => handleStyleSelect(style.id)}
              >
                <Ionicons
                  name={style.icon as any}
                  size={20}
                  color={selectedStyle === style.id ? '#FFFFFF' : (isDark ? '#D1D5DB' : '#4B5563')}
                />
                <Text
                  style={[
                    styles.styleText,
                    {
                      color: selectedStyle === style.id
                        ? '#FFFFFF'
                        : (isDark ? '#D1D5DB' : '#4B5563'),
                    },
                  ]}
                >
                  {style.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 生成按钮 */}
        <TouchableOpacity
          style={[
            styles.generateButton,
            {
              backgroundColor: prompt.trim() && !isGenerating ? '#8B5CF6' : (isDark ? '#374151' : '#E5E7EB'),
            },
          ]}
          onPress={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="brush" size={20} color={prompt.trim() ? '#FFFFFF' : (isDark ? '#6B7280' : '#9CA3AF')} />
          )}
          <Text
            style={[
              styles.generateButtonText,
              {
                color: prompt.trim() && !isGenerating ? '#FFFFFF' : (isDark ? '#6B7280' : '#9CA3AF'),
              },
            ]}
          >
            {isGenerating ? '正在生成...' : '开始创作'}
          </Text>
        </TouchableOpacity>

        {/* 提示建议 */}
        {generatedImages.length === 0 && (
          <View style={styles.suggestionsSection}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
              💡 创意提示
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

        {/* 生成历史 */}
        {generatedImages.length > 0 && (
          <View style={styles.historySection}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
              创作历史
            </Text>
            <View style={styles.imageGrid}>
              {generatedImages.map((image) => (
                <View
                  key={image.id}
                  style={[styles.imageCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}
                >
                  <Image source={{ uri: image.imageUrl }} style={styles.generatedImage} />
                  <View style={styles.imageInfo}>
                    <Text style={[styles.imagePrompt, { color: isDark ? '#D1D5DB' : '#4B5563' }]} numberOfLines={2}>
                      {image.prompt}
                    </Text>
                    <View style={styles.imageMetadata}>
                      <Text style={[styles.imageStyle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                        {getStyleName(image.style)}
                      </Text>
                      <Text style={[styles.imageTime, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
                        {image.timestamp.toLocaleTimeString('zh-CN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
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
  content: {
    flex: 1,
  },
  inputSection: {
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
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: 8,
  },
  styleSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  styleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 6,
  },
  styleText: {
    fontSize: 14,
    marginLeft: 6,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
  historySection: {
    paddingHorizontal: 20,
  },
  imageGrid: {
    marginHorizontal: -8,
  },
  imageCard: {
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
  generatedImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  imageInfo: {
    marginBottom: 8,
  },
  imagePrompt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  imageMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageStyle: {
    fontSize: 12,
  },
  imageTime: {
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