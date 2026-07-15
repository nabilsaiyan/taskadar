import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/theme/theme';

/** Max content width so the app stays readable on wide web/desktop viewports. */
export const CONTENT_MAX_WIDTH = 620;

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Background color override. */
  background?: string;
}

/**
 * Page background + centered, width-capped content column. On phones this is a
 * plain full-width column; on web/tablet the content centers with a max width
 * so the layout never stretches awkwardly. Works on all three platforms.
 */
export function Screen({ children, style, background = colors.background }: Props) {
  return (
    <View style={[styles.root, { backgroundColor: background }]}>
      <View style={[styles.content, style]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center' },
  content: { flex: 1, width: '100%', maxWidth: CONTENT_MAX_WIDTH },
});
