import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const FADE_DURATION = 700;

function Fill({ gradient }) {
  return (
    <LinearGradient
      colors={gradient.colors}
      locations={gradient.locations}
      start={gradient.start}
      end={gradient.end}
      style={StyleSheet.absoluteFill}
    />
  );
}

/**
 * Full screen gradient that cross-fades whenever `gradient` changes:
 * the outgoing preset stays underneath while the incoming one fades in on top.
 */
export default function GradientBackground({ gradient, children, style }) {
  const [pair, setPair] = useState({ from: gradient, to: gradient });
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (gradient.id === pair.to.id) return;

    setPair((current) => ({ from: current.to, to: gradient }));
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: FADE_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [gradient, pair.to.id, progress]);

  return (
    <View style={[styles.root, style]}>
      <Fill gradient={pair.from} />
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: progress }]}>
        <Fill gradient={pair.to} />
      </Animated.View>

      {/* Scrim keeps the UI readable on top of light presets. */}
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.7)']}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#05010F',
  },
  content: {
    flex: 1,
  },
});
