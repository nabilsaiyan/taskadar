/**
 * Taskadar design tokens.
 *
 * A single source of truth for colors, spacing, radii, typography and shadows.
 * Everything here is plain JS values so it works identically on iOS, Android
 * and web (react-native-web). Shadows use the cross-platform `boxShadow` style
 * prop supported by React Native 0.76+ and react-native-web.
 */

export const colors = {
  // Warm, approachable brand palette
  primary: '#FF6B3D',
  primaryDark: '#E84E24',
  primarySoft: '#FFE9E0',
  primaryTint: '#FFF3EE',

  // Secondary warm accent used for highlights
  accent: '#7A5CFF',
  accentSoft: '#EDE8FF',

  // Rating / warmth
  gold: '#FFB020',
  goldSoft: '#FFF3DC',

  // Feedback
  success: '#22A06B',
  successSoft: '#E4F6EE',

  // Neutrals (warm-tinted)
  ink: '#2B211A',
  text: '#3D342C',
  textMuted: '#8C7E72',
  textFaint: '#B4A99E',

  background: '#FFF8F2',
  backgroundAlt: '#FFF1E8',
  surface: '#FFFFFF',
  surfaceAlt: '#FBF4EC',

  border: '#F1E6DA',
  borderStrong: '#E7D8C8',

  white: '#FFFFFF',
  black: '#1A130E',
  overlay: 'rgba(43, 33, 26, 0.45)',
} as const;

/** Accent colors keyed by service category for playful category chips/avatars. */
export const categoryColors: Record<string, { bg: string; fg: string }> = {
  Plumbing: { bg: '#E3F0FF', fg: '#2F6FED' },
  'Baking & Catering': { bg: '#FFE7EF', fg: '#E5417D' },
  Tutoring: { bg: '#E9E4FF', fg: '#6B4EFF' },
  'Personal Training': { bg: '#E2F7EC', fg: '#1F9D5C' },
  Cleaning: { bg: '#E4F6FB', fg: '#1BA5C4' },
  'Pet Sitting': { bg: '#FFF0DA', fg: '#D68C10' },
  Photography: { bg: '#F3E8FF', fg: '#9333EA' },
  Handyman: { bg: '#EAF0E4', fg: '#5E8B2A' },
  'Beauty & Hair': { bg: '#FFE7E0', fg: '#E5603D' },
  Gardening: { bg: '#E5F5E0', fg: '#3E9642' },
  Moving: { bg: '#EDEEF2', fg: '#5A6472' },
  Electrician: { bg: '#FFF6D9', fg: '#C99A06' },
  Painting: { bg: '#EAF2FF', fg: '#3B6FE0' },
  'Tech Support': { bg: '#E6F0F5', fg: '#2C7A9E' },
  Wellness: { bg: '#FBEAF3', fg: '#C2478A' },
  'Auto Repair': { bg: '#ECEEF1', fg: '#4B5563' },
  Music: { bg: '#F1E9FF', fg: '#7C3AED' },
  Locksmith: { bg: '#FFF3DE', fg: '#C98A0E' },
  'Appliance Repair': { bg: '#E7F4F0', fg: '#1F9E7A' },
  Events: { bg: '#FFE9F0', fg: '#E5417D' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

export const radii = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  pill: 999,
} as const;

export const fonts = {
  // System fonts keep the bundle light and render natively everywhere.
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

export const type = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: fonts.heavy },
  h1: { fontSize: 27, lineHeight: 33, fontWeight: fonts.bold },
  h2: { fontSize: 21, lineHeight: 27, fontWeight: fonts.bold },
  h3: { fontSize: 17, lineHeight: 23, fontWeight: fonts.semibold },
  body: { fontSize: 15, lineHeight: 22, fontWeight: fonts.regular },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: fonts.semibold },
  small: { fontSize: 13, lineHeight: 18, fontWeight: fonts.medium },
  tiny: { fontSize: 11, lineHeight: 15, fontWeight: fonts.semibold },
} as const;

export const shadows = {
  none: { boxShadow: 'none' },
  sm: { boxShadow: '0px 2px 8px rgba(43, 33, 26, 0.06)' },
  md: { boxShadow: '0px 8px 22px rgba(43, 33, 26, 0.09)' },
  lg: { boxShadow: '0px 16px 38px rgba(43, 33, 26, 0.14)' },
  primary: { boxShadow: '0px 10px 24px rgba(255, 107, 61, 0.35)' },
} as const;

/** Reusable gradient color stops (tuples typed for expo-linear-gradient). */
export const gradients = {
  brand: ['#FF8A5B', '#FF6B3D', '#F1502A'] as const,
  brandMark: ['#FF8A5B', '#F1502A'] as const,
  scrim: ['transparent', 'rgba(26,19,14,0.15)', 'rgba(26,19,14,0.78)'] as const,
};

/** A deterministic, pleasant two-stop gradient for a category (image fallback). */
export function categoryGradient(category: string): readonly [string, string] {
  const fg = (categoryColors[category] ?? { fg: colors.primary }).fg;
  return [shade(fg, 18), shade(fg, -22)];
}

/** Lighten (+) / darken (−) a hex color by a percentage. */
function shade(hex: string, percent: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (n >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt));
  const b = Math.min(255, Math.max(0, (n & 0xff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export const theme = {
  colors,
  categoryColors,
  spacing,
  radii,
  fonts,
  type,
  shadows,
};

export type Theme = typeof theme;
