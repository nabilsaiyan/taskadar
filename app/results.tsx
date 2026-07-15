import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { AppHeader } from '@/components/AppHeader';
import { ProviderCard } from '@/components/ProviderCard';
import { Button } from '@/components/Button';
import { PressableScale } from '@/components/PressableScale';
import { AiThinking } from '@/components/AiThinking';
import { searchProviders } from '@/services/api';
import type { AiSearchResult } from '@/services/ai';
import { AI_PROVIDERS } from '@/services/aiConfig';
import { colors, radii, shadows, spacing, type } from '@/theme/theme';

export default function ResultsScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q: string }>();
  const query = typeof q === 'string' ? q : '';

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AiSearchResult | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    searchProviders(query).then((res) => {
      if (active) {
        setResult(res);
        setLoading(false);
        // Warm the image cache so provider profiles open instantly.
        const uris = res.matches.map((m) => m.image).filter(Boolean);
        if (uris.length) Image.prefetch(uris).catch(() => {});
      }
    });
    return () => {
      active = false;
    };
  }, [query]);

  return (
    <Screen>
      <AppHeader title="AI Results" />
      {loading ? (
        <AiThinking query={query} />
      ) : (
        <FlatList
          data={result?.matches ?? []}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListHeaderComponent={<ResultsHeader query={query} result={result} />}
          renderItem={({ item, index }) => (
            <View style={styles.cardWrap}>
              <ProviderCard
                provider={item}
                index={index}
                topMatch={index === 0 && (result?.matches.length ?? 0) > 1}
                onPress={() =>
                  router.push({ pathname: '/provider/[id]', params: { id: item.id, q: query } })
                }
              />
            </View>
          )}
          ListEmptyComponent={<EmptyState onBack={() => router.back()} />}
        />
      )}
    </Screen>
  );
}

function ResultsHeader({ query, result }: { query: string; result: AiSearchResult | null }) {
  const router = useRouter();
  if (!result) return null;
  const isRealAi = result.engine && result.engine !== 'mock';
  const engineLabel = isRealAi ? AI_PROVIDERS[result.engine as 'gemini' | 'claude' | 'openai'].label : null;
  return (
    <View style={styles.headerBlock}>
      {/* Original query recap */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.queryRecap}>
        <Ionicons name="chatbubble-ellipses" size={15} color={colors.primary} />
        <Text style={styles.queryText} numberOfLines={2}>
          “{query}”
        </Text>
      </Animated.View>

      {/* AI summary */}
      <Animated.View entering={FadeInDown.delay(60).springify().damping(18)} style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Ionicons name="sparkles" size={16} color={colors.white} />
        </View>
        <Text style={styles.summaryText}>{result.summary}</Text>
      </Animated.View>

      {/* Engine badge / demo prompt */}
      <Animated.View entering={FadeInDown.delay(90).springify().damping(18)}>
        {isRealAi ? (
          <View style={styles.engineRow}>
            <Ionicons name="sparkles" size={12} color={colors.success} />
            <Text style={styles.engineText}>Powered by {engineLabel}</Text>
          </View>
        ) : (
          <PressableScale onPress={() => router.push('/settings')} activeScale={0.97} style={styles.demoRow}>
            <Ionicons name="flask-outline" size={13} color={colors.textMuted} />
            <Text style={styles.demoText}>Demo matcher — tap to connect a real AI model</Text>
            <Ionicons name="chevron-forward" size={13} color={colors.textMuted} />
          </PressableScale>
        )}
      </Animated.View>

      {/* AI call failed → fell back to demo */}
      {result.engineError && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={15} color={colors.primaryDark} />
          <Text style={styles.errorText}>{result.engineError} Showing demo matches.</Text>
        </View>
      )}

      {/* Extracted keywords insight */}
      {result.keywords.length > 0 && (
        <Animated.View entering={FadeInDown.delay(120).springify().damping(18)} style={styles.kwRow}>
          <Text style={styles.kwLabel}>AI understood:</Text>
          <View style={styles.kwWrap}>
            {result.keywords.slice(0, 5).map((kw) => (
              <View key={kw} style={styles.kwChip}>
                <Text style={styles.kwChipText}>{kw}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      {result.matches.length > 0 && (
        <Text style={styles.countLabel}>
          {result.matches.length} {result.matches.length === 1 ? 'match' : 'matches'}
        </Text>
      )}
    </View>
  );
}

function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <Animated.View entering={FadeInDown.springify()} style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name="search-outline" size={30} color={colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No clear match yet</Text>
      <Text style={styles.emptyText}>
        Try describing the task differently — for example “fix a leaking tap” or “birthday cake”.
      </Text>
      <Button label="Try another search" icon="arrow-back" variant="secondary" fullWidth={false} onPress={onBack} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl, paddingTop: spacing.sm },
  cardWrap: { marginBottom: spacing.md },
  headerBlock: { gap: spacing.md, marginBottom: spacing.md },

  queryRecap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  queryText: { ...type.small, color: colors.text, fontStyle: 'italic', flex: 1 },

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primaryTint,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  summaryIcon: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primary,
  },
  summaryText: { ...type.bodyStrong, color: colors.ink, flex: 1, lineHeight: 21 },

  engineRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  engineText: { ...type.small, color: colors.success, fontWeight: '700' },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.pill,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    alignSelf: 'flex-start',
  },
  demoText: { ...type.small, color: colors.textMuted, fontWeight: '600' },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryTint,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  errorText: { ...type.small, color: colors.primaryDark, flex: 1 },

  kwRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm },
  kwLabel: { ...type.small, color: colors.textMuted },
  kwWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  kwChip: {
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  kwChipText: { ...type.tiny, color: colors.accent },

  countLabel: { ...type.small, color: colors.textMuted, marginTop: spacing.xs },

  empty: { alignItems: 'center', paddingVertical: spacing.xxxl, gap: spacing.md },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { ...type.h2, color: colors.ink },
  emptyText: { ...type.body, color: colors.textMuted, textAlign: 'center', maxWidth: 320 },
});
