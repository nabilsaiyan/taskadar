import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, type } from '@/theme/theme';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.container}>
        <View style={styles.icon}>
          <Ionicons name="compass-outline" size={34} color={colors.primary} />
        </View>
        <Text style={styles.title}>This page took a wrong turn</Text>
        <Text style={styles.text}>The screen you’re looking for doesn’t exist.</Text>
        <Link href="/" style={styles.link}>
          Go back home
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
    gap: spacing.md,
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...type.h2, color: colors.ink, textAlign: 'center' },
  text: { ...type.body, color: colors.textMuted, textAlign: 'center' },
  link: {
    ...type.bodyStrong,
    color: colors.white,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
});
