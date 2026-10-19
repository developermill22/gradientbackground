import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * Background layer of the bar: plain colour, frosted glass, gradient, or a
 * neumorphic slab. Fills its parent and clips to `radius`.
 */
export default function NavSurface({ variant, radius }) {
  const { surface, colors } = variant;
  const clip = [StyleSheet.absoluteFill, styles.clip, { borderRadius: radius }];

  if (surface === 'glass') {
    return (
      <View
        pointerEvents="none"
        style={[clip, styles.border, { borderColor: colors.border, borderRadius: radius }]}>
        {/* Without a BlurTargetView, Android falls back to the translucent tint below. */}
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
      </View>
    );
  }

  if (surface === 'gradient') {
    return (
      <LinearGradient
        pointerEvents="none"
        colors={colors.gradient}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={clip}
      />
    );
  }

  return <View pointerEvents="none" style={[clip, { backgroundColor: colors.background }]} />;
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
  border: {
    borderWidth: StyleSheet.hairlineWidth * 2,
  },
});
