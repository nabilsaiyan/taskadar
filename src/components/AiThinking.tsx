import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import { colors, radii, shadows, spacing, type } from '@/theme/theme';

const STEPS = [
  'Reading your request…',
  'Extracting what you need…',
  'Scanning local providers…',
  'Ranking the best matches…',
];

/** A friendly, animated "AI is thinking" state. Reanimated works on all platforms. */
export function AiThinking({ query }: { query: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Paced so all four steps surface before the ~850ms search resolves.
    const id = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 190);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.container}>
      <PulsingOrb />
      <Animated.Text entering={FadeIn} style={styles.title}>
        Finding your pros
      </Animated.Text>
      <Text style={styles.query} numberOfLines={2}>
        “{query}”
      </Text>

      <View style={styles.steps}>
        {STEPS.map((label, i) => (
          <View key={label} style={styles.stepRow}>
            <View style={[styles.stepDot, i <= step && styles.stepDotActive]}>
              {i < step ? (
                <Ionicons name="checkmark" size={12} color={colors.white} />
              ) : i === step ? (
                <BlinkDot />
              ) : null}
            </View>
            <Text style={[styles.stepText, i <= step && styles.stepTextActive]}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Skeleton placeholder cards */}
      <View style={styles.skeletons}>
        {[0, 1].map((i) => (
          <SkeletonCard key={i} delay={i * 200} />
        ))}
      </View>
    </View>
  );
}

function PulsingOrb() {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const glow = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
    rotate.value = withRepeat(withTiming(1, { duration: 3000, easing: Easing.linear }), -1);
    glow.value = withRepeat(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const orbStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value * 360}deg` }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.25 + glow.value * 0.35,
    transform: [{ scale: 1 + glow.value * 0.35 }],
  }));

  return (
    <View style={styles.orbWrap}>
      <Animated.View style={[styles.orbGlow, glowStyle]} />
      <Animated.View style={[styles.orbRing, ringStyle]} />
      <Animated.View style={[styles.orb, orbStyle]}>
        <Ionicons name="sparkles" size={30} color={colors.white} />
      </Animated.View>
    </View>
  );
}

function BlinkDot() {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.25, { duration: 500 }), -1, true);
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.blink, style]} />;
}

function SkeletonCard({ delay }: { delay: number }) {
  const shimmer = useSharedValue(0.5);
  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: shimmer.value }));

  return (
    <Animated.View entering={FadeIn.delay(delay)} style={styles.skeletonCard}>
      <Animated.View style={[styles.skelAvatar, style]} />
      <View style={styles.skelBody}>
        <Animated.View style={[styles.skelLine, { width: '55%' }, style]} />
        <Animated.View style={[styles.skelLine, { width: '80%' }, style]} />
        <Animated.View style={[styles.skelLine, { width: '40%' }, style]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.xxl },
  orbWrap: { width: 92, height: 92, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  orbGlow: {
    position: 'absolute',
    width: 92,
    height: 92,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  orbRing: {
    position: 'absolute',
    width: 92,
    height: 92,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: colors.primarySoft,
    borderTopColor: colors.primary,
  },
  orb: {
    width: 68,
    height: 68,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primary,
  },
  title: { ...type.h2, color: colors.ink },
  query: { ...type.body, color: colors.textMuted, fontStyle: 'italic', marginTop: 4, textAlign: 'center' },

  steps: { alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.xl, paddingHorizontal: spacing.sm },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  blink: { width: 7, height: 7, borderRadius: 999, backgroundColor: colors.white },
  stepText: { ...type.body, color: colors.textFaint },
  stepTextActive: { color: colors.text, fontWeight: '600' },

  skeletons: { alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.xxl },
  skeletonCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skelAvatar: { width: 54, height: 54, borderRadius: radii.md, backgroundColor: colors.surfaceAlt },
  skelBody: { flex: 1, justifyContent: 'center', gap: 8 },
  skelLine: { height: 11, borderRadius: 6, backgroundColor: colors.surfaceAlt },
});
