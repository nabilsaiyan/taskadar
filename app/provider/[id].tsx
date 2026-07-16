import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen, CONTENT_MAX_WIDTH } from '@/components/Screen';
import { ABSOLUTE_FILL } from '@/theme/webStyles';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/Button';
import { Stars } from '@/components/Stars';
import { CategoryBadge } from '@/components/CategoryBadge';
import { getProvider } from '@/services/api';
import { categoryIcon } from '@/data/categories';
import type { Provider } from '@/data/types';
import { categoryGradient, colors, gradients, radii, shadows, spacing, type } from '@/theme/theme';

export default function ProviderScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, q } = useLocalSearchParams<{ id: string; q?: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);

  useEffect(() => {
    getProvider(String(id)).then((p) => setProvider(p ?? null));
  }, [id]);

  if (!provider) {
    return (
      <Screen>
        <AppHeader title="Profile" />
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading…</Text>
        </View>
      </Screen>
    );
  }

  const goBook = () =>
    router.push({
      pathname: '/booking',
      params: { id: provider.id, q: typeof q === 'string' ? q : '' },
    });

  return (
    <Screen>
      <AppHeader title="Provider" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 110 }]}
      >
        {/* Hero image (category-gradient fallback keeps text readable when the
            placeholder photo is missing/offline, e.g. user-created listings). */}
        <Animated.View entering={FadeInDown.springify().damping(18)} style={styles.hero}>
          <LinearGradient
            colors={categoryGradient(provider.category)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={ABSOLUTE_FILL as any}
          />
          {provider.image ? (
            <Image source={{ uri: provider.image }} style={styles.heroImg} contentFit="cover" transition={400} />
          ) : (
            <View style={styles.heroIconWrap} pointerEvents="none">
              <Ionicons name={categoryIcon(provider.category)} size={132} color="rgba(255,255,255,0.22)" />
            </View>
          )}
          <LinearGradient colors={gradients.scrim} style={ABSOLUTE_FILL as any} />
          <View style={styles.heroContent}>
            <View style={styles.heroTop}>
              <CategoryBadge category={provider.category} />
              {provider.verified && (
                <View style={styles.verifiedPill}>
                  <Ionicons name="shield-checkmark" size={12} color={colors.white} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
            <Text style={styles.heroName}>{provider.name}</Text>
            <Text style={styles.heroTagline}>{provider.tagline}</Text>
          </View>
        </Animated.View>

        {/* Quick facts */}
        <Animated.View entering={FadeInDown.delay(60).springify().damping(18)} style={styles.factsRow}>
          <Fact icon="star" iconColor={colors.gold} value={provider.rating.toFixed(1)} label={`${provider.reviewCount} reviews`} />
          <View style={styles.factDivider} />
          <Fact icon="location-outline" value={provider.location.split('•')[0].trim()} label="Location" />
          <View style={styles.factDivider} />
          <Fact icon="flash-outline" value={provider.responseTime.replace('Replies in ', '')} label="Response" />
        </Animated.View>

        {/* About */}
        <Section title="About" delay={120}>
          <Text style={styles.body}>{provider.description}</Text>
          <View style={styles.priceRangeRow}>
            <Ionicons name="pricetag-outline" size={16} color={colors.primary} />
            <Text style={styles.priceRangeText}>Typical price range: {provider.priceRange}</Text>
          </View>
        </Section>

        {/* Services */}
        <Section title="Services & pricing" delay={180}>
          <View style={styles.services}>
            {provider.services.map((s) => (
              <View key={s.id} style={styles.serviceRow}>
                <View style={styles.serviceLeft}>
                  <Text style={styles.serviceTitle}>{s.title}</Text>
                  {s.description && <Text style={styles.serviceDesc}>{s.description}</Text>}
                </View>
                <View style={styles.servicePrice}>
                  <Text style={styles.servicePriceValue}>${s.price}</Text>
                  <Text style={styles.servicePriceUnit}>{s.unit}</Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        {/* Reviews */}
        <Section title={`Reviews (${provider.reviewCount})`} delay={240}>
          <View style={styles.reviews}>
            {provider.reviews.map((r) => (
              <View key={r.id} style={styles.reviewCard}>
                <View style={styles.reviewHead}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewInitial}>{r.author[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewAuthor}>{r.author}</Text>
                    <Text style={styles.reviewDate}>{r.date}</Text>
                  </View>
                  <Stars rating={r.rating} showNumber={false} size={13} />
                </View>
                <Text style={styles.reviewText}>{r.text}</Text>
              </View>
            ))}
          </View>
        </Section>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.footerInner}>
          <View style={styles.footerPrice}>
            <Text style={styles.footerFrom}>From</Text>
            <Text style={styles.footerPriceValue}>${Math.min(...provider.services.map((s) => s.price))}</Text>
          </View>
          <Button label={`Book ${provider.name.split(' ')[0]}`} icon="calendar-outline" onPress={goBook} style={{ flex: 1 }} />
        </View>
      </View>
    </Screen>
  );
}

function Fact({
  icon,
  value,
  label,
  iconColor = colors.primary,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  iconColor?: string;
}) {
  return (
    <View style={styles.fact}>
      <Ionicons name={icon} size={17} color={iconColor} />
      <Text style={styles.factValue} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.factLabel}>{label}</Text>
    </View>
  );
}

function Section({ title, delay, children }: { title: string; delay: number; children: React.ReactNode }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify().damping(18)} style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.xl },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { ...type.body, color: colors.textMuted },

  hero: { borderRadius: radii.xl, overflow: 'hidden', height: 230, ...shadows.md },
  heroImg: { ...ABSOLUTE_FILL },
  heroIconWrap: { ...ABSOLUTE_FILL, alignItems: 'center', justifyContent: 'center' },
  heroContent: { flex: 1, justifyContent: 'flex-end', padding: spacing.xl },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  verifiedText: { ...type.tiny, color: colors.white },
  heroName: { ...type.h1, color: colors.white, fontWeight: '800' },
  heroTagline: { ...type.body, color: 'rgba(255,255,255,0.92)', marginTop: 2 },

  factsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  fact: { flex: 1, alignItems: 'center', gap: 3, paddingHorizontal: 4 },
  factDivider: { width: 1, height: 38, backgroundColor: colors.border },
  factValue: { ...type.bodyStrong, color: colors.ink, fontWeight: '700' },
  factLabel: { ...type.tiny, color: colors.textMuted, fontWeight: '500' },

  section: { gap: spacing.md },
  sectionTitle: { ...type.h2, color: colors.ink },
  body: { ...type.body, color: colors.text, lineHeight: 23 },
  priceRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryTint,
    padding: spacing.md,
    borderRadius: radii.md,
  },
  priceRangeText: { ...type.small, color: colors.primaryDark, fontWeight: '600' },

  services: { gap: spacing.sm },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  serviceLeft: { flex: 1, gap: 2 },
  serviceTitle: { ...type.bodyStrong, color: colors.ink },
  serviceDesc: { ...type.small, color: colors.textMuted },
  servicePrice: { alignItems: 'flex-end' },
  servicePriceValue: { ...type.h3, color: colors.primary, fontWeight: '800' },
  servicePriceUnit: { ...type.tiny, color: colors.textMuted, fontWeight: '500' },

  reviews: { gap: spacing.md },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  reviewHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewInitial: { ...type.bodyStrong, color: colors.accent, fontWeight: '800' },
  reviewAuthor: { ...type.bodyStrong, color: colors.ink },
  reviewDate: { ...type.tiny, color: colors.textMuted, fontWeight: '500' },
  reviewText: { ...type.body, color: colors.text, lineHeight: 21 },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    ...shadows.lg,
  },
  footerInner: {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  footerPrice: { alignItems: 'flex-start' },
  footerFrom: { ...type.tiny, color: colors.textMuted, fontWeight: '500' },
  footerPriceValue: { ...type.h2, color: colors.ink, fontWeight: '800' },
});
