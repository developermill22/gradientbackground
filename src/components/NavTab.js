import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

const ICON_SIZE = 22;

/**
 * One tab. The active and inactive states are drawn as two stacked layers
 * that cross-fade, so every animated property (opacity, scale, translate)
 * can stay on the native driver.
 */
export default function NavTab({ tab, active, variant, onPress }) {
  const { colors, iconStyle } = variant;
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: active ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [active, progress]);

  const springPress = (toValue) => {
    Animated.spring(press, {
      toValue,
      friction: 6,
      tension: 180,
      useNativeDriver: true,
    }).start();
  };

  const outline = `${tab.icon}-outline`;
  const activeIcon = iconStyle === 'outline' ? outline : tab.icon;

  const lift = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -2] });
  const grow = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const fadeOut = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={tab.label}
      accessibilityState={{ selected: active }}
      onPressIn={() => springPress(0.88)}
      onPressOut={() => springPress(1)}
      onPress={() => onPress(tab)}
      style={styles.hit}>
      <Animated.View
        style={[styles.content, { transform: [{ translateY: lift }, { scale: press }] }]}>
        <Animated.View style={[styles.iconBox, { transform: [{ scale: grow }] }]}>
          <Animated.View style={[styles.layer, { opacity: fadeOut }]}>
            <Ionicons name={outline} size={ICON_SIZE} color={colors.inactive} />
          </Animated.View>
          <Animated.View style={[styles.layer, { opacity: progress }]}>
            <Ionicons name={activeIcon} size={ICON_SIZE} color={colors.active} />
          </Animated.View>
        </Animated.View>

        <View style={styles.labels}>
          <Animated.Text
            numberOfLines={1}
            style={[styles.label, { color: colors.inactive, opacity: fadeOut }]}>
            {tab.label}
          </Animated.Text>
          <Animated.Text
            numberOfLines={1}
            style={[styles.label, styles.activeLabel, { color: colors.active, opacity: progress }]}>
            {tab.label}
          </Animated.Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

/** The "Create" button: an inline circle or a raised floating action button. */
export function CenterAction({ tab, variant, onPress }) {
  const { colors, center } = variant;
  const press = useRef(new Animated.Value(1)).current;
  const raised = center === 'raised';

  const springPress = (toValue) => {
    Animated.spring(press, {
      toValue,
      friction: 5,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={tab.label}
      onPressIn={() => springPress(0.9)}
      onPressOut={() => springPress(1)}
      onPress={() => onPress(tab)}
      style={styles.hit}>
      <Animated.View style={[styles.content, { transform: [{ scale: press }] }]}>
        <View
          style={[
            raised ? styles.fab : styles.circle,
            raised && { borderColor: variant.backdrop[0] },
            { backgroundColor: colors.centerBackground },
          ]}>
          <Ionicons name={tab.icon} size={raised ? 30 : 22} color={colors.centerIcon} />
        </View>
        {tab.hideLabel ? null : (
          <Text numberOfLines={1} style={[styles.label, styles.activeLabel, { color: colors.active }]}>
            {tab.label}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 3,
  },
  labels: {
    alignSelf: 'stretch',
  },
  iconBox: {
    width: ICON_SIZE + 4,
    height: ICON_SIZE + 4,
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  activeLabel: {
    position: 'absolute',
    left: 0,
    right: 0,
    fontWeight: '700',
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fab: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 6,
    marginTop: -40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5B4CF0',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
