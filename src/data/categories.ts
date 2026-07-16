import { Ionicons } from '@expo/vector-icons';

/**
 * Icon used to represent each service category. Drives the browse row on Home
 * and the branded image placeholders (a category-colored tile with this icon)
 * shown on provider cards and profiles.
 */
export const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Plumbing: 'water',
  'Baking & Catering': 'restaurant',
  Tutoring: 'school',
  'Personal Training': 'barbell',
  Cleaning: 'sparkles',
  'Pet Sitting': 'paw',
  Photography: 'camera',
  Handyman: 'construct',
  'Beauty & Hair': 'cut',
  Gardening: 'leaf',
  Moving: 'cube',
  Electrician: 'flash',
  Painting: 'color-fill',
  'Tech Support': 'laptop',
  Wellness: 'body',
  'Auto Repair': 'car-sport',
  Music: 'musical-notes',
  Locksmith: 'key',
  'Appliance Repair': 'build',
  Events: 'balloon',
};

export function categoryIcon(category: string): keyof typeof Ionicons.glyphMap {
  return CATEGORY_ICONS[category] ?? 'briefcase';
}
