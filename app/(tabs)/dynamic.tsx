import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DynamicScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#FAFAFA' }]}>
      <Text style={[styles.title, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
        动态
      </Text>
      <Text style={[styles.subtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
        关注用户的最新动态将在这里显示
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