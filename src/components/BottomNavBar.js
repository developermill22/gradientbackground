import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import NavIndicator from './NavIndicator';
import NavSurface from './NavSurface';
import NavTab, { CenterAction } from './NavTab';

const FLOATING_RADIUS = 28;

/**
 * Bottom navigation bar. `variant` is one entry of NAV_VARIANTS and decides
 * the look; `activeKey` / `onChange` make it a controlled component.
 * `bottomInset` defaults to the device's safe-area bottom inset.
 */
export default function BottomNavBar({
  variant,
  activeKey,
  onChange,
  onAction,
  bottomInset,
  style,
}) {
  const insets = useSafeAreaInsets();
  const [rowWidth, setRowWidth] = useState(0);

  const { tabs, layout, surface, indicator, colors } = variant;
  const floating = layout === 'floating';
  const inset = bottomInset ?? insets.bottom;
  const radius = floating ? FLOATING_RADIUS : 0;
  const activeIndex = tabs.findIndex((tab) => tab.key === activeKey);
  const slotWidth = rowWidth / tabs.length;

  const handlePress = (tab) => {
    if (tab.action) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      onAction?.(tab);
      return;
    }
    if (tab.key === activeKey) return;
    Haptics.selectionAsync().catch(() => {});
    onChange?.(tab.key);
  };

  const bar = (
    <View
      accessibilityRole="tabbar"
      style={[
        floating ? styles.floating : [styles.docked, { paddingBottom: inset }],
        surface !== 'neumorph' && (floating ? styles.floatingShadow : styles.dockedShadow),
        // Android only draws elevation shadows for views with a solid background.
        (surface === 'plain' || surface === 'neumorph') && { backgroundColor: colors.background },
        { borderRadius: radius },
      ]}>
      {variant.bump ? (
        <View style={[styles.bump, { backgroundColor: colors.background }]} />
      ) : null}
      <NavSurface variant={variant} radius={radius} />

      <View style={styles.row} onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}>
        {rowWidth > 0 ? (
          <NavIndicator
            type={indicator}
            index={activeIndex}
            slotWidth={slotWidth}
            color={colors.indicator}
          />
        ) : null}
        {tabs.map((tab) =>
          tab.action && variant.center ? (
            <CenterAction key={tab.key} tab={tab} variant={variant} onPress={handlePress} />
          ) : (
            <NavTab
              key={tab.key}
              tab={tab}
              variant={variant}
              active={tab.key === activeKey}
              onPress={handlePress}
            />
          ),
        )}
      </View>
    </View>
  );

  if (surface === 'neumorph') {
    // Two opposing shadows (dark bottom-right, light top-left) give the soft extruded look.
    return (
      <View style={[styles.floatingSpace, { paddingBottom: Math.max(inset, 12) }, style]}>
        <View
          style={[
            styles.neuShadow,
            { shadowColor: colors.shadowDark, borderRadius: radius, backgroundColor: colors.background },
          ]}>
          <View
            style={[
              styles.neuShadow,
              styles.neuLight,
              { shadowColor: colors.shadowLight, borderRadius: radius },
            ]}>
            {bar}
          </View>
        </View>
      </View>
    );
  }

  if (floating) {
    return (
      <View style={[styles.floatingSpace, { paddingBottom: Math.max(inset, 12) }, style]}>
        {bar}
      </View>
    );
  }

  return <View style={style}>{bar}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  docked: {
    paddingTop: 6,
  },
  dockedShadow: {
    shadowColor: '#1B1D3A',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -3 },
    elevation: 12,
  },
  floatingSpace: {
    paddingHorizontal: 16,
  },
  floating: {
    paddingVertical: 6,
  },
  floatingShadow: {
    shadowColor: '#1B1D3A',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  neuShadow: {
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 6, height: 6 },
    elevation: 6,
  },
  neuLight: {
    shadowOpacity: 1,
    shadowOffset: { width: -6, height: -6 },
    elevation: 0,
  },
  bump: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});
