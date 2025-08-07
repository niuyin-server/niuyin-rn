import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface AICapability {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string[];
  route: string;
  stats: string;
  features: string[];
}

export default function AIScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeCard, setActiveCard] = useState<string | null>(null);
  
  // 动画值
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const aiCapabilities: AICapability[] = [
    {
      id: 'chat',
      title: '智能对话',
      subtitle: 'AI Chat',
      description: '与AI进行自然对话，获得智能回答和创意灵感',
      icon: 'chatbubbles',
      gradient: ['#667eea', '#764ba2'],
      route: '/ai/chat',
      stats: '24/7 在线',
      features: ['自然语言理解', '多轮对话', '知识问答', '创意写作'],
    },
    {
      id: 'draw',
      title: 'AI绘画',
      subtitle: 'AI Drawing',
      description: '文字转图像，让想象力变成精美的艺术作品',
      icon: 'brush',
      gradient: ['#f093fb', '#f5576c'],
      route: '/ai/draw',
      stats: '秒级生成',
      features: ['文字生图', '多种风格', '高清输出', '批量生成'],
    },
    {
      id: 'video',
      title: 'AI视频',
      subtitle: 'AI Video',
      description: '智能视频生成与编辑，创造震撼的视觉体验',
      icon: 'videocam',
      gradient: ['#4facfe', '#00f2fe'],
      route: '/ai/video',
      stats: '专业级别',
      features: ['视频生成', '智能剪辑', '特效添加', '音频合成'],
    },
  ];

  useEffect(() => {
    // 启动动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCardPress = (capability: AICapability) => {
    router.push(capability.route as any);
  };

  const handleCardPressIn = (id: string) => {
    setActiveCard(id);
  };

  const handleCardPressOut = () => {
    setActiveCard(null);
  };

  const renderCapabilityCard = (capability: AICapability, index: number) => {
    const isActive = activeCard === capability.id;
    const cardDelay = index * 200;

    return (
      <Animated.View
        key={capability.id}
        style={[
          styles.cardContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 50 + cardDelay / 10],
                }),
              },
              { scale: isActive ? 0.98 : 1 },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.capabilityCard,
            { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' },
            isActive && styles.activeCard,
          ]}
          onPress={() => handleCardPress(capability)}
          onPressIn={() => handleCardPressIn(capability.id)}
          onPressOut={handleCardPressOut}
          activeOpacity={0.9}
        >
          {/* 渐变背景 */}
          <View style={styles.gradientOverlay}>
            <View
              style={[
                styles.gradientBackground,
                {
                  backgroundColor: capability.gradient[0],
                  opacity: 0.1,
                },
              ]}
            />
          </View>

          {/* 卡片头部 */}
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <View
                style={[
                  styles.iconBackground,
                  { backgroundColor: capability.gradient[0] + '20' },
                ]}
              >
                <Ionicons
                  name={capability.icon as any}
                  size={32}
                  color={capability.gradient[0]}
                />
              </View>
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.cardTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
                {capability.title}
              </Text>
              <Text style={[styles.cardSubtitle, { color: capability.gradient[0] }]}>
                {capability.subtitle}
              </Text>
            </View>
            <View style={styles.statsContainer}>
              <Text style={[styles.statsText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                {capability.stats}
              </Text>
            </View>
          </View>

          {/* 卡片描述 */}
          <Text style={[styles.cardDescription, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
            {capability.description}
          </Text>

          {/* 功能特性 */}
          <View style={styles.featuresContainer}>
            {capability.features.map((feature, featureIndex) => (
              <View
                key={featureIndex}
                style={[
                  styles.featureTag,
                  { backgroundColor: capability.gradient[0] + '15' },
                ]}
              >
                <Text
                  style={[
                    styles.featureText,
                    { color: capability.gradient[0] },
                  ]}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          {/* 进入按钮 */}
          <View style={styles.cardFooter}>
            <View
              style={[
                styles.enterButton,
                { backgroundColor: capability.gradient[0] },
              ]}
            >
              <Text style={styles.enterButtonText}>立即体验</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </View>
          </View>

          {/* 装饰元素 */}
          <View style={styles.decorativeElements}>
            <View
              style={[
                styles.decorativeCircle,
                {
                  backgroundColor: capability.gradient[1] + '10',
                  top: 20,
                  right: 20,
                },
              ]}
            />
            <View
              style={[
                styles.decorativeCircle,
                {
                  backgroundColor: capability.gradient[0] + '08',
                  bottom: 30,
                  left: 30,
                  width: 40,
                  height: 40,
                },
              ]}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      {/* 头部区域 */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
              AI 智能助手
            </Text>
            <Text style={[styles.headerSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              探索人工智能的无限可能
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.settingsButton}>
              <Ionicons
                name="settings-outline"
                size={24}
                color={isDark ? '#9CA3AF' : '#6B7280'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 统计信息 */}
        <Animated.View
          style={[
            styles.statsRow,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={[styles.statItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Text style={[styles.statNumber, { color: '#667eea' }]}>1.2M+</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              对话次数
            </Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Text style={[styles.statNumber, { color: '#f093fb' }]}>500K+</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              图片生成
            </Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Text style={[styles.statNumber, { color: '#4facfe' }]}>100K+</Text>
            <Text style={[styles.statLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              视频创作
            </Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* 能力卡片列表 */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsContainer}>
          {aiCapabilities.map((capability, index) =>
            renderCapabilityCard(capability, index)
          )}
        </View>

        {/* 底部提示 */}
        <Animated.View
          style={[
            styles.bottomTip,
            {
              opacity: fadeAnim,
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            },
          ]}
        >
          <Ionicons
            name="bulb"
            size={20}
            color={isDark ? '#F59E0B' : '#D97706'}
          />
          <Text style={[styles.tipText, { color: isDark ? '#D1D5DB' : '#4B5563' }]}>
            每种AI能力都在不断学习和进化，为您提供更好的体验
          </Text>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  headerRight: {
    marginLeft: 16,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -6,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  cardsContainer: {
    paddingTop: 8,
  },
  cardContainer: {
    marginBottom: 24,
  },
  capabilityCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  activeCard: {
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  statsText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    marginHorizontal: -4,
  },
  featureTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    margin: 4,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  enterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  enterButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  decorativeCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  bottomTip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12,
  },
  bottomSpacing: {
    height: 20,
  },
});