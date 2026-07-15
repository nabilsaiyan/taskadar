import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, type } from '@/theme/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.bar,
        tabBarItemStyle: styles.item,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Find',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'sparkles' : 'sparkles-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: 'Provide',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'briefcase' : 'briefcase-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({ name, color }: { name: keyof typeof Ionicons.glyphMap; color: import('react-native').ColorValue }) {
  return (
    <View style={styles.icon}>
      <Ionicons name={name} size={23} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    height: Platform.select({ ios: 86, default: 66 }),
    paddingTop: 8,
    ...shadows.md,
  },
  item: { paddingTop: 4 },
  label: { ...type.tiny, fontWeight: '700', marginTop: 2 },
  icon: { alignItems: 'center', justifyContent: 'center' },
});
