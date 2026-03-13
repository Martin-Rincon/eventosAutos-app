import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface VehicleMods {
  engine?: string;
  suspension?: string;
  wheels?: string;
  [key: string]: string | undefined;
}

export interface Vehicle {
  id: string;
  model: string;
  brand: string;
  year: number;
  photos: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  mods?: VehicleMods;
}

interface GarageCardProps {
  vehicle: Vehicle;
  onPress: () => void;
  isExhibitor?: boolean;
}

function ModChip({ label }: { label: string }) {
  return (
    <View style={styles.modChip}>
      <Text style={styles.modChipText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function StatusBadge({ status }: { status: Vehicle['status'] }) {
  const statusConfig = {
    APPROVED: { label: 'Aprobado', bg: colors.approved },
    PENDING: { label: 'Pendiente', bg: colors.pending },
    REJECTED: { label: 'Rechazado', bg: colors.rejected },
  };
  const config = statusConfig[status];

  return (
    <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
      <Text style={styles.statusText}>{config.label}</Text>
    </View>
  );
}

export function GarageCard({ vehicle, onPress, isExhibitor }: GarageCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const modsArray = vehicle.mods
    ? Object.entries(vehicle.mods)
        .filter(([, v]) => v)
        .map(([, v]) => v as string)
    : [];

  const hasPhoto = Boolean(vehicle.photos?.[0]);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.card, animatedStyle]}
    >
      {/* Carbon fiber aesthetic - dark gradient overlay */}
      <View style={styles.cardInner}>
        <View style={styles.imageContainer}>
          {hasPhoto ? (
            <Image
              source={{ uri: vehicle.photos[0] }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={styles.placeholderText}>Sin foto</Text>
            </View>
          )}
          <View style={styles.imageOverlay} />
          {isExhibitor && (
            <View style={styles.statusContainer}>
              <StatusBadge status={vehicle.status} />
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.brand}>{vehicle.brand}</Text>
            <Text style={styles.year}>{vehicle.year}</Text>
          </View>
          <Text style={styles.model}>{vehicle.model}</Text>

          {modsArray.length > 0 && (
            <View style={styles.modsContainer}>
              {modsArray.slice(0, 3).map((mod, index) => (
                <ModChip key={`${mod}-${index}`} label={mod} />
              ))}
            </View>
          )}
        </View>

        {/* Red accent bottom border */}
        <View style={styles.accentLine} />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  cardInner: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 180,
    backgroundColor: colors.carbonDark,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colors.carbonMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: typography.sizes.sm,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  statusContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  brand: {
    color: colors.accent,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  year: {
    color: colors.textMuted,
    fontSize: typography.sizes.xs,
  },
  model: {
    color: colors.textPrimary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginBottom: 12,
  },
  modsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modChip: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modChipText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.xs,
    maxWidth: 100,
  },
  accentLine: {
    height: 3,
    backgroundColor: colors.accent,
  },
});
