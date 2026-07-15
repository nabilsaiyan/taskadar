import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { PressableScale } from '@/components/PressableScale';
import { CATEGORIES } from '@/data/providers';
import { useApiKey } from '@/store/apiKeyStore';
import { AI_PROVIDERS } from '@/services/aiConfig';
import { categoryColors, colors, gradients, radii, shadows, spacing, type } from '@/theme/theme';
import { NO_OUTLINE } from '@/theme/webStyles';

const EXAMPLES: { label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: 'Fix a leaking sink', icon: 'water-outline' },
  { label: 'Birthday cake for tomorrow', icon: 'gift-outline' },
  { label: 'Weekend personal trainer', icon: 'barbell-outline' },
  { label: 'Deep clean my apartment', icon: 'sparkles-outline' },
  { label: 'Dog walker for the weekend', icon: 'paw-outline' },
  { label: 'Assemble my flat-pack desk', icon: 'construct-outline' },
];

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Plumbing: 'water',
  'Baking & Catering': 'restaurant',
  Tutoring: 'school',
  'Personal Training': 'barbell',
  Cleaning: 'sparkles',
  'Pet Sitting': 'paw',
  Photography: 'camera',
  Handyman: 'construct',
  'Beauty & Hair': 'cut',
  Gardening: 'leaf',
  Moving: 'cube',
  Electrician: 'flash',
};

