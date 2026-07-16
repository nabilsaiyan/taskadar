import React, { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

/**
 * Provider brand marks, drawn as vectors so they stay crisp on iOS, Android and
 * web. These are simplified, recognizable representations used to signal which
 * AI models the app can use — not pixel-exact official logo files.
 */

interface IconProps {
  size?: number;
}

/** Gemini — four-point sparkle with the signature blue→purple→pink gradient. */
export function GeminiIcon({ size = 16 }: IconProps) {
  // Unique gradient id per instance so multiple Gemini icons on one screen
  // don't collide (a shared id can leave the fill unresolved until a reload).
  const gid = `taskadarGemini-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <LinearGradient id={gid} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#4285F4" />
          <Stop offset="0.5" stopColor="#9B72CB" />
          <Stop offset="1" stopColor="#D96570" />
        </LinearGradient>
      </Defs>
      <Path
        d="M12 0 C12 6.6 6.6 12 0 12 C6.6 12 12 17.4 12 24 C12 17.4 17.4 12 24 12 C17.4 12 12 6.6 12 0 Z"
        fill={`url(#${gid})`}
      />
    </Svg>
  );
}

/** Claude / Anthropic — the terracotta sunburst of tapered rays. */
export function ClaudeIcon({ size = 16 }: IconProps) {
  const cx = 12;
  const cy = 12;
  const count = 11;
  const inner = 3.4; // ray base radius
  const outer = 11.4; // ray tip radius
  const base = 1.55; // half-width of each ray base

  const rays = Array.from({ length: count }, (_, i) => {
    const a = (i * 2 * Math.PI) / count;
    const p = a + Math.PI / 2;
    const bx = cx + Math.cos(a) * inner;
    const by = cy + Math.sin(a) * inner;
    const l = `${(bx + Math.cos(p) * base).toFixed(2)} ${(by + Math.sin(p) * base).toFixed(2)}`;
    const r = `${(bx - Math.cos(p) * base).toFixed(2)} ${(by - Math.sin(p) * base).toFixed(2)}`;
    const tip = `${(cx + Math.cos(a) * outer).toFixed(2)} ${(cy + Math.sin(a) * outer).toFixed(2)}`;
    return `M${l} L${tip} L${r} Z`;
  }).join(' ');

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={rays} fill="#D97757" />
      <Circle cx={cx} cy={cy} r={3.1} fill="#D97757" />
    </Svg>
  );
}

/** Render the right brand mark for a provider id. */
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

/** OpenAI — the interlocking hexafoil knot. */
export function OpenAIIcon({ size = 16, color = '#0F0F0F' }: IconProps & { color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill={color}
        d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997z"
      />
    </Svg>
  );
}
