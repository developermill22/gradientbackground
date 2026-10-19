import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import NavPreviewCard from './src/components/NavPreviewCard';
import { DESIGN_TIPS, NAV_VARIANTS, PRIMARY } from './src/constants/bottomNav';

function Gallery() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 32 },
      ]}>
      <StatusBar style="dark" />
      <Text style={styles.eyebrow}>Component Series</Text>
      <Text style={styles.heading}>Bottom Navigation</Text>
      <Text style={styles.subtitle}>11 styles. Tap any tab to try it.</Text>

      {NAV_VARIANTS.map((variant) => (
        <NavPreviewCard key={variant.id} variant={variant} />
      ))}

      <View style={styles.tips}>
        <Text style={styles.tipsTitle}>Design Tips</Text>
        {DESIGN_TIPS.map((tip) => (
          <Text key={tip} style={styles.tip}>
            ✓  {tip}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Gallery />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F1F2F7',
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  eyebrow: {
    color: PRIMARY,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  heading: {
    marginTop: -10,
    color: '#15151F',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: -10,
    color: '#6E7389',
    fontSize: 14,
  },
  tips: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    gap: 8,
  },
  tipsTitle: {
    color: PRIMARY,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  tip: {
    color: '#3A3D4F',
    fontSize: 14,
  },
});
