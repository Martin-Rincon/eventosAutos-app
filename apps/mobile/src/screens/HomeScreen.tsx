import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useVehicles, Vehicle } from '../hooks/useVehicles';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

function ListHeader() {
  return (
    <Text style={styles.headerTitle}>Featured Vehicles</Text>
  );
}

function ListEmpty({ loading, error }: { loading: boolean; error: Error | null }) {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Cargando autos...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error al cargar</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
      </View>
    );
  }
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.emptyText}>No hay autos para mostrar</Text>
    </View>
  );
}

export function HomeScreen() {
  const { data, loading, error } = useVehicles();

  if (loading && data.length === 0) {
    return (
      <View style={styles.container}>
        <ListHeader />
        <ListEmpty loading={loading} error={error} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<ListEmpty loading={loading} error={error} />}
        contentContainerStyle={[
          styles.listContent,
          data.length === 0 && styles.listContentEmpty,
        ]}
        renderItem={({ item }) => (
          <VehicleCard
            vehicle={item as Vehicle}
            onPress={() => {}}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 32,
  },
  listContentEmpty: {
    flex: 1,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.md,
    marginTop: 16,
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
  },
  errorSubtext: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: typography.sizes.md,
  },
});
