import React, { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/Button';
import { PressableScale } from '@/components/PressableScale';
import { useApiKey, apiKeyStore } from '@/store/apiKeyStore';
import { AI_PROVIDERS, PROVIDER_LIST, maskKey, type ProviderId } from '@/services/aiConfig';
import { colors, radii, shadows, spacing, type } from '@/theme/theme';
import { NO_OUTLINE } from '@/theme/webStyles';

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { apiKey, provider: savedProvider, hasKey } = useApiKey();

  const [selected, setSelected] = useState<ProviderId>(savedProvider);
  const [input, setInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const info = AI_PROVIDERS[selected];
  const activeOnSelected = hasKey && savedProvider === selected;

  const save = async () => {
    const key = input.trim();
    if (!key) return;
    setSaving(true);
    await apiKeyStore.save(key, selected);
    setSaving(false);
    setInput('');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2200);
  };

  const clear = async () => {
    await apiKeyStore.clear();
    setInput('');
    setSelected('gemini');
  };

  return (
    <Screen>
      <AppHeader title="AI provider" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xxxl }]}
      >
        {/* Intro */}
        <Animated.View entering={FadeInDown.springify().damping(18)} style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons name="sparkles" size={20} color={colors.white} />
          </View>
          <Text style={styles.introTitle}>Use a real AI model</Text>
          <Text style={styles.introText}>
            Add your own API key to power natural-language matching with a live model. Your key is
            stored only on this device and sent directly to the provider — never to us.
          </Text>
          <View style={styles.privacyRow}>
            <Ionicons name="lock-closed" size={13} color={colors.success} />
            <Text style={styles.privacyText}>Stored locally · never uploaded to Taskadar</Text>
          </View>
        </Animated.View>

        {justSaved && (
          <Animated.View entering={FadeIn} style={styles.savedBanner}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={styles.savedText}>Key saved — searches now use {AI_PROVIDERS[savedProvider].label}.</Text>
          </Animated.View>
        )}

        {/* Provider picker */}
        <Animated.View entering={FadeInDown.delay(60).springify().damping(18)} style={styles.section}>
          <Text style={styles.sectionLabel}>Choose a provider</Text>
          <View style={{ gap: spacing.sm }}>
            {PROVIDER_LIST.map((p) => {
              const isSelected = selected === p.id;
              const isActive = hasKey && savedProvider === p.id;
              return (
                <PressableScale
                  key={p.id}
                  onPress={() => setSelected(p.id)}
                  activeScale={0.98}
                  style={[styles.providerCard, isSelected && styles.providerCardSelected]}
                >
                  <View style={[styles.radio, isSelected && styles.radioOn]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <View style={[styles.providerDot, { backgroundColor: p.color }]} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.providerNameRow}>
                      <Text style={styles.providerName}>{p.label}</Text>
                      {p.isFree && (
                        <View style={styles.freeBadge}>
                          <Text style={styles.freeText}>FREE</Text>
                        </View>
                      )}
                      {isActive && <Ionicons name="checkmark-circle" size={16} color={colors.success} />}
                    </View>
                    <Text style={styles.providerDesc}>{p.description}</Text>
                  </View>
                </PressableScale>
              );
            })}
          </View>
        </Animated.View>

        {/* Active key indicator */}
        {activeOnSelected && (
          <Animated.View entering={FadeIn} style={styles.activeKey}>
            <View style={styles.activeDot} />
            <Text style={styles.activeKeyText}>{maskKey(apiKey)}</Text>
            <Text style={styles.activeKeyLabel}>Active</Text>
          </Animated.View>
        )}

        {/* Key input */}
        <Animated.View entering={FadeInDown.delay(120).springify().damping(18)} style={styles.section}>
          <Text style={styles.sectionLabel}>{activeOnSelected ? 'Replace API key' : `${info.label} API key`}</Text>
          <View style={styles.inputRow}>
            <Ionicons name="key-outline" size={18} color={colors.textMuted} />
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={info.keyPlaceholder}
              placeholderTextColor={colors.textFaint}
              style={[styles.input, NO_OUTLINE]}
              secureTextEntry={!showKey}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
            />
            <PressableScale onPress={() => setShowKey((s) => !s)} activeScale={0.85} hover={false}>
              <Ionicons name={showKey ? 'eye-off-outline' : 'eye-outline'} size={19} color={colors.textMuted} />
            </PressableScale>
          </View>

          <PressableScale onPress={() => Linking.openURL(info.keyUrl)} activeScale={0.97} style={styles.keyLink}>
            <Ionicons name="open-outline" size={14} color={colors.primary} />
            <Text style={styles.keyLinkText}>{info.keyHint}</Text>
          </PressableScale>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(180).springify().damping(18)} style={styles.actions}>
          <Button label="Save key" icon="checkmark" onPress={save} loading={saving} disabled={input.trim().length === 0} />
          {hasKey && <Button label="Remove saved key" variant="secondary" icon="trash-outline" onPress={clear} />}
          <Button label="Done" variant="ghost" onPress={() => router.back()} />
        </Animated.View>

        <Text style={styles.footnote}>
          Without a key, Taskadar uses a built-in demo matcher so you can still try the full flow.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.xl },

  intro: { backgroundColor: colors.backgroundAlt, borderRadius: radii.xl, padding: spacing.xl, gap: spacing.sm },
  introIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.primary,
    marginBottom: spacing.xs,
  },
  introTitle: { ...type.h2, color: colors.ink },
  introText: { ...type.body, color: colors.text, lineHeight: 22 },
  privacyRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.xs },
  privacyText: { ...type.small, color: colors.success, fontWeight: '600' },

  savedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.successSoft,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  savedText: { ...type.small, color: colors.success, fontWeight: '600', flex: 1 },

  section: { gap: spacing.md },
  sectionLabel: { ...type.bodyStrong, color: colors.ink },

  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  providerCardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 999, backgroundColor: colors.primary },
  providerDot: { width: 10, height: 10, borderRadius: 999 },
  providerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  providerName: { ...type.bodyStrong, color: colors.ink },
  providerDesc: { ...type.small, color: colors.textMuted, marginTop: 1 },
  freeBadge: { backgroundColor: colors.successSoft, borderRadius: radii.sm, paddingHorizontal: 6, paddingVertical: 2 },
  freeText: { ...type.tiny, color: colors.success, fontWeight: '800', letterSpacing: 0.4 },

  activeKey: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  activeDot: { width: 8, height: 8, borderRadius: 999, backgroundColor: colors.success },
  activeKeyText: { ...type.small, color: colors.text, fontWeight: '700', flex: 1 },
  activeKeyLabel: { ...type.tiny, color: colors.success, fontWeight: '700' },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: { flex: 1, ...type.body, color: colors.ink },
  keyLink: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start' },
  keyLinkText: { ...type.small, color: colors.primary, fontWeight: '600' },

  actions: { gap: spacing.md },
  footnote: { ...type.small, color: colors.textMuted, textAlign: 'center', lineHeight: 19 },
});