const STATS = [
  { value: '1,200+', label: 'Local pros' },
  { value: '4.8★', label: 'Avg rating' },
  { value: '10 min', label: 'Avg reply' },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { hasKey, provider } = useApiKey();
  const [query, setQuery] = useState('');

  const submit = (text?: string) => {
    const q = (text ?? query).trim();
    if (!q) return;
    Keyboard.dismiss();
    router.push({ pathname: '/results', params: { q } });
  };

  return (
    <Screen>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxxl },
        ]}
      >
        {/* Brand row */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.brandRow}>
          <LinearGradient colors={gradients.brandMark} style={styles.logoMark}>
            <Ionicons name="sparkles" size={16} color={colors.white} />
          </LinearGradient>
          <Text style={styles.brand}>Taskadar</Text>
          <PressableScale
            onPress={() => router.push('/settings')}
            activeScale={0.92}
            style={[styles.aiPill, hasKey && styles.aiPillActive]}
            accessibilityLabel="AI provider settings"
          >
            <Ionicons
              name={hasKey ? 'sparkles' : 'add-circle-outline'}
              size={12}
              color={hasKey ? colors.success : colors.primaryDark}
            />
            <Text style={[styles.aiPillText, hasKey && styles.aiPillTextActive]}>
              {hasKey ? AI_PROVIDERS[provider].short : 'Connect AI'}
            </Text>
          </PressableScale>
        </Animated.View>

        {/* Hero */}
        <Animated.View entering={FadeInDown.delay(80).springify().damping(18)}>
          <LinearGradient
            colors={gradients.brand}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <FloatingOrb style={styles.heroGlowA} duration={5200} range={14} />
            <FloatingOrb style={styles.heroGlowB} duration={6400} range={18} />
            <Text style={styles.heroKicker}>LOCAL SERVICES, MADE SIMPLE</Text>
            <Text style={styles.heroTitle}>What do you{'\n'}need done?</Text>
            <Text style={styles.heroSubtitle}>
              Describe your task in your own words — our AI finds the right local pro for the job.
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Search card */}
        <Animated.View
          entering={FadeInDown.delay(160).springify().damping(18)}
          style={styles.searchCard}
        >
          <View style={styles.inputRow}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.primary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="e.g. I need a birthday cake delivered tomorrow"
              placeholderTextColor={colors.textFaint}
              style={[styles.input, NO_OUTLINE]}
              multiline
              returnKeyType="search"
              onSubmitEditing={() => submit()}
              blurOnSubmit
            />
            {query.length > 0 && (
              <PressableScale onPress={() => setQuery('')} activeScale={0.85} hover={false} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={19} color={colors.textFaint} />
              </PressableScale>
            )}
          </View>
          <Button
            label="Find providers"
            icon="search"
            onPress={() => submit()}
            disabled={query.trim().length === 0}
          />
        </Animated.View>

        {/* Example prompts */}
        <Animated.View entering={FadeInDown.delay(240).springify().damping(18)}>
          <Text style={styles.sectionLabel}>Try one of these</Text>
          <View style={styles.chipWrap}>
            {EXAMPLES.map((ex) => (
              <Chip key={ex.label} label={ex.label} icon={ex.icon} onPress={() => submit(ex.label)} />
            ))}
          </View>
        </Animated.View>

        {/* Browse by category */}
        <Animated.View entering={FadeInDown.delay(300).springify().damping(18)}>
          <Text style={styles.sectionLabel}>Browse by category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catRow}
          >
            {CATEGORIES.map((cat) => {
              const palette = categoryColors[cat] ?? { bg: colors.primarySoft, fg: colors.primary };
              return (
                <PressableScale
                  key={cat}
                  onPress={() => submit(cat)}
                  activeScale={0.94}
                  style={styles.catCard}
                >
                  <View style={[styles.catIcon, { backgroundColor: palette.bg }]}>
                    <Ionicons name={CATEGORY_ICONS[cat] ?? 'briefcase'} size={22} color={palette.fg} />
                  </View>
                  <Text style={styles.catLabel} numberOfLines={2}>
                    {cat}
                  </Text>
                </PressableScale>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Trust stats */}
        <Animated.View entering={FadeInDown.delay(360).springify().damping(18)} style={styles.statsRow}>
          {STATS.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={styles.statDivider} />}
              <View style={styles.stat}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </Animated.View>

        {/* How it works */}
        <Animated.View entering={FadeInDown.delay(420).springify().damping(18)} style={styles.howCard}>
          <Text style={styles.howTitle}>How Taskadar works</Text>
          {[
            { icon: 'create-outline', text: 'Describe your task in plain language' },
            { icon: 'sparkles-outline', text: 'Our AI matches you with the best local pros' },
            { icon: 'checkmark-done-outline', text: 'Compare, book and get it done' },
          ].map((step, i) => (
            <View key={i} style={styles.howStep}>
              <View style={styles.howNum}>
                <Ionicons name={step.icon as any} size={17} color={colors.primary} />
              </View>
              <Text style={styles.howText}>{step.text}</Text>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

/** A slowly drifting decorative orb — gives the hero a living, premium feel. */
function FloatingOrb({ style, duration, range }: { style: any; duration: number; range: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: t.value * range }, { translateY: -t.value * range }],
  }));
  return <Animated.View style={[style, animatedStyle]} />;
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.lg, gap: spacing.xl },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoMark: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primary,
  },
  brand: { ...type.h2, color: colors.ink, fontWeight: '800', flex: 1 },
  aiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  aiPillActive: { backgroundColor: colors.successSoft },
  aiPillText: { ...type.tiny, color: colors.primaryDark },
  aiPillTextActive: { color: colors.success },

  hero: {
    borderRadius: radii.xl,
    padding: spacing.xxl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  heroGlowA: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  heroGlowB: {
    position: 'absolute',
    bottom: -60,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  heroKicker: {
    ...type.tiny,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
  },
  heroTitle: { ...type.display, color: colors.white, fontWeight: '800' },
  heroSubtitle: {
    ...type.body,
    color: 'rgba(255,255,255,0.94)',
    marginTop: spacing.md,
    maxWidth: 340,
  },

  searchCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
    marginTop: -spacing.xxxl,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    ...type.body,
    color: colors.ink,
    minHeight: 46,
    paddingTop: 2,
  },
  clearBtn: { paddingTop: 2 },

  sectionLabel: { ...type.bodyStrong, color: colors.ink, marginBottom: spacing.md },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },

  catRow: { gap: spacing.md, paddingRight: spacing.lg, paddingVertical: 2 },
  catCard: { width: 84, alignItems: 'center', gap: spacing.sm },
  catIcon: {
    width: 64,
    height: 64,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  catLabel: { ...type.tiny, color: colors.text, textAlign: 'center', fontWeight: '600' },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 34, backgroundColor: colors.border },
  statValue: { ...type.h3, color: colors.primary, fontWeight: '800' },
  statLabel: { ...type.small, color: colors.textMuted, marginTop: 2 },

  howCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: radii.lg,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  howTitle: { ...type.h3, color: colors.ink },
  howStep: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  howNum: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  howText: { ...type.body, color: colors.text, flex: 1 },
});
