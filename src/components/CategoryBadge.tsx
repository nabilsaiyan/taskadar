import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { categoryColors, colors, radii, type } from '@/theme/theme';

interface Props {
  category: string;
  style?: StyleProp<ViewStyle>;
}

/** Soft, category-tinted pill label. */
export function CategoryBadge({ category, style }: Props) {
  const palette = categoryColors[category] ?? { bg: colors.primarySoft, fg: colors.primaryDark };
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }, style]}>
      <Text style={[styles.text, { color: palette.fg }]} numberOfLines={1}>
        {category}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  text: { ...type.tiny, letterSpacing: 0.2 },
});
