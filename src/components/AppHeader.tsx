import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PressableScale } from './PressableScale';
import { CONTENT_MAX_WIDTH } from './Screen';
import { colors, radii, spacing, type } from '@/theme/theme';

interface Props {
  title?: string;
  showBack?: boolean;
  transparent?: boolean;
  right?: React.ReactNode;
}

/** Consistent, safe-area-aware header used across pushed screens. */
export function AppHeader({ title, showBack = true, transparent = false, right }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[
        styles.wrap,
        { paddingTop: insets.top + spacing.sm },
        !transparent && styles.solid,
      ]}
    >
      <View style={styles.inner}>
        <View style={styles.side}>
          {showBack && (
            <PressableScale
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
              activeScale={0.9}
              style={styles.backBtn}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={22} color={colors.ink} />
            </PressableScale>
          )}
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={[styles.side, styles.sideRight]}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, alignItems: 'center' },
  solid: {
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  inner: {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  side: { width: 60, justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { ...type.h3, color: colors.ink, flex: 1, textAlign: 'center' },
});
