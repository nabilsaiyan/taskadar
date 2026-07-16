import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PressableScale } from './PressableScale';
import { Avatar } from './Avatar';
import { CategoryBadge } from './CategoryBadge';
import { Stars } from './Stars';
import type { Provider } from '@/data/types';
import { categoryIcon } from '@/data/categories';
import { colors, radii, shadows, spacing, type } from '@/theme/theme';

interface Props {
  provider: Provider;
  onPress?: () => void;
  /** Index used to stagger the entrance animation. */
  index?: number;
  /** Highlight the first, best match. */
  topMatch?: boolean;
}

function availabilityLabel(availability: string[]): string | null {
  if (availability.includes('today')) return 'Available today';
  if (availability.includes('tomorrow')) return 'Available tomorrow';
  if (availability.includes('weekend')) return 'Free this weekend';
  return null;
}

export function ProviderCard({ provider, onPress, index = 0, topMatch = false }: Props) {
  const availability = availabilityLabel(provider.availability);

  return (
    <Animated.View entering={FadeInDown.delay(index * 70).springify().damping(18)}>
      <PressableScale onPress={onPress} activeScale={0.985} style={[styles.card, topMatch && styles.cardTop]}>
        {topMatch && (
          <View style={styles.topRibbon}>
            <Ionicons name="sparkles" size={11} color={colors.white} />
            <Text style={styles.topRibbonText}>TOP MATCH</Text>
          </View>
        )}

        <View style={styles.header}>
          <Avatar
            name={provider.name}
            category={provider.category}
            image={provider.image}
            icon={categoryIcon(provider.category)}
            size={60}
            rounded={false}
          />
          <View style={styles.headerText}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {provider.name}
              </Text>
              {provider.verified && (
                <Ionicons name="checkmark-circle" size={16} color={colors.primary} style={{ marginLeft: 4 }} />
              )}
            </View>
            <Text style={styles.tagline} numberOfLines={1}>
              {provider.tagline}
            </Text>
            <View style={styles.metaRow}>
              <Stars rating={provider.rating} reviewCount={provider.reviewCount} size={13} />
            </View>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {provider.description}
        </Text>

        <View style={styles.pillRow}>
          <CategoryBadge category={provider.category} />
          {availability && (
            <View style={styles.availPill}>
              <View style={styles.availDot} />
              <Text style={styles.availText}>{availability}</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textMuted} />
            <Text style={styles.location} numberOfLines={1}>
              {provider.location}
            </Text>
          </View>
          <View style={styles.priceWrap}>
            <Text style={styles.price}>{provider.priceRange}</Text>
            <View style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>View</Text>
              <Ionicons name="arrow-forward" size={13} color={colors.primary} />
            </View>
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardTop: { borderColor: colors.primarySoft, borderWidth: 1.5, ...shadows.md },
  topRibbon: {
    position: 'absolute',
    top: 0,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: radii.sm,
    borderBottomRightRadius: radii.sm,
  },
  topRibbonText: { ...type.tiny, color: colors.white, letterSpacing: 0.6 },

  header: { flexDirection: 'row', alignItems: 'center' },
  headerText: { flex: 1, marginLeft: spacing.md },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { ...type.h3, color: colors.ink, flexShrink: 1 },
  tagline: { ...type.small, color: colors.textMuted, marginTop: 1 },
  metaRow: { marginTop: 5 },
  description: { ...type.body, color: colors.text, marginTop: spacing.md },

  pillRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  availPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.successSoft,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  availDot: { width: 6, height: 6, borderRadius: 999, backgroundColor: colors.success },
  availText: { ...type.tiny, color: colors.success },

  divider: { height: 1, backgroundColor: colors.border, marginTop: spacing.lg },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  location: { ...type.small, color: colors.textMuted, flexShrink: 1 },
  priceWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginLeft: spacing.md },
  price: { ...type.bodyStrong, color: colors.ink, fontWeight: '800' },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.pill,
  },
  viewBtnText: { ...type.small, color: colors.primaryDark, fontWeight: '700' },
});
