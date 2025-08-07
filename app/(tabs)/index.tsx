import WorkCard from '@/components/WorkCard';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Work } from '@/types';
import { fetchWorks } from '@/utils/mockData';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 初始加载数据
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const data = await fetchWorks(1);
      setWorks(data);
      setPage(1);
      setHasMore(true);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 下拉刷新
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await fetchWorks(1);
      setWorks(data);
      setPage(1);
      setHasMore(true);
    } catch (error) {
      console.error('刷新失败:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // 加载更多
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      console.log('加载更多数据，页码:', page + 1); // 添加日志便于调试
      
      const nextPage = page + 1;
      const newData = await fetchWorks(nextPage);
      
      if (newData.length === 0) {
        console.log('没有更多数据了');
        setHasMore(false);
      } else {
        console.log(`成功加载${newData.length}条新数据`);
        setWorks(prev => [...prev, ...newData]);
        setPage(nextPage);
        // 模拟最多加载5页数据（每页10条）
        if (nextPage >= 5) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('加载更多失败:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // 点击作品卡片
  const handleWorkPress = (work: Work) => {
    router.push({
      pathname: '/details/[id]',
      params: { id: work.id }
    });
  };

  // 创建瀑布流布局
  const createWaterfallLayout = () => {
    const leftColumn: Work[] = [];
    const rightColumn: Work[] = [];
    
    works.forEach((work, index) => {
      if (index % 2 === 0) {
        leftColumn.push(work);
      } else {
        rightColumn.push(work);
      }
    });
    
    return { leftColumn, rightColumn };
  };

  const { leftColumn, rightColumn } = createWaterfallLayout();

  // 渲染单列
  const renderColumn = (columnWorks: Work[]) => (
    <View style={styles.column}>
      {columnWorks.map((work) => (
        <View key={work.id}>
          <WorkCard 
            work={work} 
            onPress={() => handleWorkPress(work)}
          />
        </View>
      ))}
    </View>
  );

  // 渲染加载更多指示器
  const renderFooter = () => {
    if (works.length === 0) return null;
    
    if (loadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text style={[styles.footerText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            加载更多...
          </Text>
        </View>
      );
    }
    
    if (!hasMore) {
      return (
        <View style={styles.footerLoader}>
          <Text style={[styles.footerText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            暂无更多内容
          </Text>
        </View>
      );
    }
    
    return null;
  };

  // 渲染空状态
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="document-text-outline" 
        size={64} 
        color={isDark ? '#4B5563' : '#9CA3AF'} 
      />
      <Text style={[styles.emptyText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
        暂无内容
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#FAFAFA' }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
            芝士学爆
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={[styles.loadingText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
            加载中...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#111827' : '#FAFAFA' }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
          芝士学爆
        </Text>
        <Ionicons 
          name="search" 
          size={24} 
          color={isDark ? '#9CA3AF' : '#6B7280'} 
        />
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          // 减小触发阈值，提前加载更多内容
          const paddingToBottom = 100;
          if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            loadMore();
          }
        }}
        scrollEventThrottle={100} // 提高滚动事件触发频率
      >
        {works.length === 0 ? (
          renderEmpty()
        ) : (
          <View style={styles.waterfallContainer}>
            {renderColumn(leftColumn)}
            {renderColumn(rightColumn)}
          </View>
        )}
        {renderFooter()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.3)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  listContent: {
    padding: 8,
  },
  waterfallContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    paddingHorizontal: 4,
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
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
});
