import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type } from '@/theme/theme';

interface Props {
  rating: number;
  reviewCount?: number;
  size?: number;
  showNumber?: boolean;
}

/** Compact star rating with optional numeric rating and review count. */
export function Stars({ rating, reviewCount, size = 14, showNumber = true }: Props) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return 'star';
    if (i === full && hasHalf) return 'star-half';
    return 'star-outline';
  });

  return (
    <View style={styles.row}>
      <View style={styles.stars}>
        {stars.map((name, i) => (
          <Ionicons key={i} name={name as any} size={size} color={colors.gold} />
        ))}
      </View>
      {showNumber && (
        <Text style={styles.text}>
          {rating.toFixed(1)}
          {reviewCount != null && <Text style={styles.count}> ({reviewCount})</Text>}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  stars: { flexDirection: 'row', gap: 1 },
  text: { ...type.small, color: colors.text, marginLeft: 6, fontWeight: '700' },
  count: { color: colors.textMuted, fontWeight: '500' },
});
