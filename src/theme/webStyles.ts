import { Platform } from 'react-native';

/**
 * Web-only style helpers. react-native-web understands CSS properties (like
 * `outlineStyle`) that the React Native TypeScript types don't include, so we
 * keep them here behind a Platform check and an `any` cast. On iOS/Android this
 * is an empty object and has no effect.
 */
export const NO_OUTLINE: any =
  Platform.OS === 'web' ? { outlineStyle: 'none', outlineWidth: 0 } : {};

/** Absolute-fill layout (own constant so it spreads cleanly and types well). */
export const ABSOLUTE_FILL = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
} as const;
