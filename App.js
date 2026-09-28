import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import GradientBackground from './src/components/GradientBackground';
import GradientGrid from './src/components/GradientGrid';
import { DEFAULT_GRADIENT, GRADIENTS } from './src/constants/gradients';

function Header({ gradient }) {
  return (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>Gradient Background</Text>
      <Text style={styles.title}>{gradient.name}</Text>
      <Text style={styles.subtitle}>
        Tap any tile to send that gradient to the background.
      </Text>
      <View style={styles.chips}>
        {gradient.colors.map((color) => (
          <View key={color} style={styles.chip}>
            <View style={[styles.chipDot, { backgroundColor: color }]} />
            <Text style={styles.chipText}>{color.toUpperCase()}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Home() {
  const [gradient, setGradient] = useState(DEFAULT_GRADIENT);
  const insets = useSafeAreaInsets();

  return (
    <GradientBackground gradient={gradient}>
      <StatusBar style="light" />
      <GradientGrid
        gradients={GRADIENTS}
        selectedId={gradient.id}
        onSelect={setGradient}
        ListHeaderComponent={<Header gradient={gradient} />}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 32,
        }}
      />
    </GradientBackground>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Home />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 8,
    gap: 6,
  },
  eyebrow: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
    lineHeight: 20,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    marginBottom: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  chipDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  chipText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
});
