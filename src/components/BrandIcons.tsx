import React from 'react';
import { StyleSheet, View } from 'react-native';
import GeminiLogo from '../../assets/logos/gemini.svg';
import ClaudeLogo from '../../assets/logos/claude.svg';
import OpenAILogo from '../../assets/logos/openai.svg';

/**
 * Provider brand logos.
 *
 * These render the SVG files in `assets/logos/`. To use the exact official
 * marks, replace those three files (`gemini.svg`, `claude.svg`, `openai.svg`)
 * with the providers' official logo SVGs — no code changes needed. The files
 * shipped in the repo are simple placeholder marks.
 */

interface IconProps {
  size?: number;
}

export function GeminiIcon({ size = 16 }: IconProps) {
  return <GeminiLogo width={size} height={size} />;
}

export function ClaudeIcon({ size = 16 }: IconProps) {
  return <ClaudeLogo width={size} height={size} />;
}

export function OpenAIIcon({ size = 16 }: IconProps) {
  return <OpenAILogo width={size} height={size} />;
}

/** Render the right brand logo for a provider id. */
export function ProviderIcon({ id, size = 18 }: { id: 'gemini' | 'claude' | 'openai'; size?: number }) {
  if (id === 'gemini') return <GeminiIcon size={size} />;
  if (id === 'claude') return <ClaudeIcon size={size} />;
  return <OpenAIIcon size={size} />;
}

/**
 * The three provider marks as an overlapping avatar cluster — a compact way to
 * signal "works with Gemini, Claude and GPT" wherever the AI features surface.
 */
export function ModelCluster({ chip = 18 }: { chip?: number }) {
  const icon = Math.round(chip * 0.64);
  const overlap = Math.round(chip * 0.36);
  const wrap = [styles.chip, { width: chip, height: chip, borderRadius: chip }];
  return (
    <View style={styles.cluster}>
      <View style={wrap}>
        <GeminiIcon size={icon} />
      </View>
      <View style={[wrap, { marginLeft: -overlap }]}>
        <ClaudeIcon size={icon} />
      </View>
      <View style={[wrap, { marginLeft: -overlap }]}>
        <OpenAIIcon size={icon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cluster: { flexDirection: 'row', alignItems: 'center' },
  chip: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(26,19,14,0.12)',
    boxShadow: '0px 1px 2px rgba(26,19,14,0.12)',
  },
});
