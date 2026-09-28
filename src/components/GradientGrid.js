import { FlatList, StyleSheet } from 'react-native';
import GradientCard from './GradientCard';

export default function GradientGrid({
  gradients,
  selectedId,
  onSelect,
  ListHeaderComponent,
  contentContainerStyle,
}) {
  return (
    <FlatList
      data={gradients}
      keyExtractor={(item) => item.id}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      renderItem={({ item }) => (
        <GradientCard
          gradient={item}
          selected={item.id === selectedId}
          onPress={onSelect}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    gap: 16,
  },
  row: {
    gap: 16,
  },
});
