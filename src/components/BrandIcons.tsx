import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

/**
 * Provider brand logos.
 *
 * These render the official logo images in `assets/logos/`. To change a logo,
 * replace the matching PNG (`gemini.png`, `claude.png`, `openai.png`) — no code
 * changes needed.
 */

const LOGOS = {
  gemini: require('../../assets/logos/gemini.png'),
  claude: require('../../assets/logos/claude.png'),
  openai: require('../../assets/logos/openai.png'),
} as const;

interface IconProps {
  size?: number;
}

function Logo({ source, size }: { source: number; size: number }) {
  return <Image source={source} style={{ width: size, height: size }} contentFit="contain" />;
}

export function GeminiIcon({ size = 16 }: IconProps) {
  return <Logo source={LOGOS.gemini} size={size} />;
}

export function ClaudeIcon({ size = 16 }: IconProps) {
  return <Logo source={LOGOS.claude} size={size} />;
}

export function OpenAIIcon({ size = 16 }: IconProps) {
  return <Logo source={LOGOS.openai} size={size} />;
}

/** Render the right brand logo for a provider id. */
export function ProviderIcon({ id, size = 18 }: { id: 'gemini' | 'claude' | 'openai'; size?: number }) {
  return <Logo source={LOGOS[id]} size={size} />;
}

/**
 * The three provider marks as an overlapping avatar cluster — a compact way to
 * signal "works with Gemini, Claude and GPT" wherever the AI features surface.
 */
export function ModelCluster({ chip = 18 }: { chip?: number }) {
  const icon = Math.round(chip * 0.66);
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
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(26,19,14,0.12)',
    boxShadow: '0px 1px 2px rgba(26,19,14,0.12)',
  },
});
