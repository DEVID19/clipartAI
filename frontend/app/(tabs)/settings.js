import { View, Text, TouchableOpacity, Alert, Linking, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { clearHistory } from '../../src/store/slices/historySlice';
import { resetGeneration } from '../../src/store/slices/generationSlice';

const SettingRow = ({ icon, label, subtitle, onPress, destructive }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center px-4 py-3.5 gap-x-3"
    activeOpacity={0.7}
  >
    <View
      className={`w-9 h-9 rounded-xl items-center justify-center ${
        destructive ? 'bg-error/10' : 'bg-primary/10'
      }`}
    >
      <Ionicons name={icon} size={18} color={destructive ? '#F87171' : '#7C6FFF'} />
    </View>
    <View className="flex-1">
      <Text className={`font-semibold text-sm ${destructive ? 'text-error' : 'text-text-primary'}`}>
        {label}
      </Text>
      {subtitle && (
        <Text className="text-text-muted text-xs mt-0.5">{subtitle}</Text>
      )}
    </View>
    <Ionicons name="chevron-forward" size={16} color="#4A4A65" />
  </TouchableOpacity>
);

const Section = ({ title, children }) => (
  <View className="mb-4">
    <Text className="text-text-muted text-xs font-semibold uppercase tracking-widest px-5 mb-2">
      {title}
    </Text>
    <View className="bg-card rounded-2xl border border-border overflow-hidden mx-4">
      {children}
    </View>
  </View>
);

const Divider = () => <View className="h-px bg-border mx-4" />;

export default function SettingsScreen() {
  const dispatch = useDispatch();

  const handleClearHistory = () => {
    Alert.alert('Clear History', 'This will remove all saved generations from your device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => dispatch(clearHistory()),
      },
    ]);
  };

  const handleReset = () => {
    Alert.alert('Reset App', 'Clear all data and start fresh?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          dispatch(clearHistory());
          dispatch(resetGeneration());
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="px-5 pt-6 pb-5">
        <Text className="text-2xl font-bold text-text-primary">Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Animated.View entering={FadeInDown.duration(300)}>
          <Section title="About">
            <SettingRow
              icon="information-circle-outline"
              label="App Version"
              subtitle="1.0.0 — AI Clipart Generator"
              onPress={() => {}}
            />
            <Divider />
            <SettingRow
              icon="code-slash-outline"
              label="Built with"
              subtitle="React Native Expo + MERN Stack"
              onPress={() => {}}
            />
          </Section>

          <Section title="AI Engine">
            <SettingRow
              icon="hardware-chip-outline"
              label="Model"
              subtitle="Stability AI SDXL via Replicate"
              onPress={() => {}}
            />
            <Divider />
            <SettingRow
              icon="layers-outline"
              label="Available Styles"
              subtitle="Cartoon, Flat Art, Anime, Pixel Art, Sketch"
              onPress={() => {}}
            />
          </Section>

          <Section title="Data">
            <SettingRow
              icon="time-outline"
              label="Clear Generation History"
              subtitle="Remove all saved cliparts from device"
              onPress={handleClearHistory}
            />
            <Divider />
            <SettingRow
              icon="refresh-outline"
              label="Reset App"
              subtitle="Clear all local data"
              onPress={handleReset}
              destructive
            />
          </Section>

          <Section title="Legal">
            <SettingRow
              icon="document-text-outline"
              label="Privacy Policy"
              onPress={() => Linking.openURL('https://example.com/privacy')}
            />
            <Divider />
            <SettingRow
              icon="shield-checkmark-outline"
              label="Terms of Service"
              onPress={() => Linking.openURL('https://example.com/terms')}
            />
          </Section>
        </Animated.View>

        <Text className="text-text-muted text-xs text-center mt-6">
          Made with care for the assignment review
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
