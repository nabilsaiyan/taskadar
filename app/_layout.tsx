import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { colors } from '@/theme/theme';
import { apiKeyStore } from '@/store/apiKeyStore';

export default function RootLayout() {
  // Load any saved BYOK provider + key once at startup.
  useEffect(() => {
    apiKeyStore.hydrate();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="results" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="provider/[id]" />
          <Stack.Screen name="booking" options={{ animation: 'fade', gestureEnabled: false }} />
          <Stack.Screen name="settings" options={{ animation: 'slide_from_bottom' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
