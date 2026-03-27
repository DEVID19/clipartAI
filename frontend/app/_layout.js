import '../src/global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, persistor } from '../src/store';
import ToastOverlay from '../src/components/common/ToastOverlay';
import LoadingScreen from '../src/components/common/LoadingScreen';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <SafeAreaProvider>
            <StatusBar style="light" backgroundColor="#0D0D14" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#0D0D14' },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="result/[sessionId]"
                options={{ animation: 'slide_from_bottom' }}
              />
              <Stack.Screen
                name="fullscreen"
                options={{ animation: 'fade', presentation: 'transparentModal' }}
              />
            </Stack>
            <ToastOverlay />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
