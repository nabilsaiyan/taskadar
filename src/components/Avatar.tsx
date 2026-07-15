import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { categoryColors, colors, radii, type } from '@/theme/theme';
import { ABSOLUTE_FILL } from '@/theme/webStyles';

interface Props {
  name: string;
  category: string;
  image?: string;
  size?: number;
  rounded?: boolean;
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
 * Provider image with a graceful, category-tinted initials fallback rendered
 * underneath. If the (placeholder) photo fails to load or is offline, the
 * initials show through — so the UI never looks broken. expo-image works on
 * iOS, Android and web.
 */
export function Avatar({ name, category, image, size = 56, rounded = true, style }: Props) {
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
      <Text style={[styles.initials, { color: palette.fg, fontSize: size * 0.36 }]}>
        {initials(name)}
      </Text>
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
