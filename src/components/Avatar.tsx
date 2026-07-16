import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { categoryColors, colors, radii, type } from '@/theme/theme';
import { ABSOLUTE_FILL } from '@/theme/webStyles';

interface Props {
  name: string;
  category: string;
  image?: string;
  size?: number;
  rounded?: boolean;
  /** When set (and no photo), render this category icon instead of initials. */
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Branded provider thumbnail: a category-tinted tile showing the trade's icon
 * (or the provider's initials). If a real photo URL is supplied it's layered on
 * top; otherwise the clean, on-brand placeholder shows — so imagery is always
 * appropriate and the UI never looks broken. expo-image works on all platforms.
 */
export function Avatar({ name, category, image, size = 56, rounded = true, icon, style }: Props) {
  const palette = categoryColors[category] ?? { bg: colors.primarySoft, fg: colors.primaryDark };
  const borderRadius = rounded ? radii.pill : radii.md;

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius, backgroundColor: palette.bg },
        style,
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={size * 0.44} color={palette.fg} />
      ) : (
        <Text style={[styles.initials, { color: palette.fg, fontSize: size * 0.36 }]}>
          {initials(name)}
        </Text>
      )}
      {image ? (
        <Image
          source={{ uri: image }}
          style={[ABSOLUTE_FILL, { borderRadius }]}
          contentFit="cover"
          transition={300}
          cachePolicy="memory-disk"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  initials: { ...type.h2, fontWeight: '800' },
});
