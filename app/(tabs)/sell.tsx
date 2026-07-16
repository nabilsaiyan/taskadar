import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { PressableScale } from '@/components/PressableScale';
import { Avatar } from '@/components/Avatar';
import { CategoryBadge } from '@/components/CategoryBadge';
import { addProviderListing } from '@/services/api';
import { categoryIcon } from '@/data/categories';
import { useProviders } from '@/store/providerStore';
import type { Provider } from '@/data/types';
import { categoryColors, colors, radii, shadows, spacing, type } from '@/theme/theme';
import { NO_OUTLINE } from '@/theme/webStyles';

const CATEGORY_OPTIONS = Object.keys(categoryColors);

export default function SellScreen() {
  const insets = useSafeAreaInsets();
  const allProviders = useProviders();
  const myListings = useMemo(() => allProviders.filter((p) => p.isUserCreated), [allProviders]);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const valid =
    name.trim().length > 1 &&
    category.length > 0 &&
    description.trim().length > 4 &&
    Number(price) > 0;

  const reset = () => {
    setName('');
    setCategory('');
    setDescription('');
    setPrice('');
  };

  const submit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    const priceNum = Number(price);
    const newProvider: Provider = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      tagline: `New on Taskadar · ${category}`,
      category,
      tags: [
        category.toLowerCase(),
        ...description
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter((w) => w.length > 3),
      ],
      description: description.trim(),
      priceRange: `$${priceNum} - $${priceNum * 3}`,
      rating: 5.0,
      reviewCount: 0,
      image: '',
      location: 'Your area',
      responseTime: 'New provider',
      verified: false,
      availability: ['today', 'tomorrow', 'weekend'],
      services: [
        { id: `svc-${Date.now()}`, title: `${category} service`, price: priceNum, unit: 'flat', description: description.trim() },
      ],
      reviews: [],
      isUserCreated: true,
    };
    await addProviderListing(newProvider);
    setSubmitting(false);
    setJustAdded(true);
    reset();
    setTimeout(() => setJustAdded(false), 2600);
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + spacing.lg, paddingBottom: spacing.xxxl },
          ]}
        >
          {/* Intro */}
          <Animated.View entering={FadeInDown.springify().damping(18)} style={styles.intro}>
            <View style={styles.introIcon}>
              <Ionicons name="briefcase" size={22} color={colors.white} />
            </View>
            <Text style={styles.introTitle}>Grow your business</Text>
            <Text style={styles.introText}>
              If you’re a service provider, list what you offer and get matched to nearby customers
              through natural-language search.
            </Text>
          </Animated.View>

          {justAdded && (
            <Animated.View entering={FadeIn} style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.successText}>Listing published! It’s now searchable on the Find tab.</Text>
            </Animated.View>
          )}

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(80).springify().damping(18)} style={styles.form}>
            <Field label="Business / your name">
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Green Thumb Gardening"
                placeholderTextColor={colors.textFaint}
                style={[styles.input, NO_OUTLINE]}
              />
            </Field>

            <Field label="Category">
              <View style={styles.catWrap}>
                {CATEGORY_OPTIONS.map((c) => {
                  const selected = category === c;
                  return (
                    <Animated.View key={c} layout={LinearTransition.springify()}>
                      <PressableScale
                        onPress={() => setCategory(c)}
                        activeScale={0.94}
                        style={[styles.catChip, selected && styles.catChipSelected]}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                      >
                        <Text style={[styles.catChipText, selected && styles.catChipTextSelected]}>{c}</Text>
                      </PressableScale>
                    </Animated.View>
                  );
                })}
              </View>
            </Field>

            <Field label="Description">
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the service you offer, your experience and what makes you great…"
                placeholderTextColor={colors.textFaint}
                style={[styles.input, styles.textarea, NO_OUTLINE]}
                multiline
              />
            </Field>

            <Field label="Starting price (USD)">
              <View style={styles.priceInputWrap}>
                <Text style={styles.dollar}>$</Text>
                <TextInput
                  value={price}
                  onChangeText={(t) => setPrice(t.replace(/[^0-9]/g, ''))}
                  placeholder="40"
                  placeholderTextColor={colors.textFaint}
                  style={[styles.input, styles.priceInput, NO_OUTLINE]}
                  keyboardType="number-pad"
                  inputMode="numeric"
                />
              </View>
            </Field>

            <Button
              label="Publish listing"
              icon="add-circle-outline"
              onPress={submit}
              loading={submitting}
              disabled={!valid}
            />
          </Animated.View>

          {/* My listings */}
          <Animated.View entering={FadeInDown.delay(160).springify().damping(18)} style={styles.myBlock}>
            <Text style={styles.myTitle}>
              Your listings {myListings.length > 0 && `(${myListings.length})`}
            </Text>
            {myListings.length === 0 ? (
              <View style={styles.emptyListings}>
                <Ionicons name="documents-outline" size={26} color={colors.textFaint} />
                <Text style={styles.emptyListingsText}>
                  Your published listings will appear here — and instantly become searchable for buyers.
                </Text>
              </View>
            ) : (
              <View style={{ gap: spacing.md }}>
                {myListings.map((p) => (
                  <Animated.View key={p.id} entering={FadeIn} layout={LinearTransition.springify()} style={styles.listingCard}>
                    <Avatar name={p.name} category={p.category} icon={categoryIcon(p.category)} size={46} rounded={false} />
                    <View style={styles.listingText}>
                      <Text style={styles.listingName} numberOfLines={1}>
                        {p.name}
                      </Text>
                      <CategoryBadge category={p.category} style={{ marginTop: 4 }} />
                    </View>
                    <View style={styles.listingPrice}>
                      <Text style={styles.listingPriceValue}>${p.services[0]?.price}</Text>
                      <View style={styles.liveDot}>
                        <View style={styles.liveDotInner} />
                        <Text style={styles.liveText}>Live</Text>
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: spacing.lg, gap: spacing.xl },

  intro: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  introIcon: {
    width: 46,
    height: 46,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primary,
    marginBottom: spacing.xs,
  },
  introTitle: { ...type.h1, color: colors.ink, fontWeight: '800' },
  introText: { ...type.body, color: colors.text, lineHeight: 22 },

  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.successSoft,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  successText: { ...type.small, color: colors.success, fontWeight: '600', flex: 1 },

  form: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  field: { gap: spacing.sm },
  fieldLabel: { ...type.bodyStrong, color: colors.ink },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    ...type.body,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textarea: { minHeight: 96, textAlignVertical: 'top', paddingTop: 12 },

  catWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  catChip: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
  },
  catChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  catChipText: { ...type.small, color: colors.text, fontWeight: '600' },
  catChipTextSelected: { color: colors.white },

  priceInputWrap: { flexDirection: 'row', alignItems: 'center' },
  dollar: {
    ...type.h3,
    color: colors.textMuted,
    position: 'absolute',
    left: spacing.md,
    zIndex: 1,
  },
  priceInput: { flex: 1, paddingLeft: spacing.xxl },

  myBlock: { gap: spacing.md },
  myTitle: { ...type.h2, color: colors.ink },
  emptyListings: {
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
  },
  emptyListingsText: { ...type.small, color: colors.textMuted, textAlign: 'center', maxWidth: 320 },

  listingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  listingText: { flex: 1 },
  listingName: { ...type.bodyStrong, color: colors.ink },
  listingPrice: { alignItems: 'flex-end', gap: 4 },
  listingPriceValue: { ...type.h3, color: colors.primary, fontWeight: '800' },
  liveDot: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveDotInner: { width: 7, height: 7, borderRadius: 999, backgroundColor: colors.success },
  liveText: { ...type.tiny, color: colors.success },
});
