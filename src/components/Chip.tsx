import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from './PressableScale';
import { colors, radii, shadows, spacing, type } from '@/theme/theme';

interface Props {
  label: string;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  selected?: boolean;
}

/** Tappable suggestion / filter chip. */
export function Chip({ label, onPress, icon, selected = false }: Props) {
  return (
    <PressableScale
      onPress={onPress}
      activeScale={0.94}
      style={[styles.chip, selected ? styles.selected : shadows.sm]}
      accessibilityRole="button"
    >
      <View style={styles.row}>
        {icon && (
          <Ionicons
            name={icon}
            size={15}
            color={selected ? colors.white : colors.primary}
            style={styles.icon}
          />
        )}
        <Text style={[styles.label, selected && styles.labelSelected]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 6 },
  label: { ...type.small, color: colors.text, fontWeight: '600' },
  labelSelected: { color: colors.white },
});
