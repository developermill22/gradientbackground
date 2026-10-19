import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

/**
 * Active-tab marker that springs between tab slots. It is one slot wide and
 * only its translateX animates, so it runs entirely on the native driver.
 */
export default function NavIndicator({ type, index, slotWidth, color }) {
  const x = useRef(new Animated.Value(index * slotWidth)).current;
  const placed = useRef(false);

  useEffect(() => {
    const toValue = index * slotWidth;
    // Jump into place on the first layout, spring on every change after that.
    if (!placed.current) {
      x.setValue(toValue);
      placed.current = true;
      return;
    }
    Animated.spring(x, {
      toValue,
      friction: 8,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [index, slotWidth, x]);

  if (type === 'none' || index < 0) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.slot, { width: slotWidth, transform: [{ translateX: x }] }]}>
      <View style={[styles[type], { backgroundColor: color }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  slot: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    bottom: 1,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    width: 18,
    height: 3,
    borderRadius: 2,
  },
  topLine: {
    position: 'absolute',
    top: 0,
    width: '62%',
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  pill: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 6,
    right: 6,
    borderRadius: 16,
  },
});
