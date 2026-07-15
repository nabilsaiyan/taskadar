import React from 'react';
import { Platform, Pressable, type PressableProps, type ViewStyle, type StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING = { damping: 15, stiffness: 320, mass: 0.6 };

interface Props extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** How far to scale down on press. Default 0.96. */
  activeScale?: number;
  /** Dim opacity while pressed. Default 1 (no dim). */
  activeOpacity?: number;
  /** Enable a subtle lift on web hover. Default true. */
  hover?: boolean;
  /** How far to lift on hover (px). Default 2. */
  hoverLift?: number;
}

/**
 * A Pressable that springs down when pressed and (on web) lifts gently on
 * hover. Uses Reanimated, which runs on the UI thread on native and via RAF on
 * web — identical behaviour across iOS, Android and web. Hover callbacks only
 * fire on web/pointer devices, so touch platforms are unaffected.
 */
export function PressableScale({
  children,
  style,
  activeScale = 0.96,
  activeOpacity = 1,
  hover = true,
  hoverLift = 2,
  onPressIn,
  onPressOut,
  onHoverIn,
  onHoverOut,
  ...rest
}: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const lift = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: lift.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        scale.value = withSpring(activeScale, SPRING);
        opacity.value = withTiming(activeOpacity, { duration: 90 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, SPRING);
        opacity.value = withTiming(1, { duration: 140 });
        onPressOut?.(e);
      }}
      onHoverIn={(e) => {
        if (hover) {
          scale.value = withSpring(1.02, SPRING);
          lift.value = withSpring(-hoverLift, SPRING);
        }
        onHoverIn?.(e);
      }}
      onHoverOut={(e) => {
        if (hover) {
          scale.value = withSpring(1, SPRING);
          lift.value = withSpring(0, SPRING);
        }
        onHoverOut?.(e);
      }}
      style={[style, Platform.OS === 'web' && ({ cursor: 'pointer' } as any), animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
