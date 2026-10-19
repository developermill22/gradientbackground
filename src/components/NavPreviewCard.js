import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import BottomNavBar from './BottomNavBar';

// Space the demo phone keeps free for its home-indicator strip.
const PHONE_INSET = 16;

/** A reference-sheet tile: number, title, tagline and a live bar in a phone frame. */
export default function NavPreviewCard({ variant }) {
  const [activeKey, setActiveKey] = useState(variant.tabs[0].key);
  const { backdrop } = variant;
  const dark = variant.id === 'floating';

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.number}>
          <Text style={styles.numberText}>{variant.number}</Text>
        </View>
        <View style={styles.titles}>
          <Text style={styles.title}>{variant.title}</Text>
          <Text style={styles.tagline}>{variant.tagline}</Text>
        </View>
      </View>

      <View style={styles.phone}>
        {backdrop.length > 1 ? (
          <LinearGradient
            colors={backdrop}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: backdrop[0] }]} />
        )}

        <BottomNavBar
          variant={variant}
          activeKey={activeKey}
          onChange={setActiveKey}
          bottomInset={PHONE_INSET}
        />
        <View style={[styles.homeIndicator, dark && styles.homeIndicatorLight]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    gap: 14,
    shadowColor: '#1B1D3A',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  number: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#EEF0F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3A3D4F',
  },
  titles: {
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#15151F',
  },
  tagline: {
    fontSize: 12,
    color: '#6E7389',
  },
  phone: {
    height: 150,
    justifyContent: 'flex-end',
    borderWidth: 7,
    borderTopWidth: 0,
    borderColor: '#15151F',
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
    overflow: 'hidden',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 6,
    alignSelf: 'center',
    width: 110,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#15151F',
  },
  homeIndicatorLight: {
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
});
