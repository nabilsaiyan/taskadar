import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PressableScale } from '@/components/PressableScale';
import { CONTENT_MAX_WIDTH } from '@/components/Screen';
import { colors, shadows, spacing, type } from '@/theme/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Find',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'sparkles' : 'sparkles-outline'} size={23} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: 'Provide',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'briefcase' : 'briefcase-outline'} size={23} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

/**
 * Custom bottom tab bar. The surface spans the full width (so the top border
 * and shadow reach the screen edges), but the tab items sit in a centered,
 * width-capped row that lines up with the app's content column. Items are
 * vertically centered and the bottom safe-area inset is respected on every
 * platform (web has no inset, so nothing extra is added there).
 */
function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      <View style={styles.inner}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const color = focused ? colors.primary : colors.textFaint;
          const label = (options.title ?? route.name) as string;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <PressableScale
              key={route.key}
              onPress={onPress}
              activeScale={0.9}
              hover={false}
              style={styles.item}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={label}
            >
              {options.tabBarIcon?.({ focused, color, size: 23 })}
              <Text style={[styles.label, { color }]}>{label}</Text>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // The whole bar is capped to the content width and centered, so on web/desktop
  // the app reads like a phone: a centered column with a matching bottom bar.
  bar: {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    alignItems: 'center',
    ...shadows.md,
  },
  inner: {
    width: '100%',
    flexDirection: 'row',
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 6,
  },
  label: { ...type.tiny, fontWeight: '700' },
});
