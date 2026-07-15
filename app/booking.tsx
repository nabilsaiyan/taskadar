import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { getProvider } from '@/services/api';
import type { Provider } from '@/data/types';
import { colors, radii, shadows, spacing, type } from '@/theme/theme';

export default function BookingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, q } = useLocalSearchParams<{ id: string; q?: string }>();
  const query = typeof q === 'string' ? q : '';
  const [provider, setProvider] = useState<Provider | null>(null);

  useEffect(() => {
    getProvider(String(id)).then((p) => setProvider(p ?? null));
  }, [id]);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        <SuccessCheck />

        <Animated.Text entering={FadeInDown.delay(300)} style={styles.title}>
          Request sent!
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(360)} style={styles.subtitle}>
          {provider
            ? `Your request has been sent to ${provider.name}. They typically ${provider.responseTime.toLowerCase()}.`
            : 'Your request has been sent.'}
        </Animated.Text>

        {/* Matched provider card */}
        {provider && (
          <Animated.View entering={FadeInDown.delay(420).springify().damping(18)} style={styles.card}>
            <Avatar name={provider.name} category={provider.category} image={provider.image} size={54} rounded={false} />
            <View style={styles.cardText}>
              <Text style={styles.cardName}>{provider.name}</Text>
              <Text style={styles.cardTagline} numberOfLines={1}>
                {provider.tagline}
              </Text>
            </View>
            <View style={styles.sentBadge}>
              <Ionicons name="paper-plane" size={14} color={colors.success} />
            </View>
          </Animated.View>
        )}

        {/* AI-matching recap — reinforces the narrative */}
        {query.length > 0 && (
          <Animated.View entering={FadeInDown.delay(480).springify().damping(18)} style={styles.recap}>
            <Text style={styles.recapLabel}>THE AI MATCH</Text>
            <View style={styles.recapRow}>
              <View style={styles.recapIcon}>
                <Ionicons name="chatbubble-ellipses" size={15} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.recapCaption}>You asked</Text>
                <Text style={styles.recapText}>“{query}”</Text>
              </View>
            </View>
            <View style={styles.recapConnector}>
              <Ionicons name="arrow-down" size={16} color={colors.textFaint} />
            </View>
            <View style={styles.recapRow}>
              <View style={[styles.recapIcon, styles.recapIconAi]}>
                <Ionicons name="sparkles" size={15} color={colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.recapCaption}>Taskadar AI matched you with</Text>
                <Text style={styles.recapText}>
                  {provider ? `${provider.name} · ${provider.category}` : '—'}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Next steps */}
        <Animated.View entering={FadeInDown.delay(540).springify().damping(18)} style={styles.next}>
          <Text style={styles.nextTitle}>What happens next</Text>
          {[
            'The provider reviews your request and confirms availability',
            'You’ll get a message to agree timing and details',
            'Meet, get it done, and leave a review',
          ].map((t, i) => (
            <View key={i} style={styles.nextRow}>
              <View style={styles.nextNum}>
                <Text style={styles.nextNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.nextText}>{t}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600)} style={styles.actions}>
          <Button label="Back to home" icon="home-outline" onPress={() => router.replace('/')} />
          {provider && (
            <Button
              label="View provider again"
              variant="secondary"
              onPress={() => router.replace({ pathname: '/provider/[id]', params: { id: provider.id, q: query } })}
            />
          )}
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

function SuccessCheck() {
  const scale = useSharedValue(0);
  const ring = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withDelay(120, withSpring(1.15, { damping: 9, stiffness: 140 })),
      withSpring(1, { damping: 12 }),
    );
    ring.value = withDelay(120, withTiming(1, { duration: 600 }));
  }, []);

  const checkStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.6 + ring.value * 0.9 }],
    opacity: (1 - ring.value) * 0.5,
  }));

  return (
    <View style={styles.checkWrap}>
      <Animated.View style={[styles.checkRing, ringStyle]} />
      <Animated.View style={[styles.check, checkStyle]}>
        <Ionicons name="checkmark" size={44} color={colors.white} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.lg, alignItems: 'center', gap: spacing.lg },

  checkWrap: { width: 110, height: 110, alignItems: 'center', justifyContent: 'center' },
  checkRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 999,
    backgroundColor: colors.success,
  },
  check: {
    width: 84,
    height: 84,
    borderRadius: 999,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 12px 28px rgba(34,160,107,0.4)',
  },
  title: { ...type.h1, color: colors.ink, textAlign: 'center' },
  subtitle: { ...type.body, color: colors.textMuted, textAlign: 'center', maxWidth: 360, lineHeight: 22 },

  card: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardText: { flex: 1 },
  cardName: { ...type.h3, color: colors.ink },
  cardTagline: { ...type.small, color: colors.textMuted, marginTop: 1 },
  sentBadge: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  recap: {
    alignSelf: 'stretch',
    backgroundColor: colors.primaryTint,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    gap: spacing.sm,
  },
  recapLabel: { ...type.tiny, color: colors.primaryDark, letterSpacing: 1, marginBottom: 2 },
  recapRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  recapIcon: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recapIconAi: { backgroundColor: colors.primary },
  recapCaption: { ...type.tiny, color: colors.textMuted, fontWeight: '600' },
  recapText: { ...type.bodyStrong, color: colors.ink },
  recapConnector: { paddingLeft: 8 },

  next: { alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.sm },
  nextTitle: { ...type.h3, color: colors.ink },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  nextNum: {
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextNumText: { ...type.small, color: colors.primaryDark, fontWeight: '800' },
  nextText: { ...type.body, color: colors.text, flex: 1 },

  actions: { alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.sm },
});
