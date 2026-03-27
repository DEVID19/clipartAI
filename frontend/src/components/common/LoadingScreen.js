import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoadingScreen() {
  return (
    <View
      style={{ flex: 1, backgroundColor: '#0D0D14', alignItems: 'center', justifyContent: 'center' }}
    >
      <Ionicons name="sparkles" size={40} color="#7C6FFF" />
      <ActivityIndicator color="#7C6FFF" style={{ marginTop: 16 }} />
      <Text style={{ color: '#8B8BA7', marginTop: 12, fontSize: 13 }}>Loading...</Text>
    </View>
  );
}
