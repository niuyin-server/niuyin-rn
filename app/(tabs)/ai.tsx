import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AIScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#FAFAFA' }]}>
      <Ionicons 
        name="sparkles" 
        size={64} 
        color="#3B82F6" 
        style={styles.icon}
      />
      <Text style={[styles.title, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
        AI 学习助手
      </Text>
      <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
        智能推荐学习内容，个性化学习路径规划
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});