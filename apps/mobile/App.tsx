import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GarageCard } from './src/components/garage/GarageCard';

// Demo vehicle for development
const demoVehicle = {
  id: '1',
  model: 'GT-R R35',
  brand: 'Nissan',
  year: 2022,
  photos: ['https://placehold.co/400x250/1a1a1a/e53935?text=GT-R'],
  status: 'APPROVED' as const,
  mods: {
    engine: 'VR38DETT Twin Turbo',
    suspension: 'Coilovers',
    wheels: 'Volk TE37 20"',
  },
};

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <GarageCard
        vehicle={demoVehicle}
        onPress={() => {}}
        isExhibitor
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
